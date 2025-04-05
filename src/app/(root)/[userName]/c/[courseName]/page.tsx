"use client"
import { getBatchesByUserNameandCourseName } from "../../../../../components/actions/batch";
import BatchCard from "../../../../../components/batch/card";
import WindowPathLogger from "./WindowPathLogger";
import type { Batch } from "../../../../../components/shared/schema/Project"; // or wherever your type is
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { useEffect } from "react";

export default function Page() {
  // const { userName, courseName } = params;
  const { userName, courseName } = useParams()
  console.log(userName, courseName)
  const [Batches, setBatches] = useState(null)
  useEffect(() => {
    const fetchBatches = async () => {
      const batches = await getBatchesByUserNameandCourseName(userName as string, courseName as string);
      setBatches(batches)
    }
    fetchBatches();
  }, [userName])


  if (!Batches || !Batches.batch || Batches.batch.length === 0) {
    return (
      <div className="text-center text-red-500 text-lg">Batches not found</div>
    );
  }

  return (
    <div className="flex flex-col justify-around items-center min-h-screen bg-gray-100 p-4">
      <WindowPathLogger />
      <h1 className="text-black text-7xl">{courseName}</h1>
      <div className="flex flex-wrap justify-center items-center">
        {Batches.batch
          .sort((a: Batch, b: Batch) => (a.number ?? 0) - (b.number ?? 0))
          .map((batch: Batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
      </div>
    </div>
  );
}
