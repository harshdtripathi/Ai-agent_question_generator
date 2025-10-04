import React, { useState } from "react";
import { FaDumbbell, FaFlask, FaFilm, FaNetworkWired } from "react-icons/fa";
import { GiFlowerTwirl, GiScrollUnfurled } from "react-icons/gi";
import Questions from "./Questions";

const Topic = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [showPage, setShowPage] = useState(false);

  const topics = [
    { name: "WELLNESS", icon: <GiFlowerTwirl size={40} /> },
    { name: "SCIENCE", icon: <FaFlask size={40} /> },
    { name: "SPORTS", icon: <FaDumbbell size={40} /> },
    { name: "HISTORY", icon: <GiScrollUnfurled size={40} /> },
    { name: "POP CULTURE", icon: <FaFilm size={40} /> },
    { name: "TECHNOLOGY", icon: <FaNetworkWired size={40} /> },
  ];

  const GenerateQuiz = (topic) => {
    setData(value || topic);
    console.log("Selected Topic:", value || topic);
    setShowPage(true);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-6 md:px-20 text-white">
      {/* If quiz not started, show topic selection */}
      {!showPage ? (
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Section */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-wide text-[#E6A7F6]">
              AI QUIZ -
              <br />
              <span className="text-white">CHOOSE YOUR CHALLENGE!</span>
            </h1>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-[38%] bg-[#190c3b]/70 backdrop-blur-xs rounded-3xl shadow-2xl flex flex-col items-center p-8 md:p-10 h-[60%]">
            <h2 className="text-2xl font-semibold mb-6 text-[#E6A7F6]">
             Select or Enter a Topic
            </h2>

            {/* Input */}
            <input
              type="text"
              placeholder="Enter a Topic"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mb-4 p-2 w-[90%] md:w-[80%] rounded-xl opacity-40 bg-white/20 text-center text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#E6A7F6]"
            />

            {/* Search button */}
            <button
              onClick={() => GenerateQuiz(value)}
              className="mb-6 px-6 py-2  rounded-xl bg-[#E6A7F6] text-black font-semibold hover:bg-white/80 transition-all"
            >
              Search
            </button>

            {/* Topic Grid */}
            <div className="grid grid-cols-2 gap-5 w-full justify-items-center">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  onClick={() => GenerateQuiz(topic.name)}
                  className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-[#E6A7F6]/20 rounded-2xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 w-[110px] h-[110px]"
                >
                  <div className="mb-2">{topic.icon}</div>
                  <p className="font-semibold text-sm md:text-base text-center">
                    {topic.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // ✅ Quiz Page
        <Questions topic={data} />
      )}
    </div>
  );
};

export default Topic;
