import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

interface EditTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle: string;
  initialDescription: string;
  onSubmit?: (data: { title: string; description: string }) => void;
}

function EditTopicModal({
  isOpen,
  onClose,
  initialTitle,
  initialDescription,
  onSubmit,
}: EditTopicModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [errors, setErrors] = useState({ title: "" });

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setErrors({ title: "" });
    }
  }, [isOpen, initialTitle, initialDescription]);

  function handleSubmit() {
    const newErrors = { title: "" };
    if (!title.trim()) newErrors.title = "Enter a valid topic title";
    setErrors(newErrors);
    if (newErrors.title) return;

    onSubmit?.({ title: title.trim(), description: description.trim() });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="w-screen h-screen fixed inset-0 flex justify-center bg-black/50 z-50">
      <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 p-6 rounded-lg relative mt-15 min-w-100">
        <div
          className="absolute right-4 top-4 text-2xl text-neutral-300 hover:bg-neutral-700/75 p-1 rounded-md cursor-pointer"
          onClick={onClose}
        >
          <IoClose />
        </div>

        <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
          Edit Topic
        </h1>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-medium text-neutral-300">Title</h2>
            <input
              className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 bg-neutral-900 focus:outline-none focus:border-neutral-600 ${
                errors.title ? "ring ring-red-400" : ""
              }`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter topic title"
            />
            {errors.title && (
              <div className="text-red-400 pl-1">{errors.title}</div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-medium text-neutral-300">
              Description{" "}
              <span className="text-neutral-500 text-sm">(Optional)</span>
            </h2>
            <textarea
              className="border border-neutral-800 rounded-md p-2 text-neutral-300 min-h-25 mb-1 bg-neutral-900 focus:outline-none focus:border-neutral-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter topic description"
            />
          </div>

          <button
            className="p-2 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 h-14 hover:text-neutral-300 font-medium active:text-neutral-200 active:bg-neutral-600"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTopicModal;
