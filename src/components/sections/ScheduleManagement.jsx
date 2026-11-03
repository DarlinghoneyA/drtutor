import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../service/supabaseClient';

function ScheduleManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันหา วันจันทร์ ของสัปดาห์ปัจจุบัน
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // สร้าง Array ของวันที่ทั้ง 7 วัน
  const getWeekDays = () => {
    const monday = getMonday(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  const weekDays = getWeekDays();

  // แปลง Date เป็น String รูปแบบ YYYY-MM-DD เพื่อใช้ค้นหาใน Database
  const formatDateForDB = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // จัดรูปแบบเวลา เช่น 07:00:00 -> 7:00
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5).replace(/^0/, '');
  };

  useEffect(() => {
    const fetchWeeklySchedules = async () => {
      setLoading(true);
      try {
        const startDate = formatDateForDB(weekDays[0]);
        const endDate = formatDateForDB(weekDays[6]);

        // 1. ดึงข้อมูลตารางเรียนในสัปดาห์นี้จาก Class_schedules
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('Class_schedules')
          .select('*')
          .gte('Class_date', startDate)
          .lte('Class_date', endDate);

        if (scheduleError) throw scheduleError;

        if (scheduleData && scheduleData.length > 0) {
          // 2. ดึงข้อมูล CoursesTeacherID ที่เกี่ยวข้อง
          const ctIds = [...new Set(scheduleData.map(s => s.CourseTeacherID))];
          const { data: ctData } = await supabase
            .from('Courses_Teacher')
            .select('*')
            .in('CoursesTeacherID', ctIds);

          if (ctData) {
            const courseIds = [...new Set(ctData.map(ct => ct.CourseID))];
            const teacherIds = [...new Set(ctData.map(ct => ct.TeacherID))];

            // 3. ดึงชื่อคอร์สเรียน
            const { data: coursesData } = await supabase
              .from('Courses')
              .select('CourseID, Course_name')
              .in('CourseID', courseIds);

            // 4. ดึงชื่อคุณครู
            const { data: teachersData } = await supabase
              .from('Teachers')
              .select('TeacherID, UserID')
              .in('TeacherID', teacherIds);
              
            let usersData = [];
            if (teachersData && teachersData.length > 0) {
              const userIds = [...new Set(teachersData.map(t => t.UserID))];
              const { data: uData } = await supabase
                .from('Users')
                .select('UserID, Profile_name')
                .in('UserID', userIds);
              if (uData) usersData = uData;
            }

            // 5. ประกอบร่างข้อมูล (Merge Data)
            const fullSchedules = scheduleData.map(s => {
              const ct = ctData.find(c => c.CoursesTeacherID === s.CourseTeacherID);
              const course = coursesData?.find(c => c.CourseID === ct?.CourseID);
              const teacherInfo = teachersData?.find(t => t.TeacherID === ct?.TeacherID);
              const user = usersData?.find(u => u.UserID === teacherInfo?.UserID);

              return {
                ...s,
                Course_name: course?.Course_name || 'ไม่ระบุวิชา',
                Teacher_name: user?.Profile_name || 'ไม่ระบุชื่อครู'
              };
            });
            
            // เรียงตามเวลาเริ่มสอน
            fullSchedules.sort((a, b) => a.Start_time.localeCompare(b.Start_time));
            setSchedules(fullSchedules);
          }
        } else {
          setSchedules([]);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const thaiDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const currentMonth = thaiMonths[weekDays[0].getMonth()];
  const currentYear = weekDays[0].getFullYear();

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-32 pb-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
          จัดการตารางสอน
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[600px]">
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4 text-gray-800">
              <h2 className="text-xl font-bold">
                {currentMonth} {currentYear}
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => changeWeek(-1)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => changeWeek(1)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button className="p-1.5 text-[#799eff] hover:bg-blue-50 rounded-full transition-colors">
                <CalendarIcon size={20} />
              </button>
            </div>

            {/* ปุ่มเพิ่ม ลิงก์ไปหน้าจัดตารางเรียน */}
            <Link 
              to="/add-schedule"
              className="bg-[#2FA084] hover:bg-[#248169] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
            >
              <Plus size={20} strokeWidth={2.5} />
              เพิ่ม
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
              
              {/* หัวตารางวันที่ */}
              <div className="grid grid-cols-7 border-b-2 border-[#799eff] pb-4 mb-4">
                {weekDays.map((date, index) => (
                  <div key={index} className="flex flex-col items-center justify-center text-[#799eff]">
                    <span className="text-lg font-bold">
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                    <span className="text-lg font-bold">
                      {thaiDays[index]}
                    </span>
                  </div>
                ))}
              </div>

              {/* พื้นที่ตารางสอน */}
              <div className="grid grid-cols-7 gap-4 min-h-[400px]">
                {loading ? (
                  <div className="col-span-7 flex justify-center py-20 text-gray-400">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : (
                  weekDays.map((date, index) => {
                    const dbDateStr = formatDateForDB(date);
                    // กรองตารางเรียนเฉพาะวันที่ตรงกับคอลัมน์นี้
                    const daySchedules = schedules.filter(s => s.Class_date === dbDateStr);

                    return (
                      <div key={index} className="border-r border-gray-100 last:border-0 p-1 flex flex-col gap-3">
                        {daySchedules.map((schedule) => (
                          // การ์ดตารางเรียน กรอบสีส้ม
                          <div 
                            key={schedule.ScheduleID} 
                            className="border border-[#f97316] rounded-lg p-3 bg-white shadow-sm flex flex-col h-[130px] hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <h3 className="text-[#799eff] font-bold text-sm leading-tight line-clamp-2">
                              {schedule.Course_name}
                            </h3>
                            <div className="mt-auto text-xs text-gray-500">
                              <p className="mb-0.5 truncate">{schedule.Teacher_name}</p>
                              <p>{formatTime(schedule.Start_time)} - {formatTime(schedule.End_time)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ScheduleManagement;