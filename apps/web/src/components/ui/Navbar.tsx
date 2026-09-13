import { Link, useNavigate, NavLink } from "react-router-dom";
import "@/styles/Navbar.css";
import { UserRound, Heart, Search } from "lucide-react";
import NotificationsDropdown from "./Notifcation";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth, useProfile, signOut } from "@repo/api";

const NOTIFICATIONS = [
  { id: 1, name: "Milo", action: "booking confirmed", time: "2 hours ago" },
  {
    id: 2,
    name: "Buddy",
    action: "now available for the weekend",
    time: "1 day ago",
  },
  { id: 3, name: "Bella", action: "is due back on Friday", time: "2 days ago" },
];

export default function Navbar() {

  const { user, loading } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="navbar sticky top-0 pt-4 px-6 pb-0 z-20 bg-transparent">
      <div className="navbar__inner flex align-center justify-between gap-6 py-3 px-5 rounded-full shadow-md">
        <Link
          to="/"
          className="navbar__logo flex align-center gap-2 whitespace-nowrap"
        >
          <img src="/images/pawicon.png" alt="icon" />
          <span className="font-cherry text-xl">
            Paw<span className="text-froly-400">Borrow</span>
          </span>
        </Link>

        <nav className="navbar__links font-poppins" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "text-froly-600" : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/pets"
            className={({ isActive }) => `nav-link ${isActive ? "text-froly-600" : ""}`}
          >
            Pets
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? "text-froly-600" : ""}`}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-link ${isActive ? "text-froly-600" : ""}`}
          >
            Contact Us
          </NavLink>
        </nav>

        <div className="navbar__actions">
          <div className="navbar__search">
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search"
            />
            <button aria-label="Search">
              <Search size={20} />
            </button>
          </div>

          <NotificationsDropdown notifications={NOTIFICATIONS} />

         {!loading && (
            user ? (
              <ProfileDropdown
                user={{
                  name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Account",
                  email: profile?.email ?? user.email ?? "",
                  avatar: profile?.avatar_url ?? undefined,
                }}
                onLogout={handleLogout}
              />
            ) : (
              <div className="flex items-center gap-1">
                <NavLink to="/login" className="rounded-full text-froly-500 px-4 py-2 text-sm font-medium hover:bg-froly-100 transition-colors mr-2">
                 Sign In
                </NavLink>
                <NavLink to="/register" className="rounded-full bg-froly-500 text-white px-4 py-2 text-sm font-medium hover:bg-froly-600 transition-colors">
                  Sign Up
                </NavLink>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}