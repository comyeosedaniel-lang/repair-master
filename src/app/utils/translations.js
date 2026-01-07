// 🌍 Global Dictionary (Integrated Settings)
export const translations = {
  ko: {
    sidebar: {
      dashboard: "🏠 홈 (대시보드)",
      customers: "👥 고객 관리",
      calendar: "📅 수리 일정",
      stats: "📊 매출 통계",
      settings: "⚙️ 설정",
      logout: "🔓 로그아웃",
      logo: "🛠️ REPAIR MASTER",
      hardware: "하드웨어 가이드",
    },
    home: {
      welcome: "안녕하세요, 다니엘!", 
      subtitle: "오늘도 힘차게 시작해볼까요?",
      logout: "로그아웃",
      menu: {
        customers: "고객 정보 관리",
        repairs: "수리 일정",
        statistics: "매출 통계",
        settings: "설정",
        hardware: "🛠️ 하드웨어 가이드", // ✅ 추가
        dataManagement: "💾 데이터 안전 관리",
        backup: "전체 백업",
        restore: "백업 복구"
      },
      alerts: {
        noData: "백업할 데이터가 없습니다.",
        backupDone: "백업 완료! 파일을 안전한 곳에 저장하세요.",
        error: "오류 발생",
        confirmRestore: "데이터를 복구하시겠습니까? 현재 데이터는 덮어씌워집니다.",
        restoreDone: "복구 성공!",
        invalidFile: "잘못된 파일입니다."
      }
    },
    customers: {
      headerTitle: "고객 정보 관리",
      showAddr: true, 
      usePhoneFilter: true,
      logout: "로그아웃",
      regSection: "👤 신규 고객 등록",
      listSection: "🔍 고객 리스트",
      placeholderName: "성함",
      placeholderPhone: "연락처",
      placeholderEmail: "이메일 주소 (선택)",
      placeholderAddr: "주소 검색",
      placeholderDetailAddr: "상세 주소",
      placeholderSearch: "이름 또는 전화번호로 검색",
      btnSearch: "검색",
      btnSave: "🔒 보안 저장",
      moreHint: "상세보기 및 수정 〉",
      emptyText: "등록된 고객이 없습니다.",
      alerts: {
        phoneError: "010 번호가 아닙니다!",
        inputError: "성함과 연락처를 정확히 입력해주세요.",
        saveSuccess: "등록 완료!",
        error: "오류 발생"
      }
    },
    settings: {
      title: "System Settings",
      langLabel: "Select Primary Language",
      saveBtn: "Apply Global Settings",
      saveAlert: "설정이 저장되었습니다!"
    },
    detail: {
      back: "← 뒤로가기",
      header: "고객 상세 정보",
      loading: "데이터를 불러오는 중...",
      name: "성함",
      phone: "연락처",
      address: "주소",
      regDate: "등록일",
      edit: "수정하기",
      delete: "삭제하기"
    },
    repairs: {
      yearUnit: "년",
      monthUnit: "월",
      prev: "이전",
      next: "다음",
      weekDays: ["일", "월", "화", "수", "목", "금", "토"],
      addSchedule: "일정 추가",
      rolloverTag: "[이월] ",
      call: "전화",
      sms: "문자",
      map: "지도",
      delete: "삭제",
      mapPrompt: "길찾기 선택: 1.카카오 2.네이버 3.티맵",
      status: { pending: "진행중", completed: "완료" },
      alerts: {
        rolloverSuccess: "개의 미완료 일정이 오늘로 이월되었습니다.",
        noAddress: "주소가 등록되지 않은 고객입니다.",
        confirmDelete: "이 일정을 삭제하시겠습니까?"
      },
      modalTimeTitle: "방문 시간 선택",
      modalCustTitle: "고객 선택 (검색)",
      modalSearchPlace: "이름 검색...",
      modalCancel: "취소"
    },
    repairDetail: {
      header: "🛠️ 수리 완료 보고서",
      back: "← 뒤로",
      loading: "정보를 불러오는 중...",
      custName: "고객명",
      custPhone: "연락처",
      visitDate: "방문일",
      workDetailLabel: "수리 내용 및 부품 교체 내역",
      workPlaceholder: "예: 메인보드 교체",
      costLabel: "수리 비용 (원)",
      completeBtn: "✅ 수리 완료 및 저장하기",
      alertNoDetail: "수리 내용을 입력해 주세요.",
      alertSuccess: "수리 완료 보고서가 저장되었습니다.",
      statusDone: "완료"
    },
    stats: {
      header: "📈 매출 통계",
      totalRevenue: "누적 총 매출",
      monthlyRevenue: "이번 달 매출",
      completedCount: "수리 완료 건수",
      avgCost: "건당 평균 비용",
      currency: "원",
      currPos: "after",
      unit: "건",
      noData: "통계 데이터가 없습니다."
    },
    info: {
      title: "하드웨어 가이드",
      searchPlaceholder: "부품명, 브랜드 검색...",
      tabs: ["바이오스/장치", "파워/안정성", "부품 매칭", "전문가 툴킷"],
      labels: {
        link: "공식 사이트",
        tip: "팁",
        caution: "주의사항"
      }
    }
  },
  en: {
    sidebar: {
      dashboard: "🏠 Home",
      customers: "👥 Customers",
      calendar: "📅 Schedule",
      stats: "📊 Stats",
      settings: "⚙️ Settings",
      logout: "🔓 Logout",
      logo: "🛠️ REPAIR MASTER",
      hardware: "Hardware Guide",
    },
    home: {
      welcome: "Hello, Daniel!", 
      subtitle: "Shall we start today's work?",
      logout: "Logout",
      menu: {
        customers: "Customers",
        repairs: "Schedule",
        statistics: "Stats",
        settings: "Settings",
        hardware: "🛠️ Hardware Guide", // ✅ 추가
        dataManagement: "💾 Data",
        backup: "Backup",
        restore: "Restore"
      },
      alerts: {
        noData: "No data to backup.",
        backupDone: "Backup completed!",
        error: "Error occurred",
        confirmRestore: "Restore data? Current data will be lost.",
        restoreDone: "Restore successful!",
        invalidFile: "Invalid file."
      }
    },
    customers: {
      headerTitle: "Customer Management",
      showAddr: false,
      usePhoneFilter: false,
      logout: "Logout",
      regSection: "👤 New Registration",
      listSection: "🔍 Customer List",
      placeholderName: "Name",
      placeholderPhone: "Phone",
      placeholderEmail: "Email (Optional)",
      placeholderAddr: "Search Address",
      placeholderDetailAddr: "Detail Address",
      placeholderSearch: "Search name/phone",
      btnSearch: "Search",
      btnSave: "🔒 Save",
      moreHint: "View Details 〉",
      emptyText: "No customers.",
      alerts: {
        phoneError: "Invalid number!",
        inputError: "Please check your input.",
        saveSuccess: "Saved!",
        error: "Error occurred"
      }
    },
    settings: {
      title: "Settings",
      langLabel: "Language",
      saveBtn: "Save Settings",
      saveAlert: "Settings applied!"
    },
    detail: {
      back: "← Back",
      header: "Details",
      loading: "Loading...",
      name: "Name",
      phone: "Phone",
      address: "Address",
      regDate: "Registered",
      edit: "Edit",
      delete: "Delete"
    },
    repairs: {
      yearUnit: "/",
      monthUnit: "",
      prev: "Prev",
      next: "Next",
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      addSchedule: "Add",
      rolloverTag: "[Roll] ",
      call: "Call",
      sms: "SMS",
      map: "Map",
      delete: "Del",
      mapPrompt: "Map: 1.Kakao 2.Naver 3.T-Map",
      status: { pending: "Pending", completed: "Done" },
      alerts: {
        rolloverSuccess: " tasks rolled over.",
        noAddress: "No address.",
        confirmDelete: "Delete?"
      },
      modalTimeTitle: "Select Time",
      modalCustTitle: "Select Customer",
      modalSearchPlace: "Search Name...",
      modalCancel: "Cancel"
    },
    repairDetail: {
      header: "🛠️ Repair Report",
      back: "← Back",
      loading: "Loading...",
      custName: "Customer",
      custPhone: "Phone",
      visitDate: "Date",
      workDetailLabel: "Work Details",
      workPlaceholder: "What did you fix?",
      costLabel: "Cost ($)",
      completeBtn: "✅ Save",
      alertNoDetail: "Enter details.",
      alertSuccess: "Report saved.",
      statusDone: "Completed"
    },
    stats: {
      header: "📈 Stats",
      totalRevenue: "Total Sales",
      monthlyRevenue: "Monthly",
      completedCount: "Completed",
      avgCost: "Average",
      currency: "$",
      currPos: "before",
      unit: "pts",
      noData: "No data."
    },
    info: {
      title: "Hardware Guide",
      searchPlaceholder: "Search components, brands...",
      tabs: ["Drivers", "Diagnostics", "Compatibility", "Maintenance"],
      labels: {
        link: "Official Site",
        tip: "Tips for Daniel",
        caution: "Caution"
      }
    }
  }
};