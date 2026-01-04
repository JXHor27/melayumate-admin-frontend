import React from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-transparent">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-4 text-lg text-blue-600 dark:text-blue-300">Loading...</span>
  </div>
);

export default LoadingSpinner;