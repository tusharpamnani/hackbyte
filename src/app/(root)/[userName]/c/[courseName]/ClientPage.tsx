/* eslint-disable @typescript-eslint/no-unused-vars */


"use client";

import { usePathname } from "next/navigation";
import WindowPathLogger from "./WindowPathLogger";
import BatchCard from "../../../../../components/batch/card";
import { Batch } from "../../../../../components/shared/schema/Batch"; // ensure correct import

interface ClientPageProps {
  courseName: string;
  batches: Batch[]; // <-- use proper Batch type which includes 'projects'
}

export default function ClientPage({ courseName, batches }: ClientPageProps) {
  const pathname = usePathname();

  const userName = pathname?.split("/")[2] ?? ""; // assuming /[userName]/c/[courseName]
  const resolvedCourseName = pathname?.split("/")[4] ?? courseName;

  if (!batches || batches.length === 0) {
    return (
      <div className="text-center text-red-500 text-lg">Batches not found</div>
    );
  }

  return (
    <div className="flex flex-col justify-around items-center min-h-screen bg-gray-100 p-4">
      <WindowPathLogger />
      <h1 className="text-black text-7xl">{resolvedCourseName}</h1>
      <div className="flex flex-wrap justify-center items-center">
        {batches
          .sort((a, b) => a.number - b.number)
          .map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
      </div>
    </div>
  );
}
