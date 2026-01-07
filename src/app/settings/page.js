"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { translations } from "../utils/translations";

export default function SettingsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState("ko");
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 1. 로컬 스토리지에서 설정 불러오기 [cite: 2026-01-06]
  useEffect(() => {
    const saved = localStorage.getItem("app_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setLang(parsed.lang || "ko");
    }
    setIsLoading(false);
  }, []);

  // 🌍 2. 언어가 바뀔 때마다 자동으로 실행되는 저장 로직
  // onChange에서 직접 호출하여 버튼 클릭 없이 즉시 반영합니다.
  const handleLangChange = (newLang) => {
    setLang(newLang);

    // 프리셋 설정 구성
    const globalDefaults = newLang === "en" 
      ? {
          lang: "en",
          mapProvider: "google",
          currency: "USD",
          messenger: "whatsapp",
          addressFormat: "international"
        }
      : {
          lang: "ko",
          mapProvider: "tmap",
          currency: "KRW",
          messenger: "sms",
          addressFormat: "korea"
        };

    // ✅ 즉시 저장 [cite: 2026-01-06]
    localStorage.setItem("app_settings", JSON.stringify(globalDefaults));
    
    // 🚀 리로드 없이 전체 앱에 반영하려면 window.location.reload()가 가장 확실하지만,
    // 다니엘이 리로드 자체를 원치 않는다면 그냥 두어도 됩니다. 
    // 하지만 사이드바 등 다른 컴포넌트까지 한꺼번에 바꾸려면 리로드가 가장 깔끔해요!
    window.location.reload(); 
  };

  if (isLoading) return null;

  const curT = translations[lang]?.settings || translations.ko.settings;

  return (
    <div style={styles.container}>
      {/* 사이드바에 현재 언어 전달 [cite: 2026-01-06] */}
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} lang={lang} />
      
      <header style={styles.header}>
        <button onClick={() => setIsMenuOpen(true)} style={styles.menuBtn}>☰</button>
        <h2 style={styles.title}>{curT.title}</h2>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <label style={styles.label}>{curT.langLabel}</label>
          {/* ✅ Select 값이 바뀌자마자 handleLangChange 실행 */}
          <select 
            value={lang} 
            onChange={(e) => handleLangChange(e.target.value)} 
            style={styles.select}
          >
            <option value="ko">Korean (한국어)</option>
            <option value="en">English (영어)</option>
          </select>
          
          <div style={styles.infoBox}>
            <p style={styles.infoText}>
              <strong>Current Preset:</strong> {lang === "en" ? "Global (USA/EU)" : "Domestic (South Korea)"}
            </p>
            <ul style={styles.list}>
              <li>Map: {lang === "en" ? "Google Maps" : "T-Map"}</li>
              <li>Currency: {lang === "en" ? "USD ($)" : "KRW (₩)"}</li>
              <li>Contact: {lang === "en" ? "WhatsApp / Int'l Call" : "SMS / Local Call"}</li>
            </ul>
          </div>
        </section>

        {/* 🚨 버튼은 이제 필요 없어서 삭제해도 되지만, 
            디자인상 허전하다면 '자동 저장됨' 안내 문구로 바꿔도 좋습니다. */}
        <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem'}}>
          Settings are saved automatically.
        </p>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f8fafc" },
  header: { display: "flex", alignItems: "center", padding: "15px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" },
  menuBtn: { fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer", marginRight: "15px" },
  title: { fontSize: "1.1rem", fontWeight: "bold", color: "#1e293b" },
  main: { padding: "20px" },
  section: { marginBottom: "30px", display: "flex", flexDirection: "column" },
  label: { fontSize: "0.95rem", fontWeight: "600", marginBottom: "10px", color: "#475569" },
  select: { padding: "14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "1rem", backgroundColor: "#fff" },
  infoBox: { marginTop: "15px", padding: "15px", backgroundColor: "#f1f5f9", borderRadius: "10px" },
  infoText: { fontSize: "0.9rem", color: "#334155", marginBottom: "8px" },
  list: { fontSize: "0.85rem", color: "#64748b", paddingLeft: "20px", lineHeight: "1.6" }
};