import { createClient } from '@supabase/supabase-js';

// ดึงค่า URL และ Key มาจากไฟล์ .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// สร้างและส่งออก instance สำหรับเรียกใช้งาน
export const supabase = createClient(supabaseUrl, supabaseAnonKey);