import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router";
import { FaBook } from "react-icons/fa";
import AddTextbookModal from "../components/AddTextbookModal";
import { getBooks } from "../api/bookService";
import toast from "react-hot-toast";

type Book = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  color: string;
  totalTopics: number;
  completedTopics: number;
  createdAt: string;
  updatedAt: string;
};

function TextbooksPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchBooks() {
    setLoading(true);
    getBooks()
      .then((response) => {
        setBooks(response.data?.data ?? []);
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message || e?.message || "Failed to load books.",
        );
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    // Search filter (title, case-insensitive)
    if (
      searchQuery.trim() &&
      !book.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      return false;
    }
    if (filter === "completed") {
      return book.totalTopics > 0 && book.completedTopics === book.totalTopics;
    }
    if (filter === "in-progress") {
      return (
        book.completedTopics > 0 && book.completedTopics < book.totalTopics
      );
    }
    return true; // "all" and "favourites" (not implemented server-side yet)
  });

  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-neutral-950 flex flex-col py-8 px-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h1 className="text-white font-extrabold text-4xl">My Books</h1>
          <div className="flex gap-3 items-center flex-wrap">
            {/* Search */}
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-lg pointer-events-none" />
              <input
                type="text"
                placeholder="Search books…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-3 text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 w-52"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-300 rounded-xl px-5 py-3 font-medium transition-colors"
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

        {loading ? (
          <div className="text-neutral-500 text-lg mt-10 text-center">
            Loading books...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-neutral-600 text-lg mt-10 text-center">
            No books found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-neutral-900/75 border border-neutral-700 flex flex-col rounded-lg p-4 hover:bg-neutral-800/50 active:bg-neutral-800"
              >
                <Link to={`/books/${book._id}`}>
                  <div className=" mb-2 flex gap-2 items-center">
                    <div
                      className="text-2xl self-start p-3 rounded-full bg-neutral-800"
                      style={{ color: book.color }}
                    >
                      <FaBook />
                    </div>
                    <div
                      className="text-xl font-bold text-neutral-200 line-clamp-2"
                      style={{ color: book.color }}
                    >
                      {book.title}
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400 line-clamp-3 w-full">
                    {book.description}
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="text-neutral-300 font-medium">Progress</div>
                    <div className="h-2 rounded-full w-full bg-neutral-700 my-1">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: book.color,
                          width:
                            book.totalTopics > 0
                              ? `${Math.ceil(
                                  (book.completedTopics / book.totalTopics) *
                                    100,
                                )}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <div className="text-neutral-400 text-sm">{`${book.completedTopics} / ${book.totalTopics} completed`}</div>
                  </div>
                  <div className="h-5"></div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <AddTextbookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchBooks}
        />
      </div>
    </>
  );
}

export default TextbooksPage;
