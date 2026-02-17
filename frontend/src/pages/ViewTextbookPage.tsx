import { useState } from "react";
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

// Initial dummy data
const initialBook = {
  _id: "65f1a1c4e1a1a1a1a1a1a101",
  userId: "65f1a1c4e1a1a1a1a1a1a001",
  title: "Human Anatomy",
  description:
    "Detailed exploration of structural anatomy with clinical relevance for medical students.",
  color: "#987aaa",
  totalTopics: 8,
  completedTopics: 3,
  createdAt: "2026-02-01T10:00:00.000Z",
  updatedAt: "2026-02-10T10:00:00.000Z",

  sections: [
    {
      _id: "sec001",
      title: "Upper Limb",
      description:
        "Anatomy of bones, joints, muscles, vessels, and nerves of the upper extremity.",
      totalChapters: 2,
      completedChapters: 1,

      chapters: [
        {
          _id: "chap001",
          title: "Bones of Upper Limb",
          description:
            "Covers detailed osteology of clavicle, scapula, humerus, radius, and ulna.",
          totalTopics: 3,
          completedTopics: 2,

          topics: [
            {
              _id: "top001",
              title: "Humerus",
              description:
                "Anatomical features, muscle attachments, fractures, and clinical correlations.",
              isCompleted: true,
              completedAt: "2026-02-09T10:00:00.000Z",
            },
            {
              _id: "top002",
              title: "Radius",
              description:
                "Structure, articulations, and clinical significance of radius fractures.",
              isCompleted: true,
              completedAt: "2026-02-09T11:00:00.000Z",
            },
            {
              _id: "top003",
              title: "Ulna",
              description:
                "Olecranon process, shaft features, and functional anatomy.",
              isCompleted: false,
              completedAt: null,
            },
          ],
        },
        {
          _id: "chap002",
          title: "Muscles of Upper Limb",
          description:
            "Functional groups of flexors and extensors with innervation patterns.",
          totalTopics: 2,
          completedTopics: 0,

          topics: [
            {
              _id: "top004",
              title: "Flexor Group",
              description:
                "Origin, insertion, nerve supply, and action of flexor muscles.",
              isCompleted: false,
              completedAt: null,
            },
            {
              _id: "top005",
              title: "Extensor Group",
              description:
                "Posterior compartment muscles and radial nerve involvement.",
              isCompleted: false,
              completedAt: null,
            },
          ],
        },
      ],
    },

    {
      _id: "sec002",
      title: "Lower Limb",
      description:
        "Study of lower limb skeletal framework, musculature, and neurovascular supply.",
      totalChapters: 1,
      completedChapters: 0,

      chapters: [
        {
          _id: "chap003",
          title: "Bones of Lower Limb",
          description:
            "Osteology of femur, tibia, fibula and their articulations.",
          totalTopics: 3,
          completedTopics: 1,

          topics: [
            {
              _id: "top006",
              title: "Femur",
              description:
                "Largest bone in the body, anatomical landmarks and fracture sites.",
              isCompleted: true,
              completedAt: "2026-02-08T09:00:00.000Z",
            },
            {
              _id: "top007",
              title: "Tibia",
              description:
                "Weight-bearing bone with clinical importance in trauma.",
              isCompleted: false,
              completedAt: null,
            },
            {
              _id: "top008",
              title: "Fibula",
              description:
                "Non-weight-bearing bone contributing to ankle stability.",
              isCompleted: false,
              completedAt: null,
            },
          ],
        },
      ],
    },
  ],
};

function ViewTextbookPage() {
  const [bookData, setBookData] = useState(initialBook);
  const [editBookModal, setEditBookModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "SECTION" | "CHAPTER" | "TOPIC" | null;
    ids: { secId?: string; chapId?: string; topId?: string } | null;
  }>({ isOpen: false, type: null, ids: null });

  // Modal States
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
  }>({ type: null });

  // Expansion States
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["sec001"]),
  );
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(["chap001"]),
  );

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedSections(newExpanded);
  };

  const toggleChapter = (id: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedChapters(newExpanded);
  };

  const expandAll = () => {
    const allSecIds = bookData.sections.map((s) => s._id);
    const allChapIds = bookData.sections.flatMap((s) =>
      s.chapters.map((c) => c._id),
    );
    setExpandedSections(new Set(allSecIds));
    setExpandedChapters(new Set(allChapIds));
  };

  const handleConfirmDelete = () => {
    if (!confirmModal.type || !confirmModal.ids) return;
    const { type, ids } = confirmModal;

    const newBookData = JSON.parse(JSON.stringify(bookData));
    if (type === "SECTION" && ids.secId) {
      newBookData.sections = newBookData.sections.filter(
        (s: any) => s._id !== ids.secId,
      );
    } else if (type === "CHAPTER" && ids.secId && ids.chapId) {
      const section = newBookData.sections.find(
        (s: any) => s._id === ids.secId,
      );
      if (section) {
        section.chapters = section.chapters.filter(
          (c: any) => c._id !== ids.chapId,
        );
      }
    } else if (type === "TOPIC" && ids.secId && ids.chapId && ids.topId) {
      const section = newBookData.sections.find(
        (s: any) => s._id === ids.secId,
      );
      const chapter = section?.chapters.find((c: any) => c._id === ids.chapId);
      if (chapter) {
        chapter.topics = chapter.topics.filter((t: any) => t._id !== ids.topId);
        chapter.totalTopics--;
      }
    }
    setBookData(newBookData);
  };

  const handleDelete = (
    type: "SECTION" | "CHAPTER" | "TOPIC",
    secId: string,
    chapId?: string,
    topId?: string,
  ) => {
    setConfirmModal({
      isOpen: true,
      type,
      ids: { secId, chapId, topId },
    });
  };

  const toggleTopicCompletion = (
    secId: string,
    chapId: string,
    topId: string,
  ) => {
    const newBookData = JSON.parse(JSON.stringify(bookData));
    const section = newBookData.sections.find((s: any) => s._id === secId);
    const chapter = section?.chapters.find((c: any) => c._id === chapId);
    const topic = chapter?.topics.find((t: any) => t._id === topId);

    if (topic) {
      topic.isCompleted = !topic.isCompleted;
      // Update counts
      chapter.completedTopics = topic.isCompleted
        ? chapter.completedTopics + 1
        : chapter.completedTopics - 1;
    }
    setBookData(newBookData);
  };

  const handleModalSubmit = () => {
    if (!activeModal.type) return;

    // Deep copy for immutability
    const newBookData = JSON.parse(JSON.stringify(bookData));

    if (activeModal.type === "ADD_SECTION") {
      newBookData.sections.push({
        _id: `sec_new_${Date.now()}`,
        title: "New Section",
        description: "New Description",
        totalChapters: 0,
        completedChapters: 0,
        chapters: [],
      });
    } else if (activeModal.type === "EDIT_SECTION") {
      // Simulate edit
      const section = newBookData.sections.find(
        (s: any) => s._id === activeModal.sectionId,
      );
      if (section) section.title += " (Edited)";
    } else if (activeModal.type === "ADD_CHAPTER") {
      const section = newBookData.sections.find(
        (s: any) => s._id === activeModal.sectionId,
      );
      if (section) {
        section.chapters.push({
          _id: `chap_new_${Date.now()}`,
          title: "New Chapter",
          description: "New Description",
          totalTopics: 0,
          completedTopics: 0,
          topics: [],
        });
      }
    } else if (activeModal.type === "EDIT_CHAPTER") {
      const section = newBookData.sections.find(
        (s: any) => s._id === activeModal.sectionId,
      );
      const chapter = section?.chapters.find(
        (c: any) => c._id === activeModal.chapterId,
      );
      if (chapter) chapter.title += " (Edited)";
    } else if (activeModal.type === "ADD_TOPIC") {
      const section = newBookData.sections.find(
        (s: any) => s._id === activeModal.sectionId,
      );
      const chapter = section?.chapters.find(
        (c: any) => c._id === activeModal.chapterId,
      );
      if (chapter) {
        chapter.topics.push({
          _id: `top_new_${Date.now()}`,
          title: "New Topic",
          description: "New Description",
          isCompleted: false,
          completedAt: null,
        });
        chapter.totalTopics++;
      }
    } else if (activeModal.type === "EDIT_TOPIC") {
      const section = newBookData.sections.find(
        (s: any) => s._id === activeModal.sectionId,
      );
      const chapter = section?.chapters.find(
        (c: any) => c._id === activeModal.chapterId,
      );
      const topic = chapter?.topics.find(
        (t: any) => t._id === activeModal.topicId,
      );
      if (topic) topic.title += " (Edited)";
    }

    setBookData(newBookData);
    setActiveModal({ type: null });
  };

  // Progress Calculation Helper
  const calculateProgress = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

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
          </div>
        </div>

        {/* Description */}
        <div className="text-lg text-neutral-400 mb-8 max-w-4xl">
          <p>{bookData.description}</p>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-neutral-200 font-bold">Sections</h2>
          <button
            onClick={expandAll}
            style={{ color: bookData.color }}
            className=" hover:underline font-medium"
          >
            Expand All
          </button>
        </div>

        {/* Content List */}
        <div className="flex flex-col gap-4 pb-20">
          {bookData.sections.map((section) => {
            const isSecExpanded = expandedSections.has(section._id);
            const secProgress = calculateProgress(
              section.chapters.reduce(
                (acc: number, c: any) => acc + c.completedTopics, // Simplified for now, really should aggregate topics
                0,
              ),
              section.chapters.reduce(
                (acc: number, c: any) => acc + c.totalTopics,
                0,
              ),
            );

            return (
              <div
                key={section._id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <div className="p-4 flex items-center justify-between bg-neutral-900 ">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleSection(section._id)}
                      className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800"
                    >
                      {isSecExpanded ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold text-white">
                        {section.title}
                      </h3>
                      <span className="text-sm text-neutral-500">
                        {section.chapters.length} Chapters • {secProgress}%
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 px-4">
                    {/* Progress Bar */}
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
                      className="text-lg font-bold"
                      style={{ color: bookData.color }}
                    >
                      {secProgress}%
                    </span>

                    {/* Actions */}
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
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() => toggleChapter(chapter._id)}
                                className="text-neutral-500 hover:text-white p-1 rounded-full hover:bg-neutral-800"
                              >
                                {isChapExpanded ? (
                                  <IoChevronDown size={14} />
                                ) : (
                                  <IoChevronForward size={14} />
                                )}
                              </button>
                              <h4 className="text-lg font-medium text-neutral-200">
                                {chapter.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-6 px-4">
                              {/* Chapter Progress */}
                              <div className="w-32 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${chapProgress}%`,
                                    backgroundColor: bookData.color,
                                  }}
                                />
                              </div>

                              {/* Chapter Actions */}
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
                              {chapter.topics.map((topic) => (
                                <div
                                  key={topic._id}
                                  className="flex items-center justify-between py-2 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() =>
                                        toggleTopicCompletion(
                                          section._id,
                                          chapter._id,
                                          topic._id,
                                        )
                                      }
                                      style={{
                                        backgroundColor: topic.isCompleted
                                          ? bookData.color
                                          : "transparent",
                                      }}
                                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                        topic.isCompleted
                                          ? `border-[${bookData.color}]`
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
                                    <span
                                      className={`${
                                        topic.isCompleted
                                          ? "text-neutral-500 line-through"
                                          : "text-neutral-300"
                                      }`}
                                    >
                                      {topic.title}
                                    </span>
                                  </div>

                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      title="Edit Topic"
                                      onClick={() =>
                                        setActiveModal({
                                          type: "EDIT_TOPIC",
                                          sectionId: section._id,
                                          chapterId: chapter._id,
                                          topicId: topic._id,
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
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${confirmModal.type ? confirmModal.type.charAt(0) + confirmModal.type.slice(1).toLowerCase() : "Item"}`}
        message="Are you sure you want to delete this item? This action cannot be undone."
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
        initialTitle=""
        initialDescription=""
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
        initialTitle=""
        initialDescription=""
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
        initialTitle=""
        initialDescription=""
      />
    </>
  );
}

export default ViewTextbookPage;
