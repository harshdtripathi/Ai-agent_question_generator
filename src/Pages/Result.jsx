import React from 'react'
import { MdCelebration } from "react-icons/md";
import Loader from '../components/Loader';

const Result = ({suggestion,score,data,loadingSuggestion,percentage}) => {
  return (
    <div className="w-full h-auto flex flex-col justify-center items-center text-white">
        <div className="bg-[#0c022b]/70 h-[40%] p-8 rounded-3xl shadow-xl text-center w-full md:w-[50%]">
          <div className="flex flex-row justify-center items-center gap-3 mb-4">
            <MdCelebration className="text-3xl text-[#E6A7F6]" />
            <h2 className="lg:text-3xl text-2xl font-bold text-[#E6A7F6]">
              Quiz Completed!
            </h2>
          </div>

          <p className="text-2xl mb-4">
            Your final score is{" "}
            <span className="text-[#E6A7F6] font-semibold">
              {score} / {data.length * 2}
            </span>{" "}
            ({percentage}%)
          </p>

          {/* AI-generated suggestion */}
          {loadingSuggestion ? (
            <div className="flex justify-center ">
              <Loader topic="Generating feedback..." />
            </div>
          ) : (
            <p className="text-base text-white/80 mb-8 border-t border-white/20 pt-4 italic">
              💡 {suggestion}
            </p>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#E6A7F6] text-black font-semibold rounded-xl hover:bg-white/80 transition-all duration-300"
          >
            Play Again 🔁
          </button>
        </div>
      </div>
  )
}

export default Result
