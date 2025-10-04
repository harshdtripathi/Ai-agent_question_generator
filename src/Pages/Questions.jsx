import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Result from "./Result";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Questions = ({ topic }) => {
  const [data, setData] = useState([]);
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(false); // ✅ corrected state name

  const navigate = useNavigate();

  // ✅ Fetch quiz data from Gemini API
  useEffect(() => {
    if (!topic || data.length > 0) return;

    const fetchQuestions = async (retryCount = 0) => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
            import.meta.env.VITE_GEMINI_API_KEY,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `You are a quiz master. 
                      Begin with a short introduction for the candidate (1–2 lines). 
                      Then generate 10 multiple-choice questions (easy to hard) with 4 options and the correct answer clearly mentioned.
                      Topic: ${topic}.
                      Format strictly as:
                      Intro text
                      Q1. question
                      A) option1
                      B) option2
                      C) option3
                      D) option4
                      Answer: correct option`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const result = await response.json();

        if (
          result.error?.message?.toLowerCase().includes("overloaded") &&
          retryCount < 3
        ) {
          toast.warning("⚠️ AI server busy. Retrying...");
          await new Promise((r) => setTimeout(r, 3000));
          return fetchQuestions(retryCount + 1);
        }

        if (result.error) {
          toast.error(`Gemini Error: ${result.error.message}`);
          return;
        }

        const text =
          result.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No questions generated.";

        const [introPart, restText] = text.split(/(?=Q1\.)/s);
        setIntro(introPart.trim());
        setData(restText.trim().split(/\n\n+/));
      } catch (error) {
        console.error("Fetch failed:", error);
        setData(["❌ Failed to generate quiz. Try again later."]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic]);

  // ✅ Parse each question block
  const parseQuestion = (text) => {
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    const question = lines[0] || "";
    const options = lines.slice(1, 5);
    const answerLine = lines.find((line) =>
      line.toLowerCase().includes("answer")
    );
    const correctAnswer = answerLine
      ? answerLine.split(":")[1]?.trim()?.replace(/["']/g, "")
      : "";
    return { question, options, correctAnswer };
  };

  // ✅ Handle option selection
  const handleSelect = (option, correctAnswer) => {
    setSelected(option);
    setShowAnswer(true);
    const isCorrect = option.includes(correctAnswer);

    setAnswers((prev) => ({
      ...prev,
      [current]: { selected: option, correctAnswer, isCorrect },
    }));

    if (isCorrect) setScore((prev) => prev + 2);
  };

  // ✅ Handle next question
  const nextQuestion = () => {
    if (current < data.length - 1) {
      const nextIndex = current + 1;
      setCurrent(nextIndex);

      if (answers[nextIndex]) {
        setSelected(answers[nextIndex].selected);
        setShowAnswer(true);
      } else {
        setSelected(null);
        setShowAnswer(false);
      }
    } else {
      setShowResult(true);
      generateSuggestion();
    }
  };

  // ✅ Handle previous question
  const prevQuestion = () => {
    if (current > 0) {
      const prevIndex = current - 1;
      setCurrent(prevIndex);

      if (answers[prevIndex]) {
        setSelected(answers[prevIndex].selected);
        setShowAnswer(true);
      } else {
        setSelected(null);
        setShowAnswer(false);
      }
    }
  };

  // ✅ Generate AI feedback suggestion
  const generateSuggestion = async () => {
    try {
      setLoadingSuggestion(true);
      const percentage = Math.round((score / (data.length * 2)) * 100);

      const prompt = `
      Based on a quiz performance report:
      - Topic: ${topic}
      - Score: ${score} / ${data.length * 2} (${percentage}%)
      Write a short motivational feedback (2–6 lines).`;

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
          import.meta.env.VITE_GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      );

      const result = await res.json();
      const aiText =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Keep learning and practicing!";
      setSuggestion(aiText.trim());
    } catch (err) {
      setSuggestion("⚠️ Could not fetch suggestion. Try again later.");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  // ✅ Loader during fetch
  if (loading) return <Loader topic={topic} feedback={false} />;

  // ✅ No data case
  if (data.length === 0)
    return (
      <div className="w-full h-screen flex justify-center items-center text-white text-lg text-center px-4">
        ❌ No questions generated for "{topic}".
      </div>
    );

  // ✅ Show Result Screen
  if (showResult) {
    const percentage = Math.round((score / (data.length * 2)) * 100);
    return (
      <Result
        suggestion={suggestion}
        score={score}
        data={data}
        loadingSuggestion={loadingSuggestion}
        percentage={percentage}
        feedback={true}
      />
    );
  }

  // ✅ Intro Screen
  if (!showQuiz) {
    return (
      <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-24 text-white">
        {/* 🏠 Home Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 text-white cursor-pointer hover:text-[#E6A7F6] transition-colors duration-300"
        >
          <FaHome className="text-3xl sm:text-4xl" />
        </button>

        <div className="w-full max-w-[600px] bg-[#0c022b]/70 p-6 sm:p-8 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E6A7F6] mb-4 sm:mb-6">
            Instructions
          </h2>
          <p className="text-base sm:text-lg mb-8 leading-relaxed">
            {intro || "Get ready for your AI-generated quiz!"}
          </p>
          <button
            onClick={() => setShowQuiz(true)}
            className="px-6 py-3 bg-[#E6A7F6] text-black text-sm sm:text-base font-semibold rounded-xl hover:bg-white/80 transition-all duration-300 w-full sm:w-auto"
          >
            Continue ➡
          </button>
        </div>
      </div>
    );
  }

  // ✅ Active Quiz Screen
  const { question, options, correctAnswer } = parseQuestion(data[current]);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-24 text-white overflow-x-hidden">
      {/* 🏠 Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 text-white hover:text-[#E6A7F6] transition-colors duration-300"
      >
        <FaHome className="text-3xl sm:text-4xl" />
      </button>

      <div className="w-full max-w-[700px] bg-[#0c022b]/70 p-6 sm:p-8 rounded-3xl shadow-2xl text-center">
        <h2 className="text-lg sm:text-2xl font-bold text-[#E6A7F6] mb-6 sm:mb-8">
          {question.replace(/^\d+\.\s*/, "")}
        </h2>

        <div className="flex flex-col gap-3 sm:gap-4">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(option, correctAnswer)}
              disabled={showAnswer}
              className={`text-sm sm:text-lg py-3 px-2 rounded-xl border transition-all duration-300 break-words ${
                showAnswer
                  ? option.includes(correctAnswer)
                    ? "bg-green-400 opacity-55"
                    : selected === option
                    ? "bg-red-600 opacity-40"
                    : "bg-white/10"
                  : "bg-white/10 hover:bg-[#E6A7F6]/30"
              }`}
            >
              {option.replace(/^[A-D]\)\s*/, "")}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8 sm:mt-10 text-xs sm:text-base flex-wrap gap-3">
          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#E6A7F6]/30 rounded-lg hover:bg-[#E6A7F6]/50 disabled:opacity-40 text-center"
          >
            ⬅ PREVIOUS
          </button>

          {showAnswer ? (
            <button
              onClick={nextQuestion}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#E6A7F6] text-black font-semibold rounded-lg hover:bg-white/90"
            >
              NEXT ➡
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#E6A7F6]/30 rounded-lg hover:bg-[#E6A7F6]/50"
            >
              SKIP ➡
            </button>
          )}
        </div>

        <div className="mt-4 sm:mt-6 text-[#E6A7F6] text-sm sm:text-base font-semibold">
          Question {current + 1} / {data.length} — Score: {score}
        </div>
      </div>
    </div>
  );
};

export default Questions;
