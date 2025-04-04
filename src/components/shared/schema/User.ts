import { Course } from "./Courses";

export interface User {
    id: string;
    clerkId: string;
    githubId?: string | null;
    githubOwnerid?: string | null;
    githubToken?: string | null;
    name: string;
    lastName?: string;
    userName?: string | null;
    email: string;
    avatar?: string | null;
    courses?: Course[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  