import { TiHome } from "react-icons/ti";
import { FaClipboard } from "react-icons/fa";
import { RiBookShelfFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router";

function Navbar() {
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
        <div className="flex flex-col items-center justify-between ">
          <div className="text-[32px] text-neutral-700 h-10 flex items-center">
            <FaUserCircle />
          </div>
          <p className="text-xs text-neutral-700">You</p>
        </div>
      </div>
    </>
  );
}

export default Navbar;
