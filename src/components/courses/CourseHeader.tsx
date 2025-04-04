// CourseHeader.tsx
import React from 'react';

interface CourseHeaderProps {
  id: string;
  title?: string;
  createdAt?: string;
}

const CourseHeader = ({ id, title, createdAt }: CourseHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Course ID: {id}</h1>
      {title && (
        <div>
          <h2 className="text-2xl font-semibold text-blue-700">{title}</h2>
          <p className="text-gray-500 mt-1">
            Created At: {new Date(createdAt!).toLocaleDateString()}
          </p>
        </div>
      )}
    </>
  );
};

export default CourseHeader;