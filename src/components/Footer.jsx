import React from 'react';
import qrCodeImg from '../assets/Drtutor_line_qr_code.jpg';
import drTutorLogo from "../assets/Drtutor-logo.png";
function Footer() {
  return (
    <footer className="bg-[#799eff] text-black py-8 px-6 font-sans mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
        
        <div className="flex-shrink-0">
          <img src={drTutorLogo} alt="Dr.Tutor Logo" className="w-24 h-24 object-contain" />
        </div>

        <div className="flex flex-col gap-2 font-bold text-sm mt-2 md:mt-0">
          <a href="#" className="underline hover:text-gray-700 transition-colors">นโยบายความเป็นส่วนตัว</a>
          <a href="#" className="underline hover:text-gray-700 transition-colors">ข้อตกลงและเงื่อนไข</a>
        </div>

        <div className="flex flex-col text-sm">
          <h3 className="font-bold mb-1">ที่อยู่</h3>
          <p>998 /126 โครงการเสนาช็อป(แพรกษา)</p>
          <p>ถ. แพรกษา ตำบล แพรกษา เมือง,</p>
          <p>สมุทรปราการ 10280</p>
        </div>

        <div className="flex flex-col text-sm">
          <h3 className="font-bold mb-1">ติดต่อเรา</h3>
          <p>โทร. 0829832555</p>
          <p>Line ID : yuri_te</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span>กวดวิชาด็อกเตอร์ติวเตอร์ Dr.Tutor</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-white p-1 rounded-sm shadow-md">
            <img 
              src={qrCodeImg} 
              alt="Line QR Code" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain" 
            />
          </div>
          <span className="text-xs mt-1 font-medium">Line QR CODE</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;