"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoMdSettings, IoIosArrowForward } from "react-icons/io";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { DiGoogleAnalytics } from "react-icons/di";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const Sidenav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const menuItems = [
    { icon: FaHome, label: "Dashboard", href: "/dashboard" },
    { icon: MdMessage, label: "Courses", expandable: true },
    { icon: AiOutlinePlusCircle, label: "New Course", href: "/new_course" },
    { icon: DiGoogleAnalytics, label: "Analytics", href: "/analytics" },
    { icon: IoMdSettings, label: "Settings", href: "/settings" },
  ];

  const getCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/query/course");
      
      if (response.status !== 200) {
        throw new Error("Failed to fetch courses. Please try again.");
      }
      
      const jsonData = response.data.data;

      if (!jsonData || jsonData.length === 0) {
        return { status: "success", data: [], error: "" };
      }

      return { status: "success", data: jsonData, error: "" };
    } catch (err) {
      console.error("Error fetching courses:", err.message);
      return { status: "error", data: [], error: err.message };
    } finally {
      setLoading(false);
      setIsCoursesExpanded(true);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getCourses();
      if (result.status === "success") {
        setCourses(result.data);
      } else {
        setError(result.error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouseX = event.clientX;
      if (mouseX < 100 && !isHovered) {
        setIsExpanded(true);
      } else if (mouseX > 200 && !isHovered) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered]);

  return (
    <nav
      onMouseEnter={() => {
        setIsHovered(true);
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
      }}
      className={`fixed z-[999] left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        isExpanded ? "w-52 " : "w-0"
      }`}
    >
      <div className="flex flex-col h-full py-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.expandable ? (
              <div
                onClick={() => setIsCoursesExpanded(!isCoursesExpanded)}
                className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer transition-all"
              >
                <item.icon size={24} />
                <span
                  className={`ml-4 transition-opacity duration-300 whitespace-nowrap ${
                    isExpanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
                {isExpanded && (
                  <div className="flex justify-between ml-auto gap-4">
                    <motion.span
                      onClick={(e) => {
                        e.stopPropagation();
                        getCourses();
                      }}
                      animate={{ rotate: loading ? 720 : 0 }}
                      transition={{ duration: 1 }}
                    >
                      <RefreshCw size={18} />
                    </motion.span>
                    <motion.span
                      animate={{ rotate: isCoursesExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IoIosArrowForward size={20} />
                    </motion.span>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <item.icon size={24} />
                <span
                  className={`ml-4 transition-opacity duration-300 whitespace-nowrap ${
                    isExpanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )}

            <AnimatePresence>
              {item.expandable && isCoursesExpanded && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="ml-6 mt-2 overflow-hidden"
                >
                  {loading ? (
                    <p className="text-gray-400 text-sm px-4">Loading...</p>
                  ) : error ? (
                    <p className="text-red-500 text-sm px-4">{error}</p>
                  ) : courses.length === 0 ? (
                    <p className="text-gray-400 text-sm px-4">
                      No courses available
                    </p>
                  ) : (
                    courses.map((course, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.1, duration: 0.2 }}
                        className="flex justify-between items-center px-4 py-2 text-sm bg-gray-800 rounded-md my-1"
                      >
                        <Link
                          href={`/courses/${course.id}`}
                          className="flex items-center justify-between w-full"
                        >
                          <span>{course.title}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              course.status === "Active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {course.status}
                          </span>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidenav;