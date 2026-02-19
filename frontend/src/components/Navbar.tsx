import { useState, useRef, useEffect } from "react";
import { TiHome } from "react-icons/ti";
import { FaClipboard } from "react-icons/fa";
import { RiBookShelfFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { userInfoStore } from "../zustand/userInfoStore";
import { userLogout } from "../api/userAuthService";
import toast from "react-hot-toast";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clearUserInfo = userInfoStore((state) => state.clearUserInfo);
  const navigate = useNavigate();

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

  return (
    <>
      <div className="fixed bottom-5 right-5 bg-neutral-900 border border-neutral-700 p-2 rounded-xl flex gap-7 px-6">
        <Link to="/">
          <div className="flex flex-col items-center justify-between">
            <div className="text-[36px] text-neutral-700 h-10 flex items-center">
              <TiHome />
            </div>
            <p className="text-xs text-neutral-700">Home</p>
          </div>
        </Link>
        <Link to="/books">
          <div className="flex flex-col items-center justify-between ">
            <div className="text-[34px] text-neutral-700 h-10 flex items-center">
              <RiBookShelfFill />
            </div>
            <p className="text-xs text-neutral-700">Books</p>
          </div>
        </Link>
        <Link to="/exams">
          <div className="flex flex-col items-center justify-between ">
            <div className="text-[30px] text-neutral-700 h-10 flex items-center">
              <FaClipboard />
            </div>
            <p className="text-xs text-neutral-700">Exams</p>
          </div>
        </Link>

        <div
          className="relative flex flex-col items-center justify-between"
          ref={dropdownRef}
        >
          <button
            className="flex flex-col items-center gap-0 focus:outline-none"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="text-[32px] text-neutral-700 h-10 flex items-center">
              <FaUserCircle />
            </div>
            <p className="text-xs text-neutral-700">You</p>
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full mb-3 -right-4 bg-neutral-900 border border-neutral-700 rounded-lg py-1 min-w-[130px] shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
              >
                <IoLogOutOutline className="text-[16px]" />
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
