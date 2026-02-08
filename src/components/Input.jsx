import React from "react";

const Input = ({ setSearchTerm }) => {
  return (
    <div className="flex justify-center md:justify-end w-full">
      <div
        className="p-4 overflow-hidden w-[55px] h-[55px] 
                   hover:w-[270px] focus-within:w-[270px] 
                   bg-[#4070f4] shadow-lg rounded-full 
                   flex flex-row-reverse items-center 
                   transition-all duration-500 ease-in-out cursor-pointer group"
      >
        {/* Icon: flex-row-reverse ki wajah se ye hamesha right par rahega */}
        <div className="flex items-center justify-center min-w-[25px] shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={22}
            height={22}
          >
            <path
              d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Input: Ye ab left side ki taraf expand hoga */}
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none text-[16px] bg-transparent w-full text-white font-normal 
                     px-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 
                     transition-opacity duration-300 placeholder:text-blue-100"
        />
      </div>
    </div>
  );
};

export default Input;
