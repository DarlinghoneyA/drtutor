import React from 'react';
// นำเข้ารูปภาพสำหรับส่วนที่ 1 และ 2
import teachingImg from '../../assets/Teaching-cuate.svg';
import teacherBoardImg from "../../assets/Teacher-blackboard.svg";
import happyStudentImg from "../../assets/Happy_student.svg";

function Home() {
  return (
    <div className="bg-[#f4f6fa] min-h-screen pt-36 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ================= ส่วนที่ 1: Hero Section ================= */}
        <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-[#799eff] mb-16 tracking-wide">
          DR.TUTOR ACADEMY
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {/* คอลัมน์ซ้าย */}
          <div className="text-left flex flex-col items-start">
            <h2 className="text-2xl md:text-3xl font-bold text-[#333] mb-4 leading-snug">
              สถาบันโรงเรียนกวดวิชา<br />
              จังหวัดสมุทรปราการ
            </h2>
            <p className="text-gray-700 text-sm md:text-base mb-8 leading-relaxed">
              มุ่งมั่นพัฒนาศักยภาพทางการเรียน<br />
              ตั้งแต่ระดับอนุบาล ประถม มัธยมต้น<br />
              และมัธยมปลาย
            </p>
            <button className="bg-[#799eff] hover:bg-[#5a7ecc] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              คอร์สเรียน
            </button>
          </div>

          {/* คอลัมน์กลาง */}
          <div className="flex justify-center">
            <img 
              src={teachingImg} 
              alt="Teaching Illustration" 
              className="w-full max-w-[350px] md:max-w-[400px] object-contain drop-shadow-sm"
            />
          </div>

          {/* คอลัมน์ขวา */}
          <div className="text-right flex flex-col items-end">
            <h2 className="text-xl md:text-2xl font-bold text-[#333] mb-4 inline-block border-b-[3px] border-[#799eff] pb-1">
              ทำไมต้องเรียนกับเรา?
            </h2>
            <div className="text-gray-700 text-sm md:text-base mb-8 leading-relaxed text-right space-y-1">
              <p>คุณครูมากประสบการณ์</p>
              <p>คอร์สเรียนยืดหยุ่น ราคาเหมาะสม</p>
              <p>บรรยากาศเป็นกันเอง ดูแลใกล้ชิด</p>
              <p>เทคนิคการสอนเข้าใจง่าย พร้อมแนวข้อสอบอัปเดต</p>
            </div>
            <button className="bg-[#799eff] hover:bg-[#5a7ecc] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              อาจารย์ของเรา
            </button>
          </div>
        </div>

        {/* ================= ส่วนที่ 2: About Us (แนะนำสถาบัน) ================= */}
        {/* ใช้ mt-32 เพื่อเว้นระยะห่างจากส่วนแรกให้ดูโปร่งขึ้น */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* คอลัมน์ซ้าย: รูปภาพกระดานดำ */}
          <div className="flex justify-center md:justify-center">
            <img 
              src={teacherBoardImg} 
              alt="Teacher at Blackboard" 
              className="w-full max-w-[450px] object-contain drop-shadow-sm"
            />
          </div>

          {/* คอลัมน์ขวา: ข้อความบรรยาย */}
          <div className="flex flex-col">
            {/* หัวข้อจัดกึ่งกลางตามแบบ */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#333] mb-6 text-center leading-snug">
              กวดวิชาดอกเตอร์ติวเตอร์ คือ<br />
              สถาบันกวดวิชาในจังหวัดสมุทรปราการ
            </h2>
            
            {/* เนื้อหาจัดชิดซ้าย */}
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
              ที่มุ่งมั่นพัฒนาศักยภาพทางการเรียนของนักเรียนตั้งแต่ระดับ อนุบาล ประถม 
              มัธยมต้น จนถึงมัธยมปลาย (ม.6) ด้วยแนวการสอนที่เข้าใจง่าย สนุก 
              และปรับให้เหมาะกับแต่ละช่วงวัย ไม่ว่าจะต้องการ ติวเพิ่มเกรด 
              ติวสอบเข้าโรงเรียนดัง หรือเตรียมสอบเข้ามหาวิทยาลัย — 
              เรามีหลักสูตรที่ครอบคลุมและปรับให้เหมาะกับเป้าหมายของแต่ละคนโดยเฉพาะ
            </p>
            
            {/* ปุ่มใช้ self-end เพื่อดันให้ไปอยู่ชิดขวาของ flex container */}
            <button className="self-end bg-[#799eff] hover:bg-[#5a7ecc] text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              คุณครูของเรา
            </button>
          </div>

        </div>
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* คอลัมน์ซ้าย: ข้อความบรรยาย */}
          <div className="flex flex-col items-start text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-[#333] mb-6 leading-snug">
              ก้าวเล็ก ๆ ของน้อง ๆ สู่ความสำเร็จที่ยิ่งใหญ่
            </h2>
            
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
              ไม่ว่าจะเป็นการเพิ่มเกรด การสอบเข้าโรงเรียนดัง<br />
              หรือการเตรียมสอบเข้ามหาวิทยาลัย เราพร้อมเคียงข้างเสมอ<br />
              ทุกความตั้งใจของเด็ก ๆ<br />
              คือแรงผลักดันให้เราพัฒนาหลักสูตรและวิธีสอนให้ดียิ่งขึ้น<br />
              สถาบันของเราเน้นการเรียนที่เป็นมิตร ครูดูแลใกล้ชิด<br />
              ทำให้เด็กกล้าเรียน กล้าถาม และสนุกกับทุกวิชา
            </p>
            
            <button className="bg-[#799eff] hover:bg-[#5a7ecc] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              นักเรียนของเรา
            </button>
          </div>

          {/* คอลัมน์ขวา: รูปภาพเด็กนักเรียน */}
          <div className="flex justify-center md:justify-center">
            <img 
              src={happyStudentImg} 
              alt="Happy Students" 
              className="w-full max-w-[450px] object-contain drop-shadow-sm"
            />
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;