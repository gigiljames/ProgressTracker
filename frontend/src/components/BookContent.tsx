import { useState } from "react";
import {
  IoChevronDown,
  IoChevronForward,
  IoAdd,
  IoCreateOutline,
  IoTrashOutline,
  IoCheckmark,
} from "react-icons/io5";

const BookContent = () => {
  const [book, setBook] = useState({
    _id: "65f1a1c4e1a1a1a1a1a1a101",
    userId: "65f1a1c4e1a1a1a1a1a1a001",
    title: "Human Anatomy",
    description:
      "Detailed exploration of structural anatomy with clinical relevance for medical students.",
    color: "#3B82F6",
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
  });

  const [expandedSections, setExpandedSections] = useState(["sec001"]);
  const [expandedChapters, setExpandedChapters] = useState(["chap001"]);
  const [expandAll, setExpandAll] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const toggleExpandAll = () => {
    if (!expandAll) {
      setExpandedSections(book.sections.map((s) => s._id));
      setExpandedChapters(
        book.sections.flatMap((s) => s.chapters.map((c) => c._id)),
      );
    } else {
      setExpandedSections([]);
      setExpandedChapters([]);
    }
    setExpandAll(!expandAll);
  };

  const toggleTopicComplete = (
    sectionId: string,
    chapterId: string,
    topicId: string,
  ) => {
    setBook((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section._id === sectionId) {
          return {
            ...section,
            chapters: section.chapters.map((chapter) => {
              if (chapter._id === chapterId) {
                return {
                  ...chapter,
                  topics: chapter.topics.map((topic) => {
                    if (topic._id === topicId) {
                      return {
                        ...topic,
                        isCompleted: !topic.isCompleted,
                        completedAt: !topic.isCompleted
                          ? new Date().toISOString()
                          : null,
                      };
                    }
                    return topic;
                  }),
                };
              }
              return chapter;
            }),
          };
        }
        return section;
      }),
    }));
  };

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const addSection = () => {
    const newSection = {
      _id: `sec${Date.now()}`,
      title: "New Section",
      description: "Section description",
      totalChapters: 0,
      completedChapters: 0,
      chapters: [],
    };
    setBook((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const deleteSection = (sectionId: string) => {
    setBook((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s._id !== sectionId),
    }));
  };

  const addChapter = (sectionId: string) => {
    const newChapter = {
      _id: `chap${Date.now()}`,
      title: "New Chapter",
      description: "Chapter description",
      totalTopics: 0,
      completedTopics: 0,
      topics: [],
    };
    setBook((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section._id === sectionId) {
          return {
            ...section,
            chapters: [...section.chapters, newChapter],
            totalChapters: section.totalChapters + 1,
          };
        }
        return section;
      }),
    }));
  };

  const deleteChapter = (sectionId: string, chapterId: string) => {
    setBook((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section._id === sectionId) {
          return {
            ...section,
            chapters: section.chapters.filter((c) => c._id !== chapterId),
            totalChapters: section.totalChapters - 1,
          };
        }
        return section;
      }),
    }));
  };

  const addTopic = (sectionId: string, chapterId: string) => {
    const newTopic = {
      _id: `top${Date.now()}`,
      title: "New Topic",
      description: "Topic description",
      isCompleted: false,
      completedAt: null,
    };
    setBook((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section._id === sectionId) {
          return {
            ...section,
            chapters: section.chapters.map((chapter) => {
              if (chapter._id === chapterId) {
                return {
                  ...chapter,
                  topics: [...chapter.topics, newTopic],
                  totalTopics: chapter.totalTopics + 1,
                };
              }
              return chapter;
            }),
          };
        }
        return section;
      }),
    }));
  };

  const deleteTopic = (
    sectionId: string,
    chapterId: string,
    topicId: string,
  ) => {
    setBook((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section._id === sectionId) {
          return {
            ...section,
            chapters: section.chapters.map((chapter) => {
              if (chapter._id === chapterId) {
                return {
                  ...chapter,
                  topics: chapter.topics.filter((t) => t._id !== topicId),
                  totalTopics: chapter.totalTopics - 1,
                };
              }
              return chapter;
            }),
          };
        }
        return section;
      }),
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-neutral-50">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">
            Course Content
          </h2>
          <div className="flex gap-2">
            <button
              onClick={toggleExpandAll}
              className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              {expandAll ? "Collapse All" : "Expand All"}
            </button>
            <button
              onClick={addSection}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
            >
              <IoAdd className="w-4 h-4" />
              Add Section
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="divide-y divide-neutral-200">
          {book.sections.map((section, sectionIndex) => {
            const sectionProgress = calculateProgress(
              section.completedChapters,
              section.totalChapters,
            );
            const isExpanded = expandedSections.includes(section._id);

            return (
              <div key={section._id} className="bg-white">
                {/* Section Header */}
                <div className="px-6 py-4 hover:bg-neutral-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        {isExpanded ? (
                          <IoChevronDown className="w-5 h-5" />
                        ) : (
                          <IoChevronForward className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 text-base mb-1">
                          Section {sectionIndex + 1}: {section.title}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {section.totalChapters} Chapters • {sectionProgress}%
                          Completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 min-w-50">
                        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 transition-all duration-300"
                            style={{ width: `${sectionProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-neutral-900 min-w-[45px] text-right">
                          {sectionProgress}%
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => addChapter(section._id)}
                          className="p-1.5 text-neutral-600 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                          title="Add Chapter"
                        >
                          <IoAdd className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Section"
                        >
                          <IoCreateOutline className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSection(section._id)}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Section"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapters */}
                {isExpanded && (
                  <div className="bg-neutral-50 border-t border-neutral-200">
                    {section.chapters.map((chapter, chapterIndex) => {
                      const chapterProgress = calculateProgress(
                        chapter.completedTopics,
                        chapter.totalTopics,
                      );
                      const isChapterExpanded = expandedChapters.includes(
                        chapter._id,
                      );

                      return (
                        <div
                          key={chapter._id}
                          className="border-b border-neutral-200 last:border-b-0"
                        >
                          {/* Chapter Header */}
                          <div className="px-6 py-3 hover:bg-neutral-100 transition-colors group/chapter">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 ml-8">
                                <button
                                  onClick={() => toggleChapter(chapter._id)}
                                  className="text-neutral-600 hover:text-neutral-900 transition-colors"
                                >
                                  {isChapterExpanded ? (
                                    <IoChevronDown className="w-4 h-4" />
                                  ) : (
                                    <IoChevronForward className="w-4 h-4" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <h4 className="font-medium text-neutral-900 text-sm">
                                    Chapter {chapterIndex + 1}: {chapter.title}
                                  </h4>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 min-w-50">
                                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-teal-500 transition-all duration-300"
                                      style={{ width: `${chapterProgress}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover/chapter:opacity-100 transition-opacity">
                                  <button
                                    onClick={() =>
                                      addTopic(section._id, chapter._id)
                                    }
                                    className="p-1.5 text-neutral-600 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                                    title="Add Topic"
                                  >
                                    <IoAdd className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit Chapter"
                                  >
                                    <IoCreateOutline className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteChapter(section._id, chapter._id)
                                    }
                                    className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Chapter"
                                  >
                                    <IoTrashOutline className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Topics */}
                          {isChapterExpanded && chapter.topics.length > 0 && (
                            <div className="bg-white">
                              {chapter.topics.map((topic) => (
                                <div
                                  key={topic._id}
                                  className="px-6 py-3 hover:bg-neutral-50 transition-colors border-t border-neutral-100 group/topic"
                                >
                                  <div className="flex items-center justify-between ml-16">
                                    <div className="flex items-center gap-3 flex-1">
                                      <button
                                        onClick={() =>
                                          toggleTopicComplete(
                                            section._id,
                                            chapter._id,
                                            topic._id,
                                          )
                                        }
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                          topic.isCompleted
                                            ? "bg-teal-500 border-teal-500"
                                            : "border-neutral-300 hover:border-teal-400"
                                        }`}
                                      >
                                        {topic.isCompleted && (
                                          <IoCheckmark
                                            className="w-3.5 h-3.5 text-white"
                                            strokeWidth={3}
                                          />
                                        )}
                                      </button>
                                      <span
                                        className={`text-sm flex-1 ${
                                          topic.isCompleted
                                            ? "text-neutral-500 line-through"
                                            : "text-neutral-700"
                                        }`}
                                      >
                                        {topic.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-neutral-400 min-w-[45px] text-right">
                                        {Math.floor(Math.random() * 30) + 10}{" "}
                                        min
                                      </span>
                                      <div className="flex gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity">
                                        <button
                                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                          title="Edit Topic"
                                        >
                                          <IoCreateOutline className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            deleteTopic(
                                              section._id,
                                              chapter._id,
                                              topic._id,
                                            )
                                          }
                                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                          title="Delete Topic"
                                        >
                                          <IoTrashOutline className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
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
    </div>
  );
};

export default BookContent;
