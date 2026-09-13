import { useEffect, useRef, useState } from "react";
import { Bell } from 'lucide-react';

export type NotificationItem = {
  id: number | string;
  name: string;
  action: string;
  time: string;
};

type NotificationsDropdownProps = {
  notifications: NotificationItem[];
};

export default function NotificationsDropdown({ notifications }: NotificationsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar__notif" ref={ref}>
      <button
        className="navbar__icon-btn"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell size={18} />
      </button>

      {open && (
        <div className="navbar__notif-dropdown">
          <span className="navbar__notif-arrow" aria-hidden="true" />
          <p className="navbar__notif-title">Notifications</p>
          {notifications.length === 0 ? (
            <p className="navbar__notif-empty">You're all caught up.</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n.id}>
                  <span className="navbar__notif-avatar" aria-hidden="true" />
                  <div className="navbar__notif-body">
                    <p>
                      <strong>{n.name}</strong> {n.action}
                    </p>
                    <span className="navbar__notif-time">{n.time}</span>
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