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

export type PlanCategory = 'health' | 'pa';

export interface PaDismembermentSchedule {
  permanentDisability: number; // ทุพพลภาพโดยถาวร (100%)
  twoLimbsOrEyes: number; // สูญเสียอวัยวะ (แขน,ขา,ตา) 2 ข้างขึ้นไป (100%)
  oneLimbOrEye: number; // สูญเสียอวัยวะ (แขน,ขา,ตา) 1 ข้าง (60%)
  deafBothOrMute: number; // หูหนวก 2 ข้าง หรือเป็นใบ้ (50%)
  thumbTwoJoints: number; // สูญเสียนิ้วหัวแม่มือ 2 ข้อ (25%)
  deafOneEar: number; // หูหนวก 1 ข้าง (15%)
  thumbOneJoint: number; // สูญเสียนิ้วหัวแม่มือ 1 ข้อ (10%)
  indexFingerThreeJoints: number; // สูญเสียนิ้วชี้ 3 ข้อ (10%)
  indexFingerTwoJoints: number; // สูญเสียนิ้วชี้ 2 ข้อ (8%)
  indexFingerOneJoint: number; // สูญเสียนิ้วชี้ 1 ข้อ (4%)
  otherFingersTwoJoints: number; // สูญเสียนิ้วอื่นๆ 2 ข้อ หรือมากกว่า (5%)
  bigToe: number; // สูญเสียนิ้วหัวแม่เท้า (5%)
  otherFingersOneJoint: number; // สูญเสียนิ้วอื่นๆ 1 ข้อ หรือมากกว่า (1%)
  accidentMedicalTreatment?: number; // ค่ารักษาพยาบาลจากอุบัติเหตุ
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
  category?: PlanCategory; // 'health' | 'pa'
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

  // PA Specific Dismemberment Schedule (อบ.2)
  paSchedule?: PaDismembermentSchedule;
}

export interface CustomerPolicyItem {
  policyNumber: string;
  planId: string;
  startDate: string;
  lossClaimRate?: number;
  lossClaimStatus?: string;
}

export interface CustomerProfile {
  idCard: string;
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  phone?: string;
  existingPlanId: string; // The primary current plan they hold
  existingPlanIds?: string[]; // Multiple plans if applicable
  policies?: CustomerPolicyItem[]; // Detailed policies for multi-plan support
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
  coordinatorName?: string; // ผู้ประสานงานโครงการ ชื่อ-นามสกุล
  coordinatorPhone?: string; // เบอร์โทรศัพท์ผู้ประสานงาน
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
