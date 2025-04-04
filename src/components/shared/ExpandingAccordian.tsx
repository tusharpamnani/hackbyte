"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Project } from "./schema/Project";
import Link from "next/link";
import { useParams } from "next/navigation";

const ExpandingAccordion = ({ items }: { items: Project[] }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const gap = 20;
  const windowHeight = window.innerHeight;
  const params = useParams();

  const getExpandVariants = (index: number) => {
    const totalItems = items.length;
    const collapsedHeight = 70;
    const expandedHeight = windowHeight - 150;
    return {
      collapsed: {
        height: collapsedHeight,
        y: index * (collapsedHeight + gap),
      },
      expanded: {
        height: expandedHeight,
        y: index - 0.8 * index,
      },
    };
  };
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case "in progress":
        return <Clock className="w-4 h-4 mr-1" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 mr-1" />;
      default:
        return <ChevronRight className="w-4 h-4 mr-1" />;
    }
  };

  // Format date for better display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const safeStringify = (obj: any, depth: number = 2) => {
    if (depth <= 0) return "[Object]";

    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";
          seen.add(value);

          if (depth > 1) {
            return Object.keys(value).reduce((acc, k) => {
              acc[k] = safeStringify(value[k], depth - 1);
              return acc;
            }, {} as any);
          }
          return "[Object]";
        }
        return value;
      },
      2
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return "N/A";
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {value.map((item, idx) => (
            <li key={idx}>
              {typeof item === "object" ? safeStringify(item, 1) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object") {
      return (
        <div className="text-sm">
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {safeStringify(value)}
          </pre>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center font-urbanist mt-5">
      <div
        className="relative w-full h-full"
        style={{ height: `${100 * items.length}px` }}
        ref={parentRef}
      >
        <div className="absolute inset-0">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className={`absolute w-full overflow-hidden border-2 bg-white ${
                  hoveredId === item.id
                    ? "z-10 border-indigo-400 shadow-xl"
                    : "border-gray-200 shadow-md"
                } rounded-lg`}
                initial="collapsed"
                animate={hoveredId === item.id ? "expanded" : "collapsed"}
                exit="collapsed"
                variants={getExpandVariants(index)}
                transition={{
                  type: "spring",
                  stiffness: 900,
                  damping: 100,
                  mass: 2,
                }}
                onClick={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ position: "absolute" }}
              >
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div
                    className={`flex w-full justify-between items-center p-4 ${
                      hoveredId !== item.id ? "h-full" : ""
                    } ${
                      hoveredId === item.id
                        ? "bg-indigo-50 border-b border-indigo-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-start">
                      <div className="w-2 h-12 rounded-full bg-indigo-500 mr-4"></div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {item.title || "Untitled Project"}
                      </h2>
                      {item.status && (
                        <div
                          className={`mx-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          <div className="flex items-center whitespace-nowrap">
                            {getStatusIcon(item.status)}
                            {item.status}
                          </div>
                        </div>
                      )}
                    </div>
                    <Link href={`/${(params.userName as string).split('/')[0]}/project/${item.id}`}>
                      <button className="p-2 bg-blue-400 cursor-pointer text-white font-bold rounded">
                        View Project
                      </button>
                    </Link>
                  </div>
                  <AnimatePresence>
                    {hoveredId === item.id && (
                      <motion.div
                        className="px-6 py-4 h-full overflow-y-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                          ease: "easeOut",
                        }}
                      >
                        <div className="flex flex-col mb-14 ">
                          <div className="flex flex-nowrap gap-4">
                            <div className=" p-4 bg-gray-50 rounded-lg border border-gray-100 basis-1/2">
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Project Details
                              </h3>
                              <p className="text-gray-700 mb-2">
                                {item.description || "No description available"}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.level && (
                                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                    Level: {item.level}
                                  </span>
                                )}
                                {item.batchId && (
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    Batch: {item.batchId}
                                  </span>
                                )}
                                {item.position !== undefined && (
                                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                                    Position: {item.position}
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.learningObjectives && (
                              <div className="mb-6 basis-1/2">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                  Learning Objectives
                                </h3>
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-black">
                                  {renderValue(item.learningObjectives)}
                                </div>
                              </div>
                            )}
                          </div>
                          {item.steps && (
                            <div className="mb-6">
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Project Steps
                              </h3>
                              <div className="space-y-4 flex gap-4 flex-wrap justify-evenly items-center">
                                {Array.isArray(item.steps) &&
                                  item.steps.map((step, idx) => (
                                    <div
                                      key={idx}
                                      className="rounded-lg border overflow-hidden w-1/3"
                                    >
                                      <div
                                        className={`p-3 flex justify-between items-center ${
                                          step.status === "completed"
                                            ? "bg-green-50 border-b border-green-100"
                                            : step.status === "in progress"
                                            ? "bg-blue-50 border-b border-blue-100"
                                            : "bg-amber-50 border-b border-amber-100"
                                        }`}
                                      >
                                        <div className="flex items-center">
                                          {step.status === "completed" && (
                                            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                                          )}
                                          {step.status === "in progress" && (
                                            <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                          )}
                                          {step.status === "pending" && (
                                            <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                                          )}
                                          <h4 className="font-medium text-black">
                                            {step.stepTitle}
                                          </h4>
                                        </div>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            step.status === "completed"
                                              ? "bg-green-100 text-green-800"
                                              : step.status === "in progress"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-amber-100 text-amber-800"
                                          }`}
                                        >
                                          {step.status}
                                        </span>
                                      </div>

                                      <div className="p-4 bg-white">
                                        <p className="text-gray-700 mb-3">
                                          {step.description}
                                        </p>

                                        {step.resources &&
                                          step.resources.length > 0 && (
                                            <div className="mb-3">
                                              <h5 className="text-sm font-medium text-gray-600 mb-2">
                                                Resources:
                                              </h5>
                                              <div className="flex flex-wrap gap-2">
                                                {step.resources.map(
                                                  (resource, resourceIdx) => (
                                                    <a
                                                      key={resourceIdx}
                                                      href={resource.url}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm hover:bg-indigo-100 transition-colors"
                                                    >
                                                      <ChevronRight className="w-3 h-3 mr-1" />
                                                      {resource.title}
                                                    </a>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {step.githubCommitInstruction && (
                                          <div>
                                            <h5 className="text-sm font-medium text-gray-600 mb-2">
                                              GitHub Commit:
                                            </h5>
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-gray-700 text-sm">
                                              {step.githubCommitInstruction}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {item.GithubData && (
                            <div className="mb-6">
                              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                GitHub Data
                              </h3>
                              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700  font-mono text-sm overflow-x-auto text-black">
                                {renderValue(item.GithubData)}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExpandingAccordion;
