import React from 'react';
import { Presentation, Users, GraduationCap } from 'lucide-react';

function RoleSelection() {
  // ฟังก์ชันจำลองเมื่อผู้ใช้คลิกเลือกบทบาท
  const handleRoleSelect = (role) => {
    console.log("Selected role:", role);
    // ในอนาคตคุณสามารถใช้ฟังก์ชันนี้เพื่ออัปเดตข้อมูลผู้ใช้ใน Database หรือเปลี่ยนหน้าต่อไป
  };

  return (
    // พื้นหลังไล่สีและจัดให้อยู่ตรงกลางหน้าจอ
    <div 
      className="min-h-screen w-full flex justify-center items-center pt-24 pb-8 px-4"
      style={{ background: 'linear-gradient(180deg, #5b86e5 0%, #36d1dc 100%)' }}
    >
      {/* กล่องสีขาวสำหรับแสดงตัวเลือก */}
      <div className="bg-white p-10 md:p-16 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-4xl text-center">
        
        <h2 className="text-3xl md:text-4xl font-bold text-[#333] mb-12">
          คุณคือใคร ?
        </h2>

        {/* โครงสร้าง Grid แบ่งเป็น 3 คอลัมน์ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* การ์ด: คุณครู */}
          {/* ใช้คลาส group เพื่อให้เมื่อ hover ที่ปุ่ม จะส่งผลต่อองค์ประกอบด้านในพร้อมกัน */}
          <button 
            onClick={() => handleRoleSelect('teacher')}
            className="group flex flex-col items-center justify-center p-12 border border-gray-400 rounded-lg transition-colors duration-300 hover:bg-[#799eff] hover:border-[#799eff]"
          >
            <Presentation size={80} className="text-[#333] group-hover:text-white transition-colors duration-300 mb-6" />
            <span className="text-xl font-bold text-[#333] group-hover:text-white transition-colors duration-300">
              คุณครู
            </span>
          </button>

          {/* การ์ด: ผู้ปกครอง */}
          <button 
            onClick={() => handleRoleSelect('parent')}
            className="group flex flex-col items-center justify-center p-12 border border-gray-400 rounded-lg transition-colors duration-300 hover:bg-[#799eff] hover:border-[#799eff]"
          >
            <Users size={80} className="text-[#333] group-hover:text-white transition-colors duration-300 mb-6" />
            <span className="text-xl font-bold text-[#333] group-hover:text-white transition-colors duration-300">
              ผู้ปกครอง
            </span>
          </button>

          {/* การ์ด: นักเรียน */}
          <button 
            onClick={() => handleRoleSelect('student')}
            className="group flex flex-col items-center justify-center p-12 border border-gray-400 rounded-lg transition-colors duration-300 hover:bg-[#799eff] hover:border-[#799eff]"
          >
            <GraduationCap size={80} className="text-[#333] group-hover:text-white transition-colors duration-300 mb-6" />
            <span className="text-xl font-bold text-[#333] group-hover:text-white transition-colors duration-300">
              นักเรียน
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}

export default RoleSelection;