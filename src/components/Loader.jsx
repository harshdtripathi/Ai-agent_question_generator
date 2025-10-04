import React from 'react'

const Loader = ({topic}) => {
  return (
      <div className="w-full   flex flex-col justify-center items-center  text-[#E6A7F6]">
        <div className="relative w-24 h-24 mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#E6A7F6] animate-spin"></div>

          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full border-2 border-[#E6A7F6]/40 animate-pulse"></div>
        </div>

        <p className="text-xl font-medium text-center animate-pulse">
          Hold On Generating quiz on <span className="text-white">{topic}</span>...
        </p>
      </div>
  )
}

export default Loader
