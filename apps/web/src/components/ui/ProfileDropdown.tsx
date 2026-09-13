import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserRound, Settings, LogOut, Bookmark, Heart } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export default function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left font-poppins" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="navbar__icon-btn flex items-center gap-1.5 hover:bg-gray-100 transition-colors rounded-full p-1.5 pr-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-5 h-5 rounded-full object-cover"
          />
        ) : (
          <UserRound size={20} />
        )}
      </button>

      <div
        className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right transition-all duration-200
          ${isOpen ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-95"}`}
      >
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>

        <div className="py-2">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-froly-50 hover:text-froly-500 transition-colors"
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>

          <Link
            to="/bookings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-froly-50 hover:text-froly-500 transition-colors"
          >
            <Bookmark size={16} />
            <span>History</span>
          </Link>

          <Link
            to="/favorites"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-froly-50 hover:text-froly-500 transition-colors"
          >
            <Heart size={16} />
            <span>Liked Pets</span>
          </Link>
        </div>

        <div className="border-t border-gray-100 py-2">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}