import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../service/api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCourses(await apiFetch('/courses'));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-32 pb-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            คอร์สเรียนทั้งหมด
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-400 text-lg">ยังไม่มีข้อมูลคอร์สเรียน</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link
                to={`/course-details/${course.id}`}
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="h-44 relative bg-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop"
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
                    {course.courseName}
                  </h3>
                  <p className="text-[#a0aec0] text-sm mb-4 line-clamp-2 flex-grow font-light">
                    {course.description}
                  </p>
                  <div className="text-2xl font-bold text-[#f97316] mt-auto">
                    {(course.price ?? 0).toLocaleString()} บาท
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;