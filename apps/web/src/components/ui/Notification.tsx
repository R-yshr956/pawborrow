import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import {
  useNotifications,
  useMarkAllNotificationsRead,
} from "@repo/api";

function formatTime(createdAt: string): string {
  const createdTime = new Date(createdAt).getTime();
  const difference = Date.now() - createdTime;

  const minutes = Math.floor(difference / 60_000);
  const hours = Math.floor(difference / 3_600_000);
  const days = Math.floor(difference / 86_400_000);

  if (minutes < 1) return "Just now";

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Date(createdAt).toLocaleDateString();
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    data: notificationData,
    isLoading,
    error,
  } = useNotifications();

  const {
    mutate: markAllAsRead,
    isPending: isMarkingRead,
  } = useMarkAllNotificationsRead();

  const notifications = Array.isArray(notificationData)
    ? notificationData
    : [];

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function handleToggle() {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen && unreadCount > 0 && !isMarkingRead) {
      markAllAsRead();
    }
  }

  return (
    <div className="navbar__notif" ref={ref}>
      <button
        type="button"
        className="navbar__icon-btn"
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread notifications`
            : "Notifications"
        }
        aria-expanded={open}
        onClick={handleToggle}
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="navbar__notif-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="navbar__notif-dropdown">
          <span
            className="navbar__notif-arrow"
            aria-hidden="true"
          />

          <p className="navbar__notif-title">
            Notifications
          </p>

          {isLoading && (
            <p className="navbar__notif-empty">
              Loading notifications...
            </p>
          )}

          {error && (
            <p className="navbar__notif-empty">
              {error instanceof Error
                ? error.message
                : "Failed to load notifications."}
            </p>
          )}

          {!isLoading &&
            !error &&
            notifications.length === 0 && (
              <p className="navbar__notif-empty">
                You're all caught up.
              </p>
            )}

          {!isLoading &&
            !error &&
            notifications.length > 0 && (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.notification_id}
                    className={
                      notification.is_read
                        ? ""
                        : "navbar__notif-unread"
                    }
                  >
                    <span
                      className="navbar__notif-avatar"
                      aria-hidden="true"
                    />

                    <div className="navbar__notif-body">
                      <p>
                        <strong>
                          {notification.title}
                        </strong>{" "}
                        {notification.message}
                      </p>

                      <span className="navbar__notif-time">
                        {formatTime(notification.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
    </div>
  );
}