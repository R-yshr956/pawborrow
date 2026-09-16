import { Link, useNavigate, NavLink } from "react-router-dom";
import NotificationsDropdown from "./Notification";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth, useProfile, signOut } from "@repo/api";
import "@/styles/Navbar.css";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="navbar sticky top-0 z-20 bg-transparent px-6 pb-0 pt-4">
      <div className="navbar__inner flex items-center justify-between gap-6 rounded-full px-5 py-3 shadow-md">
        <Link
          to="/"
          className="navbar__logo flex items-center gap-2 whitespace-nowrap"
        >
          <img src="/images/pawicon.png" alt="PawBorrow" />

          <span className="font-cherry text-xl">
            Paw<span className="text-froly-400">Borrow</span>
          </span>
        </Link>

        <nav className="navbar__links font-poppins" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-froly-600" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pets"
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-froly-600" : ""}`
            }
          >
            Pets
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-froly-600" : ""}`
            }
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-froly-600" : ""}`
            }
          >
            Contact Us
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {!loading &&
            (user ? (
              <>
                <NotificationsDropdown />

                <ProfileDropdown
                  user={{
                    name:
                      [profile?.first_name, profile?.last_name]
                        .filter(Boolean)  
                        .join(" ") || "Account",
                    email: profile?.email ?? user.email ?? "",
                    avatar: profile?.avatar_url ?? undefined,
                  }}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <div className="flex items-center gap-1">
                <NavLink
                  to="/login"
                  className="mr-2 rounded-full px-4 py-2 text-sm font-medium text-froly-500 transition-colors hover:bg-froly-100"
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="/register"
                  className="rounded-full bg-froly-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-froly-600"
                >
                  Sign Up
                </NavLink>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}