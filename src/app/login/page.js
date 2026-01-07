"use client";

import { auth, googleProvider, checkExistingUser, registerNewUser } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

// 🌐 [다국어 사전] 모든 텍스트를 여기에 몰아넣어 나중에 관리가 아주 편합니다!
const t = {
  ko: {
    tagline: "기사 전용 통합 수리 관리 시스템",
    accountTitle: "계정 관리",
    loginGoogle: "기존 계정으로 로그인",
    registerGoogle: "구글 계정으로 신규 등록",
    or: "또는",
    footerNote: "※ 승인된 기사만 시스템 접속이 가능합니다.",
    alerts: {
      notRegistered: "❌ 등록된 기사 정보가 없습니다. 신규 등록을 먼저 진행해주세요.",
      alreadyRegistered: "이미 등록된 기사님입니다. 기존 로그인을 이용해주세요.",
      confirmRegister: "신규 기사로 등록하시겠습니까?",
      loginError: "로그인 에러:",
      registerError: "등록 에러:"
    }
  },
  en: {
    tagline: "Integrated Repair Management System",
    accountTitle: "Account Management",
    loginGoogle: "Login with Google",
    registerGoogle: "Register with Google Account",
    or: "OR",
    footerNote: "※ Only authorized engineers can access the system.",
    alerts: {
      notRegistered: "❌ No technician information found. Please register first.",
      alreadyRegistered: "Already registered. Please use existing login.",
      confirmRegister: "Would you like to register as a new technician?",
      loginError: "Login Error:",
      registerError: "Registration Error:"
    }
  }
};

export default function LoginPage() {
  const router = useRouter();
  const lang = "ko"; // 👈 나중에 "en"으로 바꾸면 즉시 영어 버전이 됩니다!
  const curT = t[lang];

  // 1. 기존 회원 로그인
  const handleExistingLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isRegistered = await checkExistingUser(result.user.uid);

      if (isRegistered) {
        // [다니엘 지시사항] alert 없이 바로 대시보드로 이동
        window.location.href = "/"; 
      } else {
        alert(curT.alerts.notRegistered);
        await auth.signOut();
      }
    } catch (error) {
      console.error(curT.alerts.loginError, error);
    }
  };

  // 2. 신규 기사 등록
  const handleNewRegistration = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isRegistered = await checkExistingUser(result.user.uid);

      if (isRegistered) {
        alert(curT.alerts.alreadyRegistered);
      } else {
        if (confirm(curT.alerts.confirmRegister)) {
          await registerNewUser(result.user);
          await auth.signOut();
          window.location.reload(); 
        }
      }
    } catch (error) {
      console.error(curT.alerts.registerError, error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoIcon}>🛠️</div>
          <h1 style={styles.appName}>REPAIR MASTER</h1>
          <p style={styles.appTagline}>{curT.tagline}</p>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.actionSection}>
          <h2 style={styles.sectionTitle}>{curT.accountTitle}</h2>
          
          <button onClick={handleExistingLogin} style={styles.loginBtn}>
            <img src="https://www.google.com/favicon.ico" width="18" alt="G" />
            {curT.loginGoogle}
          </button>

          <div style={styles.orText}>{curT.or}</div>

          <button onClick={handleNewRegistration} style={styles.registerBtn}>
            {curT.registerGoogle}
          </button>
        </div>

        <p style={styles.footerNote}>
          {curT.footerNote}
        </p>
      </div>
    </div>
  );
}

// 스타일은 다니엘의 원본 디자인을 그대로 유지합니다.
const styles = {
  container: {
    height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
    backgroundColor: "#0f172a", fontFamily: "'Pretendard', sans-serif"
  },
  card: {
    width: "100%", maxWidth: "400px", padding: "40px", backgroundColor: "#ffffff",
    borderRadius: "24px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", textAlign: "center"
  },
  header: { marginBottom: "30px" },
  logoIcon: { fontSize: "40px", marginBottom: "10px" },
  appName: { fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0 },
  appTagline: { fontSize: "14px", color: "#64748b", marginTop: "5px" },
  divider: { height: "1px", backgroundColor: "#f1f5f9", margin: "25px 0" },
  actionSection: { display: "flex", flexDirection: "column", gap: "10px" },
  sectionTitle: { fontSize: "13px", fontWeight: "600", color: "#94a3b8", textAlign: "left" },
  loginBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    padding: "14px", backgroundColor: "#1e293b", color: "#fff", border: "none",
    borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer"
  },
  registerBtn: {
    padding: "14px", backgroundColor: "#fff", color: "#1e293b", border: "1px solid #e2e8f0",
    borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer"
  },
  orText: { fontSize: "12px", color: "#cbd5e1", margin: "5px 0" },
  footerNote: { fontSize: "11px", color: "#94a3b8", marginTop: "25px" }
};