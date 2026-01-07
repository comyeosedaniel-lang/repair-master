import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  initializeFirestore, 
  CACHE_SIZE_UNLIMITED 
} from "firebase/firestore";

// 1. 다니엘의 보안 설정값
const firebaseConfig = {
  apiKey: "AIzaSyAD0DdqkrhdOMz-xdFxZqDuNk1JwAzTzII",
  authDomain: "my-repair-app-726f5.firebaseapp.com",
  projectId: "my-repair-app-726f5",
  storageBucket: "my-repair-app-726f5.firebasestorage.app",
  messagingSenderId: "579219313192",
  appId: "1:5792193132:web:262a773d11de57a3f71b1d"
};

// 2. Firebase 앱 시동
const app = initializeApp(firebaseConfig);

// 3. 도구들 내보내기 (중복 없이 한 번만 설정)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/** * [네트워크 보강 버전 DB 설정]
 * 오프라인 에러를 방지하기 위해 캐시 설정을 추가한 초기화 방식입니다.
 */
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

/**
 * [기사 확인 함수]
 * DB의 'technicians' 목록에 해당 UID가 있는지 검사합니다.
 */
export const checkExistingUser = async (uid) => {
  if (!uid) return false;
  try {
    const userRef = doc(db, "technicians", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (e) {
    console.error("DB 접근 불가 (오프라인/권한문제):", e);
    return false;
  }
};

/**
 * [기사 등록 함수]
 * 새로운 기사님의 정보를 DB에 저장합니다.
 */
export const registerNewUser = async (user) => {
  try {
    const userRef = doc(db, "technicians", user.uid);
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      joinedAt: new Date()
    });
  } catch (e) {
    console.error("기사 등록 실패:", e);
  }
};