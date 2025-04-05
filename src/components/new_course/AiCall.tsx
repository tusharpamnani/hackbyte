
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { validateJsonStructure } from "../../utils/JsonChecker";
import { useRouter } from 'next/navigation';

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
  userName
}: {
  onOutputChange: (data: Batch[]) => void;
  onMetadataChange: (data) => void;
  userName: string;
}) => {
  const [prompt, setPrompt] = useState("");
  const [timeDuration, setTimeDuration] = useState("");
  const [level, setLevel] = useState("Easy");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [typedText, setTypedText] = useState("");
  const codingEffect = "Generate learning pathways with AI...";
  const router = useRouter();

  // Coding effect animation
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= codingEffect.length) {
        setTypedText(codingEffect.slice(0, currentIndex));
        currentIndex++;
      } else {
        currentIndex = 0; // Reset to create loop effect
      }
    }, 150);


    return () => clearInterval(typingInterval);
  }, []);
  console.log(userName)

  function filterByBatches(projects: Project[]): Batch[] {
    const batches: Record<number, Batch> = {};

    projects.forEach((project) => {
      const batchId = project.batch - 1;
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

      router.push(`/${userName}/c`)
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
        level: level,
        description: description
      });

      if (response.status !== 200) {
        throw new Error("AI service error.");
      }

      const data = response.data;

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
      setError("All fields are required.");
      return;
    }
    processData();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6">
          <h2 className="text-4xl font-bold text-white">AI Assistant</h2>
          <p className="text-white text-opacity-90 mt-1">
            Let AI assist you in generating personalized outputs
          </p>
          <div className="h-6 mt-2 font-mono text-white text-sm">
            <span className="inline-block">{typedText}</span>
            <span className="inline-block animate-pulse">|</span>
          </div>
        </div>

        <div className="px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Topic"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              placeholder="What do you want to learn?"
            />

            <div className="flex items-center justify-around gap-4">

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Duration (in months)</label>
                <select
                  value={timeDuration}
                  onChange={(e) => setTimeDuration(e.target.value)}
                  disabled={loading}
                  className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                >
                  <option value="">Select duration</option>
                  {[1, 2, 3, 4, 5, 6].map((month) => (
                    <option key={month} value={`${month} month${month > 1 ? 's' : ''}`}>
                      {month} month{month > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  disabled={loading}
                  className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={4}
                placeholder="I have 2 days of React.js knowledge"
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md border border-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-md text-white font-semibold transition-all ${loading
                ? "bg-blue-300"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Generate"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800"
    />
  </div>
);

export default AiCall;