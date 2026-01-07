"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// 🚀 [해석] 폴더가 repairs/[id]로 두 단계 깊이이므로 점 두 개(../../)가 맞습니다!
import Sidebar from "../../components/Sidebar";
import { translations } from "../../utils/translations";

export default function RepairReport() {
  const { id } = useParams(); 
  const router = useRouter();
  
  // 🚀 [해석] 언어 상태 관리 (기본값 ko)
  const [lang, setLang] = useState("ko");
  const [repair, setRepair] = useState(null); 
  const [workDetail, setWorkDetail] = useState(""); 
  const [cost, setCost] = useState(""); 

  // 🎯 [해석] 중요! 단어장에서 'repairDetail' 방을 사용합니다. 
  // 다니엘, translations.js에 repairDetail: { ... } 이 있어야 합니다.
  const curT = translations[lang]?.repairDetail || translations.ko.repairDetail;

  useEffect(() => {
    // ⚙️ [해석] 저장된 언어 설정을 불러옵니다.
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setLang(parsed.lang || "ko");
    }

    // 📂 [해석] 로컬스토리지(r_data)에서 해당 ID의 수리 내역을 찾습니다. [cite: 2026-01-06]
    const saved = JSON.parse(localStorage.getItem("r_data") || "[]");
    const found = saved.find(item => item.repairId === id);
    if (found) {
      setRepair(found);
      if (found.workDetail) setWorkDetail(found.workDetail);
      if (found.cost) setCost(found.cost);
    }
  }, [id]);

  // --- [수리 완료 저장 함수] ---
  const handleComplete = () => {
    if (!workDetail) return alert(curT.alertNoDetail);

    const saved = JSON.parse(localStorage.getItem("r_data") || "[]");
    const updated = saved.map(item => 
      item.repairId === id 
        ? { 
            ...item, 
            status: curT.statusDone, // 🚀 단어장에 정의된 "완료" 문구 사용
            workDetail: workDetail, 
            cost: cost,
            completedAt: new Date().toLocaleString() 
          } 
        : item
    );

    // 💾 [해석] 모든 데이터는 모바일 내부에 안전하게 저장! [cite: 2026-01-06]
    localStorage.setItem("r_data", JSON.stringify(updated));
    alert(curT.alertSuccess);
    router.push("/repairs"); 
  };

  // 로딩 중일 때
  if (!repair) return <div style={{padding:'20px'}}>{curT.loading}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => router.back()} style={styles.backBtn}>{curT.back}</button>
        <h3 style={styles.title}>{curT.header}</h3>
        <div style={{width:'40px'}}></div>
      </header>

      {/* 고객 기본 정보 카드 */}
      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span style={styles.label}>{curT.custName}</span>
          <span style={styles.value}>{repair.customerName}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>{curT.custPhone}</span>
          <span style={styles.value}>{repair.customerPhone}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>{curT.visitDate}</span>
          <span style={styles.value}>{repair.date}</span>
        </div>
      </div>

      {/* 수리 내역 입력란 */}
      <div style={styles.formSection}>
        <label style={styles.inputLabel}>{curT.workDetailLabel}</label>
        <textarea 
          style={styles.textarea}
          placeholder={curT.workPlaceholder}
          value={workDetail}
          onChange={(e) => setWorkDetail(e.target.value)}
        />

        <label style={styles.inputLabel}>{curT.costLabel}</label>
        <input 
          type="number"
          style={styles.input}
          placeholder="0"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

        <button onClick={handleComplete} style={styles.completeBtn}>
          {curT.completeBtn}
        </button>
      </div>
    </div>
  );
}

// 스타일 코드는 기존과 동일하므로 유지하시면 됩니다!

const styles = {
  container: { padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { background: 'none', border: 'none', fontSize: '1rem', color: '#64748b', fontWeight: 'bold', cursor: 'pointer' },
  title: { fontSize: '1.2rem', fontWeight: 'bold' },
  infoCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  label: { color: '#64748b', fontSize: '0.9rem' },
  value: { fontWeight: 'bold', fontSize: '1rem' },
  formSection: { display: 'flex', flexDirection: 'column' },
  inputLabel: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' },
  textarea: { padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', height: '150px', fontSize: '1rem', marginBottom: '20px', fontFamily: 'inherit' },
  input: { padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1.1rem', marginBottom: '30px' },
  completeBtn: { padding: '18px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }
};