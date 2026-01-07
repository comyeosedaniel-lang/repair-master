"use client";

import { useEffect, useState } from "react";
import { auth, checkExistingUser } from "@/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import LoginPage from "./login/page";
import Dashboard from "./dashboard/page";

/**
 * 🚀 캡틴의 가이드:
 * 이 페이지는 사용자가 앱에 접속했을 때 가장 먼저 거치는 '체크포인트'입니다.
 * 1. 로그인 여부 확인
 * 2. DB 등록 기사 여부 확인
 * 3. 로컬 설정(언어 등) 세팅 확인
 */
export default function RootPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // 🌍 [다니엘의 요청] 모바일 로컬 저장소에서 언어 설정을 미리 확인합니다. [cite: 2026-01-06]
    const checkSettings = () => {
      const saved = localStorage.getItem("app_settings");
      if (!saved) {
        // 설정이 없다면 기본값(한국어)을 미리 심어둡니다. [cite: 2026-01-06]
        localStorage.setItem("app_settings", JSON.stringify({ lang: "ko" }));
      }
    };
    checkSettings();

    // 🔒 1. 유저의 로그인 상태 감시 (Firebase)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // 2. DB에서 실제 등록된 기사님(다니엘)인지 체크 [cite: 2026-01-03]
          const registered = await checkExistingUser(currentUser.uid);
          setUser(currentUser);
          setIsRegistered(registered);
        } catch (error) {
          console.error("보안 확인 중 에러 발생:", error);
          setUser(null);
        }
      } else {
        // 로그아웃 상태라면 초기화
        setUser(null);
        setIsRegistered(false);
      }
      
      // ✅ 확인이 끝나면 로딩 화면을 종료합니다.
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ 로딩 중일 때 보여줄 화면 (다니엘의 스타일 유지)
  if (loading) {
    return (
      <div style={{ 
        display: "flex", height: "100vh", flexDirection: "column",
        justifyContent: "center", alignItems: "center", 
        backgroundColor: "#0f172a", color: "#38bdf8" 
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "20px" }}>🛠️</div>
        <p style={{ fontWeight: "bold", letterSpacing: "1px" }}>REPAIR MASTER</p>
        <p style={{ fontSize: "0.8rem", marginTop: "10px", color: "#94a3b8" }}>보안 시스템 확인 중...</p>
      </div>
    );
  }

  /**
   * 🛡️ [보안 관문]
   * 로그인이 안 되어 있거나, 등록되지 않은 사용자는 무조건 로그인 페이지로 보냅니다.
   */
  if (!user || !isRegistered) {
    return <LoginPage />;
  }

  // 🏁 모든 관문을 통과했다면 대시보드를 보여줍니다.
  return <Dashboard user={user} />;
}
