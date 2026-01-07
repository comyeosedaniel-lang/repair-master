"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; 
import { translations } from "../utils/translations";

export default function InfoPage() {
  const [lang, setLang] = useState("ko");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  const [search, setSearch] = useState("");

  const curT = translations[lang]?.info || translations.ko.info;

  useEffect(() => {
    const saved = localStorage.getItem("app_settings");
    if (saved) setLang(JSON.parse(saved).lang || "ko");
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header style={styles.header}>
        <button onClick={() => setIsMenuOpen(true)} style={styles.menuBtn}>☰</button>
        <h2 style={styles.headerTitle}>{curT.title}</h2>
        <div style={{width: 30}} />
      </header>

      <main style={styles.viewPort}>
        {/* 탭 메뉴 */}
        <div style={styles.tabBar}>
          {curT.tabs?.map((tab, idx) => (
            <button key={idx} onClick={() => setActiveTab(idx)}
              style={{...styles.tabBtn, color: activeTab === idx ? "#38bdf8" : "#94a3b8", borderBottom: activeTab === idx ? "2px solid #38bdf8" : "none"}}
            >{tab}</button>
          ))}
        </div>

        <div style={styles.contentArea}>
          
          {/* 1️⃣ 탭: 바이오스 & 설치 가이드 */}
          {activeTab === 0 && (
            <div style={styles.fadeAnim}>
              <Section title="⌨️ 브랜드별 BIOS/부팅 단축키">
                <Table headers={["브랜드", "BIOS", "Boot Menu"]} 
                       rows={[
                         ["ASUS/MSI/ASRock", "DEL", "F8 / F11"],
                         ["GIGABYTE", "DEL", "F12"],
                         ["Samsung/LG", "F2", "F10"],
                         ["HP / Dell", "F10 / F2", "F9 / F12"]
                       ]} />
              </Section>
              
              <Section title="⚠️ 장치 관리자 노란 느낌표 판독">
                <Tip color="#f0f9ff" borderColor="#38bdf8">
                  • <strong>SM 버스 컨트롤러</strong>: 칩셋 드라이버 설치<br/>
                  • <strong>PCI 단순 통신</strong>: Intel ME 드라이버 설치<br/>
                  • <strong>알 수 없는 장치</strong>: 우클릭 → 상세 → 하드웨어 ID 확인
                </Tip>
              </Section>

              <Section title="📋 드라이버 설치 권장 순서">
                <div style={styles.listText}>1. 칩셋 → 2. 저장장치(NVMe) → 3. VGA → 4. 사운드/랜</div>
              </Section>
            </div>
          )}

          {/* 2️⃣ 탭: 진단 & 안정성 가이드 */}
          {activeTab === 1 && (
            <div style={styles.fadeAnim}>
              <Section title="⚡ 파워 용량 부족/적정 판독법">
                <div style={styles.calcBox}>
                  <strong>(CPU 사용 전력 + GPU 사용 전력 + 50W) = 총 요구량</strong>
                </div>
                <Tip color="#f8fafc" borderColor="#cbd5e1">
                  • 50~70%: 베스트 (저소음, 고효율)<br/>
                  • 70~85%: 적정 (일반 조립 PC)<br/>
                  <span style={{color: '#ef4444'}}>• 90% 이상: 위험 (교체 권장)</span>
                </Tip>
              </Section>

              <Section title="🌡️ 전압 안정성 확인 (HWiNFO64)">
                <Tip color="#fffbeb" borderColor="#f59e0b">
                  <strong>+12V 항목 체크</strong>: 부하 시에도 <strong>11.6V ~ 12.4V</strong> 사이를 유지하는지 필히 확인!
                </Tip>
              </Section>

              <Section title="🛠️ 필수 진단 툴 가이드">
                <div style={styles.toolGrid}>
                  <div style={styles.toolItem}><strong>Cinebench</strong>: CPU 성능 표준</div>
                  <div style={styles.toolItem}><strong>TM5 / MemTest86</strong>: 메모리 오류 검출</div>
                  <div style={styles.toolItem}><strong>CrystalDiskInfo</strong>: SSD 건강상태</div>
                  <div style={styles.toolItem}><strong>OCCT</strong>: 시스템 종합 안정성</div>
                </div>
              </Section>
            </div>
          )}

          {/* 3️⃣ 탭: 부품 궁합 & 사기 판독 */}
          {activeTab === 2 && (
            <div style={styles.fadeAnim}>
              <Section title="🔍 메인보드 '사기' 판독법">
                <Tip color="#fef2f2" borderColor="#ef4444">
                  <strong>"at x4"를 조심하세요!</strong><br/>
                  슬롯이 x16 크기라도 <strong>PCIe 4.0 x16 (at x4)</strong>라고 적혀 있다면 속도는 1/4 토막입니다. 외장 그래픽 성능을 다 못 뽑습니다.
                </Tip>
              </Section>

              <Section title="🔵 Intel / 🔴 AMD 매칭표">
                <Table headers={["CPU 세대", "소켓", "추천 칩셋"]} 
                       rows={[
                         ["Intel Ultra (200)", "LGA 1851", "Z890, B860"],
                         ["Intel 12~14th", "LGA 1700", "Z790, B760, H610"],
                         ["AMD 9000/7000", "AM5", "X870, B650, A620"],
                         ["AMD 5000/3000", "AM4", "X570, B550, B450"]
                       ]} />
              </Section>

              <Section title="🎮 그래픽 대역폭 주의사항">
                <div style={styles.listText}>
                  • RTX 4060 등 x8 레인 카드는 PCIe 3.0 보드 사용 시 성능 저하 가능<br/>
                  • 라이저 케이블 사용 시 버전(3.0/4.0) 일치 여부 확인 필수
                </div>
              </Section>
            </div>
          )}

          {/* 4️⃣ 탭: 전문가 툴킷 & 유지보수 */}
          {activeTab === 3 && (
            <div style={styles.fadeAnim}>
              <Section title="🛠️ 현장 필수 정비 도구">
                <div style={styles.toolGrid}>
                  <div style={styles.toolItem}>🪛 <strong>샤오미 전동</strong>: M.2/노트북용 저토크</div>
                  <div style={styles.toolItem}>💾 <strong>IODD</strong>: ISO 가상 드라이브 (필수)</div>
                  <div style={styles.toolItem}>📏 <strong>파워 테스터</strong>: 전압/PG값 실시간 확인</div>
                  <div style={styles.toolItem}>🧼 <strong>절연 알코올</strong>: 서멀 제거/접점 부위 청소</div>
                </div>
              </Section>

              <Section title="❄️ 수냉 쿨러 & 케이스 팁">
                <Tip color="#f0fdf4" borderColor="#22c55e">
                  • <strong>12VHPWR 케이블</strong>: 꺾임 방지를 위해 <strong>3.5cm 여유</strong> 두고 정리!<br/>
                  • <strong>수냉 수명</strong>: 보통 5~7년. 펌프 소음 발생 시 교체 시기.<br/>
                  • <strong>호환성</strong>: 케이스 상단 라디에이터 크기(240/360) 필히 확인.
                </Tip>
              </Section>

              <Section title="📘 핵심 용어 사전">
                <div style={styles.listText}>
                  • <strong>XMP/EXPO</strong>: 클릭 한 번으로 램 오버클럭<br/>
                  • <strong>Resizable BAR</strong>: CPU가 글카 메모리에 직접 접근 (성능 향상)
                </div>
              </Section>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// 헬퍼 컴포넌트: 가독성을 위해 분리
const Section = ({ title, children }) => (
  <div style={{ marginBottom: '25px' }}>
    <h4 style={styles.sectionTitle}>{title}</h4>
    {children}
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={styles.tableWrapper}>
    <table style={styles.table}>
      <thead style={styles.th}>
        <tr>{headers.map((h, i) => <th key={i} style={{padding: '10px'}}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 ? '#f8fafc' : '#fff' }}>
            {row.map((cell, j) => <td key={j} style={{padding: '10px'}}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Tip = ({ color, borderColor, children }) => (
  <div style={{ ...styles.tipBox, backgroundColor: color, borderLeftColor: borderColor }}>
    {children}
  </div>
);

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f1f5f9" },
  header: { padding: "15px", backgroundColor: "#fff", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0" },
  menuBtn: { fontSize: "1.5rem", background: "none", border: "none", cursor: 'pointer' },
  headerTitle: { fontSize: "1rem", fontWeight: "bold", color: "#1e293b" },
  viewPort: { padding: "15px" },
  tabBar: { display: "flex", gap: "10px", borderBottom: "1px solid #e2e8f0", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" },
  tabBtn: { padding: "10px 5px", background: "none", border: "none", fontWeight: "bold", whiteSpace: "nowrap", fontSize: "0.85rem" },
  contentArea: { backgroundColor: "#fff", padding: "20px", borderRadius: "20px", minHeight: "500px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  sectionTitle: { fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '12px', color: '#0f172a' },
  tableWrapper: { overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' },
  th: { backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' },
  tipBox: { padding: '15px', borderRadius: '12px', borderLeft: '4px solid', fontSize: '0.85rem', lineHeight: '1.7', color: '#334155' },
  calcBox: { padding: '12px', backgroundColor: '#0f172a', color: '#38bdf8', borderRadius: '10px', marginBottom: '10px', fontSize: '0.85rem', textAlign: 'center' },
  toolGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  toolItem: { padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
  listText: { fontSize: '0.85rem', color: '#475569', lineHeight: '1.8' },
  fadeAnim: { animation: 'fadeIn 0.3s ease-in' }
};