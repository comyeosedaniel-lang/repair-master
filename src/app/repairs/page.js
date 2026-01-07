"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar"; 
// 📚 [해석] 폴더 구조에 맞춰 한 단계 위(..)의 utils에서 단어장을 가져옵니다.
import { translations } from "../utils/translations";

export default function RepairCalendar() {
  const router = useRouter();
  
  // --- [상태 관리] ---
  const [lang, setLang] = useState("ko"); 
  
  // 🎯 [해석] 이제 'calendar'는 잊으세요! 파일명과 똑같이 'repairs' 방에서 단어를 가져옵니다.
  // translations.js에 반드시 repairs: { ... } 항목이 있어야 합니다.
  const curT = translations[lang]?.repairs || translations.ko.repairs;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(""); 
  const [repairData, setRepairData] = useState([]); 
  const [customers, setCustomers] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [searchCustomer, setSearchCustomer] = useState(""); 
  const [selectedHour, setSelectedHour] = useState("09:00"); 

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const decrypt = (text) => {
    try { return decodeURIComponent(atob(text)); } catch(e) { return text; }
  };

  // --- [데이터 로드 및 자동 이월 로직] ---
  useEffect(() => {
    // ⚙️ [해석] 설정에서 바꾼 언어(ko/en)를 읽어와서 적용합니다.
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.lang) setLang(parsed.lang);
    }

    const rawRepairs = localStorage.getItem("r_data");
    let currentRepairs = rawRepairs ? JSON.parse(rawRepairs) : [];

    // [이월 로직] 미완료 일정을 오늘로 가져오기 [cite: 2026-01-03]
    const pendingPastTasks = currentRepairs.filter(r => r.date < todayStr && r.status === "pending");
    if (pendingPastTasks.length > 0) {
      const newTasks = pendingPastTasks.filter(task => 
        !currentRepairs.some(r => r.date === todayStr && r.customerName === task.customerName && r.time === task.time)
      ).map(task => ({
        ...task,
        repairId: `r_roll_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        date: todayStr,
        isRollover: true
      }));

      if (newTasks.length > 0) {
        currentRepairs = [...currentRepairs, ...newTasks];
        localStorage.setItem("r_data", JSON.stringify(currentRepairs));
        // 🔔 [해석] 알람 문구도 이제 curT.repairs.alerts 에서 가져옵니다.
        alert(`${newTasks.length}${curT.alerts.rolloverSuccess}`);
      }
    }
    setRepairData(currentRepairs);

    const savedCustomers = localStorage.getItem("c_data");
    if (savedCustomers) {
      const decoded = JSON.parse(savedCustomers).map(item => ({
        id: item.id,
        name: decrypt(item.n),
        phone: decrypt(item.p),
        address: decrypt(item.a)
      }));
      setCustomers(decoded);
    }
    setSelectedDate(todayStr);
  }, [lang, curT.alerts.rolloverSuccess]); 

  // --- [기능 함수들: launchMapApp, addSchedule, deleteSchedule 등은 동일하게 유지] ---
  const launchMapApp = (e, repairItem) => {
    e.stopPropagation();
    const address = repairItem.customerAddress || "";
    if (!address) { alert(curT.alerts.noAddress); return; }
    const mode = prompt(curT.mapPrompt);
    const encodedAddr = encodeURIComponent(address);
    const encodedName = encodeURIComponent(repairItem.customerName);
    if (mode === "1") window.location.href = `kakaomap://route?ep=${encodedAddr}&by=CAR`;
    else if (mode === "2") window.location.href = `nmap://route/car?daddr=${encodedAddr}&dname=${encodedName}`;
    else if (mode === "3") window.location.href = `tmap://search?name=${encodedAddr}`;
  };

  const addSchedule = (customer) => {
    const newRepair = {
      repairId: `r_${Date.now()}`,
      date: selectedDate, 
      time: selectedHour, 
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      status: "pending" 
    };
    const updatedRepairs = [...repairData, newRepair].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    setRepairData(updatedRepairs);
    localStorage.setItem("r_data", JSON.stringify(updatedRepairs));
    setIsModalOpen(false);
  };

  const deleteSchedule = (e, repairId) => {
    e.stopPropagation(); 
    if (confirm(curT.alerts.confirmDelete)) {
      const updated = repairData.filter(r => r.repairId !== repairId);
      setRepairData(updated);
      localStorage.setItem("r_data", JSON.stringify(updated));
    }
  };

  // --- [달력 계산 로직 동일] ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({ length: firstDayOfMonth }, () => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const hourOptions = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header style={styles.unifiedHeader}>
        <button onClick={() => setIsMenuOpen(true)} style={styles.iconBtn}>
          <span style={{fontSize:'1.5rem', fontWeight:'bold'}}>☰</span>
        </button>
        <h3 style={styles.headerTitle}>{year}{curT.yearUnit} {month + 1}{curT.monthUnit}</h3>
        <div style={{display:'flex', gap:'5px'}}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={styles.navBtn}>{curT.prev}</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={styles.navBtn}>{curT.next}</button>
        </div>
      </header>

      <div style={styles.calendarGrid}>
        {curT.weekDays.map(d => (
          <div key={d} style={styles.dayHeader}>{d}</div>
        ))}
        {calendarDays.map((day, idx) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayRepairs = repairData.filter(r => r.date === dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div 
              key={idx} 
              onClick={() => day && setSelectedDate(dateStr)}
              style={{
                ...styles.dayCell, 
                backgroundColor: isToday ? '#e0f2fe' : day ? '#fff' : 'transparent',
                border: selectedDate === dateStr ? '2.5px solid #38bdf8' : '1px solid #f1f5f9'
              }}
            >
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span style={{color: idx % 7 === 0 ? 'red' : idx % 7 === 6 ? 'blue' : '#334155', fontWeight: 'bold'}}>{day}</span>
                {day && dayRepairs.length > 0 && <span style={styles.countBadge}>{dayRepairs.length}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={styles.scheduleList}>
          <div style={styles.listHeader}>
            <h4 style={{margin: 0}}>📅 {selectedDate}</h4>
            <button style={styles.addBtn} onClick={() => setIsModalOpen(true)}>{curT.addSchedule}</button>
          </div>
          <div style={{marginTop: '15px'}}>
            {repairData.filter(r => r.date === selectedDate).map(r => (
              <div key={r.repairId} style={styles.repairItem} onClick={() => router.push(`/repairs/${r.repairId}`)}>
                <div style={styles.timeTag}>{r.time || "미정"}</div>
                <div style={{flex: 1, marginLeft: '12px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={styles.cardName}>
                      {r.isRollover ? curT.rolloverTag : ""}{r.customerName}
                    </span>
                    <span style={{
                      ...styles.statusTag, 
                      backgroundColor: r.status === '완료' || r.status === 'Completed' ? '#dcfce7' : '#fef9c3'
                    }}>
                      {r.status === '완료' || r.status === 'Completed' ? curT.status.completed : curT.status.pending}
                    </span>
                  </div>
                  <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                    <a href={`tel:${r.customerPhone}`} onClick={(e) => e.stopPropagation()} style={styles.contactBtn}>{curT.call}</a>
                    <a href={`sms:${r.customerPhone}`} onClick={(e) => e.stopPropagation()} style={styles.contactBtn}>{curT.sms}</a>
                    <button onClick={(e) => launchMapApp(e, r)} style={{...styles.contactBtn, backgroundColor: '#f0f9ff', color: '#0369a1', border: 'none'}}>{curT.map}</button>
                  </div>
                </div>
                <button onClick={(e) => deleteSchedule(e, r.repairId)} style={styles.deleteBtn}>{curT.delete}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 모달 등 나머지 UI 로직 동일 */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h4 style={{marginBottom: '15px'}}>{curT.modalTimeTitle}</h4>
            <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} style={styles.timeSelect}>
              {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <h4 style={{margin: '20px 0 10px 0'}}>{curT.modalCustTitle}</h4>
            <input placeholder={curT.modalSearchPlace} style={styles.modalInput} onChange={(e) => setSearchCustomer(e.target.value)} />
            <div style={styles.customerList}>
              {customers.filter(c => c.name.includes(searchCustomer)).map(c => (
                <div key={c.id} style={styles.customerItem} onClick={() => addSchedule(c)}>
                  <strong>{c.name}</strong> 
                  <span style={{fontSize: '0.85rem', color: '#64748b', marginLeft: '10px'}}>{c.phone}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(false)} style={styles.closeModalBtn}>{curT.modalCancel}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 스타일 시트는 동일하므로 생략합니다.


const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f1f5f9" },
  unifiedHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0", position: 'sticky', top: 0, zIndex: 50 },
  iconBtn: { background: "none", border: "none", cursor: "pointer" },
  headerTitle: { fontSize: "1.1rem", fontWeight: "bold", flex: 1, textAlign: 'center' },
  navBtn: { padding: "5px 10px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: '0.8rem', cursor: "pointer" },
  calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', backgroundColor: '#fff', padding: '10px', margin: '10px', borderRadius: '15px' },
  dayHeader: { textAlign: 'center', fontSize: '0.75rem', color: '#64748b', paddingBottom: '5px' },
  dayCell: { height: '60px', padding: '5px', borderRadius: '8px', cursor: 'pointer' },
  countBadge: { backgroundColor: '#0284c7', color: '#fff', fontSize: '0.7rem', padding: '1px 5px', borderRadius: '10px' },
  scheduleList: { margin: '10px', backgroundColor: '#fff', padding: '15px', borderRadius: '15px' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: { backgroundColor: '#0f172a', color: '#38bdf8', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' },
  repairItem: { padding: '12px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', cursor: 'pointer' },
  timeTag: { backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' },
  cardName: { fontWeight: 'bold', fontSize: '1rem' },
  statusTag: { fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' },
  contactBtn: { textDecoration: 'none', fontSize: '0.85rem', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '5px', fontWeight: '600', display: 'flex', alignItems: 'center', cursor: 'pointer' },
  deleteBtn: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modalContent: { backgroundColor:'#fff', width:'90%', maxWidth:'400px', borderRadius:'20px', padding:'20px' },
  timeSelect: { width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #38bdf8', fontSize: '1rem', fontWeight: 'bold' },
  modalInput: { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '10px' },
  customerList: { maxHeight: '200px', overflowY: 'auto' },
  customerItem: { padding: '12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
  closeModalBtn: { width: '100%', marginTop: '15px', padding: '10px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#64748b', cursor: 'pointer' }
};