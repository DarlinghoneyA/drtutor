import React from 'react';
import { User, Cake, Settings } from 'lucide-react';

function Profile() {
  return (
    // เว้นพื้นที่ด้านบน (pt-32) เผื่อสำหรับ Navbar ที่ลอยอยู่
    <div className="bg-[#F4F6FA] min-h-screen pt-32 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* ================= ส่วน Banner และรูปโปรไฟล์ ================= */}
        <div className="relative w-full h-48 md:h-64 bg-[#799eff] rounded-t-xl shadow-sm">
          
          {/* ไอคอนตั้งค่า (ฟันเฟือง) ด้านขวาล่างของ Banner */}
          <button className="absolute -bottom-12 right-2 text-[#799eff] hover:text-[#5a7ecc] transition-colors" title="ตั้งค่าโปรไฟล์">
            <Settings size={28} />
          </button>

          {/* รูปโปรไฟล์วงกลมตรงกลาง */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-32 h-32 bg-[#e0e7ff] rounded-full border-4 border-[#F4F6FA] flex items-center justify-center overflow-hidden shadow-sm">
            {/* ใช้ไอคอน User ขนาดใหญ่แทนรูปภาพ */}
            <User size={64} className="text-[#799eff]" />
          </div>
        </div>

        {/* ================= ส่วนชื่อและสถานะ ================= */}
        <div className="mt-20 text-center">
          <h1 className="text-2xl font-bold text-[#333]">น้องเอ</h1>
          
          <div className="flex justify-center items-center gap-6 mt-3 text-sm text-[#333] font-medium">
            <span className="flex items-center gap-2">
              <User size={18} className="text-orange-500" />
              นักเรียน
            </span>
            <span className="flex items-center gap-2">
              <Cake size={18} className="text-orange-500" />
              1 มกราคม 2543
            </span>
          </div>
        </div>

        {/* ================= ข้อมูลรายละเอียด ================= */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-[#333]">
          
          {/* คอลัมน์ที่ 1*/}
          <div>
            <h2 className="text-lg font-bold mb-4">ข้อมูลส่วนตัว</h2>
            <ul className="space-y-4 text-sm md:text-base">
              <li><span className="font-bold">ชื่อจริง :</span> นายสมชาย ใจดี</li>
              <li><span className="font-bold">ชั้นปี :</span> มัธยมศึกษาปีที่ 6</li>
              <li><span className="font-bold">อีเมล :</span> Thisisexample@email.com</li>
              <li><span className="font-bold">เข้าใช้งานวันแรก :</span> 1 มกราคม 2569</li>
            </ul>
          </div>

          {/* คอลัมน์ที่ 2:*/}
          <div className="md:pt-11">
            <ul className="space-y-4 text-sm md:text-base">
              <li><span className="font-bold">โรงเรียน :</span> โรงเรียนวิทยาคม</li>
              <li><span className="font-bold">สายการเรียน :</span> แผนวิทย์ - คณิต</li>
            </ul>
          </div>

          {/* คอลัมน์ที่ 3:*/}
          <div>
            <h2 className="text-lg font-bold mb-4">ผู้ปกครอง</h2>
            <ul className="space-y-4 text-sm md:text-base">
              <li><span className="font-bold">ชื่อ :</span> นายสมชาย ใจดี</li>
              <li><span className="font-bold">เบอร์โทรติดต่อ :</span> 012 -345 - 678</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;