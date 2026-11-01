import React, { useState } from 'react';
import { Pencil, ArrowRight, ArrowLeft, CheckCircle, User } from 'lucide-react';
import { supabase } from '../../service/supabaseClient'; 
import { useNavigate } from 'react-router-dom';

// ==========================================
// CHILD COMPONENT: ขั้นตอนที่ 1 ข้อมูลส่วนตัว
// ==========================================
const Step1PersonalInfo = ({ nextStep, formData, handleChange }) => {
  return (
    <div className="mt-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center text-gray-400">
            <User size={48} strokeWidth={1.5} />
          </div>
          <button type="button" className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
            <Pencil size={16} className="text-gray-700" />
          </button>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-gray-800 font-bold mb-2">ชื่อโปรไฟล์</label>
          <input type="text" name="profileName" value={formData.profileName} onChange={handleChange} placeholder="ระบุชื่อโปรไฟล์" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-800 font-bold mb-2">ชื่อจริง</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="ชื่อจริง" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">นามสกุล</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="นามสกุล" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">ชื่อเล่น</label>
          <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="ชื่อเล่น" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">เบอร์โทรศัพท์</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="เบอร์โทรศัพท์" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">ไอดีไลน์</label>
          <input type="text" name="lineId" value={formData.lineId} onChange={handleChange} placeholder="ไอดีไลน์" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">วันเกิด</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] text-gray-700" />
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button onClick={nextStep} className="bg-[#2FA084] hover:bg-[#248169] text-white px-8 py-2.5 rounded-md transition-colors flex items-center gap-2 shadow-sm">
          ข้อถัดไป <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// CHILD COMPONENT: ขั้นตอนที่ 2 ที่อยู่
// ==========================================
const Step2Address = ({ nextStep, prevStep, formData, handleChange }) => {
  return (
    <div className="mt-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-gray-800 font-bold mb-2">ที่อยู่ ( บ้านเลขที่ , ซอย , หมู่ , ถนน )</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="ที่อยู่" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">จังหวัด</label>
          <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="จังหวัด" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">เขต / อำเภอ</label>
          <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="เขต / อำเภอ" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">ตำบล</label>
          <input type="text" name="subDistrict" value={formData.subDistrict} onChange={handleChange} placeholder="ตำบล" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">รหัสไปรษณีย์</label>
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="รหัสไปรษณีย์" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={prevStep} className="text-gray-500 hover:text-gray-800 px-4 py-2.5 transition-colors flex items-center gap-2">
          <ArrowLeft size={18} /> ย้อนกลับ
        </button>
        <button onClick={nextStep} className="bg-[#2FA084] hover:bg-[#248169] text-white px-8 py-2.5 rounded-md transition-colors flex items-center gap-2 shadow-sm">
          ถัดไป <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// CHILD COMPONENT: ขั้นตอนที่ 3 ข้อมูลโรงเรียน
// ==========================================
const Step3School = ({ prevStep, submitForm, formData, handleChange, loading }) => {
  return (
    <div className="mt-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-800 font-bold mb-2">โรงเรียน</label>
          <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="ระบุชื่อโรงเรียน" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-gray-800 font-bold mb-2">ระดับชั้นเรียน</label>
          <input type="text" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} placeholder="เลือกระดับชั้นเรียน" className="w-full px-4 py-2.5 border border-indigo-100 bg-[#f9faff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#799eff] placeholder-gray-300" />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={prevStep} disabled={loading} className="text-gray-500 hover:text-gray-800 px-4 py-2.5 transition-colors flex items-center gap-2">
          <ArrowLeft size={18} /> ย้อนกลับ
        </button>
        <button onClick={submitForm} disabled={loading} className={`px-8 py-2.5 rounded-md transition-colors flex items-center gap-2 shadow-sm ${loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#2FA084] hover:bg-[#248169] text-white'}`}>
          {loading ? 'กำลังบันทึก...' : 'เสร็จสิ้น'} <CheckCircle size={18} />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// PARENT COMPONENT: จัดการสถานะและการแสดงผลรวม
// ==========================================
function StudentRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    profileName: '',
    firstName: '',
    lastName: '',
    nickname: '',
    phone: '',
    lineId: '',
    birthDate: '',
    address: '',
    province: '',
    district: '',
    subDistrict: '',
    postalCode: '',
    school: '',
    gradeLevel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitForm = async () => {
    try {
      setLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert("ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินใหม่");
        return;
      }
      const currentUserId = user.id;

      const { error: userError } = await supabase
        .from('Users')
        .upsert({
          UserID: currentUserId, // ต้องแนบ Primary Key ไปด้วยเพื่อให้ upsert ทำงานถูกต้อง
          Profile_name: formData.profileName,
          Fullname: `${formData.firstName} ${formData.lastName}`.trim(),
          Phone_number: formData.phone,
          LineID: formData.lineId,
          Role: 'Student'
        });

      if (userError) throw userError;

      const { error: studentError } = await supabase
        .from('Student')
        .insert([{
          UserID: currentUserId,
          Nickname: formData.nickname,
          School_name: formData.school,
          Grade_level: formData.gradeLevel,
          Birth_date: formData.birthDate || null
        }]);

      if (studentError) throw studentError;

      alert("ส่งข้อมูลสมัครสมาชิกเรียบร้อยแล้ว!");
      navigate('/'); 

    } catch (error) {
      console.error("Error saving data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  

  const steps = [
    { id: 1, title: 'ข้อมูลส่วนตัว' },
    { id: 2, title: 'ที่อยู่' },
    { id: 3, title: 'ข้อมูลโรงเรียน' }
  ];
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] to-[#06b6d4] flex flex-col items-center p-4 pt-24 pb-12 font-sans">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          สมัครบัญชีสำหรับนักเรียน
        </h2>

        <div className="flex items-center justify-center mb-12 relative w-full max-w-md mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  currentStep >= step.id ? 'bg-[#799eff] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.id}
                </div>
                <span className={`text-sm mt-2 absolute translate-y-8 whitespace-nowrap ${
                  currentStep >= step.id ? 'text-[#799eff] font-bold' : 'text-gray-400 font-medium'
                }`}>
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className={`flex-1 h-[2px] -mt-6 mx-2 transition-colors duration-300 ${
                  currentStep > step.id ? 'bg-[#799eff]' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-12">
          {currentStep === 1 && (
            <Step1PersonalInfo nextStep={nextStep} formData={formData} handleChange={handleChange} />
          )}
          {currentStep === 2 && (
            <Step2Address nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} />
          )}
          {currentStep === 3 && (
            <Step3School prevStep={prevStep} submitForm={submitForm} formData={formData} handleChange={handleChange} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;