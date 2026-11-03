import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileImage } from 'lucide-react';
import { supabase } from '../../service/supabaseClient';

function AddCourse() {
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState('');
  const [courseType, setCourseType] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // 1. ดึงข้อมูลครูทั้งหมดจากตาราง Teachers
        const { data: teachersData, error: teachersError } = await supabase
          .from('Teachers')
          .select('TeacherID, UserID');

        if (teachersError) throw teachersError;

        // 2. ดึงข้อมูลชื่อผู้ใช้จากตาราง Users
        const { data: usersData, error: usersError } = await supabase
          .from('Users')
          .select('UserID, Profile_name');

        if (usersError) throw usersError;

        // 3. จับคู่ข้อมูล (Merge) ด้วย UserID
        const mergedTeachers = teachersData.map(teacher => {
          const user = usersData.find(u => u.UserID === teacher.UserID);
          return {
            TeacherID: teacher.TeacherID,
            // สร้างโครงสร้าง Object ให้ตรงกับที่ UI เรียกใช้ (teacher.Users.Profile_name)
            Users: {
              Profile_name: user ? user.Profile_name : 'ไม่ระบุชื่อ'
            }
          };
        });

        setTeachers(mergedTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const toggleTeacher = (teacherId) => {
    setSelectedTeachers((prev) => {
      if (prev.includes(teacherId)) {
        return prev.filter((id) => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || !price) {
      alert('กรุณากรอกชื่อวิชาและราคาให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. เตรียมข้อมูลสำหรับบันทึกลงตาราง Courses
      const courseData = {
        Course_name: courseName,
        Course_type: courseType,
        Totalhours: totalHours ? parseInt(totalHours) : null,
        Price: price ? parseFloat(price) : 0,
        Description: description,
      };
      
      // บันทึกคอร์ส และดึงข้อมูลที่บันทึกสำเร็จกลับมาเพื่อเอา CourseID
      const { data: newCourse, error: courseError } = await supabase
        .from('Courses')
        .insert([courseData])
        .select()
        .single();

      if (courseError) throw courseError;

      const newCourseId = newCourse.CourseID; // ได้ CourseID มาแล้ว

      // 2. ถ้ามีการเลือกครูผู้สอน ให้บันทึกลงตาราง Courses_Teacher[cite: 20]
      if (selectedTeachers.length > 0) {
        // สร้าง Array ของ Object เพื่อเตรียม Insert หลายแถวพร้อมกัน
        const teacherInsertData = selectedTeachers.map((teacherId) => ({
          CourseID: newCourseId,
          TeacherID: teacherId
        }));

        const { error: teacherError } = await supabase
          .from('Courses_Teacher')
          .insert(teacherInsertData);

        if (teacherError) throw teacherError;
      }

      alert('เพิ่มคอร์สเรียนและบันทึกครูผู้สอนเรียบร้อยแล้ว!');
      navigate('/courses'); 
    } catch (error) {
      console.error('Error adding course:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (error.message || 'โปรดตรวจสอบ Console'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-32 pb-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
          เพิ่มคอร์สเรียน
        </h1>

        <div className="bg-transparent md:bg-white rounded-none md:rounded-xl md:shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">ชื่อวิชา</label>
                  <input 
                    type="text" 
                    placeholder="ชื่อวิชา"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">ประเภทคอร์สเรียน</label>
                  <select 
                    value={courseType}
                    onChange={(e) => setCourseType(e.target.value)}
                    className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all"
                  >
                    <option value="" disabled>เลือกประเภทคอร์สเรียน</option>
                    <option value="Private">แบบเดี่ยว</option>
                    <option value="Group">แบบกลุ่ม</option>
                    <option value="Both">แบบกลุ่มและแบบเดี่ยว</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">ราคา</label>
                  <input 
                    type="number" 
                    placeholder="ระบุราคา (บาท)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">หมวดหมู่วิชา</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all"
                  >
                    <option value="" disabled>เลือกประเภทหมวดหมู่</option>
                    <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                    <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                    <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">ชั่วโมงเรียน</label>
                  <input 
                    type="number" 
                    placeholder="ระบุชั่วโมงเรียน"
                    value={totalHours}
                    onChange={(e) => setTotalHours(e.target.value)}
                    className="border border-[#a5b4fc] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all"
                  />
                </div>

                <div className="relative flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">ครูผู้สอน</label>
                  
                  <div 
                    onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
                    className="w-full border border-[#a5b4fc] rounded-lg px-3 py-2 bg-white flex flex-wrap gap-2 items-center cursor-pointer min-h-[46px] transition-all focus-within:ring-2 focus-within:ring-[#799eff]"
                  >
                    {selectedTeachers.length === 0 && (
                      <span className="text-gray-400 text-sm px-1">ครูผู้สอน</span>
                    )}
                    
                    {selectedTeachers.map(id => {
                      const teacher = teachers.find(t => t.TeacherID === id);
                      return (
                        <span 
                          key={id} 
                          className="bg-[#e6f0ff] text-[#799eff] text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 border border-[#799eff]/20"
                        >
                          {teacher?.Users?.Profile_name || 'ไม่ทราบชื่อ'}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTeacher(id);
                            }}
                            className="hover:text-blue-800 ml-1 text-sm leading-none"
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  {isTeacherDropdownOpen && (
                    <div className="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {teachers.length > 0 ? (
                        teachers.map((teachers) => (
                          <div
                            key={teachers.TeacherID}
                            onClick={() => toggleTeacher(teachers.TeacherID)}
                            className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedTeachers.includes(teachers.TeacherID)}
                              readOnly
                              className="w-4 h-4 text-[#799eff] rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              {teachers.Users?.Profile_name || 'ไม่ทราบชื่อ'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          กำลังโหลดข้อมูลครู... หรือไม่พบข้อมูล
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex flex-col mt-6">
              <label className="text-sm font-bold text-gray-700 mb-2">คำอธิบายเพิ่มเติม</label>
              <textarea 
                placeholder="คำอธิบายเพิ่มเติม"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-[#a5b4fc] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#799eff] transition-all resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col mt-6">
              <label className="text-sm font-bold text-gray-700 mb-2">อัปโหลดรูปภาพ</label>
              <div className="border-2 border-dashed border-[#a5b4fc] rounded-xl bg-white flex flex-col items-center justify-center p-8 transition-colors hover:bg-gray-50">
                
                {imageFile ? (
                  <div className="flex flex-col items-center">
                    <FileImage size={48} className="text-[#799eff] mb-3" />
                    <p className="text-sm text-gray-600 mb-4 font-medium">{imageFile.name}</p>
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1"
                    >
                      <X size={16} /> ลบไฟล์
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={40} className="text-[#799eff] mb-4" />
                    <p className="text-[#799eff] font-medium mb-2">ลากไฟล์วางที่นี่</p>
                    <p className="text-[#799eff] font-medium mb-4">— หรือ —</p>
                    <label className="bg-[#799eff] hover:bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors text-sm font-bold">
                      ค้นหาไฟล์
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                )}
                
              </div>
            </div>

            <div className="flex justify-end items-center gap-4 mt-10 border-t border-gray-100 pt-6">
              <button 
                type="button"
                onClick={() => navigate('/courses')}
                className="text-gray-600 hover:text-gray-800 font-bold px-6 py-2.5 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#799eff] text-white px-8 py-2.5 rounded-lg font-bold transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-500'}`}
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

export default AddCourse;