"use client";

import { useEffect, useState } from "react";
import { auth, checkExistingUser } from "@/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import LoginPage from "./login/page";
import Dashboard from "./dashboard/page";

export default function RootPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // 1. 유저의 로그인 상태가 변하는지 감시합니다.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // 로그인이 되어 있다면?
      if (currentUser) {
        try {
          // DB에서 등록된 기사인지 확인
          const registered = await checkExistingUser(currentUser.uid);
          setUser(currentUser);
          setIsRegistered(registered);
        } catch (error) {
          console.error("DB 확인 중 에러:", error);
          setUser(null);
        }
      } else {
        // 로그인이 안 되어 있다면 즉시 비우기
        setUser(null);
        setIsRegistered(false);
      }
      
      // 상태 확인이 끝났으니 로딩 화면을 걷어냅니다.
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 로딩 화면 (이제 여기서 멈추지 않고 넘어갈 겁니다!)
  if (loading) {
    return (
      <div style={{ 
        display: "flex", height: "100vh", justifyContent: "center", 
        alignItems: "center", backgroundColor: "#0f172a", color: "#fff" 
      }}>
        <p>🛠️ 보안 시스템 확인 중...</p>
      </div>
    );
  }

  // [핵심 관문]
  // 로그인이 안 되어 있거나, DB에 등록되지 않은 기사라면 로그인 페이지로!
  if (!user || !isRegistered) {
    return <LoginPage />;
  }

  // 둘 다 통과했다면 대시보드 입장!
  return <Dashboard user={user} />;
}