import Navbar from "../components/Navbar";

function ViewTextbookPage() {
  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-neutral-950 flex flex-col py-8 px-10">
        <div className="flex justify-between">
          <h1 className="text-white font-extrabold text-5xl">{"BookName"}</h1>
        </div>
      </div>
    </>
  );
}

export default ViewTextbookPage;
