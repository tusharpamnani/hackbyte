import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="flex w-full h-[100vh] justify-center items-center">
        <SignIn />
      </div>
    </>
  );
}
