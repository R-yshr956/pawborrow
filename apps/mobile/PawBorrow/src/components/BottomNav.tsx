import { useLocation, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { home, personOutline, pawOutline } from "ionicons/icons";
import { CalendarDays } from "lucide-react";

const navItems = [
  {
    path: "/dashboard",
    label: "Home",
    icon: home,
  },
  {
    path: "/pet-category",
    label: "Pets",
    icon: pawOutline,
  },
  {
    path: "/my-bookings",
    label: "Bookings",
    icon: null,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: personOutline,
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function matchesPath(path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  const isVisible = navItems.some((item) => matchesPath(item.path));

  if (!isVisible) return null;

  return (
    <nav
      aria-label="Main navigation"
      className={[
        "fixed bottom-0 left-0 z-10 flex w-full",
        "h-[clamp(55px,14vh,72px)] items-center",
        "bg-white px-2.5",
        "pb-[calc(10px_+_env(safe-area-inset-bottom))]",
        "shadow-[0_-4px_16px_rgba(0,0,0,0.06)]",
        "[@media(max-height:640px)]:h-[68px]",
      ].join(" ")}
    >
      {navItems.map(({ path, label, icon }) => {
        const active = matchesPath(path);

        return (
          <button
            key={path}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            onClick={() => navigate(path)}
            className={[
              "flex min-w-0 flex-1 cursor-pointer",
              "flex-col items-center justify-center gap-0.5",
              "border-0 bg-transparent",
              "text-[clamp(11px,3vw,16px)]",
              "focus-visible:outline-2",
              "focus-visible:outline-offset-2",
              "focus-visible:outline-froly-400",
              active ? "text-froly-400" : "text-[#9a9a9a]",
            ].join(" ")}
          >
            {icon ? (
              <IonIcon
                icon={icon}
                aria-hidden="true"
                className="text-[clamp(22px,6vw,32px)]"
              />
            ) : (
              <CalendarDays
                aria-hidden="true"
                className="h-[clamp(22px,6vw,32px)] w-[clamp(22px,6vw,32px)]"
              />
            )}

            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
