"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// FlippingText component for the word changing animation
const FlippingText = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

const GitSmartHero = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect values
  const line1X = useTransform(scrollY, [0, 300], [0, -50]);
  const line2X = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <motion.section
      ref={containerRef}
      className="w-full sm:min-h-screen flex flex-col md:justify-center items-center my-16 md:my-0 md:-mt-10 px-4 sm:px-6"
      initial="hidden"
      animate="visible"
    >
      <div className="w-full font-sans font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[5.5rem] xl:text-[6.5rem] leading-tight flex flex-col items-center transition-all duration-500 ease-in-out">
        <div className="flex flex-row items-end gap-4 justify-center mb-4 sm:mb-6">
          <div className="flex relative items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-orange-500 rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#ffffff"
                className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
              >
                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
              </svg>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50, skew: "-30deg" }}
            animate={{ opacity: 1, y: 0, skew: "0deg" }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="z-50 mt-4 sm:mt-0"
          >
            GitSmart
          </motion.div>
        </div>

        <motion.div
          className="self-center   flex items-center gap-2 sm:gap-3 md:gap-4 my-2 sm:my-4"
          style={{ x: line1X }}
        >
          <motion.span
            initial={{ opacity: 0, y: 100, skew: "-90deg" }}
            animate={{ opacity: 1, y: 0, skew: "0deg" }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            Smart
          </motion.span>

          <motion.span
            initial={{ opacity: 0, scale: 3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="text-blue-500"
          >
            Learning
          </motion.span>
        </motion.div>

        <motion.div
          transition={{ duration: 1, delay: 0.8, ease: [0.6, 0.05, 0.2, 0.9] }}
          className="flex items-end gap-2 sm:gap-3 md:gap-4 self-center"
          style={{ x: line2X }}
        >
          <motion.span
            initial={{ opacity: 0, y: 50, skew: "-30deg" }}
            animate={{ opacity: 1, y: 0, skew: "0deg" }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            Seamless
          </motion.span>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.8 }}
            className="bg-purple-600 ml-1 sm:ml-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ffffff"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
            >
              <path
                fillRule="evenodd"
                d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
          <FlippingText
            text="Automation"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[5.5rem] xl:text-[6.5rem]"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="mt-12 md:mt-16 lg:mt-24 text-center"
      >
        <p className="text-lg sm:text-xl md:text-2xl text-gray-500">
          Master Git. Automate Workflows. Code Smarter.
        </p>
      </motion.div>
    </motion.section>
  );
};

export default GitSmartHero;
