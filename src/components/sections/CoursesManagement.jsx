import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { supabase } from '../../service/supabaseClient';
import { useNavigate } from 'react-router-dom';

function CoursesManagement() {
  const navigate = useNavigate();  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลคอร์สเรียน
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('Courses')
          .select('*')
          .order('Created_at', { ascending: false }); // เรียงจากคอร์สใหม่สุด

        if (error) throw error;
        if (data) setCourses(data);
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
        
        {/* ส่วนหัว: ชื่อหน้า และ ปุ่มเพิ่ม */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            คอร์สเรียนทั้งหมด
          </h1>
          
          <button 
            onClick={() => navigate('/add-course')} 
            className="bg-[#2FA084] hover:bg-[#248169] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} strokeWidth={2.5} />
            เพิ่ม
          </button>
        </div>

        {/* ตรวจสอบสถานะการโหลดข้อมูล */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        ) : courses.length === 0 ? (
          // กรณีไม่มีข้อมูล
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-400 text-lg">ยังไม่มีข้อมูลคอร์สเรียน</p>
          </div>
        ) : (
          // กรณีมีข้อมูล นำมาแสดงเป็น Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div 
                key={course.CourseID} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col relative"
              >
                {/* ส่วนรูปภาพจำลอง พร้อมปุ่มตั้งค่า */}
                <div className="h-44 relative bg-gray-200">
                  <img 
                    // ใส่ URL รูป Mockup ชั่วคราว
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop" 
                    alt={course.Course_name} 
                    className="w-full h-full object-cover"
                  />
                  {/* ปุ่มฟันเฟือง (ตั้งค่า) มุมขวาบน */}
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-[#60a5fa] hover:bg-gray-50 transition-colors">
                    <Settings size={20} strokeWidth={2} />
                  </button>
                </div>

                {/* ส่วนเนื้อหาคอร์สเรียน */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
                    {course.Course_name}
                  </h3>
                  <p className="text-[#a0aec0] text-sm mb-4 line-clamp-2 flex-grow font-light">
                    {course.Description}
                  </p>
                  
                  {/* ราคา สีส้มตามภาพตัวอย่าง */}
                  <div className="text-2xl font-bold text-[#f97316] mt-auto">
                    {course.Price ? course.Price.toLocaleString() : '0'} บาท
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default CoursesManagement;