import {
  CalendarClock,
  ChevronLeft,
  FilePenLine,
  LayoutDashboard,
  PawPrint,
  ScrollText,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useState } from "react";

import { Link, useLocation } from "react-router-dom";

type SidebarLink = {
  label: string;
  icon: LucideIcon;
  to: string;
};

const links: SidebarLink[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/",
  },
  {
    label: "Users Management",
    icon: Users,
    to: "/users",
  },
  {
    label: "Pets Management",
    icon: PawPrint,
    to: "/pets",
  },
  {
    label: "Booking Management",
    icon: CalendarClock,
    to: "/bookings",
  },
  {
    label: "Reviews",
    icon: Star,
    to: "/reviews",
  },
  {
    label: "Content Management",
    icon: FilePenLine,
    to: "/content",
  },
  {
    label: "Audit Trail",
    icon: ScrollText,
    to: "/audit-logs",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const { pathname } = useLocation();

  function isActive(route: string): boolean {
    if (route === "/") {
      return pathname === "/";
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  }

  return (
    <aside
      className={`
        sticky top-0 z-30
        flex h-screen
        shrink-0
        flex-col bg-sky-400
        text-white shadow-sm
        transition-[width]
        duration-200
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      <button
        type="button"
        onClick={() => setCollapsed((current) => !current)}
        className="
          absolute -right-4 top-6
          z-40 flex size-8
          items-center justify-center
          rounded-full bg-white
          text-sky-500 shadow-md
          transition
          hover:bg-gray-50
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-sky-500
        "
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        <ChevronLeft
          size={18}
          className={`
            transition-transform
            duration-200
            ${collapsed ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          flex h-24
          items-center
          ${collapsed ? "justify-center px-4" : "gap-2 px-6"}
        `}
      >
        <PawPrint
          size={32}
          className="
            shrink-0
            text-white
          "
        />

        {!collapsed && (
          <span
            className="
              whitespace-nowrap
              font-cherry
              text-xl
            "
          >
            PawBorrow Admin
          </span>
        )}
      </div>

      <nav
        className="
          flex flex-1
          flex-col gap-2
          overflow-y-auto
          px-4 pb-6
        "
        aria-label="Admin navigation"
      >
        {links.map(({ label, icon: Icon, to }) => {
          const active = isActive(to);

          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={`
                  flex min-h-11
                  items-center
                  rounded-xl
                  text-sm font-medium
                  transition-colors
                  ${collapsed ? "justify-center px-3" : "gap-3 px-4"}
                  ${
                    active
                      ? `
                        bg-white
                        text-sky-500
                        shadow-sm
                      `
                      : `
                        text-white/90
                        hover:bg-white/10
                        hover:text-white
                      `
                  }
                `}
            >
              <Icon size={19} className="shrink-0" />

              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
