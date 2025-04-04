"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Loader,
} from "lucide-react";
import axios from "axios";
import { UserId as fetchUserId } from "../../utils/userId";
import { GetUserByUserId } from "../actions/user";
import { GetProjectByProjectId } from "../actions/project";
import { CreateIssue } from "../courses/GithubFunctions";
import GithubPart from "./GithubPart";

const ProjectDetail = ({ project: initialProject }) => {
  const [project, setProject] = useState(initialProject);
  const [isStepsExpanded, setIsStepsExpanded] = useState(false);
  const [isObjectivesExpanded, setIsObjectivesExpanded] = useState(false);
  const [steps, setSteps] = useState(() => {
    // Initialize steps once using a function to prevent re-initialization on re-render
    return (initialProject.steps || []).map((step, index) => {
      if (index === 0 && step.status !== "completed") {
        return { ...step, status: "in progress" };
      }
      return step;
    });
  });
  const [loading, setLoading] = useState(false);
  const userId = fetchUserId();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("projects")
  
  useEffect(() => {
    const fetchUser = async () => {
      if (userId !== null)
        console.log("userId", userId);
        try {
          const fetchedUser = await GetUserByUserId(userId);
          if (fetchedUser)
            setUser(fetchedUser);
          console.log("fetchedUser", fetchedUser)
        } catch (error) {
          console.error("Error fetching user:", error);
        }
    };
    fetchUser();
    console.log(user)
    setSteps(initialProject.steps)
  }, [userId]);

  const getProjectStatus = useCallback(() => {
    if (!steps || steps.length === 0) return "Not Started";
    return steps.every((s) => s.status === "completed")
      ? "Completed"
      : "In Progress";
  }, [steps]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in progress":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleStepStatusChange = (stepIndex) => {
    const updatedSteps = [...steps];

    // Allow changing from "not started" to "in progress" for the first step
    if (updatedSteps[stepIndex].status === "not started") {
      if (stepIndex === 0 || updatedSteps[stepIndex - 1].status === "completed") {
        updatedSteps[stepIndex].status = "in progress";
      } else {
        return; // Can't start a step if previous step isn't completed
      }
    } else if (updatedSteps[stepIndex].status === "in progress") {
      updatedSteps[stepIndex].status = "completed";
    } else if (updatedSteps[stepIndex].status === "completed") {
      updatedSteps[stepIndex].status = "not started";

      for (let i = stepIndex + 1; i < updatedSteps.length; i++) {
        updatedSteps[i].status = "not started";
      }
    }

    for (let i = 0; i < updatedSteps.length; i++) {
      if (i === 0 || updatedSteps[i - 1].status === "completed") {
        if (updatedSteps[i].status !== "completed") {
          updatedSteps[i].status = "in progress";
          break;
        }
      } else {
        updatedSteps[i].status = "not started";
      }
    }

    setSteps(updatedSteps);
    console.log("Steps", steps);
  };

  const handleStartProject = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/ai/project", {
        topic: project.title,
        learning_objectives: project.learningObjectives,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch project data.");
      }

      const parsedData = JSON.parse(response.data.jsonObject || "{}");

      const stepsData = (parsedData?.steps || []).map((step, index) => ({
        index,
        step,
        status: "pending",
        issueId: null,
      }));

      // Get the batchId from the project
      const batchId = project.batchId;
      const projectTitle = batchId ? `${batchId}-Batch` : project.title;

      // Call CreateIssue function
      const updatedSteps = await CreateIssue(
        user.githubId,
        project.title,
        "user",
        project.id,
        projectTitle,
        batchId,
        userId,
        stepsData
      );

      // Map back the issueId to their respective steps
      const newSteps = parsedData.steps.map((step, index) => ({
        stepTitle: step,
        issueId: updatedSteps[index]?.issueId || null,
        itemId: updatedSteps[index]?.itemId || null,
        status: "not started",
      }));

      // Update the project with updated steps
      await axios.patch("/api/query/project", {
        projectId: project.id,
        updatedFields: { steps: newSteps },
      });

      // Fetch the updated project instead of refreshing the page
      const updatedProject = await GetProjectByProjectId(project.id);
      setProject(updatedProject);
      setSteps(updatedProject.steps || []);
      console.log("Steps", steps);
    } catch (error) {
      console.error("Error starting project:", error);
      alert("Failed to start project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      setLoading(true);

      await axios.patch("/api/query/project", {
        projectId: project.id,
        updatedFields: { steps },
      });

      // If the project has GitHub integration
      if (user?.githubId && steps.some((step) => step.issueId)) {
        const issueIdandStatus = steps
          .filter((step) => step.issueId)
          .map((step) => ({
            status: step.status,
            issueId: step.issueId,
            itemId: step.itemId,
          }));

        // Call the GitHub issue update API
        await axios.post("/api/ai/github/projects/issue", {
          userId,
          owner: user.githubId,
          issues: issueIdandStatus,
          batchId: project.batchId,
        });
      }

      alert("Progress saved successfully!");
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("Failed to save progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = useCallback((status) => {
    let icon;
    switch (status) {
      case "Completed":
        icon = <CheckCircle size={16} className="text-green-600" />;
        return (
          <div className="flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
            {icon} <span className="ml-1">Completed</span>
          </div>
        );
      case "In Progress":
        icon = <Clock size={16} className="text-yellow-600" />;
        return (
          <div className="flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-600">
            {icon} <span className="ml-1">In Progress</span>
          </div>
        );
      default:
        icon = <AlertCircle size={16} className="text-gray-600" />;
        return (
          <div className="flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
            {icon} <span className="ml-1">Not Started</span>
          </div>
        );
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
              <Loader size={24} className="animate-spin text-blue-600" />
              <p className="text-gray-800 font-medium">Loading...</p>
            </div>
          </div>
        )}

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "projects"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("github")}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === "github"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            GitHub Evaluation
          </button>
        </div>

        {/* Main Project Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {project.title}
                  </h1>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                  {project.level && (
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 whitespace-nowrap rounded-full text-sm font-medium">
                      {project.level}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 whitespace-nowrap">
                  {renderStatusBadge(getProjectStatus())}

                  {/* Start Project Button - Only show if no steps */}
                  {(!steps || steps.length === 0) && (
                    <button
                      onClick={handleStartProject}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
                    >
                      <Play size={16} className="mr-2" /> Start Project
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          {activeTab === "projects" ?
            <div className="p-6">
              <div className="mb-6">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setIsObjectivesExpanded(!isObjectivesExpanded)}
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    Learning Objectives
                  </h2>
                  {isObjectivesExpanded ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </div>
                {isObjectivesExpanded && (
                  <div className="mt-3 pl-2 border-l-2 border-blue-300">
                    {project.learningObjectives &&
                      project.learningObjectives.length > 0 ? (
                      <ul className="space-y-2">
                        {project.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        No learning objectives specified
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Only show steps section if we have steps */}
              {steps && steps.length > 0 && (
                <div>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setIsStepsExpanded(!isStepsExpanded)}
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      Project Steps
                    </h2>
                    {isStepsExpanded ? (
                      <ChevronUp size={20} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-600" />
                    )}
                  </div>
                  {isStepsExpanded && (
                    <div className="mt-4 space-y-3">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex flex-col p-4 border rounded-lg shadow-sm bg-white"
                        >
                          {/* Step Header */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={step.status === "completed"}
                              onChange={() => handleStepStatusChange(index)}
                              className="w-5 h-5 mr-3 rounded-full border-2 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex-grow">
                              <p
                                className={`text-lg font-semibold text-gray-800 ${step.status === "completed"
                                  ? "line-through"
                                  : ""
                                  }`}
                              >
                                {String(step.stepTitle.stepTitle)}
                              </p>
                            </div>
                            <span
                              className={`ml-3 px-3 py-1 rounded-full text-xs ${getStatusColor(
                                step.status
                              )}`}
                            >
                              {step.status}
                            </span>
                          </div>

                          {/* Step Description */}
                          {step.stepTitle.description && (
                            <p className="mt-2 text-xs text-gray-600">
                              {String(step.stepTitle.description)}
                            </p>
                          )}

                          {/* GitHub Commit Instruction */}
                          {/* {step.stepTitle.githubCommitInstruction && (
                          <p className="mt-2 text-green-600 font-semibold">
                            {String(step.githubCommitInstruction)}
                          </p>
                        )} */}

                          {/* Resources */}
                          {Array.isArray(step.stepTitle.resources) &&
                            step.stepTitle.resources.length > 0 && (
                              <div className="mt-3">
                                <h3 className="font-medium text-gray-700">
                                  Resources:
                                </h3>
                                <ul className="list-disc list-inside text-blue-500">
                                  {step.stepTitle.resources.map((resource, idx) => (
                                    <li key={idx}>
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                      >
                                        {resource.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            : <GithubPart projectId={project.id} />}
        </div>

        {/* Save Progress Button - Only show if we have steps */}
        {steps && steps.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={saveProgress}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors disabled:bg-blue-400"
            >
              Save Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Page = ({ params }) => {
  const { id } = params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const projectData = await GetProjectByProjectId(id);
          setProject(projectData);
          if (!projectData) {
            setError("Project not found");
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-md">
          <Loader size={24} className="animate-spin text-blue-600" />
          <p className="text-gray-800 font-medium">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center text-red-500 text-lg">
            {error || "Project not found"}
          </div>
        </div>
      </div>
    );
  }

  return <ProjectDetail project={project} />;
};

export default Page;