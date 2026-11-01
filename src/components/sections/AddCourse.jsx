import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { supabase } from '../../service/supabaseClient'; // 1. นำเข้า supabase client

function AddCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่ม State จัดการสถานะกำลังบันทึก
  
  const [formData, setFormData] = useState({
    courseName: '',
    category: '', // จะไม่ถูกส่งเข้า DB
    courseType: '',
    totalHours: '',
    price: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบว่ากรอกชื่อวิชาหรือยัง (บังคับกรอก)
    if (!formData.courseName) {
      alert('กรุณากรอกชื่อวิชา');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. ส่งข้อมูลบันทึกลงตาราง Courses
      const { error } = await supabase
        .from('Courses')
        .insert([
          {
            Course_name: formData.courseName,
            Course_type: formData.courseType || null,
            Totalhours: formData.totalHours ? parseInt(formData.totalHours) : null,
            Price: formData.price ? parseFloat(formData.price) : null,
            Description: formData.description || null,
            // หมายเหตุ: ละเว้น category และ image ไว้ตามที่คุณระบุ
          }
        ]);

      if (error) throw error;

      alert('เพิ่มคอร์สเรียนสำเร็จ!');
      navigate('/courses'); // บันทึกเสร็จให้เด้งกลับไปหน้าจัดการคอร์ส

    } catch (error) {
      console.error('Error inserting course:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full px-4 py-2.5 bg-white border border-[#a5c0ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] text-gray-700 placeholder-gray-400";
  const labelClassName = "block text-sm font-bold text-gray-800 mb-2";

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-32 pb-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-10 tracking-tight">
          เพิ่มคอร์สเรียน
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className={labelClassName}>ชื่อวิชา</label>
              <input
                type="text"
                name="courseName"
                placeholder="ชื่อวิชา"
                value={formData.courseName}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>หมวดหมู่วิชา</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClassName}
              >
                <option value="">เลือกประเภทหมวดหมู่</option>
                <option value="math">คณิตศาสตร์</option>
                <option value="science">วิทยาศาสตร์</option>
                <option value="language">ภาษา</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>ประเภทคอร์สเรียน</label>
              <select
                name="courseType"
                value={formData.courseType}
                onChange={handleChange}
                className={inputClassName}
              >
                <option value="">เลือกประเภทคอร์สเรียน</option>
                <option value="Private">แบบเดี่ยว</option>
                <option value="Group">แบบกลุ่ม</option>
                <option value="Both">แบบเดี่ยวและแบบกลุ่ม</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>ชั่วโมงเรียน</label>
              <input
                type="number"
                name="totalHours"
                placeholder="ระบุชั่วโมงเรียน"
                value={formData.totalHours}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>ราคา</label>
              <input
                type="number"
                name="price"
                placeholder="ระบุราคา (บาท)"
                value={formData.price}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label className={labelClassName}>คำอธิบายเพิ่มเติม</label>
            <textarea
              name="description"
              placeholder="คำอธิบายเพิ่มเติม"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClassName} resize-none`}
            />
          </div>

          <div>
            <label className={labelClassName}>อัปโหลดรูปภาพ</label>
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-10 pb-10 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center space-y-3">
                <FileText className="w-12 h-12 text-[#799eff]" />
                <p className="text-[#799eff] font-medium text-lg">ลากไฟล์วางที่นี่</p>
                <div className="flex items-center w-full max-w-xs my-2">
                  <div className="flex-grow border-t border-[#799eff]"></div>
                  <span className="px-4 text-[#799eff] font-medium text-lg">หรือ</span>
                  <div className="flex-grow border-t border-[#799eff]"></div>
                </div>
                <button
                  type="button"
                  className="bg-[#799eff] hover:bg-blue-500 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-sm"
                >
                  ค้นหาไฟล์
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 pt-6">
            <button
              type="button"
              onClick={() => navigate('/coursesmanagement')}
              className="text-gray-700 font-bold hover:text-gray-900 transition-colors"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#799eff] hover:bg-blue-500'} text-white px-10 py-2.5 rounded-md font-bold transition-colors shadow-sm`}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default AddCourse;