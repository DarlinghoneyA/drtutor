import React, { useState } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';

function UserManagement() {
  // State สำหรับเก็บค่าว่าตอนนี้ผู้ใช้กำลังเลือก Tab ไหนอยู่
  const [activeTab, setActiveTab] = useState('all');

  // ข้อมูลเมนูแท็บด้านซ้าย
  const tabs = [
    { id: 'all', label: 'ผู้ใช้งานทั้งหมด' },
    { id: 'teacher', label: 'ครู' },
    { id: 'student', label: 'นักเรียน' },
    { id: 'parent', label: 'ผู้ปกครอง' },
  ];

  // ข้อมูลจำลอง (Mock Data) สำหรับแสดงผลในตาราง
  // ในอนาคตคุณจะต้องดึงข้อมูลส่วนนี้มาจาก Backend / Database
  const mockData = [
    { id: 1, name: 'น้องบี', role: 'นักเรียน', email: 'example@mail.com', date: '10 / 01 / 2025', grade: 'มัธยมศึกษาปีที่ 6', phone: '0853091237', avatar: 'https://cdn-icons-png.flaticon.com/512/147/147142.png' },
    { id: 2, name: 'ครูเอ', role: 'คุณครู', email: 'example@mail.com', date: '10 / 01 / 2025', grade: '-', phone: '0853091237', avatar: 'https://cdn-icons-png.flaticon.com/512/147/147142.png' },
  ];

  return (
    // พื้นหลังสีเทาอ่อนแบบในรูป และเว้นระยะด้านบน (pt-32) เผื่อ Navbar ที่ลอยอยู่
    <div className="min-h-screen bg-[#F4F6FA] pt-32 pb-10 px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-[#333]">จัดการผู้ใช้งาน</h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ส่วนเมนูด้านซ้าย (Sidebar Tabs) */}
          <div className="w-full md:w-56 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 text-center font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#799eff] text-white rounded-md'
                    : 'text-[#333] hover:bg-gray-200 rounded-md bg-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ส่วนตารางข้อมูล (Data Table) */}
          <div className="flex-1 overflow-x-auto">
            {/* ใส่ min-w-max เพื่อบังคับไม่ให้ตารางบีบตัวจนพังในจอขนาดเล็ก */}
            <table className="w-full min-w-[800px] text-center border-collapse">
              <thead>
                <tr className="text-[#799eff] text-sm border-b border-[#799eff]">
                  <th className="pb-4 px-2 font-semibold">รูป</th>
                  <th className="pb-4 px-2 font-semibold">ชื่อ</th>
                  <th className="pb-4 px-2 font-semibold">ตำแหน่ง</th>
                  <th className="pb-4 px-2 font-semibold">อีเมล</th>
                  <th className="pb-4 px-2 font-semibold">วันที่เข้าใช้งาน</th>
                  <th className="pb-4 px-2 font-semibold">ชั้นปี</th>
                  <th className="pb-4 px-2 font-semibold">เบอร์โทร</th>
                  <th className="pb-4 px-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-white transition-colors text-sm text-[#333]">
                    <td className="py-4 px-2">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-300" />
                    </td>
                    <td className="py-4 px-2 font-medium">{user.name}</td>
                    <td className="py-4 px-2">{user.role}</td>
                    <td className="py-4 px-2">{user.email}</td>
                    <td className="py-4 px-2">{user.date}</td>
                    <td className="py-4 px-2">{user.grade}</td>
                    <td className="py-4 px-2">{user.phone}</td>
                    <td className="py-4 px-2">
                      <div className="flex gap-4 justify-end">
                        <button className="text-gray-700 hover:text-blue-500 transition-colors" title="แก้ไข">
                          <SquarePen size={18} />
                        </button>
                        <button className="text-gray-700 hover:text-red-500 transition-colors" title="ลบ">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserManagement;