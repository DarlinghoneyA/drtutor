import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './service/supabaseClient';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/sections/Login';
import UserManagement from './components/sections/UserManagement';
import Home from './components/sections/Home';
import Profile from './components/sections/Profile';
import RoleSelection from './components/sections/Roleselection';
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบ session เริ่มต้น
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // ดักฟังการเปลี่ยนแปลงสถานะ (ล็อกอิน/ล็อกเอาท์)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
  }
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<><Home /><Footer /></>} />
        
        {/* หน้า Login: ถ้าล็อกอินสำเร็จแล้ว (มี session) ให้เด้งกลับไปหน้า Home (/) */}
        <Route 
          path="/login" 
          element={session ? <Navigate to="/" /> : <Login />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App