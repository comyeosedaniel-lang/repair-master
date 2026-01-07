"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // 사이드바 호출 [cite: 2026-01-06]
// ✅ 파일명 대소문자를 이미지와 똑같이 맞춰야 합니다 (Infoko, InfoEn)
import InfoKo from "./Infoko"; 
import InfoEn from "./InfoEn";

export default function InfoRouter() {
  const [lang, setLang] = useState("ko");
  const [loading, setLoading] = useState(true); // 🔄 로딩 상태 추가

  useEffect(() => {
    // 📱 모바일 로컬 저장소에서 언어 설정 가져오기 [cite: 2026-01-06]
    const saved = localStorage.getItem("app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLang(parsed.lang || "ko");
      } catch (e) {
        console.error("설정 로드 실패:", e);
      }
    }
    setLoading(false); // 로딩 완료
  }, []);

  // 로딩 중일 때는 빈 화면이나 로딩바를 보여줍니다.
  if (loading) return <div style={{padding: '20px'}}>Loading...</div>;

  // 🔄 lang 값에 따라 한국어/영어 컴포넌트 렌더링
  return lang === "ko" ? <InfoKo /> : <InfoEn />;
}