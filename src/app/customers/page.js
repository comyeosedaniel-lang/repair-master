"use client";

import { useState, useEffect, useMemo } from "react"; // ✅ useMemo 추가
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar"; 
import { translations } from "../utils/translations";

export default function CustomerPage() {
  const router = useRouter();
  const [lang, setLang] = useState("ko");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // ⏳ 1. 로딩 상태: 언어 설정을 다 읽어오기 전까지 잠깐 대기합니다. [cite: 2026-01-03]
  const [isLoading, setIsLoading] = useState(true); 

  const [myCustomers, setMyCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({ 
    name: "", phone: "", email: "", address: "", detailAddress: "" 
  });

  const decrypt = (t) => { try { return decodeURIComponent(atob(t)); } catch(e) { return t; } };
  const encrypt = (t) => btoa(encodeURIComponent(t || ""));

  useEffect(() => {
    // ⚙️ 2. 로컬 스토리지에서 언어 설정 불러오기 [cite: 2026-01-06]
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setLang(parsed.lang || "ko");
    }
    
    // 로딩 끝! 이제 화면을 그려도 됩니다.
    setIsLoading(false); 

    const saved = localStorage.getItem("c_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMyCustomers(parsed.map(item => ({
        id: item.id,
        name: decrypt(item.n),
        phone: decrypt(item.p),
        email: decrypt(item.e || ""),
        address: decrypt(item.a || ""),
        date: decrypt(item.d)
      })));
    }
  }, []);

  // 🌍 3. 실시간 번역 데이터 계산: lang이 바뀔 때마다 번역 바구니(curT)를 새로 업데이트합니다. [cite: 2026-01-03]
  const curT = useMemo(() => {
    return translations[lang]?.customers || translations.ko.customers || {};
  }, [lang]);

  // 로딩 중일 때는 아무것도 보여주지 않습니다. (언어 꼬임 방지) [cite: 2026-01-03]
  if (isLoading) return null; 

  // 📞 전화번호 입력 필터링
  const handlePhoneInput = (value) => {
    if (!curT.usePhoneFilter) {
      setNewCustomer({ ...newCustomer, phone: value });
      return;
    }
    const num = value.replace(/[^\d]/g, "");
    let formatted = num;
    if (num.length > 3 && num.length <= 7) {
      formatted = `${num.slice(0, 3)}-${num.slice(3)}`;
    } else if (num.length > 7) {
      formatted = `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
    }
    setNewCustomer({ ...newCustomer, phone: formatted });
  };

  const handleAddressSearch = () => {
    if (typeof window !== "undefined" && window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data) {
          setNewCustomer(prev => ({ ...prev, address: data.address }));
        }
      }).open();
    } else {
      alert("주소 서비스 로딩 중입니다.");
    }
  };

  // 💾 고객 정보 저장 로직 수정
  const handleSave = () => {
    // 1. 유효성 검사: 이름과 전화번호는 필수입니다.
    const minPhoneLength = curT.usePhoneFilter ? 13 : 1; 
    if (!newCustomer.name || newCustomer.phone.length < minPhoneLength) {
      return alert(curT.alerts?.inputError || "정보를 정확히 입력해주세요.");
    }
    
    // 2. 보안 데이터 생성 (다니엘의 암호화 방식 유지) [cite: 2026-01-03]
    const secureEntry = {
      id: `c_${Date.now()}`, 
      n: encrypt(newCustomer.name),
      p: encrypt(newCustomer.phone),
      e: encrypt(newCustomer.email),
      a: encrypt(`${newCustomer.address} ${newCustomer.detailAddress}`.trim()),
      d: encrypt(new Date().toLocaleString())
    };

    try {
      // 3. 폰(localStorage)에서 기존 데이터를 가져옵니다. [cite: 2026-01-06]
      const currentRaw = JSON.parse(localStorage.getItem("c_data") || "[]");
      const updatedRaw = [secureEntry, ...currentRaw];
      
      // 4. 새 목록을 저장합니다.
      localStorage.setItem("c_data", JSON.stringify(updatedRaw));

      // 5. 🚀 [중요] 화면을 새로고침하지 않고 리스트를 즉시 업데이트합니다. [cite: 2026-01-03]
      const newDisplayItem = {
        id: secureEntry.id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        address: `${newCustomer.address} ${newCustomer.detailAddress}`.trim(),
        date: new Date().toLocaleString()
      };
      setMyCustomers([newDisplayItem, ...myCustomers]);

      // 6. 입력창 비우기
      setNewCustomer({ name: "", phone: "", email: "", address: "", detailAddress: "" });
      alert(curT.alerts?.saveSuccess || "다니엘의 폰에 안전하게 저장되었습니다! ✅");

    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      alert("저장 공간이 부족하거나 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      {/* 🚀 사이드바에도 현재 lang을 전달하여 일관성을 유지합니다. [cite: 2026-01-06] */}
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} lang={lang} />

      <header style={styles.mainHeader}>
        <button onClick={() => setIsMenuOpen(true)} style={styles.hamburgerBtn}>☰</button>
        <h2 style={styles.headerTitle}>{curT.headerTitle}</h2>
        <button onClick={() => signOut(auth).then(() => router.push("/"))} style={styles.logoutBtn}>{curT.logout}</button>
      </header>

      <main style={styles.viewPort}>
        <div style={styles.contentCard}>
          <h3 style={styles.sectionTitle}>{curT.regSection}</h3>
          <div style={styles.formGrid}>
            <input placeholder={curT.placeholderName} value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name:e.target.value})} style={styles.input} />
            <input placeholder={curT.placeholderPhone} value={newCustomer.phone} onChange={e => handlePhoneInput(e.target.value)} style={styles.input} />
            <input placeholder={curT.placeholderEmail} value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email:e.target.value})} style={styles.input} />
            
            <input 
              placeholder={curT.placeholderAddr || "Address"} 
              value={newCustomer.address} 
              onClick={curT.usePhoneFilter ? handleAddressSearch : undefined} 
              readOnly={curT.usePhoneFilter} 
              onChange={e => !curT.usePhoneFilter && setNewCustomer({...newCustomer, address: e.target.value})}
              style={{
                ...styles.input, 
                cursor: curT.usePhoneFilter ? 'pointer' : 'text', 
                backgroundColor: curT.usePhoneFilter ? '#f8fafc' : '#fff'
              }} 
            />

            <input 
              placeholder={curT.placeholderDetailAddr || "Suite/Apt #"} 
              value={newCustomer.detailAddress} 
              onChange={e => setNewCustomer({...newCustomer, detailAddress:e.target.value})} 
              style={styles.input} 
            />
            
            <button onClick={handleSave} style={styles.saveBtn}>{curT.btnSave}</button>
          </div>
        </div>

        <div style={{margin: '20px 0'}} />

        <div style={styles.listCard}>
          <h3 style={styles.sectionTitle}>{curT.listSection}</h3>
          <input 
            placeholder={curT.placeholderSearch} 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={styles.searchInput} 
          />
          <div style={styles.scrollArea}>
            {myCustomers
              .filter(c => c.name.includes(searchTerm) || c.phone.includes(searchTerm))
              .map(c => (
                <div key={c.id} style={styles.customerItem} onClick={() => router.push(`/customers/${c.id}`)}>
                  <div>
                    <div style={styles.itemName}>{c.name}</div>
                    <div style={styles.itemPhone}>{c.phone}</div>
                  </div>
                  <div style={styles.itemDate}>{c.date ? c.date.split(",")[0] : "-"}</div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f1f5f9" },
  mainHeader: { padding: "10px 20px", backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" },
  hamburgerBtn: { fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" },
  headerTitle: { fontSize: "1rem", fontWeight: "bold" },
  logoutBtn: { color: '#ef4444', border: '1px solid #fee2e2', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' },
  viewPort: { padding: "15px" },
  contentCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  listCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", maxHeight: '450px', display: 'flex', flexDirection: 'column' },
  sectionTitle: { fontSize: "1rem", marginBottom: "15px", fontWeight: "bold" },
  formGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "1rem" },
  saveBtn: { padding: "14px", backgroundColor: "#0f172a", color: "#38bdf8", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: 'pointer' },
  searchInput: { padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "15px" },
  scrollArea: { overflowY: 'auto', flex: 1 },
  customerItem: { padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  itemName: { fontWeight: 'bold', fontSize: '1.1rem' },
  itemPhone: { color: '#38bdf8', fontSize: '0.9rem' },
  itemDate: { fontSize: '0.75rem', color: '#94a3b8' }
};