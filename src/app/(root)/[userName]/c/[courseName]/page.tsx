import { getBatchesByUserNameandCourseName } from "../../../../../components/actions/batch";
import BatchCard from "../../../../../components/batch/card";
import WindowPathLogger from "./WindowPathLogger";

type PageProps = {
  params: {
    userName: string;
    courseName: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { userName, courseName } = params;

  const Batches = await getBatchesByUserNameandCourseName(userName, courseName);

  if (!Batches || Batches.batch.length === 0) {
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
          .sort((a, b) => a.number - b.number)
          .map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
      </div>
    </div>
  );
};

export default Page;
