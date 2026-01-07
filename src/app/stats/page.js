"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar"; // 🚀 [해석] 사이드바 컴포넌트 임포트
import { translations } from "../utils/translations";

export default function SalesStats() {
  const router = useRouter();
  
  const [lang, setLang] = useState("ko");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 🚀 [해석] 사이드바 열림/닫힘 상태
  const [stats, setStats] = useState({
    total: 0,
    monthly: 0,
    count: 0,
    average: 0
  });

  const curT = translations[lang]?.stats || translations.ko.stats || {};

  useEffect(() => {
    // 설정에서 언어 가져오기
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setLang(parsed.lang || "ko");
    }

    // 수리 데이터 계산 (기존 로직 동일)
    const saved = JSON.parse(localStorage.getItem("r_data") || "[]");
    const completedRepairs = saved.filter(item => item.completedAt); 

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalRev = 0;
    let monthRev = 0;

    completedRepairs.forEach(item => {
      const cost = parseInt(String(item.cost || "0").replace(/[^\d]/g, "")) || 0;
      totalRev += cost;
      const date = new Date(item.completedAt);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        monthRev += cost;
      }
    });

    setStats({
      total: totalRev,
      monthly: monthRev,
      count: completedRepairs.length,
      average: completedRepairs.length > 0 ? Math.floor(totalRev / completedRepairs.length) : 0
    });
  }, []);

  return (
    <div style={styles.container}>
      {/* 🚀 [해석] 사이드바를 다시 넣어주었습니다! */}
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header style={styles.header}>
        {/* 🚀 [해석] 뒤로가기 대신 사이드바를 여는 햄버거 버튼으로 변경하거나, 뒤로가기를 유지할 수 있습니다. */}
        <button onClick={() => setIsMenuOpen(true)} style={styles.hamburgerBtn}>☰</button>
        <h3 style={styles.title}>{curT.header || "Statistics"}</h3>
        <button onClick={() => router.back()} style={styles.backBtn}>←</button>
      </header>

      <main style={styles.content}>
        <div style={styles.grid}>
          {/* 총 매출 카드 */}
          <div style={styles.card}>
            <span style={styles.label}>{curT.totalRevenue}</span>
            <p style={styles.value}>
              {curT.currPos === "before" && curT.currency}
              {stats.total.toLocaleString()}
              {curT.currPos === "after" && curT.currency}
            </p>
          </div>

          {/* 이번 달 매출 카드 */}
          <div style={styles.card}>
            <span style={styles.label}>{curT.monthlyRevenue}</span>
            <p style={{...styles.value, color: '#10b981'}}>
              {curT.currPos === "before" && curT.currency}
              {stats.monthly.toLocaleString()}
              {curT.currPos === "after" && curT.currency}
            </p>
          </div>

          {/* 건수 카드 */}
          <div style={styles.card}>
            <span style={styles.label}>{curT.completedCount}</span>
            <p style={styles.value}>{stats.count}{curT.unit}</p>
          </div>

          {/* 평균 카드 */}
          <div style={styles.card}>
            <span style={styles.label}>{curT.avgCost}</span>
            <p style={styles.value}>
              {curT.currPos === "before" && curT.currency}
              {stats.average.toLocaleString()}
              {curT.currPos === "after" && curT.currency}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' },
  hamburgerBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  backBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },
  title: { fontSize: '1.1rem', fontWeight: 'bold', margin: 0 },
  content: { padding: '20px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  label: { fontSize: '0.85rem', color: '#64748b' },
  value: { fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px' }
};