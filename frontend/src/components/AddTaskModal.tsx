import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { addTask } from "../api/slotService";
import { getBooks } from "../api/bookService";
import { getSections } from "../api/sectionService";
import { getChapters } from "../api/chapterService";
import { getTopics } from "../api/topicService";

// ── Types ──────────────────────────────────────────────────────────────────

interface Book {
  _id: string;
  title: string;
}
interface Section {
  _id: string;
  title: string;
}
interface Chapter {
  _id: string;
  title: string;
}
interface Topic {
  _id: string;
  title: string;
  isCompleted: boolean;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedSlot: any) => void;
  slotId: string;
}

// ── Component ──────────────────────────────────────────────────────────────

function AddTaskModal({
  isOpen,
  onClose,
  onSuccess,
  slotId,
}: AddTaskModalProps) {
  const [mode, setMode] = useState<"CUSTOM" | "TEXTBOOK">("CUSTOM");

  // Custom mode fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Textbook cascade
  const [books, setBooks] = useState<Book[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [tbDescription, setTbDescription] = useState("");

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({ title: "", topic: "" });

  // Reset on open
  useEffect(() => {
    if (!isOpen) return;
    setMode("CUSTOM");
    setTitle("");
    setDescription("");
    setSelectedBookId("");
    setSelectedSectionId("");
    setSelectedChapterId("");
    setSelectedTopicId("");
    setTbDescription("");
    setSections([]);
    setChapters([]);
    setTopics([]);
    setErrors({ title: "", topic: "" });
  }, [isOpen]);

  // Fetch books when switching to TEXTBOOK mode
  useEffect(() => {
    if (mode !== "TEXTBOOK" || !isOpen) return;
    setLoadingBooks(true);
    getBooks()
      .then((r) => setBooks(r.data.data ?? []))
      .catch(() => toast.error("Failed to load books."))
      .finally(() => setLoadingBooks(false));
  }, [mode, isOpen]);

  // Cascade: book → sections
  useEffect(() => {
    setSelectedSectionId("");
    setSections([]);
    setSelectedChapterId("");
    setChapters([]);
    setSelectedTopicId("");
    setTopics([]);
    if (!selectedBookId) return;
    setLoadingSections(true);
    getSections(selectedBookId)
      .then((r) => setSections(r.data.data ?? []))
      .catch(() => toast.error("Failed to load sections."))
      .finally(() => setLoadingSections(false));
  }, [selectedBookId]);

  // Cascade: section → chapters
  useEffect(() => {
    setSelectedChapterId("");
    setChapters([]);
    setSelectedTopicId("");
    setTopics([]);
    if (!selectedSectionId) return;
    setLoadingChapters(true);
    getChapters(selectedSectionId)
      .then((r) => setChapters(r.data.data ?? []))
      .catch(() => toast.error("Failed to load chapters."))
      .finally(() => setLoadingChapters(false));
  }, [selectedSectionId]);

  // Cascade: chapter → topics
  useEffect(() => {
    setSelectedTopicId("");
    setTopics([]);
    if (!selectedChapterId) return;
    setLoadingTopics(true);
    getTopics(selectedChapterId)
      .then((r) => setTopics(r.data.data ?? []))
      .catch(() => toast.error("Failed to load topics."))
      .finally(() => setLoadingTopics(false));
  }, [selectedChapterId]);

  function validate(): boolean {
    const e = { title: "", topic: "" };
    let ok = true;
    if (mode === "CUSTOM" && !title.trim()) {
      e.title = "Title is required.";
      ok = false;
    }
    if (mode === "TEXTBOOK" && !selectedTopicId) {
      e.topic = "Please select a topic.";
      ok = false;
    }
    setErrors(e);
    return ok;
  }

  function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);

    const selectedTopic = topics.find((t) => t._id === selectedTopicId);
    const payload =
      mode === "CUSTOM"
        ? {
            type: "CUSTOM" as const,
            titleSnapshot: title.trim(),
            description: description.trim() || undefined,
          }
        : {
            type: "TEXTBOOK" as const,
            topicId: selectedTopicId,
            titleSnapshot: selectedTopic?.title ?? "",
            description: tbDescription.trim() || undefined,
          };

    addTask(slotId, payload)
      .then((r) => {
        toast.success("Task added.");
        onSuccess(r.data.data.slot);
        onClose();
      })
      .catch((e: any) =>
        toast.error(e?.response?.data?.message || "Failed to add task."),
      )
      .finally(() => setSubmitting(false));
  }

  const inputBase =
    "w-full border border-neutral-800 rounded-md p-3 text-neutral-300 bg-neutral-900 focus:outline-none focus:border-neutral-600 disabled:opacity-40";
  const selectBase = inputBase + " cursor-pointer";

  if (!isOpen) return null;

  return (
    <div className="w-screen h-screen fixed inset-0 flex justify-center bg-black/50 z-50 overflow-y-auto py-10">
      <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 p-6 rounded-lg relative w-[500px]">
        {/* Close */}
        <button
          className="absolute right-4 top-4 text-2xl text-neutral-300 hover:bg-neutral-700/75 p-1 rounded-md cursor-pointer"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
          Add Task
        </h1>

        {/* Mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-neutral-800 text-sm font-medium">
          {(["CUSTOM", "TEXTBOOK"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 transition-colors ${
                mode === m
                  ? "bg-neutral-800 text-neutral-200"
                  : "bg-neutral-900 text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {m === "CUSTOM" ? "Custom Task" : "From Textbook"}
            </button>
          ))}
        </div>

        {/* ── CUSTOM MODE ───────────────────────────────────── */}
        {mode === "CUSTOM" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-neutral-300 text-sm">
                Title
              </label>
              <input
                type="text"
                placeholder="Task title"
                className={`${inputBase} ${errors.title ? "ring-1 ring-red-400 border-red-400" : ""}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <span className="text-red-400 text-xs">{errors.title}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-neutral-300 text-sm">
                Description <span className="text-neutral-500">(Optional)</span>
              </label>
              <textarea
                placeholder="Add notes..."
                className={`${inputBase} min-h-[80px] resize-none`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── TEXTBOOK MODE ─────────────────────────────────── */}
        {mode === "TEXTBOOK" && (
          <div className="flex flex-col gap-4">
            {/* Book */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-neutral-300 text-sm">
                Book
              </label>
              <select
                className={selectBase}
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                disabled={loadingBooks}
              >
                <option value="">
                  {loadingBooks ? "Loading..." : "Select a book"}
                </option>
                {books.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            {selectedBookId && (
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-sm">
                  Section
                </label>
                <select
                  className={selectBase}
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  disabled={loadingSections || sections.length === 0}
                >
                  <option value="">
                    {loadingSections
                      ? "Loading..."
                      : sections.length === 0
                        ? "No sections"
                        : "Select a section"}
                  </option>
                  {sections.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chapter */}
            {selectedSectionId && (
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-sm">
                  Chapter
                </label>
                <select
                  className={selectBase}
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  disabled={loadingChapters || chapters.length === 0}
                >
                  <option value="">
                    {loadingChapters
                      ? "Loading..."
                      : chapters.length === 0
                        ? "No chapters"
                        : "Select a chapter"}
                  </option>
                  {chapters.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic */}
            {selectedChapterId && (
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-sm">
                  Topic
                </label>
                <select
                  className={`${selectBase} ${errors.topic ? "ring-1 ring-red-400 border-red-400" : ""}`}
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  disabled={loadingTopics || topics.length === 0}
                >
                  <option value="">
                    {loadingTopics
                      ? "Loading..."
                      : topics.length === 0
                        ? "No topics"
                        : "Select a topic"}
                  </option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                      {t.isCompleted ? " ✓" : ""}
                    </option>
                  ))}
                </select>
                {errors.topic && (
                  <span className="text-red-400 text-xs">{errors.topic}</span>
                )}
              </div>
            )}

            {/* Optional description */}
            {selectedTopicId && (
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-sm">
                  Notes <span className="text-neutral-500">(Optional)</span>
                </label>
                <textarea
                  placeholder="Any additional notes..."
                  className={`${inputBase} min-h-[70px] resize-none`}
                  value={tbDescription}
                  onChange={(e) => setTbDescription(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full p-3 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors active:bg-neutral-600 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Task"}
        </button>
      </div>
    </div>
  );
}

export default AddTaskModal;
