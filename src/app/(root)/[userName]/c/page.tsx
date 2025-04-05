"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseCard from "../../../../components/course/card";
import Link from "next/link";
import { GetCoursesByName } from "../../../../components/actions/course";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const userName = params.userName as string;

  useEffect(() => {
    const fetchCourses = async () => {
      if (userName) {
        try {
          const fetchedCourses = await GetCoursesByName(userName);
          setCourses(fetchedCourses);
        } catch (error) {
          console.error("Error fetching courses:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userName]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center text-red-500 text-lg">Courses not found</div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 min-h-screen bg-gray-100">
      {courses.map((course) => (
        <div key={course.id}>
          <Link href={`c/${course.title.split(" ").join("_")}`}>
            <CourseCard title={course.title} status={course.status} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CoursesPage;