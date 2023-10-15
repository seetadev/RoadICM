import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-10 h-10 border-4 border-solid border-gray-300 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
};

export default LoadingAnimation;
