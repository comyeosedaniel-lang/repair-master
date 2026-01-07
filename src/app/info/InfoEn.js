"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; 

export default function InfoPageEn() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 

  // 📝 영어 버전 탭 제목
  const tabs = ["BIOS/Setup", "Power/Diag", "Compatibility", "Pro Toolkit"];

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header style={styles.header}>
        <button onClick={() => setIsMenuOpen(true)} style={styles.menuBtn}>☰</button>
        <h2 style={styles.headerTitle}>PC Hardware Master Guide</h2>
        <div style={{width: 30}} />
      </header>

      <main style={styles.viewPort}>
        <div style={styles.tabBar}>
          {tabs.map((tab, idx) => (
            <button key={idx} onClick={() => setActiveTab(idx)}
              style={{...styles.tabBtn, color: activeTab === idx ? "#38bdf8" : "#94a3b8", borderBottom: activeTab === idx ? "2px solid #38bdf8" : "none"}}
            >{tab}</button>
          ))}
        </div>

        <div style={styles.contentArea}>
          
          {/* 1️⃣ Tab: BIOS & Installation */}
          {activeTab === 0 && (
            <div style={styles.fadeAnim}>
              <Section title="⌨️ BIOS / Boot Menu Shortcuts">
                <Table headers={["Brand", "BIOS", "Boot Menu"]} 
                       rows={[
                         ["ASUS/MSI/ASRock", "DEL", "F8 / F11"],
                         ["GIGABYTE", "DEL", "F12"],
                         ["Samsung / Dell", "F2", "F10 / F12"],
                         ["HP / Lenovo", "F10 / F1", "F9 / F12"]
                       ]} />
              </Section>
              
              <Section title="⚠️ Device Manager Yellow Icons">
                <Tip color="#f0f9ff" borderColor="#38bdf8">
                  • <strong>SM Bus Controller</strong>: Install Chipset Driver<br/>
                  • <strong>PCI Simple Communications</strong>: Install Intel ME Driver<br/>
                  • <strong>Unknown Device</strong>: Right-click → Details → Hardware ID
                </Tip>
              </Section>
            </div>
          )}

          {/* 2️⃣ Tab: Power & Stability */}
          {activeTab === 1 && (
            <div style={styles.fadeAnim}>
              <Section title="⚡ PSU Power Calculation">
                <div style={styles.calcBox}>
                  <strong>(CPU TDP + GPU TDP + 50W) = Total Load</strong>
                </div>
                <Tip color="#f8fafc" borderColor="#cbd5e1">
                  • 50~70%: Best (High Efficiency, Quiet)<br/>
                  • 70~85%: Normal (Standard Gaming PC)<br/>
                  <span style={{color: '#ef4444'}}>• 90%+: Danger (PSU Upgrade Required)</span>
                </Tip>
              </Section>

              <Section title="🛠️ Essential Diagnostics">
                <div style={styles.toolGrid}>
                  <div style={styles.toolItem}><strong>Cinebench</strong>: CPU Benchmark</div>
                  <div style={styles.toolItem}><strong>TM5 / MemTest86</strong>: RAM Stress Test</div>
                  <div style={styles.toolItem}><strong>CrystalDiskInfo</strong>: SSD Health Check</div>
                  <div style={styles.toolItem}><strong>OCCT</strong>: System Stability Test</div>
                </div>
              </Section>
            </div>
          )}

          {/* 3️⃣ Tab: Compatibility & Anti-Fraud */}
          {activeTab === 2 && (
            <div style={styles.fadeAnim}>
              <Section title="🔍 Motherboard 'at x4' Warning">
                <Tip color="#fef2f2" borderColor="#ef4444">
                  <strong>Beware of "at x4" Slots!</strong><br/>
                  If a slot looks like x16 but says <strong>PCIe 4.0 x16 (at x4)</strong>, it only has 1/4 the bandwidth. Huge performance loss for high-end GPUs.
                </Tip>
              </Section>

              <Section title="🔵 Intel / 🔴 AMD Socket Matrix">
                <Table headers={["CPU Gen", "Socket", "Chipset"]} 
                       rows={[
                         ["Intel Ultra (200)", "LGA 1851", "Z890, B860"],
                         ["Intel 12~14th", "LGA 1700", "Z790, B760"],
                         ["AMD 9000/7000", "AM5", "X870, B650"],
                         ["AMD 5000/3000", "AM4", "X570, B550"]
                       ]} />
              </Section>
            </div>
          )}

          {/* 4️⃣ Tab: Toolkit & Maintenance */}
          {activeTab === 3 && (
            <div style={styles.fadeAnim}>
              <Section title="🛠️ Professional Repair Kit">
                <div style={styles.toolGrid}>
                  <div style={styles.toolItem}>🪛 <strong>Mijia Precision</strong>: For M.2 & Laptops</div>
                  <div style={styles.toolItem}>💾 <strong>IODD</strong>: ISO Virtual Drive (Highly Rec.)</div>
                  <div style={styles.toolItem}>📏 <strong>PSU Tester</strong>: Real-time Voltage Check</div>
                  <div style={styles.toolItem}>🧼 <strong>IPA (99%)</strong>: For Thermal Paste Removal</div>
                </div>
              </Section>

              <Section title="❄️ Cooling & Cable Tips">
                <Tip color="#f0fdf4" borderColor="#22c55e">
                  • <strong>12VHPWR Cable</strong>: Leave <strong>3.5cm (1.4")</strong> slack to prevent melting!<br/>
                  • <strong>AIO Lifespan</strong>: 5~7 years. Check for pump noise.<br/>
                  • <strong>XMP / EXPO</strong>: Enable in BIOS for full RAM speed.
                </Tip>
              </Section>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// 💡 Helper Components & Styles (Same as page.js, omitted for brevity)
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