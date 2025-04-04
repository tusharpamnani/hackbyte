import { Project } from "./Project";

export interface Batch {
    id: string;
    number: number;
    courseId: string;
    projects?: Project[];
    githubProjectId?: string | null;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }