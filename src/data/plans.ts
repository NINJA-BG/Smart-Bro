import { InsurancePlan } from '../types';

export const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: 'plan-15-i',
    code: '15-I',
    name: 'แผน 15-I',
    badge: 'คุ้มครองชีวิตสูง',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'เน้นผู้ป่วยใน (IPD) ค่าห้อง 1,200 บ. คุ้มครองอุบัติเหตุสูง 200,000 บ.',
    monthlyPremium: 1590,
    annualPremium: 19080,
    minAge: 15,
    maxAge: 60,
    ageRangeText: '15 - 60 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 2000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครอง',
      },
    },
    dailyCompensation: {
      perNight: 300,
      maxLimit: 30000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsNormalRoom: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 200000,
      murderAssault: 100000,
      motorcycle: 100000,
      funeralBenefit: 20000,
    },
  },
  {
    id: 'plan-15-o',
    code: '15-O',
    name: 'แผน 15-O',
    badge: 'ยอดนิยม ครบ OPD+IPD',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'ครบทั้งผู้ป่วยใน (IPD) และผู้ป่วยนอก OPD โรคทั่วไป 500 บ./ครั้ง (9 ครั้ง/ปี)',
    monthlyPremium: 1890,
    annualPremium: 22680,
    minAge: 15,
    maxAge: 60,
    ageRangeText: '15 - 60 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 2000,
      illness: {
        covered: true,
        perVisit: 500,
        maxVisitsPerYear: 9,
        note: '500 บ. (9 ครั้ง/ปี)',
      },
    },
    dailyCompensation: {
      perNight: 300,
      maxLimit: 30000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsNormalRoom: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 200000,
      murderAssault: 100000,
      motorcycle: 100000,
      funeralBenefit: 20000,
    },
  },
  {
    id: 'plan-610-i',
    code: '610-I',
    name: 'แผน 610-I',
    badge: 'เบี้ยประหยัดสุด',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'เบี้ยสบายกระเป๋าเพียง 590 บ./เดือน คุ้มครองผู้ป่วยในและชีวิต 200,000 บ.',
    monthlyPremium: 590,
    annualPremium: 7080,
    minAge: 6,
    maxAge: 65,
    ageRangeText: '6 - 65 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 2000,
      illness: {
        covered: false,
        note: 'ไม่คุ้มครอง',
      },
    },
    dailyCompensation: {
      perNight: 300,
      maxLimit: 30000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsNormalRoom: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 200000,
      murderAssault: 100000,
      motorcycle: 100000,
      funeralBenefit: 20000,
    },
  },
  {
    id: 'plan-610-o',
    code: '610-O',
    name: 'แผน 610-O',
    badge: 'ชดเชยรายวันสูงพิเศษ',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'ชดเชยรายวันสูงสุด 1,200 บ./คืน (กรณีใช้สิทธิ์อื่นได้ 3,000 บ.) + OPD 500 บ. (9 ครั้ง/ปี)',
    monthlyPremium: 790,
    annualPremium: 9480,
    minAge: 6,
    maxAge: 65,
    ageRangeText: '6 - 65 ปี',
    roomNormal: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
    },
    roomICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
    },
    medicalGeneralPerVisit: 10000,
    surgeryPerDisorder: 30000,
    doctorVisitPerNight: {
      perNight: 300,
      maxLimit: 13500,
      note: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
    },
    opd: {
      accident: 2000,
      illness: {
        covered: true,
        perVisit: 500,
        maxVisitsPerYear: 9,
        note: '500 บ. (9 ครั้ง/ปี)',
      },
    },
    dailyCompensation: {
      perNight: 1200,
      maxLimit: 54000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค (สูงกว่าแผนอื่น 4 เท่า)',
    },
    otherRightsNormalRoom: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค (สูงกว่าแผนอื่น 2.5 เท่า)',
    },
    otherRightsICU: {
      perNight: 3000,
      maxLimit: 90000,
      note: 'สูงสุด ต่อครั้ง ต่อโรค',
    },
    life: {
      accidentGeneral: 3000,
      murderAssault: 3000,
      motorcycle: 3000,
      funeralBenefit: 3000,
    },
  },
];

export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('th-TH').format(val);
};

export interface DiffRowItem {
  id: string;
  category: string;
  title: string;
  subTitle?: string;
  values: { [planId: string]: string };
  isDifferent: boolean;
  highlightNote?: string;
}

export function analyzeDifferences(selectedPlans: InsurancePlan[]): DiffRowItem[] {
  if (selectedPlans.length === 0) return [];

  const rows: {
    id: string;
    category: string;
    title: string;
    subTitle?: string;
    getter: (p: InsurancePlan) => string;
    highlightNote?: string;
  }[] = [
    // ข้อมูลทั่วไปและคุณสมบัติ
    {
      id: 'plan-age-range',
      category: 'คุณสมบัติผู้สมัคร',
      title: 'เกณฑ์อายุที่รับประกันภัย',
      subTitle: 'ช่วงอายุผู้เอาประกันภัยที่สามารถสมัครได้',
      getter: (p) => p.ageRangeText,
      highlightNote: 'แผนตระกูล 15 รับอายุ 15-60 ปี ส่วนแผน 610 ขยายรับอายุ 6-65 ปี',
    },
    // เบี้ยประกัน
    {
      id: 'premium-monthly',
      category: 'เบี้ยประกันภัย',
      title: 'เบี้ยประกันภัยรายเดือน',
      subTitle: 'คำนวณชำระแบบรายเดือน',
      getter: (p) => `${formatCurrency(p.monthlyPremium)} บาท`,
    },
    {
      id: 'premium-annual',
      category: 'เบี้ยประกันภัย',
      title: 'เบี้ยประกันภัยรายปี',
      subTitle: 'คำนวณชำระแบบรายปี',
      getter: (p) => `${formatCurrency(p.annualPremium)} บาท`,
    },
    // ส่วนที่ 1: ค่าห้อง ค่าอาหาร
    {
      id: 'room-normal',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '1.1 ค่าห้อง ค่าอาหาร ผู้ป่วยปกติ ต่อคืน',
      subTitle: 'สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค',
      getter: (p) => `${formatCurrency(p.roomNormal.perNight)} บ. (สูงสุด ${formatCurrency(p.roomNormal.maxLimit)} บ.)`,
    },
    {
      id: 'room-icu',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '1.2 ค่าห้อง ค่าอาหาร ผู้ป่วยหนัก ICU ต่อคืน',
      subTitle: 'สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค',
      getter: (p) => `${formatCurrency(p.roomICU.perNight)} บ. (สูงสุด ${formatCurrency(p.roomICU.maxLimit)} บ.)`,
    },
    {
      id: 'med-general',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.1 ค่ารักษาพยาบาล และค่าบริการทั่วไป ต่อครั้ง',
      subTitle: 'เบิกจ่ายตามจริงในวงเงิน',
      getter: (p) => `${formatCurrency(p.medicalGeneralPerVisit)} บาท`,
    },
    {
      id: 'surgery',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.2 การรักษาโดยการผ่าตัด ต่อโรค',
      subTitle: 'เบิกตามค่าใช้จ่ายจริง ไม่เกินวงเงิน',
      getter: (p) => `${formatCurrency(p.surgeryPerDisorder)} บาท`,
    },
    {
      id: 'med-inpatient-subtotal',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.4 รวมค่ารักษาพยาบาลผู้ป่วยใน (รักษาทั่วไป + ผ่าตัด)',
      subTitle: 'รวมวงเงินค่ารักษาและผ่าตัดต่อครั้ง',
      getter: (p) => `${formatCurrency(p.medicalGeneralPerVisit + p.surgeryPerDisorder)} บาท`,
    },
    {
      id: 'doctor-visit',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.3 ค่าแพทย์ตรวจเยี่ยมไข้ ผู้ป่วยใน ต่อคืน',
      subTitle: 'สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค',
      getter: (p) => `${formatCurrency(p.doctorVisitPerNight.perNight)} บ. (สูงสุด ${formatCurrency(p.doctorVisitPerNight.maxLimit)} บ.)`,
    },
    {
      id: 'med-inpatient-max-limit',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '2.5 รวมผลประโยชน์ค่ารักษาพยาบาลผู้ป่วยในสูงสุด ต่อการรักษาครั้งหนึ่ง',
      subTitle: 'ค่าห้องปกติ 45 คืน + ค่ารักษาทั่วไป + ผ่าตัด + ค่าแพทย์ 45 คืน',
      getter: (p) => `${formatCurrency(p.roomNormal.maxLimit + p.medicalGeneralPerVisit + p.surgeryPerDisorder + p.doctorVisitPerNight.maxLimit)} บาท`,
    },
    {
      id: 'opd-accident',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '3.1 OPD กรณีอุบัติเหตุ ต่อครั้ง',
      subTitle: 'ไม่จำกัดจำนวนครั้ง',
      getter: (p) => `${formatCurrency(p.opd.accident)} บาท`,
    },
    {
      id: 'opd-illness',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '3.2 OPD กรณีโรคภัยไข้เจ็บ ต่อครั้ง',
      subTitle: 'พบแพทย์ผู้ป่วยนอก ไม่ต้องนอนโรงพยาบาล',
      getter: (p) => p.opd.illness.covered 
        ? `${formatCurrency(p.opd.illness.perVisit || 0)} บ. (${p.opd.illness.maxVisitsPerYear} ครั้ง/ปี)`
        : 'ไม่คุ้มครอง',
      highlightNote: 'แผน 15-O และ 610-O มีความคุ้มครอง OPD โรคทั่วไป 500 บ./ครั้ง (9 ครั้ง/ปี)',
    },
    {
      id: 'opd-total-per-visit',
      category: 'ส่วนที่ 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล',
      title: '3.3 รวมค่ารักษาพยาบาลผู้ป่วยนอก (OPD) สูงสุดต่อครั้ง',
      subTitle: 'รวมอุบัติเหตุฉุกเฉิน และ OPD โรคทั่วไป',
      getter: (p) => `${formatCurrency(p.opd.accident + (p.opd.illness.covered ? (p.opd.illness.perVisit || 0) : 0))} บาท`,
    },
    // ส่วนที่ 2: ค่าชดเชย
    {
      id: 'daily-comp',
      category: 'ส่วนที่ 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยรายวัน',
      title: '1. ค่าชดเชยการนอนโรงพยาบาล ผู้ป่วยใน ต่อคืน',
      subTitle: 'สูงสุด ต่อครั้ง ต่อโรค',
      getter: (p) => `${formatCurrency(p.dailyCompensation.perNight)} บ./คืน (สูงสุด ${formatCurrency(p.dailyCompensation.maxLimit)} บ.)`,
      highlightNote: 'แผน 610-O ชดเชยสูง 1,200 บ./คืน (สูงสุด 54,000 บ.) ขณะที่แผนอื่นได้ 300 บ./คืน',
    },
    {
      id: 'other-rights-normal',
      category: 'ส่วนที่ 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยรายวัน',
      title: '2.1 ชดเชยกรณีใช้สิทธิ์อื่น (ห้องปกติ ต่อคืน)',
      subTitle: 'เบิกจ่ายจากสิทธิ์ราชการ, ประกันสังคม ฯลฯ ไม่ใช้ส่วนที่ 1',
      getter: (p) => `${formatCurrency(p.otherRightsNormalRoom.perNight)} บ./คืน (สูงสุด ${formatCurrency(p.otherRightsNormalRoom.maxLimit)} บ.)`,
      highlightNote: 'แผน 610-O ชดเชยสูง 3,000 บ./คืน (สูงสุด 90,000 บ.) สูงกว่าแผนอื่น',
    },
    {
      id: 'other-rights-icu',
      category: 'ส่วนที่ 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยรายวัน',
      title: '2.2 ชดเชยกรณีใช้สิทธิ์อื่น (ห้อง ICU ต่อคืน)',
      subTitle: 'สูงสุด ต่อครั้ง ต่อโรค',
      getter: (p) => `${formatCurrency(p.otherRightsICU.perNight)} บ./คืน (สูงสุด ${formatCurrency(p.otherRightsICU.maxLimit)} บ.)`,
    },
    // ส่วนที่ 3: เสียชีวิต
    {
      id: 'life-accident',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '1. เสียชีวิต/ทุพพลภาพ จากอุบัติเหตุทั่วไป (อบ.2)',
      subTitle: 'คุ้มครองการเสียชีวิต สูญเสียอวัยวะ สายตา หรือทุพพลภาพ',
      getter: (p) => `${formatCurrency(p.life.accidentGeneral)} บาท`,
      highlightNote: 'แผน 15-I, 15-O, 610-I คุ้มครอง 200,000 บ. ส่วน 610-O คุ้มครอง 3,000 บ.',
    },
    {
      id: 'life-murder',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '2. เสียชีวิตจากถูกฆาตกรรม / ลอบทำร้าย',
      subTitle: 'ความคุ้มครองกรณีถูกทำร้ายร่างกาย',
      getter: (p) => `${formatCurrency(p.life.murderAssault)} บาท`,
    },
    {
      id: 'life-motorcycle',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '3. เสียชีวิตจากการขับขี่/โดยสารรถจักรยานยนต์',
      subTitle: 'กรณีอุบัติเหตุยานยนต์ 2 ล้อ',
      getter: (p) => `${formatCurrency(p.life.motorcycle)} บาท`,
    },
    {
      id: 'life-funeral',
      category: 'ส่วนที่ 3: ความคุ้มครองการเสียชีวิต',
      title: '4. ผลประโยชน์ค่าปลงศพ กรณีเสียชีวิตจากการเจ็บป่วย',
      subTitle: 'ระยะเวลารอคอย 180 วัน',
      getter: (p) => `${formatCurrency(p.life.funeralBenefit)} บาท`,
      highlightNote: 'แผน 15-I, 15-O, 610-I มีค่าปลงศพ 20,000 บ. ขณะที่ 610-O ได้ 3,000 บ.',
    },
  ];

  return rows.map((r) => {
    const values: { [planId: string]: string } = {};
    const valueSet = new Set<string>();

    selectedPlans.forEach((plan) => {
      const val = r.getter(plan);
      values[plan.id] = val;
      valueSet.add(val);
    });

    return {
      id: r.id,
      category: r.category,
      title: r.title,
      subTitle: r.subTitle,
      values,
      isDifferent: selectedPlans.length > 1 && valueSet.size > 1,
      highlightNote: r.highlightNote,
    };
  });
}
