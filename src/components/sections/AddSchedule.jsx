import React, { useState, useEffect } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../service/supabaseClient';

function AddSchedule() {
  const navigate = useNavigate();

  // State สำหรับเก็บข้อมูลที่ดึงมาจาก Database
  const [coursesList, setCoursesList] = useState([]);
  const [teachersList, setTeachersList] = useState([]); // ครูที่ผูกกับคอร์สที่เลือก

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTeacherId, setSelectedCourseTeacherId] = useState(''); // เก็บ CoursesTeacherID
  const [classroom, setClassroom] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  
  // คำอธิบายและไฟล์ (ยังไม่บันทึกลงระบบในตอนนี้)
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. ดึงรายชื่อคอร์สทั้งหมดเมื่อโหลดหน้า
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('Courses')
          .select('CourseID, Course_name');
        if (error) throw error;
        if (data) setCoursesList(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  // 2. ดึงรายชื่อครูที่สอนคอร์สนี้ เมื่อมีการเลือกคอร์ส
  useEffect(() => {
    const fetchTeachersForCourse = async () => {
      if (!selectedCourseId) {
        setTeachersList([]);
        setSelectedCourseTeacherId('');
        return;
      }

      try {
        // ดึง CoursesTeacherID และ TeacherID จาก Courses_Teacher[cite: 18]
        const { data: ctData, error: ctError } = await supabase
          .from('Courses_Teacher')
          .select('CoursesTeacherID, TeacherID')
          .eq('CourseID', selectedCourseId);

        if (ctError) throw ctError;

        if (ctData && ctData.length > 0) {
          // ดึงข้อมูลชื่อครูเพื่อมาแสดงผล
          const { data: teachersData } = await supabase
            .from('Teachers')
            .select('TeacherID, UserID');
            
          const { data: usersData } = await supabase
            .from('Users')
            .select('UserID, Profile_name');

          const mappedTeachers = ctData.map(ct => {
            const teacher = teachersData?.find(t => t.TeacherID === ct.TeacherID);
            const user = usersData?.find(u => u.UserID === teacher?.UserID);
            return {
              CoursesTeacherID: ct.CoursesTeacherID,
              Profile_name: user?.Profile_name || 'ไม่ระบุชื่อ'
            };
          });

          setTeachersList(mappedTeachers);
        } else {
          setTeachersList([]);
        }
      } catch (error) {
        console.error('Error fetching teachers for course:', error);
      }
    };

    fetchTeachersForCourse();
  }, [selectedCourseId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  // 3. ฟังก์ชันบันทึกข้อมูลลง Class_schedules[cite: 17]
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseTeacherId || !date || !startTime || !endTime) {
      alert('กรุณากรอกข้อมูล คอร์ส ครูผู้สอน วันที่ และเวลา ให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduleData = {
        CourseTeacherID: selectedCourseTeacherId,
        Class_date: date,
        Start_time: startTime,
        End_time: endTime,
        Hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        Room: classroom || null
      };

      const { error } = await supabase
        .from('Class_schedules')
        .insert([scheduleData]);

      if (error) throw error;

      alert('บันทึกตารางเรียนสำเร็จ!');
      navigate('/schedule-management'); 
    } catch (error) {
      console.error('Error adding schedule:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (error.message || 'ตรวจสอบ Console'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-32 pb-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
          จัดตารางเรียน
        </h1>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2">คอร์สเรียน</label>
                <select 
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all"
                >
                  <option value="" disabled>เลือกคอร์สเรียน</option>
                  {coursesList.map(course => (
                    <option key={course.CourseID} value={course.CourseID}>
                      {course.Course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2">คุณครูผู้สอน</label>
                <select 
                  value={selectedCourseTeacherId}
                  onChange={(e) => setSelectedCourseTeacherId(e.target.value)}
                  className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all"
                  disabled={!selectedCourseId}
                >
                  <option value="" disabled>ชื่อคุณครู</option>
                  {teachersList.map(teacher => (
                    <option key={teacher.CoursesTeacherID} value={teacher.CoursesTeacherID}>
                      {teacher.Profile_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2">ห้องเรียน</label>
                <input 
                  type="text" 
                  placeholder="ระบุห้องเรียน"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all bg-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2">วันที่</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-[#a5b4fc] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all bg-white text-gray-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2">เวลา</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 border border-[#a5b4fc] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all bg-white text-gray-600"
                  />
                  <span className="text-gray-700 font-bold">ถึง</span>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 border border-[#a5b4fc] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all bg-white text-gray-600"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2">อัตราค่าสอนต่อชั่วโมง</label>
                <input 
                  type="number" 
                  placeholder="ระบุอัตราค่าสอน"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all bg-white"
                />
              </div>

            </div>

            {/* ส่วนคำอธิบายเพิ่มเติมและอัปโหลดไฟล์ คง UI ไว้ตามเดิม */}
            <div className="flex flex-col mt-6">
              <label className="text-sm font-bold text-gray-700 mb-2">คำอธิบายเพิ่มเติม (ไม่บังคับ)</label>
              <textarea 
                placeholder="คำอธิบายเพิ่มเติม"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-[#a5b4fc] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all resize-none bg-white"
              ></textarea>
            </div>

            <div className="flex flex-col mt-6">
              <label className="text-sm font-bold text-gray-700 mb-2">อัปโหลดเอกสาร (ไม่บังคับ)</label>
              <div className="border-2 border-dashed border-[#a5b4fc] rounded-xl bg-white flex flex-col items-center justify-center p-8 transition-colors hover:bg-gray-50">
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText size={48} className="text-[#799eff] mb-3" />
                    <p className="text-sm text-gray-600 mb-4 font-medium">{file.name}</p>
                    <button 
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1"
                    >
                      <X size={16} /> ลบไฟล์
                    </button>
                  </div>
                ) : (
                  <>
                    <FileText size={40} className="text-[#799eff] mb-4" />
                    <p className="text-[#799eff] font-medium mb-2">ลากไฟล์วางที่นี่</p>
                    <p className="text-[#799eff] font-medium mb-4">— หรือ —</p>
                    <label className="bg-[#799eff] hover:bg-blue-500 text-white px-8 py-2 rounded-lg cursor-pointer transition-colors text-sm font-bold shadow-sm">
                      ค้นหาไฟล์
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end items-center gap-4 mt-8 pt-6">
              <button 
                type="button"
                onClick={() => navigate('/schedule-management')}
                className="text-gray-600 hover:text-gray-800 font-bold px-6 py-2.5 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#799eff] text-white px-10 py-2.5 rounded-lg font-bold transition-colors shadow-sm ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-500'}`}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSchedule;