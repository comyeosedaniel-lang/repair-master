"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react"; 
// 🚀 다니엘의 설계: 중앙 사전 불러오기
import { translations } from "../utils/translations";

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  
  // 초기값은 'ko'로 설정하되, 실시간으로 설정을 읽어옵니다.
  const [lang, setLang] = useState("ko");

  // Sidebar.js 내부 수정
// Sidebar.js 수정 제안
useEffect(() => {
  const syncLanguage = () => {
    const savedData = localStorage.getItem("app_settings");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // ✅ 사이드바 내부의 lang 상태를 강제로 업데이트!
      setLang(parsed.lang || "ko");
    }
  };

  if (isOpen) {
    syncLanguage(); // 사이드바가 열릴 때마다 무조건 최신 언어 체크 [cite: 2026-01-06]
  }
}, [isOpen]); // isOpen이 바뀔 때(메뉴를 열 때)마다 실행

  // 🎯 중앙 사전에서 현재 언어와 'sidebar' 전용 텍스트만 쏙 뽑아옵니다.
  const curT = translations[lang]?.sidebar || translations.ko.sidebar;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigateTo = (path) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* 배경 클릭 시 닫히는 오버레이 */}
      {isOpen && <div style={styles.backdrop} onClick={onClose} />}

      {/* 왼쪽에서 튀어나오는 메뉴바 */}
      <div style={{ ...styles.sideMenu, left: isOpen ? "0" : "-280px" }}>
        <div style={styles.menuHeader}>
          {/* 중앙 사전에서 가져온 로고 텍스트 적용 */}
          <span style={styles.menuLogo}>{curT.logo}</span>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <nav style={styles.menuList}>
          {/* 중앙 사전에서 가져온 메뉴명들 적용 */}
          <button onClick={() => navigateTo("/dashboard")} style={styles.menuItem}>{curT.dashboard}</button>
          <button onClick={() => navigateTo("/customers")} style={styles.menuItem}>{curT.customers}</button>
          <button onClick={() => navigateTo("/repairs")} style={styles.menuItem}>{curT.calendar}</button>
          
          {/* ✅ 새로 만든 하드웨어 가이드 메뉴 추가! [cite: 2026-01-04, 2026-01-06] */}
          <button onClick={() => navigateTo("/info")} style={{...styles.menuItem, color: '#38bdf8'}}>
            ✨ {curT.hardware}
          </button>

          <button onClick={() => navigateTo("/stats")} style={styles.menuItem}>{curT.stats}</button>
          <button onClick={() => navigateTo("/settings")} style={styles.menuItem}>{curT.settings}</button>
          
          <hr style={styles.divider} />
          
          <button onClick={handleLogout} style={{ ...styles.menuItem, color: '#f87171' }}>
            {curT.logout}
          </button>
        </nav>
      </div>
    </>
  );
}

// 스타일 코드는 다니엘의 원본 그대로 유지합니다.
const styles = {
  backdrop: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100 },
  sideMenu: { position: "fixed", top: 0, width: "280px", height: "100%", backgroundColor: "#1e293b", zIndex: 101, transition: "0.3s ease", padding: "20px" },
  menuHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "15px" },
  menuLogo: { color: "#38bdf8", fontWeight: "bold", fontSize: "1.1rem" },
  closeBtn: { background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: 'pointer' },
  menuList: { display: "flex", flexDirection: "column", gap: "10px" },
  menuItem: { width: "100%", padding: "15px", textAlign: "left", background: "none", border: "none", color: "#cbd5e1", fontSize: "1rem", cursor: "pointer" },
  divider: { border: 'none', borderTop: '1px solid #334155', margin: '10px 0' }
};