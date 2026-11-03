import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Users, CreditCard, Calendar } from 'lucide-react';
import { supabase } from '../../service/supabaseClient';
import { apiFetch } from '../../service/api';

const COURSE_TYPE_LABEL = {
  Private: 'แบบเดี่ยว',
  Group: 'แบบกลุ่ม',
  Both: 'แบบเดี่ยวและแบบกลุ่ม',
};

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [learningFormat, setLearningFormat] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [installmentMonths, setInstallmentMonths] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const data = await apiFetch(`/courses/${id}`);
        setCourse(data);
        // ถ้าคอร์สเปิดสอนแบบเดียว เลือกให้อัตโนมัติ
        if (data.courseType === 'Private') setLearningFormat('single');
        if (data.courseType === 'Group') setLearningFormat('group');
      } catch (error) {
        console.error('Error fetching course details:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourseDetail();
  }, [id]);

  // รูปแบบการเรียนที่คอร์สนี้เปิดให้เลือก
  const allowSingle = course?.courseType !== 'Group';
  const allowGroup = course?.courseType !== 'Private';

  // ⚠️ ตอนนี้ยังเขียนลง DB ตรง จะย้ายไปใช้ backend ในตอนที่ 4 ของโมดูล course
  const handleEnroll = async () => {
    if (!learningFormat || !paymentMethod) {
      alert('กรุณาเลือกรูปแบบการเรียนและวิธีการชำระเงินให้ครบถ้วน');
      return;
    }
    if (paymentMethod === 'installment' && !installmentMonths) {
      alert('กรุณาเลือกระยะเวลาผ่อนชำระ (3 หรือ 6 เดือน)');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('กรุณาเข้าสู่ระบบก่อนลงทะเบียนเรียน');

      const { data: studentData, error: studentError } = await supabase
        .from('Student')
        .select('StudentID')
        .eq('UserID', user.id)
        .single();
      if (studentError || !studentData) throw new Error('ไม่พบข้อมูลนักเรียนของคุณในระบบ');

      const { data: existingEnrollment, error: checkError } = await supabase
        .from('Enrollments')
        .select('EnrollmentID')
        .eq('StudentID', studentData.StudentID)
        .eq('CourseID', id)
        .maybeSingle();
      if (checkError) throw checkError;
      if (existingEnrollment) {
        alert('คุณได้ลงทะเบียนคอร์สเรียนนี้ไปแล้ว ไม่สามารถสมัครซ้ำได้');
        return;
      }

      const { data: enrollmentData, error: enrollError } = await supabase
        .from('Enrollments')
        .insert([{
          StudentID: studentData.StudentID,
          CourseID: id,
          EnrollDate: new Date().toISOString(),
          Payment_type: paymentMethod === 'full' ? 'Full' : 'Installment',
          Status: 'Active',
        }])
        .select()
        .single();
      if (enrollError) throw enrollError;

      const totalMonths = paymentMethod === 'full' ? 1 : installmentMonths;
      const amountPerMonth = (course.price || 0) / totalMonths;
      const schedules = [];
      for (let i = 1; i <= totalMonths; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + (i - 1));
        schedules.push({
          EnrollmentID: enrollmentData.EnrollmentID,
          Installment_number: i,
          Amount_due: amountPerMonth,
          Due_date: dueDate.toISOString(),
          Status: 'Pending',
          Created_at: new Date().toISOString(),
        });
      }

      const { error: scheduleError } = await supabase.from('Payment_schedules').insert(schedules);
      if (scheduleError) throw scheduleError;

      alert('ลงทะเบียนเรียนสำเร็จ!');
      navigate('/');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] pt-32 flex justify-center items-start">
        <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] pt-32 flex justify-center items-start">
        <p className="text-red-500 text-lg">ไม่พบข้อมูลคอร์สเรียนนี้</p>
      </div>
    );
  }

  const optionClass = (selected) =>
    `flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
      selected ? 'border-[#f97316] bg-orange-50 text-[#f97316]' : 'border-gray-200 text-gray-400 hover:border-orange-200'
    }`;

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-28 pb-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">รายละเอียดคอร์สเรียน</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ฝั่งซ้าย: ข้อมูลคอร์ส */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {course.courseName}
              </h2>
              {course.teachers?.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 mt-3 text-[#799eff] text-sm font-medium">
                  {course.teachers.map((t) => (
                    <div key={t.teacherId} className="flex items-center gap-1">
                      <User size={16} /> {t.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full h-[300px] md:h-[400px] bg-gray-200 rounded-xl overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop"
                alt={course.courseName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-gray-800 space-y-2 mb-4 font-bold">
                <p>ประเภทคอร์สเรียน : {COURSE_TYPE_LABEL[course.courseType] ?? 'แบบเดี่ยวและแบบกลุ่ม'}</p>
                <p>จำนวนชั่วโมงเรียน : {course.totalHours ? `${course.totalHours} ชั่วโมง` : 'ไม่ได้ระบุ'}</p>
              </div>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {course.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: ลงทะเบียน */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm sticky top-28">
              <div className="mb-6">
                <h3 className="text-center font-bold text-gray-800 mb-4 text-lg">เลือกรูปแบบการเรียน</h3>
                <div className={`grid ${allowSingle && allowGroup ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                  {allowSingle && (
                    <button onClick={() => setLearningFormat('single')} className={optionClass(learningFormat === 'single')}>
                      <User size={28} className="mb-1" />
                      <span className="text-sm font-medium">แบบเดี่ยว</span>
                    </button>
                  )}
                  {allowGroup && (
                    <button onClick={() => setLearningFormat('group')} className={optionClass(learningFormat === 'group')}>
                      <Users size={28} className="mb-1" />
                      <span className="text-sm font-medium">แบบกลุ่ม</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-center font-bold text-gray-800 mb-4 text-lg">เลือกวิธีการชำระเงิน</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setPaymentMethod('full');
                      setInstallmentMonths(null);
                    }}
                    className={optionClass(paymentMethod === 'full')}
                  >
                    <CreditCard size={28} className="mb-1" />
                    <span className="text-sm font-medium">ชำระเต็มจำนวน</span>
                  </button>
                  <button onClick={() => setPaymentMethod('installment')} className={optionClass(paymentMethod === 'installment')}>
                    <Calendar size={28} className="mb-1" />
                    <span className="text-sm font-medium text-center leading-tight mt-1">แบ่งชำระ<br />รายเดือน</span>
                  </button>
                </div>

                {paymentMethod === 'installment' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-center text-sm font-bold text-gray-600 mb-3">เลือกระยะเวลาผ่อนชำระ</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[3, 6].map((months) => (
                        <button
                          key={months}
                          onClick={() => setInstallmentMonths(months)}
                          className={`py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                            installmentMonths === months
                              ? 'border-[#f97316] bg-orange-50 text-[#f97316]'
                              : 'border-gray-200 text-gray-500 hover:border-orange-200'
                          }`}
                        >
                          {months} เดือน
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center mt-8">
                <div className="text-3xl font-bold text-[#f97316] mb-4">
                  {(course.price ?? 0).toLocaleString()} บาท
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={isSubmitting}
                  className={`w-full text-white py-3 rounded-lg font-bold text-lg transition-colors shadow-sm ${
                    isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#799eff] hover:bg-blue-500'
                  }`}
                >
                  {isSubmitting ? 'กำลังดำเนินการ...' : 'ลงทะเบียนเรียน'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;