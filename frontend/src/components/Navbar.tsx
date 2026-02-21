import { useState, useRef, useEffect } from "react";
import { TiHome } from "react-icons/ti";
import { FaClipboard } from "react-icons/fa";
import { RiBookShelfFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router";
import { userInfoStore } from "../zustand/userInfoStore";
import { userLogout } from "../api/userAuthService";
import toast from "react-hot-toast";

const navItems = [
  { to: "/", label: "Home", Icon: TiHome },
  { to: "/books", label: "Books", Icon: RiBookShelfFill },
  { to: "/exams", label: "Exams", Icon: FaClipboard },
];

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clearUserInfo = userInfoStore((state) => state.clearUserInfo);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    userLogout()
      .then(() => {
        clearUserInfo();
        toast.success("Logged out successfully.");
        navigate("/login");
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message || e?.message || "Logout failed.",
        );
      });
    setDropdownOpen(false);
  }

  // Determine active route — "/" only matches exactly
  function isActive(to: string) {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  }

  return (
    <>
      {/* Bottom nav bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl px-2 py-2 flex items-center gap-1">
        {navItems.map(({ to, label, Icon }) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to}>
              <div
                className={`flex flex-col items-center justify-center gap-1 px-5 py-2.5 rounded-xl transition-colors min-w-[72px] ${
                  active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/60 active:bg-neutral-800"
                }`}
              >
                <Icon
                  className={`text-[28px] ${active ? "text-white" : "text-neutral-500"}`}
                />
                <span
                  className={`text-xs font-medium leading-none ${active ? "text-white" : "text-neutral-500"}`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Profile / logout */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-1 px-5 py-2.5 rounded-xl transition-colors min-w-[72px] focus:outline-none ${
              dropdownOpen
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/60 active:bg-neutral-800"
            }`}
          >
            <FaUserCircle
              className={`text-[28px] ${dropdownOpen ? "text-white" : "text-neutral-500"}`}
            />
            <span
              className={`text-xs font-medium leading-none ${dropdownOpen ? "text-white" : "text-neutral-500"}`}
            >
              You
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full mb-3 right-0 bg-neutral-900 border border-neutral-700 rounded-xl py-1 min-w-[150px] shadow-xl">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 active:bg-neutral-700 transition-colors rounded-xl"
              >
                <IoLogOutOutline className="text-[20px]" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
