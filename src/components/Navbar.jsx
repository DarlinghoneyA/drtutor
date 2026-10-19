import React, { useState, useEffect } from 'react';
import drTutorLogo from "../assets/Drtutor-logo.png";
import { Link } from 'react-router-dom';
function Navbar() {
  // สร้าง State สำหรับตรวจสอบว่ามีการเลื่อนหน้าจอลงมาหรือยัง
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ถ้าเลื่อนลงมามากกว่า 0 พิกเซล ให้ตั้งค่าเป็น true
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // 1. ทำให้ Nav ลอยด้วย fixed top-0 left-0 w-full z-50
    // 2. ใช้ transition-all เพื่อให้ตอนเปลี่ยนสไตล์ดูลื่นไหล
    // 3. ถ้าเลื่อนจอ (isScrolled) จะเปลี่ยน padding ให้แถบดูเล็กลง
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'pt-2 px-4' : 'pt-6 px-4'}`}>
      
      {/* ส่วนของแถบแคปซูลด้านใน */}
      <div className={`mx-auto max-w-6xl flex justify-between items-center bg-[#f4f6fa] rounded-full shadow-md transition-all duration-300 ${isScrolled ? 'py-1.5 px-4 opacity-95' : 'py-2 px-6'}`}>
        
        {/* โลโก้ */}
        <div>
          <img src={drTutorLogo} alt="Dr. Tutor Logo" className="h-12 w-12 rounded-full object-cover" />
        </div>

        {/* เมนูตรงกลาง */}
        <ul className="hidden md:flex gap-8 m-0 p-0 list-none">
          <li><a href="#home" className="text-[#799eff] font-medium hover:text-[#5a7ecc] transition-colors">หน้าหลัก</a></li>
          <li><a href="#courses" className="text-[#799eff] font-medium hover:text-[#5a7ecc] transition-colors">คอร์สเรียน</a></li>
          <li><a href="#teachers" className="text-[#799eff] font-medium hover:text-[#5a7ecc] transition-colors">คุณครู</a></li>
          <li><a href="#students" className="text-[#799eff] font-medium hover:text-[#5a7ecc] transition-colors">นักเรียน</a></li>
          <li><a href="#contact" className="text-[#799eff] font-medium hover:text-[#5a7ecc] transition-colors">ติดต่อเรา</a></li>
        </ul>

        <div> {/* Login Button */}
          <Link 
            to="/login" 
            className="bg-[#2FA084] hover:bg-[#248169] text-white px-8 py-2.5 rounded-full font-bold transition-colors inline-block text-center"
          >
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;