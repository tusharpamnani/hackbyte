"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { validateJsonStructure } from "../../utils/JsonChecker";
import { currentUser } from "@clerk/nextjs/dist/types/server";

interface Project {
  batch: number;
  title: string;
  description: string;
  level: string;
  status: string;
  learningObjectives: Record<string, string>;
  steps: Record<string, string>;
}

interface Batch {
  batchId: number;
  projects: Project[];
}


const AiCall = ({
  onOutputChange,
  onMetadataChange,
}: {
  onOutputChange: (data: Batch[]) => void;
  onMetadataChange: (data) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [timeDuration, setTimeDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [Users, setUsers] = useState("");

  // const loadingStates = [
  //   { text: "Initializing AI model..." },
  //   { text: "Processing your prompt..." },
  //   { text: "Analyzing time duration..." },
  //   { text: "Generating response..." },
  //   { text: "Formatting output..." },
  //   { text: "Verifying data integrity..." },
  //   { text: "Complete!" },
  // ];

  // const handleComplete = () => {
  //   setLoading(false);
  // };

  // useEffect(()=>{
  //   const fetchUSer = async () => {
  //     const result = await currentUser();
  //     setUsers(result.);
  //   }
  // })

  function filterByBatches(projects: Project[]): Batch[] {
    const batches: Record<number, Batch> = {};

    projects.forEach((project) => {
      const batchId = project.batch-1; // Removed -1 as batch should directly reflect its actual value
      if (!batches[batchId]) {
        batches[batchId] = {
          batchId,
          projects: [],
        };
      }
      batches[batchId].projects.push(project);
    });

    return Object.values(batches);
  }

  const uploadCourse = async (
    title: string,
    description: string,
    batches: Batch[]
  ) => {
    try {
      const response = await axios.post("/api/query/courseandprojects", {
        title,
        description,
        batches,
      });

      if (!(response.status === 201 || response.status === 200)) {
        setError(response.data.message || response.data.error);
      }
    } catch (err) {
      console.error("Error uploading course:", err);
      setError("Failed to upload course data.");
    }
  };

  const processData = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post("/api/ai/course", {
        topic: prompt,
        time_duration: timeDuration,
      });
  
      if (response.status !== 200) {
        throw new Error("AI service error.");
      }
  
      const data = response.data;
  
      // Parse the jsonObject string into an actual object
      let parsedJson;
      try {
        parsedJson = JSON.parse(data.jsonObject);
      } catch (error) {
        throw new Error("Invalid JSON format received from API.", error);
      }
  
      const projects = parsedJson?.projects;
  
      if (!Array.isArray(projects)) {
        throw new Error("Invalid data format: Projects should be an array.");
      }
  
      const checkJson = validateJsonStructure(projects);
  
      if (checkJson.valid) {
  
        const sortedBatches = filterByBatches(projects);
        onOutputChange(sortedBatches);
        onMetadataChange(parsedJson.METADATA);
  
        await uploadCourse(
          parsedJson.METADATA.topic,
          parsedJson.METADATA.generalTip,
          sortedBatches
        );
      } else {
        setError(checkJson.error);
      }
    } catch (err) {
      console.error("Error processing data:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !timeDuration.trim()) {
      setError("Both fields are required.");
      return;
    }
    processData();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          placeholder="Enter your topic..."
          className="border p-2 rounded-md w-full text-black"
        />
        <input
          type="text"
          value={timeDuration}
          onChange={(e) => setTimeDuration(e.target.value)}
          disabled={loading}
          placeholder="Enter time duration..."
          className="border p-2 rounded-md w-full text-black"
        />
        {error && <div className="text-red-500 text-lg py-2">{error}</div>}
        <button
          type="submit"
          className={`${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white px-4 py-2 rounded-md w-full`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send"}
        </button>
      </form>

      {/* Uncomment this for multi-step loader animation */}
      {/* <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        conditionalVariable={conditionalVariable}
        onComplete={handleComplete}
      /> */}
    </div>
  );
};

export default AiCall;
