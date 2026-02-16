import { IoSearch } from "react-icons/io5";
import Navbar from "../components/Navbar";
import { useState } from "react";
import AddExamModal from "../components/AddExamModal";

function ExamsPage() {
  const [addExamModal, setAddExamModal] = useState(false);
  return (
    <>
      <Navbar />
      <AddExamModal
        isOpen={addExamModal}
        onClose={() => {
          setAddExamModal(false);
        }}
      />
      <div className="h-screen w-screen bg-neutral-950 flex flex-col py-8 px-10">
        <div className="flex justify-between mb-8">
          <h1 className="text-white font-extrabold text-5xl">My Exams</h1>
          <div className="flex gap-4">
            <div className="border border-neutral-700 rounded-full text-neutral-300 relative">
              <input
                type="text"
                placeholder="Search exams"
                className="h-full rounded-full p-2 pr-10 pl-3"
              />
              <span className="text-2xl absolute right-2.5 top-2.5 h-full ">
                <IoSearch />
              </span>
            </div>
            <button
              className="bg-neutral-500 rounded-full flex justify-center items-center px-4 text-lg"
              onClick={() => {
                setAddExamModal(true);
              }}
            >
              Add exam
            </button>
          </div>
        </div>
        <div className="text-2xl text-neutral-600 h-100 flex items-center justify-center">
          Coming soon...
        </div>
      </div>
    </>
  );
}

export default ExamsPage;
