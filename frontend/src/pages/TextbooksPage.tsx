import { useState } from "react";
import Navbar from "../components/Navbar";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router";
import { FaBook } from "react-icons/fa";
import AddTextbookModal from "../components/AddTextbookModal";

export const books = [
  {
    _id: "65f1a1c4e1a1a1a1a1a1a101",
    userId: "65f1a1c4e1a1a1a1a1a1a001",
    title: "Human Anatomy",
    description:
      "Comprehensive study of gross human anatomy including limbs, thorax, abdomen, and neuroanatomy. Comprehensive study of gross human anatomy including limbs, thorax, abdomen, and neuroanatomy. Comprehensive study of gross human anatomy including limbs, thorax, abdomen, and neuroanatomy. Comprehensive study of gross human anatomy including limbs, thorax, abdomen, and neuroanatomy.",
    color: "#3B82F6",
    totalTopics: 42,
    completedTopics: 18,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-10T10:00:00.000Z",
  },
  {
    _id: "65f1a1c4e1a1a1a1a1a1a102",
    userId: "65f1a1c4e1a1a1a1a1a1a001",
    title:
      "Biochemistry Biochemistry Biochemistry Biochemistry Biochemistry Biochemistry Biochemistry",
    description:
      "Covers metabolic pathways, enzyme kinetics, molecular biology, and clinical correlations.",
    color: "#10B981",
    totalTopics: 30,
    completedTopics: 25,
    createdAt: "2026-02-02T09:00:00.000Z",
    updatedAt: "2026-02-12T09:00:00.000Z",
  },
  {
    _id: "65f1a1c4e1a1a1a1a1a1a103",
    userId: "65f1a1c4e1a1a1a1a1a1a001",
    title: "Pathology",
    description:
      "Focuses on mechanisms of disease, inflammation, neoplasia, and systemic pathology.",
    color: "#F59E0B",
    totalTopics: 55,
    completedTopics: 12,
    createdAt: "2026-02-03T08:00:00.000Z",
    updatedAt: "2026-02-11T08:00:00.000Z",
  },
];

function TextbooksPage() {
  const [filter, setFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-neutral-950 flex flex-col py-8 px-10">
        <div className="flex justify-between mb-8">
          <h1 className="text-white font-extrabold text-5xl">My Books</h1>
          <div className="flex gap-4">
            <div className="border border-neutral-700 rounded-full text-neutral-300 relative">
              <input
                type="text"
                placeholder="Search books"
                className="h-full rounded-full p-2 pr-10 pl-3"
              />
              <span className="text-2xl absolute right-2.5 top-2.5 h-full ">
                <IoSearch />
              </span>
            </div>
            <button
              className="bg-neutral-500 rounded-full flex justify-center items-center px-4 text-lg"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add book
            </button>
          </div>
        </div>
        <div className="flex gap-3 mb-5">
          <button
            className={`py-2.5 px-4 ${filter === "all" ? "bg-black" : "bg-neutral-700"} border border-neutral-600 rounded-full text-neutral-200 flex justify-center items-center`}
            onClick={() => setFilter("all")}
          >
            All books
          </button>
          <button
            className={`py-2.5 px-4 ${filter === "completed" ? "bg-black" : "bg-neutral-700"} border border-neutral-600 rounded-full text-neutral-200 flex justify-center items-center`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`py-2.5 px-4 ${filter === "in-progress" ? "bg-black" : "bg-neutral-700"} border border-neutral-600 rounded-full text-neutral-200 flex justify-center items-center`}
            onClick={() => setFilter("in-progress")}
          >
            In-progress
          </button>
          <button
            className={`py-2.5 px-4 ${filter === "favourites" ? "bg-black" : "bg-neutral-700"} border border-neutral-600 rounded-full text-neutral-200 flex justify-center items-center`}
            onClick={() => setFilter("favourites")}
          >
            Favourites
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {books.map((book, index) => (
            <>
              <div
                key={index}
                className="bg-neutral-900/75 border border-neutral-700 flex flex-col rounded-lg p-4 hover:bg-neutral-800/50 active:bg-neutral-800"
              >
                <Link to={`/books/${book._id}`}>
                  <div className=" mb-2 flex gap-2 items-center">
                    <div
                      className="text-2xl self-start p-3 rounded-full bg-neutral-800"
                      style={{
                        color: book.color,
                      }}
                    >
                      <FaBook />
                    </div>
                    <div
                      className="text-xl font-bold text-neutral-200 line-clamp-2"
                      style={{
                        color: book.color,
                      }}
                    >
                      {book.title}
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400 line-clamp-3">
                    {book.description}
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="text-neutral-300 font-medium">Progress</div>
                    <div className="h-2 rounded-full w-full bg-neutral-700 my-1">
                      <div
                        className="h-2 rounded-full w-[20%]"
                        style={{
                          backgroundColor: book.color,
                          width: `${Math.ceil(
                            (book.completedTopics / book.totalTopics) * 100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-neutral-400 text-sm">{`${book.completedTopics} / ${book.totalTopics} completed`}</div>
                  </div>
                  <div className="h-5"></div>
                </Link>
              </div>
            </>
          ))}
        </div>
        <AddTextbookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </>
  );
}

export default TextbooksPage;
