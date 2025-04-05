/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Project {
  id: string;
  title: string;
  githubRepo?: string;
  description?: string;
  level?: string;
  status?: string;
  batchId?: string;
  position?: number;
  learningObjectives?: any;
  steps?: any | null;
  GithubData?: any | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Batch {
  id: string;
  projects: Project[];
  number ?: number;
  courseId ?: string;
}