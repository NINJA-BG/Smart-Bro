import { CustomerProfile } from '../types';

/**
 * Mock database of existing customers for demonstration.
 * In a real production environment, this would call a backend customer CRM/Policy API.
 */
export const MOCK_EXISTING_CUSTOMERS: CustomerProfile[] = [
  {
    idCard: '1100501234567',
    fullName: 'สมชาย มั่นคงดี',
    birthDate: '1985-06-15',
    age: 41,
    phone: '081-445-6789',
    existingPlanId: 'plan-15-i',
    policyNumber: 'POL-2022-8910',
    startDate: '15 มิ.ย. 2565',
    lossClaimRate: 15,
    lossClaimStatus: '15% (ประวัติดี)',
    lineOaRegistered: true,
    lineOaStatusText: 'ลงทะเบียนแล้ว',
  },
  {
    idCard: '3200109876543',
    fullName: 'วิภาดา วงศ์สุวรรณ',
    birthDate: '1992-11-20',
    age: 33,
    phone: '089-123-4567',
    existingPlanId: 'plan-610-i',
    policyNumber: 'POL-2023-4321',
    startDate: '20 พ.ย. 2566',
    lossClaimRate: 0,
    lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
    lineOaRegistered: true,
    lineOaStatusText: 'ลงทะเบียนแล้ว',
  },
  {
    idCard: '1509900345678',
    fullName: 'กิตติศักดิ์ เจริญพร',
    birthDate: '1976-03-10',
    age: 50,
    phone: '086-778-9900',
    existingPlanId: 'plan-15-o',
    policyNumber: 'POL-2021-1122',
    startDate: '10 มี.ค. 2564',
    lossClaimRate: 48,
    lossClaimStatus: '48% (ปกติ)',
    lineOaRegistered: false,
    lineOaStatusText: 'ยังไม่ลงทะเบียน',
  },
  {
    idCard: '1101234567890',
    fullName: 'นภาภรณ์ รัตนโชติ',
    birthDate: '2015-08-25',
    age: 10,
    phone: '090-987-6543',
    existingPlanId: 'plan-610-o',
    policyNumber: 'POL-2024-5566',
    startDate: '25 ส.ค. 2567',
    lossClaimRate: 0,
    lossClaimStatus: '0% (ไม่มีประวัติเคลม)',
    lineOaRegistered: false,
    lineOaStatusText: 'ยังไม่ลงทะเบียน',
  },
];

/**
 * Calculate precise age in years from birthdate string (YYYY-MM-DD)
 */
export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Calculate detailed age in years, months, and days for display
 */
export function calculateDetailedAge(birthDateString: string): {
  years: number;
  months: number;
  days: number;
  displayText: string;
} {
  if (!birthDateString) {
    return { years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' };
  }

  const birth = new Date(birthDateString);
  if (isNaN(birth.getTime())) {
    return { years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' };
  }

  const today = new Date();
  if (birth > today) {
    return { years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' };
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  years = Math.max(0, years);
  months = Math.max(0, months);
  days = Math.max(0, days);

  return {
    years,
    months,
    days,
    displayText: `อายุ : ${years} ปี ${months} เดือน ${days} วัน`,
  };
}

/**
 * Format date string into Thai Buddhist Era string (DD/MM/BBBB)
 */
export function formatThaiBuddhistDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parts[1];
  const day = parts[2];
  if (isNaN(year)) return dateStr;
  const thaiYear = year + 543;
  return `${day}/${month}/${thaiYear}`;
}


/**
 * Search existing customer by ID card or full name (case-insensitive substring match)
 */
export function searchExistingCustomer(query: string): CustomerProfile | null {
  const cleanQuery = query.trim().replace(/-/g, '');
  if (!cleanQuery) return null;

  return (
    MOCK_EXISTING_CUSTOMERS.find((c) => {
      const cleanId = c.idCard.replace(/-/g, '');
      const cleanName = c.fullName.replace(/\s+/g, '');
      const searchTarget = cleanQuery.replace(/\s+/g, '');
      return cleanId.includes(searchTarget) || cleanName.includes(searchTarget) || c.fullName.includes(query.trim());
    }) || null
  );
}
