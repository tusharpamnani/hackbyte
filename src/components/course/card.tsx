import React from "react";

const CourseCard = ({ title, status }: { title: string; status: string }) => {
  return (
    <div className="relative bg-white shadow-lg rounded-lg p-5 w-72 m-3 border border-gray-200 transition duration-300">
      {/* Course Title with Truncate & Marquee on Hover */}
      <div className="relative w-full overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-800 truncate whitespace-nowrap">
          {title}
        </h2>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-0 transition-opacity duration-300">
          <p className="animate-marquee whitespace-nowrap">{title}</p>
        </div>
      </div>

      {/* Course Status Indicator */}
      <span
        className={`absolute top-3 right-3 h-5 w-5 rounded-full ${
          status === "completed"
            ? "bg-green-500"
            : status === "not started"
            ? "bg-red-500"
            : "bg-yellow-500"
        }`}
      ></span>

      {/* Course Status Label */}
      <p className="mt-3 text-sm text-gray-600">
        Status:{" "}
        <span
          className={`px-2 py-1 rounded-md text-white text-xs ${
            status === "completed"
              ? "bg-green-500"
              : status === "not started"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </p>
    </div>
  );
};

export default CourseCard;
