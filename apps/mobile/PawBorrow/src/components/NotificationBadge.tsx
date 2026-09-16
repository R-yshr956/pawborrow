import './NotificationBadge.css';

interface NotificationBadgeProps {
  count?: number;
  ariaLabel?: string;
}

const NotificationBadge = ({ count = 0, ariaLabel }: NotificationBadgeProps) => {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className="notification-badge"
      aria-label={ariaLabel ?? 'You have new notifications'}
      title={ariaLabel ?? 'You have new notifications'}
    />
  );
};

export default NotificationBadge;
