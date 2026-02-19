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

        {loading ? (
          <div className="text-neutral-500 text-lg mt-10 text-center">
            Loading books...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-neutral-600 text-lg mt-10 text-center">
            No books found.
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
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
