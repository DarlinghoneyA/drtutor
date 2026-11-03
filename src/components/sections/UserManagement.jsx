import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { apiFetch } from '../../service/api';

const tabs = [
  { id: 'all', label: 'ผู้ใช้งานทั้งหมด', roleValue: null },
  { id: 'teacher', label: 'ครู', roleValue: 'Teacher' },
  { id: 'student', label: 'นักเรียน', roleValue: 'Student' },
  { id: 'parent', label: 'ผู้ปกครอง', roleValue: 'Parent' },
  { id: 'pending', label: 'ครูรออนุมัติ', roleValue: null },
];

const translateRole = (role) => {
  if (role === 'Teacher') return 'คุณครู';
  if (role === 'Student') return 'นักเรียน';
  if (role === 'Parent') return 'ผู้ปกครอง';
  if (role === 'Admin') return 'ผู้ดูแลระบบ';
  return 'ยังไม่มีบทบาท';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString)
    .toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, ' / ');
};

function UserManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isPendingTab = activeTab === 'pending';

  // โหลดข้อมูลใหม่ทุกครั้งที่เปลี่ยนแท็บ
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        setUsers(await apiFetch('/admin/teachers/pending'));
      } else {
        const tab = tabs.find((t) => t.id === activeTab);
        const params = new URLSearchParams({ pageSize: '100' });
        if (tab.roleValue) params.set('role', tab.roleValue);
        const result = await apiFetch(`/admin/users?${params}`);
        setUsers(result.items);
      }
    } catch (err) {
      alert('ดึงข้อมูลไม่สำเร็จ: ' + err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // อนุมัติ / ปฏิเสธครู
  const handleDecision = async (user, action) => {
    const label = action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ';
    if (!window.confirm(`${label} "${user.fullName || user.email}" เป็นครูใช่ไหม?`)) return;

    try {
      await apiFetch(`/admin/teachers/${user.id}/${action}`, { method: 'POST' });
      await loadUsers();
    } catch (err) {
      alert(`${label}ไม่สำเร็จ: ` + err.message);
    }
  };

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
                  activeTab === tab.id ? 'bg-[#799eff] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                  <th className="pb-3 px-2 font-medium">อีเมล</th>
                  <th className="pb-3 px-2 font-medium">วันที่เข้าใช้งาน</th>
                  <th className="pb-3 px-2 font-medium">{isPendingTab ? 'ที่ทำงาน' : 'ชั้นปี'}</th>
                  <th className="pb-3 px-2 font-medium">เบอร์โทร</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-gray-500">กำลังโหลดข้อมูล...</td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="text-gray-800 text-sm hover:bg-white/50 transition-colors">
                      <td className="py-3 px-2">
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100&auto=format&fit=crop'}
                          alt={user.profileName || 'User'}
                          className="w-10 h-10 rounded-full mx-auto object-cover shadow-sm border border-gray-200"
                        />
                      </td>
                      <td className="py-3 px-2">{user.profileName || user.fullName || '-'}</td>
                      <td className="py-3 px-2">{isPendingTab ? 'รออนุมัติเป็นครู' : translateRole(user.role)}</td>
                      <td className="py-3 px-2">{user.email || '-'}</td>
                      <td className="py-3 px-2">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-2">
                        {isPendingTab ? user.teacher?.workplaceName || '-' : user.student?.gradeLevel || '-'}
                      </td>
                      <td className="py-3 px-2">{user.phoneNumber || '-'}</td>
                      <td className="py-3 px-2">
                        {isPendingTab ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDecision(user, 'approve')}
                              className="flex items-center gap-1 bg-[#2FA084] hover:bg-[#248169] text-white px-3 py-1.5 rounded-md text-xs"
                            >
                              <Check size={14} /> อนุมัติ
                            </button>
                            <button
                              onClick={() => handleDecision(user, 'reject')}
                              className="flex items-center gap-1 bg-white border border-red-300 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md text-xs"
                            >
                              <X size={14} /> ปฏิเสธ
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3 text-gray-300">
                            <button className="p-1 cursor-not-allowed" title="ยังไม่เปิดใช้งาน" disabled>
                              <Edit size={18} />
                            </button>
                            <button className="p-1 cursor-not-allowed" title="ยังไม่เปิดใช้งาน" disabled>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-gray-400">ไม่พบข้อมูลผู้ใช้งานในหมวดหมู่นี้</td>
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