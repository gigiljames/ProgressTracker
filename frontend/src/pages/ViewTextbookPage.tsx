import { useState } from "react";
import Navbar from "../components/Navbar";
import BookContent from "../components/BookContent";

export const book = {
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
};

function ViewTextbookPage() {
  const [editBookModal, setEditBookModal] = useState(false);
  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-neutral-950 flex flex-col py-4 px-10">
        <div className="flex justify-between mb-8">
          <h1 className="text-white font-extrabold text-5xl">{book.title}</h1>
          <div className="flex gap-4">
            <button
              className="bg-neutral-500 rounded-full flex justify-center items-center px-4 text-lg"
              onClick={() => {
                setEditBookModal(true);
              }}
            >
              Edit Book
            </button>
          </div>
        </div>
        <div className="text-lg text-neutral-500 mb-6">
          <p>{book.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl text-neutral-200 font-bold">Book content</h2>
          {/* <BookContent /> */}
        </div>
      </div>
    </>
  );
}

export default ViewTextbookPage;
