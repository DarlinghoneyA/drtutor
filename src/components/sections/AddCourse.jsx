import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, User, X } from 'lucide-react';
import { apiFetch } from '../../service/api';

const EMPTY_FORM = {
  courseName: '',
  category: '', // ยังไม่มีคอลัมน์ใน DB จึงไม่ได้ส่งไปบันทึก
  courseType: '',
  totalHours: '',
  price: '',
  maxStudents: '',
  description: '',
  isActive: true,
};

function AddCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(isEdit);

  const [courseTeachers, setCourseTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  // โหมดแก้ไข: ดึงข้อมูลคอร์สมาใส่ฟอร์ม / โหมดสร้าง: ล้างฟอร์ม
  useEffect(() => {
    if (!isEdit) {
      setFormData(EMPTY_FORM);
      setCourseTeachers([]);
      return;
    }
    const loadCourse = async () => {
      try {
        const c = await apiFetch(`/admin/courses/${id}`);
        setFormData({
          courseName: c.courseName ?? '',
          category: '',
          courseType: c.courseType ?? '',
          totalHours: c.totalHours ?? '',
          price: c.price ?? '',
          maxStudents: c.maxStudents ?? '',
          description: c.description ?? '',
          isActive: c.isActive,
        });
        setCourseTeachers(c.teachers ?? []);
      } catch (err) {
        alert('ไม่พบคอร์สนี้: ' + err.message);
        navigate('/coursesmanagement');
      } finally {
        setLoadingCourse(false);
      }
    };
    loadCourse();
  }, [id, isEdit, navigate]);

  // โหลดรายชื่อครูที่อนุมัติแล้วไว้ทำ dropdown (ทั้งสองโหมด)
  useEffect(() => {
    apiFetch('/admin/teachers')
      .then(setAllTeachers)
      .catch((err) => console.error('โหลดรายชื่อครูไม่สำเร็จ:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = {
      courseName: formData.courseName,
      courseType: formData.courseType,
      totalHours: formData.totalHours,
      price: formData.price,
      maxStudents: formData.maxStudents,
      description: formData.description,
      isActive: formData.isActive,
    };
    // โหมดสร้าง: ส่งครูที่เลือกไว้ไปพร้อมกัน
    if (!isEdit) {
      body.teacherIds = courseTeachers.map((t) => t.teacherId);
    }

    try {
      await apiFetch(isEdit ? `/admin/courses/${id}` : '/admin/courses', {
        method: isEdit ? 'PATCH' : 'POST',
        body,
      });
      alert(isEdit ? 'บันทึกการแก้ไขสำเร็จ!' : 'เพิ่มคอร์สเรียนสำเร็จ!');
      navigate('/coursesmanagement');
    } catch (err) {
      const details = err.details?.map((d) => `• ${d.message}`).join('\n');
      alert(details || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- จัดการครูผู้สอน ----
  const handleAddTeacher = async () => {
    if (!selectedTeacherId) return;

    // โหมดสร้าง: เก็บไว้ในหน้าเว็บก่อน
    if (!isEdit) {
      const teacher = allTeachers.find((t) => t.teacherId === selectedTeacherId);
      if (teacher) setCourseTeachers((prev) => [...prev, teacher]);
      setSelectedTeacherId('');
      return;
    }

    // โหมดแก้ไข: บันทึกทันที
    try {
      const updated = await apiFetch(`/admin/courses/${id}/teachers`, {
        method: 'POST',
        body: { teacherId: selectedTeacherId },
      });
      setCourseTeachers(updated.teachers);
      setSelectedTeacherId('');
    } catch (err) {
      alert('เพิ่มครูไม่สำเร็จ: ' + err.message);
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    // โหมดสร้าง: เอาออกจากรายการในหน้าเว็บ
    if (!isEdit) {
      setCourseTeachers((prev) => prev.filter((t) => t.teacherId !== teacherId));
      return;
    }

    // โหมดแก้ไข: ลบทันที
    if (!window.confirm('เอาครูคนนี้ออกจากคอร์สใช่ไหม?')) return;
    try {
      const updated = await apiFetch(`/admin/courses/${id}/teachers/${teacherId}`, { method: 'DELETE' });
      setCourseTeachers(updated.teachers);
    } catch (err) {
      alert('เอาครูออกไม่สำเร็จ: ' + err.message);
    }
  };

  // ครูที่ยังไม่ได้อยู่ในคอร์สนี้ (ไว้ใส่ใน dropdown)
  const availableTeachers = allTeachers.filter(
    (t) => !courseTeachers.some((ct) => ct.teacherId === t.teacherId),
  );

  const inputClassName =
    'w-full px-4 py-2.5 bg-white border border-[#a5c0ff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] text-gray-700 placeholder-gray-400';
  const labelClassName = 'block text-sm font-bold text-gray-800 mb-2';

  if (loadingCourse) {
    return <div className="min-h-screen pt-32 text-center text-gray-500">กำลังโหลดข้อมูลคอร์ส...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-32 pb-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-10 tracking-tight">
          {isEdit ? 'แก้ไขคอร์สเรียน' : 'เพิ่มคอร์สเรียน'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className={labelClassName}>ชื่อวิชา</label>
              <input type="text" name="courseName" placeholder="ชื่อวิชา" value={formData.courseName} onChange={handleChange} className={inputClassName} required />
            </div>

            <div>
              <label className={labelClassName}>หมวดหมู่วิชา</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputClassName}>
                <option value="">เลือกประเภทหมวดหมู่</option>
                <option value="math">คณิตศาสตร์</option>
                <option value="science">วิทยาศาสตร์</option>
                <option value="language">ภาษา</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>ประเภทคอร์สเรียน</label>
              <select name="courseType" value={formData.courseType} onChange={handleChange} className={inputClassName}>
                <option value="">เลือกประเภทคอร์สเรียน</option>
                <option value="Private">แบบเดี่ยว</option>
                <option value="Group">แบบกลุ่ม</option>
                <option value="Both">แบบเดี่ยวและแบบกลุ่ม</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>ชั่วโมงเรียน</label>
              <input type="number" name="totalHours" placeholder="ระบุชั่วโมงเรียน" value={formData.totalHours} onChange={handleChange} className={inputClassName} />
            </div>

            <div>
              <label className={labelClassName}>ราคา</label>
              <input type="number" name="price" placeholder="ระบุราคา (บาท)" value={formData.price} onChange={handleChange} className={inputClassName} />
            </div>

            <div>
              <label className={labelClassName}>จำนวนนักเรียนสูงสุด</label>
              <input type="number" name="maxStudents" placeholder="เช่น 1 สำหรับเรียนเดี่ยว" value={formData.maxStudents} onChange={handleChange} className={inputClassName} />
            </div>
          </div>

          <div>
            <label className={labelClassName}>คำอธิบายเพิ่มเติม</label>
            <textarea name="description" placeholder="คำอธิบายเพิ่มเติม" rows="5" value={formData.description} onChange={handleChange} className={`${inputClassName} resize-none`} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-[#2FA084]" />
            <span className="font-bold text-gray-800">เปิดรับสมัคร</span>
            <span className="text-sm text-gray-500">(ถ้าปิด นักเรียนจะไม่เห็นคอร์สนี้)</span>
          </label>

          {/* ครูผู้สอน */}
          <div className="bg-white border border-[#a5c0ff] rounded-md p-5">
            <label className={labelClassName}>ครูผู้สอน</label>
            <p className="text-xs text-gray-400 mb-3">
              {isEdit ? 'เพิ่มหรือลบครูจะบันทึกทันที' : 'ครูที่เลือกจะถูกบันทึกพร้อมกับคอร์สตอนกดยืนยัน'}
            </p>

            {courseTeachers.length === 0 ? (
              <p className="text-sm text-gray-400 mb-4">ยังไม่มีครูในคอร์สนี้</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-4">
                {courseTeachers.map((t) => (
                  <span key={t.teacherId} className="flex items-center gap-1.5 bg-[#eef3ff] text-[#4a6fd1] px-3 py-1.5 rounded-full text-sm font-medium">
                    <User size={14} /> {t.name}
                    <button type="button" onClick={() => handleRemoveTeacher(t.teacherId)} className="hover:text-red-500" title="เอาออก">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} className={inputClassName}>
                <option value="">เลือกครูที่จะเพิ่ม</option>
                {availableTeachers.map((t) => (
                  <option key={t.teacherId} value={t.teacherId}>
                    {t.name}{t.fullName && t.fullName !== t.name ? ` (${t.fullName})` : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddTeacher}
                disabled={!selectedTeacherId}
                className="bg-[#2FA084] hover:bg-[#248169] disabled:bg-gray-300 text-white px-5 rounded-md font-bold whitespace-nowrap"
              >
                เพิ่มครู
              </button>
            </div>
          </div>

          <div>
            <label className={labelClassName}>อัปโหลดรูปภาพ</label>
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-10 pb-10 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <div className="flex flex-col items-center space-y-3">
                <FileText className="w-12 h-12 text-[#799eff]" />
                <p className="text-[#799eff] font-medium text-lg">ลากไฟล์วางที่นี่</p>
                <div className="flex items-center w-full max-w-xs my-2">
                  <div className="flex-grow border-t border-[#799eff]"></div>
                  <span className="px-4 text-[#799eff] font-medium text-lg">หรือ</span>
                  <div className="flex-grow border-t border-[#799eff]"></div>
                </div>
                <button type="button" className="bg-[#799eff] text-white px-6 py-2 rounded-md font-medium shadow-sm opacity-60 cursor-not-allowed" disabled title="ยังไม่เปิดใช้งาน">
                  ค้นหาไฟล์
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 pt-6">
            <button type="button" onClick={() => navigate('/coursesmanagement')} className="text-gray-700 font-bold hover:text-gray-900 transition-colors" disabled={isSubmitting}>
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#799eff] hover:bg-blue-500'} text-white px-10 py-2.5 rounded-md font-bold transition-colors shadow-sm`}
            >
              {isSubmitting ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'ยืนยัน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;