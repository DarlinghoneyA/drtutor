import React from 'react';

function Login() {
  return (
    // Wrapper คลุมทั้งหน้าจอพร้อมสีพื้นหลังแบบไล่สี (ใช้ Inline Style สำหรับ Gradient)
    <div 
      className="flex justify-center items-center w-full min-h-screen"
      style={{ background: 'linear-gradient(180deg, #5b86e5 0%, #36d1dc 100%)' }}
    >
      <div className="bg-white p-10 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-[400px] text-center mx-4">
        <h2 className="text-[28px] font-bold text-[#333] mb-8">
          เข้าสู่ระบบ
        </h2>
        {/* Loginด้วยGoogle */}
        <button className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-600 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
            alt="Google Logo" 
            className="w-5 h-5" 
          />
          เข้าสู่ระบบด้วย Google
        </button>
      </div>
    </div>
  );
}

export default Login;