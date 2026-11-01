import React from 'react';
import { Presentation, Users, GraduationCap } from 'lucide-react';
// 1. นำเข้า useNavigate
import { useNavigate } from 'react-router-dom'; 

function RoleSelection() {
  const navigate = useNavigate(); // 2. เรียกใช้งาน

  const roles = [
    { id: 'teacher', title: 'คุณครู', icon: Presentation },
    { id: 'parent', title: 'ผู้ปกครอง', icon: Users },
    { id: 'student', title: 'นักเรียน', icon: GraduationCap },
  ];

  // 3. ฟังก์ชันจัดการเมื่อคลิกเลือก Role
  const handleRoleSelect = (roleId) => {
    if (roleId === 'student') {
      navigate('/StudentRegistration');
    } else if (roleId === 'teacher') {
      // navigate('/TeacherRegistration'); // สำหรับอนาคต
    } else if (roleId === 'parent') {
      // navigate('/ParentRegistration'); // สำหรับอนาคต
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] to-[#06b6d4] flex items-center justify-center p-4 pt-20">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl p-10 md:p-16 border border-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-800 tracking-wide">
          คุณคือใคร ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button 
                key={role.id}
                onClick={() => handleRoleSelect(role.id)} // 4. เพิ่ม onClick ตรงนี้
                className="flex flex-col items-center justify-center p-8 bg-white border-2 border-transparent hover:border-[#2FA084] hover:shadow-lg rounded-xl transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-black group-hover:text-[#2FA084] transition-colors duration-300 mb-6">
                  <Icon size={100} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#2FA084] transition-colors duration-300">
                  {role.title}
                </h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;