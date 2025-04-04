import { Batch } from "./Batch";

export interface Course {
    id: string;
    title: string;
    userId?: string;
    batch?: Batch[];
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }