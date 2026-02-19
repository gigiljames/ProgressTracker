import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { createSlot } from "../api/slotService";

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Pre-fill the date field (YYYY-MM-DD). Useful when opening the modal from a calendar day. */
  defaultDate?: string;
}

function getTodayISO() {
  // Local date in YYYY-MM-DD
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function CreateSlotModal({
  isOpen,
  onClose,
  onSuccess,
  defaultDate,
}: CreateSlotModalProps) {
  const [date, setDate] = useState(defaultDate ?? getTodayISO());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    date: "",
    startTime: "",
    endTime: "",
    title: "",
  });

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setDate(defaultDate ?? getTodayISO());
      setStartTime("09:00");
      setEndTime("10:00");
      setTitle("");
      setDescription("");
      setErrors({ date: "", startTime: "", endTime: "", title: "" });
    }
  }, [isOpen, defaultDate]);

  function validate() {
    const newErrors = { date: "", startTime: "", endTime: "", title: "" };
    let valid = true;

    if (!date) {
      newErrors.date = "Date is required.";
      valid = false;
    }
    if (!startTime) {
      newErrors.startTime = "Start time is required.";
      valid = false;
    }
    if (!endTime) {
      newErrors.endTime = "End time is required.";
      valid = false;
    }
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time.";
      valid = false;
    }
    if (!title.trim()) {
      newErrors.title = "Title is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    createSlot({
      date,
      startTime,
      endTime,
      title: title.trim(),
      description: description.trim() || undefined,
    })
      .then(() => {
        toast.success("Slot created.");
        onSuccess();
        onClose();
      })
      .catch((e: any) => {
        toast.error(
          e?.response?.data?.message || e?.message || "Failed to create slot.",
        );
      })
      .finally(() => setLoading(false));
  }

  const inputBase =
    "w-full border border-neutral-800 rounded-md p-3 text-neutral-300 bg-neutral-900 focus:outline-none focus:border-neutral-600";
  const inputError = "ring-1 ring-red-400 border-red-400";

  return (
    <>
      {isOpen && (
        <div className="w-screen h-screen fixed inset-0 flex justify-center bg-black/50 z-50">
          <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 p-6 rounded-lg relative w-[480px] mt-15">
            {/* Close */}
            <button
              className="absolute right-4 top-4 text-2xl text-neutral-300 hover:bg-neutral-700/75 p-1 rounded-md cursor-pointer"
              onClick={onClose}
            >
              <IoClose />
            </button>

            <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
              Create Slot
            </h1>

            <div className="flex flex-col gap-4">
              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-sm">
                  Date
                </label>
                <input
                  type="date"
                  className={`${inputBase} ${errors.date ? inputError : ""}`}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && (
                  <span className="text-red-400 text-xs">{errors.date}</span>
                )}
              </div>

              {/* Start / End time */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="font-medium text-neutral-300 text-sm">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className={`${inputBase} ${errors.startTime ? inputError : ""}`}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  {errors.startTime && (
                    <span className="text-red-400 text-xs">
                      {errors.startTime}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <label className="font-medium text-neutral-300 text-sm">
                    End Time
                  </label>
                  <input
                    type="time"
                    className={`${inputBase} ${errors.endTime ? inputError : ""}`}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                  {errors.endTime && (
                    <span className="text-red-400 text-xs">
                      {errors.endTime}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-sm">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning study session"
                  className={`${inputBase} ${errors.title ? inputError : ""}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <span className="text-red-400 text-xs">{errors.title}</span>
                )}
              </div>

              {/* Description (optional) */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-sm">
                  Description{" "}
                  <span className="text-neutral-500">(Optional)</span>
                </label>
                <textarea
                  placeholder="Add notes about this slot..."
                  className={`${inputBase} min-h-[90px] resize-none`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-1 w-full p-3 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors active:bg-neutral-600 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateSlotModal;
