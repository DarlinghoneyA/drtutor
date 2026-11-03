import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../service/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';
import drTutorLogo from '../assets/Drtutor-logo.png';

function Navbar() {
  const { session, me } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ชุดเมนูเริ่มต้น
  const defaultMenu = [
    { name: 'คอร์สเรียน', path: '/courses' },
    { name: 'คุณครู', path: '/teachers' },
    { name: 'นักเรียน', path: '/students' },
    { name: 'ติดต่อเรา', path: '/contact' },
  ];

  // ชุดเมนูสำหรับนักเรียน
  const studentMenu = [
    { name: 'คอร์สเรียน', path: '/courses' },
    { name: 'ตารางเรียน', path: '/schedule' },
    { name: 'แบบฝึกหัด', path: '/exercises' },
    { name: 'สถิติ', path: '/stats' },
    { name: 'ติดต่อเรา', path: '/contact' },
  ];

  const adminMenu = [
    { name: 'คอร์สเรียน', path: '' },
    { name: 'จัดตารางเรียน', path: '' },
    { name: 'จัดการบัญชี', path: '' },
    { name: 'จัดการผู้ใช้งาน', path: '/usermangement' },
    { name: 'สถิติ', path: '' },
  ];

  const currentMenu = me?.role === 'Admin' ? adminMenu
                    : me?.role === 'Student' ? studentMenu
                    : defaultMenu;

  return (
    // คืนค่าโครงสร้าง Navbar แบบเดิมของคุณ
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'pt-2 px-4' : 'pt-6 px-4'}`}>
      
      {/* ส่วนของแถบแคปซูลด้านใน */}
      <div className={`mx-auto max-w-6xl flex justify-between items-center bg-[#f4f6fa] rounded-full shadow-md transition-all duration-300 ${isScrolled ? 'py-1.5 px-4 opacity-95' : 'py-2 px-6'}`}>
        
        {/* โลโก้ */}
        <div className="flex items-center">
          <Link to="/">
            <img src={drTutorLogo} alt="Dr.Tutor Logo" className="h-10" /> 
          </Link>
        </div>

        {/* เมนูตรงกลาง */}
        <div className="hidden md:flex gap-6 items-center text-[#799eff] font-medium">
          {currentMenu.map((item, index) => (
            <Link key={index} to={item.path} className="hover:text-blue-700 transition-colors">
              {item.name}
            </Link>
          ))}
        </div>

        {/* ส่วนขวา: ล็อกอิน หรือ โปรไฟล์ */}
        <div>
          {session && me ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-800 font-bold">
                <UserCircle className="text-[#60a5fa] w-9 h-9 stroke-[1.5]" />
                <span>{me.profileName || 'ผู้ใช้'}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="ออกจากระบบ"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#2FA084] hover:bg-[#248169] text-white px-8 py-2.5 rounded-full font-bold transition-colors inline-block"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;