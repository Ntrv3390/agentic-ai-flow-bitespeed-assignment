"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveFlow } from "../features/flowSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.flow);

  const githubUrl = "https://github.com/Ntrv3390";
  const linkedinUrl = "https://linkedin.com/in/mohammed-puthawala";
  const leetcodeUrl = "https://leetcode.com/mohammedputhawala793";

  const handleRedirect = (url) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  const handleSave = () => {
    dispatch(saveFlow());
  };
  return (
    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex items-center justify-between px-[8vw]">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-[#656ba3]">
          Mohammed Puthawala
        </span>

        <button
          onClick={() => handleRedirect(githubUrl)}
          className="border border-[#656ba3] text-[#656ba3] px-6 h-[45px] text-base hover:bg-[#656ba3] hover:text-white transition-colors duration-200 font-bold rounded-lg shadow-lg leading-none"
        >
          GitHub
        </button>
        <button
          onClick={() => handleRedirect(linkedinUrl)}
          className="border border-[#656ba3] text-[#656ba3] px-6 h-[45px] text-base hover:bg-[#656ba3] hover:text-white transition-colors duration-200 font-bold rounded-lg shadow-lg leading-none"
        >
          LinkedIn
        </button>
        <button
          onClick={() => handleRedirect(leetcodeUrl)}
          className="border border-[#656ba3] text-[#656ba3] px-6 h-[45px] text-base hover:bg-[#656ba3] hover:text-white transition-colors duration-200 font-bold rounded-lg shadow-lg leading-none"
        >
          LeetCode
        </button>
      </div>

      {/* Right Section: Save Button */}
      <div className="flex items-center">
        <button
          onClick={handleSave}
          disabled={loading}
          className="border border-[#656ba3] text-[#656ba3] px-6 h-[45px] text-base hover:bg-[#656ba3] hover:text-white transition-colors duration-200 font-bold rounded-lg shadow-lg leading-none"
        >
          {loading ? "Saving..." : "Save Flow"}
        </button>
      </div>
    </div>
  );
};

export default Header;
