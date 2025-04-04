"use client";
import React, { useState } from "react";
import { getBatchProjectsByBatchId } from "../actions/batch";
import ProjectList from "../projects/ProjectList";
import { Batch, Project } from "../shared/schema/Project";

const BatchCard = ({ batch }: { batch: Batch }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);

  console.log(batch.projects);
  const fetchProjectDetails = async () => {
    try {
      const response = await getBatchProjectsByBatchId(batch.id);
      console.log(response);
      setProjectDetails(response);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const AvgLevel = (projects: Project[]) => {
    let levelsCount = {
      Beginner: 0,
      Intermediate: 0,
      Advanced: 0,
      Expert: 0,
    };

    projects.forEach((project: Project) => {
      if (levelsCount.hasOwnProperty(project.level)) {
        levelsCount[project.level]++;
      }
    });

    if (projects.length === 0) return "Unknown";

    return Object.keys(levelsCount).reduce((a, b) =>
      levelsCount[a] >= levelsCount[b] ? a : b
    );
  };

  const level = AvgLevel(batch.projects);

  const levelColors: { [key: string]: string } = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-orange-500",
    Expert: "bg-red-500",
    Unknown: "bg-gray-400",
  };

  return (
    <div>
      <div
        className="bg-white shadow-md rounded-lg p-4 m-2 w-72 border border-gray-300 text-center relative cursor-pointer"
        onClick={() => {
          setActiveTab(batch.id);
          fetchProjectDetails();
        }}
      >
        <h2 className="text-lg font-semibold text-black text-left w-full">
          Batch {batch.number}
        </h2>
        {batch.projects.length > 0 &&
          batch.projects
            .sort((a, b) => a.position - b.position)
            .map((project: any) => (
              <p
                key={project.id}
                className="text-gray-500 text-sm mt-2 truncate text-left ml-4 cursor-pointer"
              >
                {project.title}
              </p>
            ))}
        <div
          className={`absolute top-2 right-2 h-4 w-4 rounded-full ${levelColors[level]}`}
        ></div>
      </div>

      <ProjectList Batch={projectDetails} activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  );
};

export default BatchCard;
