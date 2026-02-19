import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import EditTextbookModal from "../components/EditTextbookModal";
import AddSectionModal from "../components/AddSectionModal";
import EditSectionModal from "../components/EditSectionModal";
import AddChapterModal from "../components/AddChapterModal";
import EditChapterModal from "../components/EditChapterModal";
import AddTopicModal from "../components/AddTopicModal";
import EditTopicModal from "../components/EditTopicModal";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  IoChevronDown,
  IoChevronForward,
  IoAdd,
  IoPencil,
  IoTrash,
  IoCheckmark,
} from "react-icons/io5";
import toast from "react-hot-toast";
import { getBook, deleteBook } from "../api/bookService";
import {
  getSections,
  createSection,
  editSection,
  deleteSection,
} from "../api/sectionService";
import {
  getChapters,
  createChapter,
  editChapter,
  deleteChapter,
} from "../api/chapterService";
import {
  getTopics,
  createTopic,
  editTopic,
  deleteTopic,
  toggleTopic,
} from "../api/topicService";

// ── Types ────────────────────────────────────────────────────────────────────

type Topic = {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
};

type Chapter = {
  _id: string;
  title: string;
  description: string;
  totalTopics: number;
  completedTopics: number;
  topics: Topic[];
};

type Section = {
  _id: string;
  title: string;
  description: string;
  totalChapters: number;
  completedChapters: number;
  chapters: Chapter[];
};

type Book = {
  _id: string;
  title: string;
  description: string;
  color: string;
  totalTopics: number;
  completedTopics: number;
  sections: Section[];
};

// ── ExpandableText ─────────────────────────────────────────────────────────

const CHAR_LIMIT = 120;

function ExpandableText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > CHAR_LIMIT;
  const displayed =
    isLong && !expanded ? text.slice(0, CHAR_LIMIT) + "…" : text;

  return (
    <p className={className}>
      {displayed}
      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="ml-1.5 text-neutral-500 hover:text-neutral-300 text-xs underline transition-colors"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </p>
  );
}

// ── Immutable state helpers ───────────────────────────────────────────────────

function updateSection(
  sections: Section[],
  secId: string,
  updater: (s: Section) => Section,
): Section[] {
  return sections.map((s) => (s._id === secId ? updater(s) : s));
}

function updateChapter(
  sections: Section[],
  secId: string,
  chapId: string,
  updater: (c: Chapter) => Chapter,
): Section[] {
  return updateSection(sections, secId, (sec) => ({
    ...sec,
    chapters: sec.chapters.map((c) => (c._id === chapId ? updater(c) : c)),
  }));
}

function updateTopic(
  sections: Section[],
  secId: string,
  chapId: string,
  topId: string,
  updater: (t: Topic) => Topic,
): Section[] {
  return updateChapter(sections, secId, chapId, (chap) => ({
    ...chap,
    topics: chap.topics.map((t) => (t._id === topId ? updater(t) : t)),
  }));
}

// ── Component ────────────────────────────────────────────────────────────────

function ViewTextbookPage() {
  const { id: bookId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [editBookModal, setEditBookModal] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "BOOK" | "SECTION" | "CHAPTER" | "TOPIC" | null;
    ids: { secId?: string; chapId?: string; topId?: string } | null;
  }>({ isOpen: false, type: null, ids: null });

  const [activeModal, setActiveModal] = useState<{
    type:
      | "ADD_SECTION"
      | "EDIT_SECTION"
      | "ADD_CHAPTER"
      | "EDIT_CHAPTER"
      | "ADD_TOPIC"
      | "EDIT_TOPIC"
      | null;
    sectionId?: string;
    chapterId?: string;
    topicId?: string;
    initialTitle?: string;
    initialDescription?: string;
  }>({ type: null });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(),
  );

  // ── Initial Data Load ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);

    async function fetchAll() {
      try {
        const bookRes = await getBook(bookId!);
        const book: Book = { ...bookRes.data.data, sections: [] };

        const secRes = await getSections(bookId!);
        const sections: Section[] = (secRes.data.data ?? []).map(
          (s: Section) => ({ ...s, chapters: [] }),
        );

        await Promise.all(
          sections.map(async (section) => {
            const chapRes = await getChapters(section._id);
            const chapters: Chapter[] = (chapRes.data.data ?? []).map(
              (c: Chapter) => ({ ...c, topics: [] }),
            );

            await Promise.all(
              chapters.map(async (chapter) => {
                const topRes = await getTopics(chapter._id);
                chapter.topics = topRes.data.data ?? [];
              }),
            );

            section.chapters = chapters;
          }),
        );

        book.sections = sections;
        setBookData(book);
      } catch (e: any) {
        toast.error(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load textbook.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [bookId]);

  // ── Expand / Collapse ──────────────────────────────────────────────────────

  const toggleSection = (id: string) => {
    const next = new Set(expandedSections);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedSections(next);
  };

  const toggleChapter = (id: string) => {
    const next = new Set(expandedChapters);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedChapters(next);
  };

  const expandAll = () => {
    if (!bookData) return;
    setExpandedSections(new Set(bookData.sections.map((s) => s._id)));
    setExpandedChapters(
      new Set(bookData.sections.flatMap((s) => s.chapters.map((c) => c._id))),
    );
  };

  // ── Book edit ──────────────────────────────────────────────────────────────

  const handleBookEditSuccess = () => {
    if (!bookId) return;
    getBook(bookId)
      .then((res) => {
        const updated = res.data.data;
        setBookData((prev) =>
          prev
            ? {
                ...prev,
                title: updated.title,
                description: updated.description,
                color: updated.color,
              }
            : prev,
        );
      })
      .catch(() => {});
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleConfirmDelete = () => {
    if (!confirmModal.type || !bookData) return;
    const { type, ids } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    if (type === "BOOK") {
      deleteBook(bookData._id)
        .then(() => {
          toast.success("Book deleted.");
          navigate("/books");
        })
        .catch((e: any) =>
          toast.error(e?.response?.data?.message || "Failed to delete book."),
        );
      return;
    }

    if (type === "SECTION" && ids?.secId) {
      const secId = ids.secId;
      deleteSection(secId)
        .then(() => {
          toast.success("Section deleted.");
          setBookData((prev) =>
            prev
              ? {
                  ...prev,
                  sections: prev.sections.filter((s) => s._id !== secId),
                }
              : prev,
          );
        })
        .catch((e: any) =>
          toast.error(
            e?.response?.data?.message || "Failed to delete section.",
          ),
        );
      return;
    }

    if (type === "CHAPTER" && ids?.secId && ids?.chapId) {
      const { secId, chapId } = ids;
      deleteChapter(chapId)
        .then(() => {
          toast.success("Chapter deleted.");
          setBookData((prev) =>
            prev
              ? {
                  ...prev,
                  sections: updateSection(prev.sections, secId, (sec) => ({
                    ...sec,
                    chapters: sec.chapters.filter((c) => c._id !== chapId),
                  })),
                }
              : prev,
          );
        })
        .catch((e: any) =>
          toast.error(
            e?.response?.data?.message || "Failed to delete chapter.",
          ),
        );
      return;
    }

    if (type === "TOPIC" && ids?.secId && ids?.chapId && ids?.topId) {
      const { secId, chapId, topId } = ids;
      deleteTopic(topId)
        .then(() => {
          toast.success("Topic deleted.");
          setBookData((prev) => {
            if (!prev) return prev;
            const section = prev.sections.find((s) => s._id === secId);
            const chapter = section?.chapters.find((c) => c._id === chapId);
            const topic = chapter?.topics.find((t) => t._id === topId);
            const wasCompleted = topic?.isCompleted ?? false;
            return {
              ...prev,
              sections: updateChapter(prev.sections, secId, chapId, (chap) => ({
                ...chap,
                totalTopics: chap.totalTopics - 1,
                completedTopics: chap.completedTopics - (wasCompleted ? 1 : 0),
                topics: chap.topics.filter((t) => t._id !== topId),
              })),
            };
          });
        })
        .catch((e: any) =>
          toast.error(e?.response?.data?.message || "Failed to delete topic."),
        );
    }
  };

  const handleDelete = (
    type: "SECTION" | "CHAPTER" | "TOPIC",
    secId: string,
    chapId?: string,
    topId?: string,
  ) => {
    setConfirmModal({ isOpen: true, type, ids: { secId, chapId, topId } });
  };

  // ── Toggle Topic ───────────────────────────────────────────────────────────

  const handleToggleTopicCompletion = (
    secId: string,
    chapId: string,
    topId: string,
    currentlyCompleted: boolean,
  ) => {
    toggleTopic(topId)
      .then(() => {
        const delta = currentlyCompleted ? -1 : 1;
        setBookData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            sections: updateChapter(prev.sections, secId, chapId, (chap) => ({
              ...chap,
              completedTopics: chap.completedTopics + delta,
              topics: chap.topics.map((t) =>
                t._id === topId
                  ? {
                      ...t,
                      isCompleted: !currentlyCompleted,
                      completedAt: !currentlyCompleted
                        ? new Date().toISOString()
                        : null,
                    }
                  : t,
              ),
            })),
          };
        });
      })
      .catch((e: any) =>
        toast.error(e?.response?.data?.message || "Failed to toggle topic."),
      );
  };

  // ── Add / Edit ─────────────────────────────────────────────────────────────

  const handleModalSubmit = (data: { title: string; description: string }) => {
    const { type, sectionId, chapterId, topicId } = activeModal;
    if (!type || !bookData) return;

    if (type === "ADD_SECTION" && bookId) {
      createSection(bookId, data)
        .then((res) => {
          const newSection: Section = { ...res.data.data, chapters: [] };
          toast.success("Section added.");
          setActiveModal({ type: null });
          setBookData((prev) =>
            prev ? { ...prev, sections: [...prev.sections, newSection] } : prev,
          );
        })
        .catch((e: any) =>
          toast.error(e?.response?.data?.message || "Failed to add section."),
        );
      return;
    }

    if (type === "EDIT_SECTION" && sectionId) {
      editSection(sectionId, data)
        .then(() => {
          toast.success("Section updated.");
          setActiveModal({ type: null });
          setBookData((prev) =>
            prev
              ? {
                  ...prev,
                  sections: updateSection(prev.sections, sectionId, (sec) => ({
                    ...sec,
                    title: data.title,
                    description: data.description,
                  })),
                }
              : prev,
          );
        })
        .catch((e: any) =>
          toast.error(
            e?.response?.data?.message || "Failed to update section.",
          ),
        );
      return;
    }

    if (type === "ADD_CHAPTER" && sectionId) {
      createChapter(sectionId, data)
        .then((res) => {
          const newChapter: Chapter = { ...res.data.data, topics: [] };
          toast.success("Chapter added.");
          setActiveModal({ type: null });
          setBookData((prev) =>
            prev
              ? {
                  ...prev,
                  sections: updateSection(prev.sections, sectionId, (sec) => ({
                    ...sec,
                    chapters: [...sec.chapters, newChapter],
                  })),
                }
              : prev,
          );
        })
        .catch((e: any) =>
          toast.error(e?.response?.data?.message || "Failed to add chapter."),
        );
      return;
    }

    if (type === "EDIT_CHAPTER" && sectionId && chapterId) {
      editChapter(chapterId, data)
        .then(() => {
          toast.success("Chapter updated.");
          setActiveModal({ type: null });
          setBookData((prev) =>
            prev
              ? {
                  ...prev,
                  sections: updateChapter(
                    prev.sections,
                    sectionId,
                    chapterId,
                    (chap) => ({
                      ...chap,
                      title: data.title,
                      description: data.description,
                    }),
                  ),
                }
              : prev,
          );
        })
        .catch((e: any) =>
          toast.error(
            e?.response?.data?.message || "Failed to update chapter.",
          ),
        );
      return;
    }

    if (type === "ADD_TOPIC" && sectionId && chapterId) {
      createTopic(chapterId, data)
        .then((res) => {
          const newTopic: Topic = res.data.data;
          toast.success("Topic added.");
          setActiveModal({ type: null });
          setBookData((prev) =>
            prev
              ? {
                  ...prev,
                  sections: updateChapter(
                    prev.sections,
                    sectionId,
                    chapterId,
                    (chap) => ({
                      ...chap,
                      totalTopics: chap.totalTopics + 1,
                      topics: [...chap.topics, newTopic],
                    }),
                  ),
                }
              : prev,
          );
        })
        .catch((e: any) =>
          toast.error(e?.response?.data?.message || "Failed to add topic."),
        );
      return;
    }

    if (type === "EDIT_TOPIC" && sectionId && chapterId && topicId) {
      editTopic(topicId, data)
        .then(() => {
          toast.success("Topic updated.");
          setActiveModal({ type: null });
          setBookData((prev) =>
            prev
              ? {
                  ...prev,
                  sections: updateTopic(
                    prev.sections,
                    sectionId,
                    chapterId,
                    topicId,
                    (top) => ({
                      ...top,
                      title: data.title,
                      description: data.description,
                    }),
                  ),
                }
              : prev,
          );
        })
        .catch((e: any) =>
          toast.error(e?.response?.data?.message || "Failed to update topic."),
        );
    }
  };

  // ── Progress Helper ────────────────────────────────────────────────────────

  const calculateProgress = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
          <p className="text-neutral-500 text-xl">Loading...</p>
        </div>
      </>
    );
  }

  if (!bookData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
          <p className="text-neutral-500 text-xl">Book not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col py-8 px-10 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <h1 className="text-white font-extrabold text-5xl">
            {bookData.title}
          </h1>
          <div className="flex gap-4">
            <button
              className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 rounded-full px-5 py-2 font-medium transition-colors"
              onClick={() => setActiveModal({ type: "ADD_SECTION" })}
            >
              Add Section
            </button>
            <button
              className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 rounded-full px-5 py-2 font-medium transition-colors"
              onClick={() => setEditBookModal(true)}
            >
              Edit Book
            </button>
            <button
              className="bg-red-400 hover:bg-red-500 text-neutral-100 rounded-full px-5 py-2 font-medium transition-colors"
              onClick={() =>
                setConfirmModal({ isOpen: true, type: "BOOK", ids: null })
              }
            >
              Delete Book
            </button>
          </div>
        </div>

        {/* Book Description */}
        <div className="mb-8 max-w-4xl">
          <ExpandableText
            text={bookData.description}
            className="text-lg text-neutral-400 leading-relaxed"
          />
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-neutral-200 font-bold">Sections</h2>
          <button
            onClick={expandAll}
            style={{ color: bookData.color }}
            className="hover:underline font-medium"
          >
            Expand All
          </button>
        </div>

        {/* Sections List */}
        <div className="flex flex-col gap-4 pb-20">
          {bookData.sections.length === 0 && (
            <p className="text-neutral-600 text-center mt-8">
              No sections yet. Add one above.
            </p>
          )}
          {bookData.sections.map((section) => {
            const isSecExpanded = expandedSections.has(section._id);
            const totalTopics = section.chapters.reduce(
              (acc, c) => acc + c.totalTopics,
              0,
            );
            const completedTopics = section.chapters.reduce(
              (acc, c) => acc + c.completedTopics,
              0,
            );
            const secProgress = calculateProgress(completedTopics, totalTopics);

            return (
              <div
                key={section._id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <div className="p-4 flex items-center justify-between bg-neutral-900">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Double-size chevron (size 24) */}
                    <button
                      onClick={() => toggleSection(section._id)}
                      className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 flex-shrink-0"
                    >
                      {isSecExpanded ? (
                        <IoChevronDown size={24} />
                      ) : (
                        <IoChevronForward size={24} />
                      )}
                    </button>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-xl font-bold text-white">
                        {section.title}
                      </h3>
                      <span className="text-sm text-neutral-500">
                        {section.chapters.length} Chapters • {secProgress}%
                        Completed
                      </span>
                      {section.description && (
                        <ExpandableText
                          text={section.description}
                          className="text-sm text-neutral-500 mt-1"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 px-4 flex-shrink-0">
                    <div className="w-48 h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${secProgress}%`,
                          backgroundColor: bookData.color,
                        }}
                      />
                    </div>
                    <span
                      className="text-lg font-bold w-12 text-right"
                      style={{ color: bookData.color }}
                    >
                      {secProgress}%
                    </span>

                    <div className="flex gap-2 ml-4">
                      <button
                        title="Add Chapter"
                        onClick={() =>
                          setActiveModal({
                            type: "ADD_CHAPTER",
                            sectionId: section._id,
                          })
                        }
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                      >
                        <IoAdd />
                      </button>
                      <button
                        title="Edit Section"
                        onClick={() =>
                          setActiveModal({
                            type: "EDIT_SECTION",
                            sectionId: section._id,
                            initialTitle: section.title,
                            initialDescription: section.description,
                          })
                        }
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                      >
                        <IoPencil />
                      </button>
                      <button
                        title="Delete Section"
                        onClick={() => handleDelete("SECTION", section._id)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg"
                      >
                        <IoTrash />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chapters List */}
                {isSecExpanded && (
                  <div className="bg-neutral-900/50 border-t border-neutral-800 pl-4">
                    {section.chapters.length === 0 && (
                      <p className="text-neutral-600 text-sm py-4 pl-8">
                        No chapters yet.
                      </p>
                    )}
                    {section.chapters.map((chapter) => {
                      const isChapExpanded = expandedChapters.has(chapter._id);
                      const chapProgress = calculateProgress(
                        chapter.completedTopics,
                        chapter.totalTopics,
                      );

                      return (
                        <div
                          key={chapter._id}
                          className="border-b border-neutral-800/50 last:border-0"
                        >
                          {/* Chapter Header */}
                          <div className="p-3 pl-8 flex items-center justify-between hover:bg-neutral-800/30">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Double-size chevron (size 20) */}
                              <button
                                onClick={() => toggleChapter(chapter._id)}
                                className="text-neutral-500 hover:text-white p-1 rounded-full hover:bg-neutral-800 flex-shrink-0"
                              >
                                {isChapExpanded ? (
                                  <IoChevronDown size={20} />
                                ) : (
                                  <IoChevronForward size={20} />
                                )}
                              </button>
                              <div className="flex flex-col min-w-0">
                                <h4 className="text-lg font-medium text-neutral-200">
                                  {chapter.title}
                                </h4>
                                {chapter.description && (
                                  <ExpandableText
                                    text={chapter.description}
                                    className="text-sm text-neutral-500 mt-0.5"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-6 px-4 flex-shrink-0">
                              <div className="w-32 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${chapProgress}%`,
                                    backgroundColor: bookData.color,
                                  }}
                                />
                              </div>

                              <div className="flex gap-1 ml-4 opacity-50 hover:opacity-100 transition-opacity">
                                <button
                                  title="Add Topic"
                                  onClick={() =>
                                    setActiveModal({
                                      type: "ADD_TOPIC",
                                      sectionId: section._id,
                                      chapterId: chapter._id,
                                    })
                                  }
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"
                                >
                                  <IoAdd size={16} />
                                </button>
                                <button
                                  title="Edit Chapter"
                                  onClick={() =>
                                    setActiveModal({
                                      type: "EDIT_CHAPTER",
                                      sectionId: section._id,
                                      chapterId: chapter._id,
                                      initialTitle: chapter.title,
                                      initialDescription: chapter.description,
                                    })
                                  }
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"
                                >
                                  <IoPencil size={16} />
                                </button>
                                <button
                                  title="Delete Chapter"
                                  onClick={() =>
                                    handleDelete(
                                      "CHAPTER",
                                      section._id,
                                      chapter._id,
                                    )
                                  }
                                  className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded"
                                >
                                  <IoTrash size={16} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Topics List */}
                          {isChapExpanded && (
                            <div className="pl-16 pr-4 py-2 bg-neutral-950/30">
                              {chapter.topics.length === 0 && (
                                <p className="text-neutral-600 text-sm py-2">
                                  No topics yet.
                                </p>
                              )}
                              {chapter.topics.map((topic) => (
                                <div
                                  key={topic._id}
                                  className="flex items-start justify-between py-2 group gap-3"
                                >
                                  <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <button
                                      onClick={() =>
                                        handleToggleTopicCompletion(
                                          section._id,
                                          chapter._id,
                                          topic._id,
                                          topic.isCompleted,
                                        )
                                      }
                                      style={{
                                        backgroundColor: topic.isCompleted
                                          ? bookData.color
                                          : "transparent",
                                      }}
                                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                        topic.isCompleted
                                          ? ""
                                          : "border-neutral-600 hover:border-neutral-400"
                                      }`}
                                    >
                                      {topic.isCompleted && (
                                        <IoCheckmark
                                          size={14}
                                          className="text-white"
                                        />
                                      )}
                                    </button>
                                    <div className="flex flex-col min-w-0">
                                      <span
                                        className={`${
                                          topic.isCompleted
                                            ? "text-neutral-500 line-through"
                                            : "text-neutral-300"
                                        }`}
                                      >
                                        {topic.title}
                                      </span>
                                      {topic.description && (
                                        <ExpandableText
                                          text={topic.description}
                                          className="text-xs text-neutral-600 mt-0.5"
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button
                                      title="Edit Topic"
                                      onClick={() =>
                                        setActiveModal({
                                          type: "EDIT_TOPIC",
                                          sectionId: section._id,
                                          chapterId: chapter._id,
                                          topicId: topic._id,
                                          initialTitle: topic.title,
                                          initialDescription: topic.description,
                                        })
                                      }
                                      className="text-xs text-neutral-500 hover:text-white px-2 py-1 rounded bg-neutral-800"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      title="Delete Topic"
                                      onClick={() =>
                                        handleDelete(
                                          "TOPIC",
                                          section._id,
                                          chapter._id,
                                          topic._id,
                                        )
                                      }
                                      className="text-xs text-neutral-500 hover:text-red-400 px-2 py-1 rounded bg-neutral-800"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <EditTextbookModal
        isOpen={editBookModal}
        onClose={() => setEditBookModal(false)}
        onSuccess={handleBookEditSuccess}
        bookId={bookData._id}
        initialTitle={bookData.title}
        initialDescription={bookData.description}
        initialColor={bookData.color}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={
          confirmModal.type === "BOOK"
            ? "Delete Book"
            : `Delete ${
                confirmModal.type
                  ? confirmModal.type.charAt(0) +
                    confirmModal.type.slice(1).toLowerCase()
                  : "Item"
              }`
        }
        message={
          confirmModal.type === "BOOK"
            ? "Are you sure you want to delete this book? All its sections, chapters, and topics will also be deleted. This action cannot be undone."
            : "Are you sure you want to delete this item? This action cannot be undone."
        }
        confirmText="Delete"
        isDangerous={true}
      />

      <AddSectionModal
        isOpen={activeModal.type === "ADD_SECTION"}
        onClose={() => setActiveModal({ type: null })}
        onSubmit={handleModalSubmit}
      />

      <EditSectionModal
        isOpen={activeModal.type === "EDIT_SECTION"}
        onClose={() => setActiveModal({ type: null })}
        onSubmit={handleModalSubmit}
        initialTitle={activeModal.initialTitle ?? ""}
        initialDescription={activeModal.initialDescription ?? ""}
      />

      <AddChapterModal
        isOpen={activeModal.type === "ADD_CHAPTER"}
        onClose={() => setActiveModal({ type: null })}
        onSubmit={handleModalSubmit}
      />

      <EditChapterModal
        isOpen={activeModal.type === "EDIT_CHAPTER"}
        onClose={() => setActiveModal({ type: null })}
        onSubmit={handleModalSubmit}
        initialTitle={activeModal.initialTitle ?? ""}
        initialDescription={activeModal.initialDescription ?? ""}
      />

      <AddTopicModal
        isOpen={activeModal.type === "ADD_TOPIC"}
        onClose={() => setActiveModal({ type: null })}
        onSubmit={handleModalSubmit}
      />

      <EditTopicModal
        isOpen={activeModal.type === "EDIT_TOPIC"}
        onClose={() => setActiveModal({ type: null })}
        onSubmit={handleModalSubmit}
        initialTitle={activeModal.initialTitle ?? ""}
        initialDescription={activeModal.initialDescription ?? ""}
      />
    </>
  );
}

export default ViewTextbookPage;
