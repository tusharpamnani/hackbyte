/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { motion } from "framer-motion";

const BatchDetails = ({ batch, onClose }: { batch: any; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100vh", opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="fixed z-[99] bottom-0 left-0 transform w-[90%] max-w-4xl bg-white shadow-lg rounded-t-2xl p-6 border border-gray-300"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
      >
        ✖
      </button>

      <h2 className="text-lg font-semibold text-black text-center">
        Batch {batch.number} - Project Details
      </h2>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Level</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {batch.projects.map((project: any) => (
              <tr key={project.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{project.title}</td>
                <td className="border border-gray-300 px-4 py-2">{project.level}</td>
                <td className="border border-gray-300 px-4 py-2">{project.status}</td>
                <td className="border border-gray-300 px-4 py-2">{project.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BatchDetails;
