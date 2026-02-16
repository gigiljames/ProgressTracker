import Navbar from "../components/Navbar";
import { IoSearch } from "react-icons/io5";

function TextbooksPage() {
  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-neutral-950 flex flex-col py-8 px-10">
        <div className="flex justify-between">
          <h1 className="text-white font-extrabold text-5xl">My Books</h1>
          <div className="flex gap-4">
            <div className="border border-neutral-700 rounded-full text-neutral-300 relative">
              <input
                type="text"
                placeholder="Search books"
                className="h-full rounded-full p-2 pr-10"
              />
              <span className="text-2xl absolute right-2.5 top-2.5 h-full ">
                <IoSearch />
              </span>
            </div>
            <button className="bg-neutral-500 rounded-full flex justify-center items-center px-4 text-lg">
              Add book
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TextbooksPage;
