'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-semibold">MyApp</div>

      <div className="space-x-4">
        <Link href="/">
          <span className="text-gray-700 hover:text-black cursor-pointer">Home</span>
        </Link>
        <Link href="/courses/new">
          <span className="text-gray-700 hover:text-black cursor-pointer">New Course</span>
        </Link>
        <Link href="/courses">
          <span className="text-gray-700 hover:text-black cursor-pointer">Courses</span>
        </Link>
      </div>
    </nav>
  )
}
