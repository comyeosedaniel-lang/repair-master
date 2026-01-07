"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import Sidebar from "../components/Sidebar"; 
// 🚀 [해석] 중앙 단어장 불러오기
import { translations } from "../utils/translations";

export default function Dashboard({ user }) {
  const router = useRouter();
  
  // 🚀 [해석] 현재 언어 상태 (기본값 ko)
  const [lang, setLang] = useState("ko");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🚀 [해석] 단어장에서 'home' 전용 문구들만 쏙 뽑아옵니다.
  const curT = translations[lang]?.home || translations.ko.home;

  useEffect(() => {
    // ⚙️ [해석] 페이지 로드 시 설정 바구니에서 언어 정보를 읽어옵니다. [cite: 2026-01-06]
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setLang(parsed.lang || "ko");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      alert(curT.alerts.error);
    }
  };

  // 📤 [데이터 백업 로직 - 기존 유지]
  const exportData = () => {
    try {
      const rawData = localStorage.getItem("c_data");
      if (!rawData || rawData === "[]") {
        alert(curT.alerts.noData);
        return;
      }
      const blob = new Blob([rawData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `repair_master_backup_${new Date().toISOString().slice(0, 10)}.txt`;
      link.click();
      alert(curT.alerts.backupDone);
    } catch (e) {
      alert(curT.alerts.error);
    }
  };

  // 📥 [데이터 복구 로직 - 기존 유지]
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          if (confirm(curT.alerts.confirmRestore)) {
            localStorage.setItem("c_data", content);
            alert(curT.alerts.restoreDone);
            window.location.reload();
          }
        }
      } catch (err) {
        alert(curT.alerts.invalidFile);
      }
    };
    reader.readAsText(file);
  };

  // 📋 [메뉴 카드 컴포넌트]
  const MenuCard = ({ title, icon, path, color }) => (
    <div 
      onClick={() => router.push(path)}
      style={{
        ...styles.card, 
        borderLeft: `5px solid ${color}`,
        transition: 'transform 0.1s'
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={styles.cardIcon}>{icon}</div>
      <div style={styles.cardTitle}>{title}</div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* 사이드바 컴포넌트 */}
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header style={styles.header}>
        <button onClick={() => setIsMenuOpen(true)} style={styles.menuBtn}>☰</button>
        <h2 style={styles.logo}>🛠️ REPAIR MASTER</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>{curT.logout}</button>
      </header>

      <main style={styles.main}>
        {/* 🏷️ [해석] 인사말을 단어장에서 가져옵니다. */}
        <div style={styles.welcome}>
          <h3 style={{fontSize: '1.2rem'}}>{curT.welcome}</h3>
          <p style={{fontSize: '0.9rem', color: '#64748b'}}>{curT.subtitle}</p>
        </div>

        {/* 🏷️ [해석] 메뉴 버튼들의 글자도 단어장에서 가져옵니다. */}
        <div style={styles.grid}>
          <MenuCard title={curT.menu.customers} icon="👥" path="/customers" color="#38bdf8" />
          <MenuCard title={curT.menu.repairs} icon="📅" path="/repairs" color="#fbbf24" />
          <MenuCard title={curT.menu.statistics} icon="📈" path="/stats" color="#4ade80" />
          <MenuCard title={curT.menu.hardware} icon="🛠️" path="/info" color="#f43f5e" /> {/* ✅ 하드웨어 가이드 추가 (색상은 Rose) */}
          <MenuCard title={curT.menu.settings} icon="⚙️" path="/settings" color="#94a3b8" />
        </div>

        {/* 데이터 관리 섹션 */}
        <div style={{marginTop: '40px'}}>
          <h4 style={{marginBottom: '15px', color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold'}}>
            {curT.menu.dataManagement}
          </h4>
          <div style={styles.grid}>
            <div onClick={exportData} style={{...styles.card, borderLeft: `5px solid #6366f1`}}>
              <div style={styles.cardIcon}>📤</div>
              <div style={{...styles.cardTitle, color: '#6366f1'}}>{curT.menu.backup}</div>
            </div>

            <label style={{...styles.card, borderLeft: `5px solid #ec4899`, cursor: 'pointer'}}>
              <div style={styles.cardIcon}>📥</div>
              <div style={{...styles.cardTitle, color: '#ec4899'}}>{curT.menu.restore}</div>
              <input type="file" accept=".txt,.json" onChange={importData} style={{display: 'none'}} />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}

// 스타일 시트는 기존과 동일
const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f1f5f9" },
  header: { padding: "15px 20px", backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  menuBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1e293b' },
  logo: { fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: 0 },
  logoutBtn: { color: "#ef4444", border: "1px solid #fee2e2", background: "#fff", padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' },
  main: { padding: "20px" },
  welcome: { marginBottom: "30px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", userSelect: 'none' },
  cardIcon: { fontSize: "1.8rem" },
  cardTitle: { fontWeight: "bold", fontSize: "0.85rem", color: "#334155" },
};