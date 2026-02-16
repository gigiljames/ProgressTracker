import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface EditExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function EditExamModal({ isOpen, onClose }: EditExamModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [examDate, setExamDate] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    examDate: "",
    desc: "",
  });

  function handleSubmit() {
    let valid = true;
    const newErrors = {
      title: "",
      examDate: "",
      desc: "",
    };
    setErrors(newErrors);

    if (!title.trim()) {
      valid = false;
      newErrors.title = "Enter a valid exam title";
    }
    if (!examDate) {
      valid = false;
      newErrors.examDate = "Enter a valid exam date";
    }

    setErrors(newErrors);
  }

  return (
    <>
      {isOpen && (
        <div className="w-screen h-screen fixed inset-0 flex justify-center bg-black/50">
          <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 p-6 rounded-lg relative mt-15 min-w-100">
            <div
              className="absolute right-4 top-4 text-2xl text-neutral-300 hover:bg-neutral-700/75 p-1 rounded-md"
              onClick={onClose}
            >
              <IoClose />
            </div>
            <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
              Edit Exam
            </h1>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="font-medium text-neutral-300">Title</h2>
                <input
                  className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 ${
                    errors.title ? "ring ring-red-400" : ""
                  } `}
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <div className="text-red-400 pl-1">{errors.title}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-medium text-neutral-300">Date</h2>
                <input
                  className={`border border-neutral-800 rounded-md p-2 text-neutral-300 w-full h-14 mb-1 ${
                    errors.examDate ? "ring ring-red-400" : ""
                  }`}
                  type="date"
                  value={examDate}
                  placeholder="Exam date"
                  onChange={(e) => setExamDate(e.target.value)}
                />
                {errors.examDate && (
                  <div className="text-red-400 pl-1">{errors.examDate}</div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-medium text-neutral-300">Description</h2>
                <textarea
                  className={`border border-neutral-800 rounded-md p-2 text-neutral-300 min-h-25 mb-1 ${
                    errors.desc ? "ring ring-red-400" : ""
                  }`}
                  placeholder="Enter description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                {errors.desc && (
                  <div className="text-red-400 pl-1">{errors.desc}</div>
                )}
              </div>
              <button
                className="p-2 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 h-14 hover:text-neutral-300 font-medium active:text-neutral-200 active:bg-neutral-600"
                onClick={handleSubmit}
              >
                Update Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditExamModal;
