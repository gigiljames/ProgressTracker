import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddExamModal({ isOpen, onClose }: AddExamModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  function handleAddExam() {}
  return (
    <>
      {isOpen && (
        <div className="w-screen h-screen fixed inset-0 flex justify-center bg-black/50">
          <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 p-6 rounded-lg relative mt-15">
            <div
              className="absolute right-4 top-4 text-neutral-300"
              onClick={onClose}
            >
              <IoClose />
            </div>
            <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
              Add Exam
            </h1>
            <div className="flex flex-col gap-3">
              <input
                className="border border-neutral-800 rounded-md p-2 text-neutral-300"
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="border border-neutral-800 rounded-md p-2 text-neutral-300"
                type="password"
                placeholder="Enter description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <button
                className="p-2 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 font-medium active:text-neutral-200 active:bg-neutral-600"
                onClick={handleAddExam}
              >
                Add Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddExamModal;
