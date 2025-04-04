import React from "react";
import { GetCoursesByName } from "../../../../components/actions/course";
import CourseCard from "../../../../components/course/card";
import Link from "next/link";

const page = async ({ params }: { params: { userName: string } }) => {
  let Courses = [];

  const { userName } = await params;

  if (userName) {
    Courses = await GetCoursesByName(userName);
  }

  if (!Courses || Courses.length === 0) {
    return (
      <div className="text-center text-red-500 text-lg">Courses not found</div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 min-h-screen bg-gray-100">
      {Courses.map((course) => (
        <div key={course.id}>
          <Link href={`c/${course.title.split(" ").join("_")}`}>  
            <CourseCard title={course.title} status={course.status} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default page;
