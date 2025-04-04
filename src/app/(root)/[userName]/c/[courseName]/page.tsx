import React from "react";
import { getBatchesByUserNameandCourseName } from "../../../../../components/actions/batch";
import BatchCard from "../../../../../components/batch/card";

const page = async ({
  params,
}: {
  params: { userName: string; courseName: string };
}) => {
  let Batches = null;

  const { userName, courseName } = await params;

  if (userName && courseName) {
    Batches = await getBatchesByUserNameandCourseName(userName, courseName);
  }

  if (!Batches || Batches.length === 0) {
    return (
      <div className="text-center text-red-500 text-lg">Batches not found</div>
    );
  }

  return (
    <div className="flex flex-col justify-around items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-black text-7xl">{courseName}</h1>
      <div className="flex flex-wrap justify-center items-center">
        {Batches.batch
          .sort((a, b) => a.number - b.number)
          .map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
      </div>
    </div>
  );
};

export default page;
