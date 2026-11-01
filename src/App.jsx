import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './service/supabaseClient';

// นำเข้า Components
import Navbar from './components/Navbar';
import Home from './components/sections/Home';
import Login from './components/sections/Login';
import RoleSelection from './components/sections/Roleselection';
import StudentRegistration from './components/sections/StudentRegistration';
import Footer from './components/Footer'; 

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false); // เปลี่ยนค่าเริ่มต้นเป็น false ไว้ก่อน

  useEffect(() => {
    const checkUserData = async (currentSession) => {
      // ถ้าไม่มี session ถือว่ายังไม่มี Role แน่นอน
      if (!currentSession) {
        setHasRole(false); 
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('Users')
          .select('Role')
          .eq('UserID', currentSession.user.id)
          .single();
          
        if (error || !data || !data.Role) {
          setHasRole(false);
        } else {
          setHasRole(true);
        }
      } catch (err) {
        console.error("Error checking user:", err);
        setHasRole(false); // เผื่อกรณี Error ให้ตีว่ายังไม่มี Role
      } finally {
        setLoading(false);
      }
    };

    // เช็คตอนโหลดครั้งแรก
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUserData(session);
    });

    // เช็คตอนสถานะเปลี่ยน
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // ตั้ง Loading เป็น true ชั่วคราวตอนสลับสถานะ เพื่อรอเช็ค Role
      setLoading(true); 
      checkUserData(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // แสดงหน้าโหลดระหว่างรอข้อมูล Supabase
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* หน้า Home */}
            <Route path="/" element={<Home />} />
            
            {/* หน้า Login */}
            <Route 
              path="/login" 
              element={
                // เช็คว่าล็อกอินหรือยัง?
                !session 
                  ? <Login /> // ถ้ายัง แสดงหน้า Login
                  : (!hasRole ? <Navigate to="/RoleSelection" /> : <Navigate to="/" />) // ถ้าล็อกแล้ว ค่อยเช็ค Role
              } 
            />
            
            {/* หน้า RoleSelection */}
            <Route 
              path="/RoleSelection" 
              element={
                 session && !hasRole 
                  ? <RoleSelection /> 
                  : <Navigate to="/" /> 
              } 
            />
            
            {/* หน้า StudentRegistration */}
            <Route 
              path="/StudentRegistration" 
              element={
                 session && !hasRole
                 ? <StudentRegistration />
                 : <Navigate to="/" />
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;