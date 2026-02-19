import { useState, useRef, useEffect } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { colors } from "../constants/colors";
import { createBook } from "../api/bookService";
import toast from "react-hot-toast";

interface AddTextbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AddTextbookModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTextbookModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState({ title: "", color: "" });

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDesc("");
      setColor(colors[0]);
      setErrors({ title: "", color: "" });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsColorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit() {
    const newErrors = { title: "", color: "" };

    if (!title.trim()) newErrors.title = "Enter a valid textbook title";
    if (!color) newErrors.color = "Select a valid color";

    setErrors(newErrors);
    if (newErrors.title || newErrors.color) return;

    setLoading(true);
    createBook({ title: title.trim(), description: desc.trim(), color })
      .then(() => {
        toast.success("Textbook added successfully.");
        onSuccess();
        onClose();
      })
      .catch((e: any) => {
        toast.error(
          e?.response?.data?.message || e?.message || "Failed to add textbook.",
        );
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      {isOpen && (
        <div className="w-screen h-screen fixed inset-0 flex justify-center bg-black/50 z-50">
          <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 p-6 rounded-lg relative min-w-100 mt-15 max-w-lg">
            <button
              className="absolute right-4 top-4 text-2xl text-neutral-300 hover:bg-neutral-700/75 p-1 rounded-md cursor-pointer"
              onClick={onClose}
            >
              <IoClose />
            </button>
            <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
              Add Textbook
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-neutral-300">Title</label>
                <input
                  className={`border border-neutral-800 rounded-md p-3 text-neutral-300 bg-neutral-900 focus:outline-none focus:border-neutral-600 ${
                    errors.title ? "ring-1 ring-red-400 border-red-400" : ""
                  }`}
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <span className="text-red-400 text-sm">{errors.title}</span>
                )}
              </div>

              <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
                <label className="font-medium text-neutral-300">Color</label>
                <button
                  type="button"
                  className={`border border-neutral-800 rounded-md p-3 bg-neutral-900 flex items-center justify-between focus:outline-none focus:border-neutral-600 ${
                    errors.color ? "ring-1 ring-red-400 border-red-400" : ""
                  }`}
                  onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-neutral-300">{color}</span>
                  </div>
                  <IoChevronDown
                    className={`text-neutral-400 transition-transform ${isColorDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isColorDropdownOpen && (
                  <div className="absolute top-[85px] left-0 w-full z-10 bg-neutral-900 border border-neutral-700 rounded-lg p-4 shadow-xl max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-3">
                      {colors.map((c) => (
                        <button
                          key={c}
                          className={`w-8 h-8 rounded-full transition-transform ${
                            color === c
                              ? "ring-2 ring-white scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: c }}
                          onClick={() => {
                            setColor(c);
                            setIsColorDropdownOpen(false);
                          }}
                          type="button"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errors.color && (
                  <span className="text-red-400 text-sm">{errors.color}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-neutral-300">
                  Description{" "}
                  <span className="text-neutral-500 text-sm">(Optional)</span>
                </label>
                <textarea
                  className="border border-neutral-800 rounded-md p-3 text-neutral-300 bg-neutral-900 min-h-[120px] focus:outline-none focus:border-neutral-600"
                  placeholder="Enter description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <button
                className="mt-2 w-full p-3 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors active:bg-neutral-600 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Textbook"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddTextbookModal;
