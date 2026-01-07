import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🍎 여기를 아이폰용으로 조금 더 채웠습니다!
export const metadata = {
  title: "REPAIR MASTER",
  description: "Daniel's Customer Management App",
  // ✅ 아이폰에서 주소창 없이 "진짜 앱"처럼 보이게 해주는 마법의 코드
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Repair Master",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 🚀 주소 API (다니엘이 잘 챙겨두신 것!) */}
        <Script 
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" 
          strategy="beforeInteractive" 
        />
        {/* 📱 아이폰 홈 화면 아이콘 설정 (그림 파일 없어도 일단 넣어두면 나중에 편해요) */}
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}