interface NotificationBadgeProps {
  count?: number;
  ariaLabel?: string;
}

const NotificationBadge = ({
  count = 0,
  ariaLabel,
}: NotificationBadgeProps) => {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className="absolute -top-0.5 -right-0.5 inline-block h-[10px] w-[10px] rounded-full bg-[#ff4d4f] shadow-[0_0_0_2px_#fff]"
      aria-label={ariaLabel ?? "You have new notifications"}
      title={ariaLabel ?? "You have new notifications"}
    />
  );
};

export default NotificationBadge;