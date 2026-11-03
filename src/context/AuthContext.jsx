import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../service/supabaseClient';
import { apiFetch } from '../service/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async (currentSession) => {
    if (!currentSession) {
      setMe(null);
      setLoading(false);
      return;
    }
    try {
      setMe(await apiFetch('/auth/me'));
    } catch (err) {
      console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ:', err);
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);

      // โหลดข้อมูลผู้ใช้ใหม่เฉพาะตอนเปิดเว็บ / login / logout
      // (ตอนต่ออายุ token ทุกชั่วโมงไม่ต้องโหลดใหม่)
      if (['INITIAL_SESSION', 'SIGNED_IN', 'SIGNED_OUT'].includes(event)) {
        setLoading(true);
        // ห้ามเรียก supabase ตรง ๆ ข้างใน callback นี้ (อาจค้าง) จึงเลื่อนไปทำรอบถัดไป
        setTimeout(() => loadMe(newSession), 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadMe]);

  // เรียกหลังสมัครหรืออนุมัติ เพื่อดึงสถานะล่าสุด
  const refreshMe = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await loadMe(session);
  }, [loadMe]);

  return (
    <AuthContext.Provider value={{ session, me, loading, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}