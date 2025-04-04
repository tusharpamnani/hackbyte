import { Play, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import GithubEvaluation from "./GithubEvaluation";
import axios from "axios";
import { UserId as fetchUserId } from "../../utils/userId";
import { GetUserByUserId } from "../actions/user";
interface Step {
  stepTitle: string;
  status: "not started" | "in progress" | "completed";
  issueId?: string;
  itemId?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  learningObjectives: string[];
  batchId?: string;
}

interface ProjectCardProps {
  project: Project;
  onStartProject: (projectId: string) => void;
}

const ProjectCard = ({ project, onStartProject }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("projects");
  const [CourseOutcomes, setCourseOutcomes] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const userId = fetchUserId();
  const [User, setUser] = useState(null)
  console.log("steps", steps);
  const getProjectStatus = (steps: Step[]) => {
    if (!steps || steps.length === 0) return "Not Started";
    return steps.every((s) => s.status === "completed")
      ? "Completed"
      : "In Progress";
  };

  useEffect(() => {
    async function fetchUser () {
      const featchedUser = await GetUserByUserId(userId);
      setUser(featchedUser);
    }
  
    fetchUser();
  }, [userId])
  

  useEffect(() => {
    if (!project?.steps || project.steps.length === 0) {
      setSteps([]);
      return;
    }

    const updatedSteps : Step[] = project.steps.map((step: Step, index: number) => {
      if (index === 0 && step.status !== "completed") {
        return { ...step, status: "in progress" };
      }
      return step;
    });

    setSteps(updatedSteps);
  }, [project?.steps]);

  const handleStepStatusChange = (stepIndex: number) => {
    const updatedSteps = [...steps];

    if (updatedSteps[stepIndex].status === "not started") {
      return; // Prevent manual setting of "in progress"
    }

    // Toggle status for the selected step
    if (updatedSteps[stepIndex].status === "in progress") {
      updatedSteps[stepIndex].status = "completed";
    } else if (updatedSteps[stepIndex].status === "completed") {
      updatedSteps[stepIndex].status = "not started";

      // Reset all steps after the current one
      for (let i = stepIndex + 1; i < updatedSteps.length; i++) {
        updatedSteps[i].status = "not started";
      }
    }

    // Ensure only one "in progress" step exists, following the sequence
    for (let i = 0; i < updatedSteps.length; i++) {
      if (i === 0 || updatedSteps[i - 1].status === "completed") {
        if (updatedSteps[i].status !== "completed") {
          updatedSteps[i].status = "in progress"; // First "not completed" step becomes "in progress"
          break;
        }
      } else {
        updatedSteps[i].status = "not started"; // Prevent skipping
      }
    }

    setSteps(updatedSteps);
  };

  const handleCommit = async () => {
    try {
      const response = await axios.patch("/api/query/project", {
        projectId: project.id,
        updatedFields: { steps },
      });

      const data = await response.data;

      const issueIdandStatus = data.project.steps.map(
        (step) =>
          step.issueId && {
            status: step.status,
            issueId: step.issueId,
            itemId : step.itemId,
          }
      );

      await handleProjectIssueUpdate(issueIdandStatus, (await User).githubId);

      alert("Steps successfully committed!");
      setShowCommitModal(false);
    } catch (error) {
      console.error("Error committing steps:", error);
      alert("Failed to commit steps.");
    }
  };

  const handleProjectIssueUpdate = async (
    issues: { issueId: string; status: string, itemId : string }[],
    owner: string
  ) => {
    try {
      const response = await axios.post("/api/ai/github/projects/issue", {
        userId,
        owner,
        issues,
        batchId: project.batchId,
      });

      if (response.status === 200) {
        console.log("Issues updated successfully:", response.data);
        return response.data; // Optional: return response if needed
      } else {
        console.error("Failed to update issues:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating project issues:", error);
    }
  };

  const handleStartNow = async (id: string) => {
    try {
      onStartProject(id);

    } catch (error) {console.log(error)}
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm relative">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "projects"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("github")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "github"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          GitHub Evaluation
        </button>
      </div>

      {activeTab === "projects" ? (
        <>
          {!project.steps || project.steps.length === 0 ? (
            <button
              onClick={() => handleStartNow(project.id)}
              className="absolute flex items-center justify-between -top-3 -right-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg"
            >
              <Play size={16} /> Start Now
            </button>
          ) : (
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute flex items-center justify-between -top-3 -right-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg"
              >
                {isExpanded ? "Show Less" : "Show More"}{" "}
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              <p
                className={`text-sm ${
                  getProjectStatus(steps) === "Completed"
                    ? "text-green-600"
                    : "text-yellow-500"
                }`}
              >
                Status: {getProjectStatus(steps)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h5 className="text-lg font-semibold text-black">
              {project.title}
            </h5>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <p
            onClick={() => setCourseOutcomes(!CourseOutcomes)}
            className="text-blue-500 cursor-pointer"
          >
            Course Outcomes :-
          </p>
          {/* Learning Objectives */}
          {CourseOutcomes && (
            <div className="text-black">
              <h6 className="font-semibold text-gray-700">
                Learning Objectives:
              </h6>
              <ul className="list-disc list-inside space-y-1">
                {project.learningObjectives.map(
                  (objective: string, index: number) => (
                    <li key={index}>- {objective}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {isExpanded && (
            <div className="space-y-2 mt-2">
              {steps.length > 0 && (
                <div className="space-y-2">
                  <h6 className="text-md font-semibold text-gray-700">
                    Steps:
                  </h6>
                  <ul className="list-inside space-y-1">
                    {steps.map((stepObj, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={stepObj.status === "completed"}
                          onChange={() => handleStepStatusChange(index)}
                          className="appearance-none w-4 h-4 border border-gray-400 rounded-full checked:bg-green-600"
                        />
                        <span
                          className={`text-sm ${
                            stepObj.status === "completed"
                              ? "line-through text-green-600"
                              : stepObj.status === "in progress"
                              ? "text-yellow-500"
                              : "text-gray-700"
                          }`}
                        >
                          {stepObj.stepTitle} -{" "}
                          <span className="italic">{stepObj.status}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setShowCommitModal(true)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
              >
                Commit Steps
              </button>
            </div>
          )}

          {showCommitModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold text-black">
                  Commit Changes
                </h3>
                <ul className="mt-2 space-y-2">
                  {steps.map((stepObj, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-black">
                        {stepObj.stepTitle}
                      </span>
                      <span className="font-semibold text-black">
                        {stepObj.status}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCommitModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCommit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Confirm & Commit
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <GithubEvaluation project={project} />
      )}
    </div>
  );
};

export default ProjectCard;
