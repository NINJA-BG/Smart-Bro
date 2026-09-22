export interface PlanBenefitPerNight {
  perNight: number;
  maxLimit: number;
  note?: string;
}

export interface PlanOPDCoverage {
  accident: number;
  illness: {
    covered: boolean;
    perVisit?: number;
    maxVisitsPerYear?: number;
    note?: string;
  };
}

export interface PlanLifeCoverage {
  accidentGeneral: number;
  murderAssault: number;
  motorcycle: number;
  funeralBenefit: number;
}

export interface AgeEligibility {
  minAge: number; // e.g. 15 or 1 (or 6 for 610)
  maxAge: number; // e.g. 60 or 65
  description?: string;
}

export interface InsurancePlan {
  id: string;
  code: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  monthlyPremium: number;
  annualPremium: number;
  
  // Age eligibility criteria
  minAge: number;
  maxAge: number;
  ageRangeText: string;

  // Section 1: Inpatient & Room
  roomNormal: PlanBenefitPerNight;
  roomICU: PlanBenefitPerNight;
  medicalGeneralPerVisit: number;
  surgeryPerDisorder: number;
  doctorVisitPerNight: PlanBenefitPerNight;
  opd: PlanOPDCoverage;

  // Section 2: Compensation
  dailyCompensation: PlanBenefitPerNight;
  otherRightsNormalRoom: PlanBenefitPerNight;
  otherRightsICU: PlanBenefitPerNight;

  // Section 3: Life Coverage
  life: PlanLifeCoverage;
}

export interface CustomerProfile {
  idCard: string;
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  phone?: string;
  existingPlanId: string; // The current plan they hold
  policyNumber: string;
  startDate: string;
  lossClaimRate: number; // Percentage e.g. 0, 15, 48
  lossClaimStatus: string; // e.g. '0% (ไม่มีประวัติเคลม)', '15% (ประวัติดี)'
  lineOaRegistered: boolean; // true = ลงทะเบียนแล้ว, false = ยังไม่ลงทะเบียน
  lineOaStatusText: string;
}

export type ViewFilterMode = 'all' | 'differences_only';

export interface ExportMeta {
  customerName: string; // ชื่อผู้ถูกนำเสนอแผน (ระบุหรือไม่ระบุก็ได้)
  agentFirstName: string; // ชื่อผู้แทน
  agentLastName: string; // นามสกุลผู้แทน
  agentOfficeCode: string; // รหัสสำนักงาน
  agentPhone: string; // เบอร์ติดต่อของผู้แทน
  date: string;
  notes: string;
}

export interface ComparisonHistoryItem {
  id: string;
  createdAt: string; // ISO string
  formattedDate: string; // วันที่จัดทำ
  customerName: string; // ชื่อลูกค้า หรือว่าง
  isMarked: boolean; // มาร์กไว้สำหรับติดตาม / นำส่งอีกรอบ
  selectedPlanIds: string[];
  selectedPlanNames: string[];
  agentFirstName: string;
  agentLastName: string;
  agentOfficeCode: string;
  agentPhone: string;
  userAge?: number | null;
  existingCustomerIdCard?: string | null;
  notes?: string;
}
