"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// ✅ 상세 페이지는 깊이가 2단계 더 깊으므로 ../../ 입니다. [cite: 2026-01-04]
import Sidebar from "../../components/Sidebar"; 
import { translations } from "../../utils/translations";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lang, setLang] = useState("ko");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  const curT = translations[lang]?.detail || translations.ko.detail || {};

  useEffect(() => {
    const saved = localStorage.getItem("c_data");
    if (saved) {
      const found = JSON.parse(saved).find(item => item.id === id);
      if (found) {
        setCustomer({
          name: decodeURIComponent(atob(found.n)),
          phone: decodeURIComponent(atob(found.p)),
          email: decodeURIComponent(atob(found.e || "")),
          address: decodeURIComponent(atob(found.a || "")),
          date: decodeURIComponent(atob(found.d))
        });
      }
    }
  }, [id]);

  if (!customer) return <div style={{padding: '20px'}}>Loading...</div>;

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <header style={styles.header}>
        <button onClick={() => router.back()} style={styles.backBtn}>←</button>
        <h2 style={styles.headerTitle}>{curT.header || "Detail"}</h2>
        <button onClick={() => setIsMenuOpen(true)} style={styles.hamburgerBtn}>☰</button>
      </header>
      <main style={{padding: '20px'}}>
        <div style={styles.infoCard}>
          <p><strong>{curT.name}:</strong> {customer.name}</p>
          <p><strong>{curT.phone}:</strong> {customer.phone}</p>
          <p><strong>{curT.email}:</strong> {customer.email}</p>
          <p><strong>{curT.address}:</strong> {customer.address}</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f1f5f9" },
  header: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: '#fff' },
  backBtn: { border: 'none', background: 'none', fontSize: '1.2rem' },
  headerTitle: { fontSize: '1.1rem', fontWeight: 'bold' },
  hamburgerBtn: { border: 'none', background: 'none', fontSize: '1.5rem' },
  infoCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px' }
};