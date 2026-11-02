import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../service/supabaseClient';

function UserManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 1. ดึงข้อมูลผู้ใช้งานทั้งหมดจากตาราง Users[cite: 15]
        const { data: usersData, error: usersError } = await supabase
          .from('Users')
          .select('*')
          .order('Created_at', { ascending: false }); 

        if (usersError) throw usersError;

        // 2. ดึงข้อมูลชั้นปีจากตาราง Student ทั้งหมด[cite: 16]
        const { data: studentsData, error: studentsError } = await supabase
          .from('Student')
          .select('UserID, Grade_level');

        if (studentsError) throw studentsError;

        // 3. นำข้อมูลมาประกอบร่างกัน (Merge) โดยเช็คจาก UserID
        const mergedData = usersData.map(user => {
          const studentInfo = studentsData.find(s => s.UserID === user.UserID);
          return {
            ...user,
            Grade_level: studentInfo ? studentInfo.Grade_level : '-'
          };
        });

        setUsers(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('พบข้อผิดพลาดในการดึงข้อมูล: ' + (error.message || 'โปรดตรวจสอบ Console'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const translateRole = (role) => {
    if (role === 'Teacher') return 'คุณครู';
    if (role === 'Student') return 'นักเรียน';
    if (role === 'Parent') return 'ผู้ปกครอง';
    if (role === 'Admin') return 'ผู้ดูแลระบบ';
    return role || '-';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ' / ');
  };

  const tabs = [
    { id: 'all', label: 'ผู้ใช้งานทั้งหมด', roleValue: 'all' },
    { id: 'teacher', label: 'ครู', roleValue: 'Teacher' },
    { id: 'student', label: 'นักเรียน', roleValue: 'Student' },
    { id: 'parent', label: 'ผู้ปกครอง', roleValue: 'Parent' },
  ];

  const filteredUsers = users.filter(user => {
    const currentTabInfo = tabs.find(t => t.id === activeTab);
    if (currentTabInfo.roleValue === 'all') return true;
    return user.Role === currentTabInfo.roleValue;
  });

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-32 pb-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
          จัดการผู้ใช้งาน
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          
          <div className="w-full md:w-48 flex flex-col bg-transparent md:bg-white rounded-none md:rounded-lg overflow-hidden md:shadow-sm h-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-center font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#799eff] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[800px] text-center">
              <thead>
                <tr className="text-[#799eff] text-sm font-bold border-b border-[#799eff]">
                  <th className="pb-3 px-2 font-medium">รูป</th>
                  <th className="pb-3 px-2 font-medium">ชื่อ</th>
                  <th className="pb-3 px-2 font-medium">ตำแหน่ง</th>
                  <th className="pb-3 px-2 font-medium">ไลน์ไอดี</th>
                  <th className="pb-3 px-2 font-medium">วันที่เข้าใช้งาน</th>
                  <th className="pb-3 px-2 font-medium">ชั้นปี</th>
                  <th className="pb-3 px-2 font-medium">เบอร์โทร</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-gray-500">กำลังโหลดข้อมูล...</td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.UserID} className="text-gray-800 text-sm hover:bg-white/50 transition-colors">
                      <td className="py-3 px-2">
                        <img 
                          src={user.AvatarURL || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100&auto=format&fit=crop'} 
                          alt={user.Profile_name || 'User'} 
                          className="w-10 h-10 rounded-full mx-auto object-cover shadow-sm border border-gray-200"
                        />
                      </td>
                      <td className="py-3 px-2">{user.Profile_name || '-'}</td>
                      <td className="py-3 px-2">{translateRole(user.Role)}</td>
                      <td className="py-3 px-2">{user.LineID || '-'}</td>
                      <td className="py-3 px-2">{formatDate(user.Created_at)}</td>
                      <td className="py-3 px-2">{user.Grade_level}</td>
                      <td className="py-3 px-2">{user.Phone_number || '-'}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-3 text-gray-600">
                          <button className="hover:text-[#799eff] transition-colors p-1" title="แก้ไข">
                            <Edit size={18} />
                          </button>
                          <button className="hover:text-red-500 transition-colors p-1" title="ลบ">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-gray-400">
                      ไม่พบข้อมูลผู้ใช้งานในหมวดหมู่นี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserManagement;