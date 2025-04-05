/* eslint-disable  @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import yaml from "js-yaml";
import { GetProjectByProjectId } from "../actions/project";

const GithubPart = ({ projectId }) => {
  const { user } = useUser();
  const userId = user?.id;

  const [project, setProject] = useState(null);
  const [repoLink, setRepoLink] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeQL, setCodeQL] = useState(null);

  // 🧠 Fetch project details on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await GetProjectByProjectId(projectId);
        setProject(response);
        console.log(response); // 👈 Use response here instead of `project`
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchProject();
  }, [projectId]); // ✅ Correct dependency  

  if (!project) {
    return <p className="text-gray-600">Loading project...</p>;
  }

  const githubData = project.GithubData
    ? JSON.parse(project.GithubData)
    : evaluationResult;

    console.log(githubData)
  const PushToDB = async (githubData) => {
    try {
      const response = await axios.patch("/api/query/project", {
        projectId: project.id,
        updatedFields: { GithubData: githubData },
      });
      if (response.status !== 200) throw new Error("Failed to update DB");
    } catch (error) {
      console.error("Database update error:", error);
    }
  };

  const handleEvaluate = async () => {
    if (!repoLink.trim()) {
      setEvaluationResult({ error: "Please enter a valid GitHub link." });
      return;
    }

    setLoading(true);
    setEvaluationResult(null);

    try {
      const store = repoLink.split("/");
      const indexOfGithub = store.findIndex((m) => m === "github.com");
      if (!store[indexOfGithub + 1] || !store[indexOfGithub + 2]) {
        throw new Error("Invalid GitHub repository link.");
      }

      const response = await fetch("/api/ai/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          owner: store[indexOfGithub + 1],
          repo: store[indexOfGithub + 2],
          topic: project.title,
          learning_objectives: project.learningObjectives,
          steps: project.steps,
        }),
      });

      if (response.status !== 200)
        throw new Error(`Request failed: ${response.status}`);

      const { jsonObject } = await response.json();
      await PushToDB(jsonObject);
      setEvaluationResult(JSON.parse(jsonObject));
    } catch (error) {
      console.error("Evaluation error:", error);
      setEvaluationResult({ error: "Failed to evaluate the repository." });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeQlGenerate = async () => {
    if (!repoLink.trim()) {
      setEvaluationResult({ error: "Please enter a valid GitHub link." });
      return;
    }

    setLoading(true);
    setEvaluationResult(null);

    try {
      const store = repoLink.split("/");
      const indexOfGithub = store.findIndex((m) => m === "github.com");
      if (!store[indexOfGithub + 1] || !store[indexOfGithub + 2]) {
        throw new Error("Invalid GitHub repository link.");
      }

      const response = await axios.get("/api/ai/github/codeql", {
        params: {
          id: userId,
          owner: store[indexOfGithub + 1],
          repo: store[indexOfGithub + 2],
        },
      });

      if (response.status !== 200) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const yamlFormattedCode = yaml.dump(response.data.ymlCode);
      setCodeQL(yamlFormattedCode);
    } catch (error) {
      console.error("CodeQL generation error:", error);
      setCodeQL("Error generating CodeQL data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <h5 className="text-xl font-bold text-gray-800">GitHub Evaluation</h5>

      {codeQL && (
        <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700">
            🎯 <strong>CodeQL Generated:</strong> {codeQL}
          </p>
        </div>
      )}

      {githubData ? ( 
        <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
          {githubData && githubData.error ? (
            <p className="text-red-500">{githubData.error}</p>
          ) : (
            <>
              <p className="text-gray-700">
                🎯 <strong>Objectives Met:</strong>{" "}
                {githubData["Objectives Met"]}
              </p>
              <div>
                <h6 className="font-semibold text-red-600">
                  ⚠️ Critical Issues:
                </h6>
                <ul className="list-disc pl-5 text-gray-700">
                  {githubData["Critical Issues"]?.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="font-semibold text-green-600">
                  💡 Suggestions:
                </h6>
                <ul className="list-disc pl-5 text-gray-700">
                  {githubData["Suggestions"]?.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              <p className="text-lg font-bold text-black">
                🏆 Final Score: {githubData["Final Score"]} / 100
              </p>
            </>
          )}
        </div>
       ) : (
        <>
          <input
            type="text"
            placeholder="Enter GitHub Repo Link"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            className="w-full text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 ${
              loading ? "bg-gray-400" : "bg-green-600"
            } text-white rounded-lg hover:bg-green-700 transition-all`}
          >
            <Play size={16} /> {loading ? "Evaluating..." : "Evaluate"}
          </button>
          <button
            onClick={handleCodeQlGenerate}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 ${
              loading ? "bg-gray-400" : "bg-green-600"
            } text-white rounded-lg hover:bg-green-700 transition-all`}
          >
            <Play size={16} /> {loading ? "Generating..." : "Generate"}
          </button>
        </>
      )}
    </div>
  );
};

export default GithubPart;
