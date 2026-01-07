"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react"; 
import { translations } from "../utils/translations";

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const [lang, setLang] = useState("ko");

  useEffect(() => {
    const syncLanguage = () => {
      const savedData = localStorage.getItem("app_settings");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setLang(parsed.lang || "ko");
      }
    };

    if (isOpen) {
      syncLanguage(); // 메뉴가 열릴 때 언어 설정을 최신화합니다. [cite: 2026-01-06]
    }
  }, [isOpen]);

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
    onClose(); // 📱 모바일 편의성: 메뉴 클릭 시 자동으로 사이드바를 닫아줍니다. [cite: 2026-01-03]
  };

  return (
    <>
      {/* 1. 배경 흐리게 처리 (모바일 전용) */}
      {isOpen && <div style={styles.backdrop} onClick={onClose} />}

      {/* 2. 사이드바 본체: isOpen 상태에 따라 왼쪽으로 숨었다가 나왔다가 합니다. */}
      <div style={{ 
        ...styles.sideMenu, 
        transform: isOpen ? "translateX(0)" : "translateX(-100%)", // 🚀 핵심: 폰에서 부드럽게 밀려나옵니다.
      }}>
        <div style={styles.menuHeader}>
          <span style={styles.menuLogo}>{curT.logo}</span>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <nav style={styles.menuList}>
          <button onClick={() => navigateTo("/dashboard")} style={styles.menuItem}>{curT.dashboard}</button>
          <button onClick={() => navigateTo("/customers")} style={styles.menuItem}>{curT.customers}</button>
          <button onClick={() => navigateTo("/repairs")} style={styles.menuItem}>{curT.calendar}</button>
          
          {/* 하드웨어 가이드 (다니엘의 특별 메뉴) [cite: 2026-01-04] */}
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

const styles = {
  backdrop: { 
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
    backgroundColor: "rgba(0,0,0,0.6)", zIndex: 100 
  },
  sideMenu: { 
    position: "fixed", top: 0, left: 0, width: "280px", height: "100%", 
    backgroundColor: "#1e293b", zIndex: 101, transition: "transform 0.3s ease", // 🚀 애니메이션 추가
    padding: "20px", boxShadow: "5px 0 15px rgba(0,0,0,0.3)" 
  },
  menuHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "15px" },
  menuLogo: { color: "#38bdf8", fontWeight: "bold", fontSize: "1.1rem" },
  closeBtn: { background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: 'pointer' },
  menuList: { display: "flex", flexDirection: "column", gap: "10px" },
  menuItem: { width: "100%", padding: "15px", textAlign: "left", background: "none", border: "none", color: "#cbd5e1", fontSize: "1rem", cursor: "pointer" },
  divider: { border: 'none', borderTop: '1px solid #334155', margin: '10px 0' }
};