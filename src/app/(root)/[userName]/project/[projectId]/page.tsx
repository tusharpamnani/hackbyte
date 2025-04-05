"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GetProjectByProjectId } from "../../../../../components/actions/project";
import ProjectPage from "../../../../../components/projects/Projectage";

const ProjectDetailsPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          const projectData = await GetProjectByProjectId(projectId);
          setProject(projectData);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!project) {
    return <div className="text-center text-red-500 text-lg">Project not found</div>;
  }

  return (
    <div className="">
      <ProjectPage params={project} />
    </div>
  );
};

export default ProjectDetailsPage;