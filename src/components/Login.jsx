import React from 'react';

function Login() {
  return (
    // Wrapper คลุมทั้งหน้าจอพร้อมสีพื้นหลังแบบไล่สี (ใช้ Inline Style สำหรับ Gradient)
    <div 
      className="flex justify-center items-center w-full min-h-screen"
      style={{ background: 'linear-gradient(180deg, #5b86e5 0%, #36d1dc 100%)' }}
    >
      {/* กล่องสีขาว (Card) */}
      <div className="bg-white p-10 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-[400px] text-center mx-4">
        
        <h2 className="text-[28px] font-bold text-[#333] mb-8">
          เข้าสู่ระบบ
        </h2>

        <form className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="username" 
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm bg-[#fafafa] outline-none focus:border-[#2FA084] focus:bg-white transition-colors"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm bg-[#fafafa] outline-none focus:border-[#2FA084] focus:bg-white transition-colors"
          />

          <button 
            type="submit" 
            className="w-full bg-[#2FA084] hover:bg-[#248169] text-white font-medium py-3 rounded-md text-base mt-2 transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* เส้นคั่น "หรือ" */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-b border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">หรือ</span>
          <div className="flex-1 border-b border-gray-200"></div>
        </div>

        {/* ปุ่ม Google */}
        <button className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-600 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
            alt="Google Logo" 
            className="w-5 h-5" 
          />
          เข้าสู่ระบบด้วย Google
        </button>

        {/* ข้อความด้านล่าง */}
        <p className="mt-6 text-[13px] text-gray-600">
          ไม่มีบัญชี? <a href="#register" className="text-[#799eff] hover:underline">สร้างบัญชีใหม่</a>
        </p>

      </div>
    </div>
  );
}

export default Login;