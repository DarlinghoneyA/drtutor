import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// นำเข้า Components
import Navbar from './components/Navbar';
import Home from './components/sections/Home';
import Login from './components/sections/Login';
import RoleSelection from './components/sections/Roleselection';
import StudentRegistration from './components/sections/StudentRegistration';
import Footer from './components/Footer';
import CoursesManagement from './components/sections/CoursesManagement';
import AddCourse from './components/sections/AddCourse';
import Courses from './components/sections/Courses';
import CourseDetails from './components/sections/CourseDetails';
import UserManagement from './components/sections/UserManagement';

function App() {
  const { session, me, loading } = useAuth();
  const status = me?.status;

  // หลัง login แล้วจะพาไปหน้าไหน
  const homeFor = () => {
    if (status === 'needs_registration') return '/RoleSelection';
    if (status === 'pending_approval') return '/pending';
    return '/';
  };

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
              element={!session ? <Login /> : <Navigate to={homeFor()} />}
            />

            {/* หน้าเลือกบทบาท / สมัคร (เฉพาะคนที่ยังไม่ได้สมัคร) */}
            <Route
              path="/RoleSelection"
              element={status === 'needs_registration' ? <RoleSelection /> : <Navigate to="/" />}
            />
            <Route
              path="/StudentRegistration"
              element={status === 'needs_registration' ? <StudentRegistration /> : <Navigate to="/" />}
            />

            {/* หน้ารออนุมัติ (ครูที่สมัครแล้ว) */}
            <Route
              path="/pending"
              element={
                status === 'pending_approval' ? (
                  <div className="min-h-screen flex items-center justify-center pt-24">
                    ได้รับใบสมัครแล้ว กรุณารอผู้ดูแลระบบอนุมัติ
                  </div>
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* เฉพาะ Admin */}
            <Route
              path="/usermangement"
              element={me?.role === 'Admin' ? <UserManagement /> : <Navigate to="/" />}
            />

            {/* คอร์สเรียน (ยังไม่ได้กันสิทธิ์ รอทำโมดูล course) */}
            <Route path="/coursesmanagement" element={<CoursesManagement />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-details/:id" element={<CourseDetails />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;