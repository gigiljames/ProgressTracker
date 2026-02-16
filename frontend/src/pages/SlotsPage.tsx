import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { daysFull, months } from "../constants/dateTime";

function SlotsPage() {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  function handleNextDay() {
    const date = new Date();
    date.setDate(currDate.getDate() + 1);
    setCurrDate(date);
  }
  function handlePrevDay() {
    const date = new Date();
    date.setDate(currDate.getDate() - 1);
    setCurrDate(date);
  }
  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-neutral-950 flex flex-col py-8 px-10">
        <div className="flex justify-between">
          <h1 className="text-white font-extrabold text-5xl">My Slots</h1>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <div
                className="bg-neutral-500 p-2 text-3xl rounded-full flex justify-center items-center size-14"
                onClick={handlePrevDay}
              >
                <IoIosArrowBack />
              </div>
              <div className="text-neutral-300 flex items-center h-full mx-2 text-xl">
                {`${currDate.getDate()} ${months[currDate.getMonth()]} ${currDate.getFullYear()}, ${daysFull[currDate.getDay()]}`}
              </div>
              <div
                className="bg-neutral-500 p-2 text-3xl rounded-full rotate-180 flex justify-center items-center size-14"
                onClick={handleNextDay}
              >
                <IoIosArrowBack />
              </div>
            </div>
            <div className="bg-neutral-500 p-2 text-xl rounded-full flex justify-center items-center size-14">
              <FaCalendarAlt />
            </div>
            <button className="bg-neutral-500 rounded-full flex justify-center items-center px-4 text-lg">
              Create slot
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SlotsPage;
