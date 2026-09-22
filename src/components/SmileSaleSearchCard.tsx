import React, { useState, useEffect, useRef } from 'react';
import { InsurancePlan, CustomerProfile } from '../types';
import {
  calculateAge,
  calculateDetailedAge,
  formatThaiBuddhistDate,
  searchExistingCustomer,
  MOCK_EXISTING_CUSTOMERS,
} from '../data/customers';
import {
  User,
  Calendar as CalendarIcon,
  Search,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SmileSaleSearchCardProps {
  onConfirmAge: (age: number | null, birthDateStr: string, customer?: CustomerProfile | null) => void;
  onReset: () => void;
  allPlans: InsurancePlan[];
  initialDob?: string;
  existingCustomer?: CustomerProfile | null;
  currentAge?: number | null;
}

export const SmileSaleSearchCard: React.FC<SmileSaleSearchCardProps> = ({
  onConfirmAge,
  onReset,
  allPlans,
  initialDob = '',
  existingCustomer = null,
  currentAge = null,
}) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [mode, setMode] = useState<'dob' | 'customer'>('dob');

  // Date of birth state
  const [dob, setDob] = useState<string>(initialDob || '1995-05-15');
  const [detailedAge, setDetailedAge] = useState<{
    years: number;
    months: number;
    days: number;
    displayText: string;
  }>(() => calculateDetailedAge(initialDob || '1995-05-15'));

  // Customer search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foundCustomer, setFoundCustomer] = useState<CustomerProfile | null>(existingCustomer);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const dateInputRef = useRef<HTMLInputElement>(null);

  // Sync when initialDob or existingCustomer changes
  useEffect(() => {
    if (initialDob) {
      setDob(initialDob);
      setDetailedAge(calculateDetailedAge(initialDob));
    }
    if (existingCustomer) {
      setFoundCustomer(existingCustomer);
      setMode('customer');
    }
  }, [initialDob, existingCustomer]);

  const handleDateChange = (val: string) => {
    setDob(val);
    const calculated = calculateDetailedAge(val);
    setDetailedAge(calculated);
  };

  const handleSearchCustomer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const result = searchExistingCustomer(searchQuery);
    setFoundCustomer(result);
  };

  const handleSelectMockCustomer = (cust: CustomerProfile) => {
    setSearchQuery(cust.idCard);
    setFoundCustomer(cust);
    setHasSearched(true);
    setDob(cust.birthDate);
    setDetailedAge(calculateDetailedAge(cust.birthDate));
    onConfirmAge(cust.age, cust.birthDate, cust);
  };

  const handleApplySearch = () => {
    if (mode === 'customer' && foundCustomer) {
      onConfirmAge(foundCustomer.age, foundCustomer.birthDate, foundCustomer);
    } else if (dob) {
      const ageInYears = calculateAge(dob);
      onConfirmAge(ageInYears, dob, null);
    } else {
      onConfirmAge(null, '', null);
    }
  };

  const handleResetForm = () => {
    setDob('');
    setDetailedAge({ years: 0, months: 0, days: 0, displayText: 'อายุ : 0 ปี 0 เดือน 0 วัน' });
    setFoundCustomer(null);
    setSearchQuery('');
    setHasSearched(false);
    onReset();
  };

  // Check eligible plans count for this age
  const currentCalcYears = dob ? calculateAge(dob) : currentAge;
  const eligibleCount = currentCalcYears !== null && currentCalcYears !== undefined
    ? allPlans.filter((p) => currentCalcYears >= p.minAge && currentCalcYears <= p.maxAge).length
    : allPlans.length;

  const thaiFormattedDate = dob ? formatThaiBuddhistDate(dob) : '22/09/2569';

  return (
    <div className="w-full">
      {/* Outer light blue container - sleek & compact */}
      <div className="bg-[#ebf4fa] rounded-xl p-3 sm:p-4 md:p-5 border border-[#d6e7f5]">
        {/* Section title */}
        <h2 className="text-center font-bold text-slate-800 text-sm sm:text-base mb-2">
          เช็คราคาประกันสุขภาพ
        </h2>

        {/* Inner white card - compact width & padding */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-3.5 sm:p-4 md:p-5 max-w-xl mx-auto">
          {/* Card sub-header with Mode Switch */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              กรอกข้อมูลเพื่อค้นหาแผนประกัน
            </h3>

            {/* Switch Mode: DOB vs Existing Customer */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setMode('dob')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  mode === 'dob'
                    ? 'bg-white text-[#00509d] shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                คำนวณตามวันเกิด
              </button>
              <button
                type="button"
                onClick={() => setMode('customer')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                  mode === 'customer'
                    ? 'bg-[#00509d] text-white shadow-2xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>ลูกค้าเดิม (Top-up)</span>
              </button>
            </div>
          </div>

          {mode === 'dob' ? (
            <div className="space-y-3">
              {/* Gender selector - compact */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'border-[#0088cc] bg-[#f0f8ff] text-[#0088cc] ring-1 ring-[#0088cc]'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>ชาย</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'border-[#0088cc] bg-[#f0f8ff] text-[#0088cc] ring-1 ring-[#0088cc]'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>หญิง</span>
                </button>
              </div>

              {/* Date of Birth Input Container - compact */}
              <div className="relative">
                <fieldset className="border border-slate-300 rounded-lg px-3 py-1.5 focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] bg-white transition-all">
                  <legend className="text-[10px] sm:text-[11px] text-slate-500 font-medium px-1">
                    วัน/เดือน/ปีเกิด
                  </legend>

                  <div className="flex items-center justify-between gap-2">
                    {/* Native date input */}
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={dob}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none w-36 sm:w-40 py-0.5"
                    />

                    {/* Calculated detailed age on the right */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-[#00509d] bg-sky-50 px-2 py-0.5 rounded border border-sky-200/80 whitespace-nowrap">
                        {detailedAge.displayText}
                      </span>
                      <button
                        type="button"
                        onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
                        className="text-slate-400 hover:text-[#0088cc] transition-colors p-0.5"
                        title="เลือกวันเดือนปีเกิด"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </fieldset>

                {/* Display date in Thai Buddhist Era */}
                {dob && (
                  <div className="mt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 px-0.5">
                    <span>
                      วันที่เลือก: <strong className="text-slate-700">{thaiFormattedDate} (พ.ศ.)</strong>
                    </span>
                    <span className="text-[#0088cc] font-semibold">
                      สมัครได้ {eligibleCount} จาก {allPlans.length} แผน
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Age Test Presets - compact */}
              <div className="pt-0.5 flex items-center gap-1 flex-wrap text-[10px] text-slate-500">
                <span className="text-[10px] text-slate-400">ทดสอบอายุ:</span>
                <button
                  type="button"
                  onClick={() => handleDateChange('2015-06-10')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                >
                  เด็ก 10 ปี (แผน 610)
                </button>
                <button
                  type="button"
                  onClick={() => handleDateChange('1994-08-15')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                >
                  วัยทำงาน 31 ปี (ทุกแผน)
                </button>
                <button
                  type="button"
                  onClick={() => handleDateChange('1962-03-20')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] transition-colors cursor-pointer"
                >
                  สูงอายุ 63 ปี (แผน 610)
                </button>
              </div>

              {/* Action Buttons - compact */}
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2 px-3 rounded-lg border border-[#0088cc] text-[#0088cc] hover:bg-sky-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ย้อนกลับ</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplySearch}
                  className="w-full py-2 px-3 rounded-lg bg-[#00509d] hover:bg-[#003e7a] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>ค้นหาแผนประกัน</span>
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Existing Customer Lookup - compact */
            <div className="space-y-3">
              <form onSubmit={handleSearchCustomer}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="กรอกเลขบัตรประชาชน 13 หลัก หรือชื่อลูกค้าเดิม..."
                    className="w-full px-3 py-1.5 pr-20 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc] text-xs sm:text-sm text-slate-800"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#00509d] hover:bg-[#003e7a] text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Search className="w-3 h-3" />
                    <span>ค้นหา</span>
                  </button>
                </div>
              </form>

              {/* Quick Customer Test Chips */}
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">
                  หรือคลิกเลือกลูกค้าทดสอบ:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {MOCK_EXISTING_CUSTOMERS.map((cust) => (
                    <button
                      key={cust.idCard}
                      type="button"
                      onClick={() => handleSelectMockCustomer(cust)}
                      className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        foundCustomer?.idCard === cust.idCard
                          ? 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-400'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          คุณ{cust.fullName} ({cust.age} ปี)
                        </div>
                        <div className="text-[10px] text-slate-500">
                          กรมธรรม์ {cust.policyNumber} • แผน {cust.existingPlanId.replace('plan-', '').toUpperCase()}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Found customer result box */}
              {foundCustomer && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>พบข้อมูลลูกค้าเดิม: คุณ{foundCustomer.fullName}</span>
                  </div>
                  <p className="text-slate-600 text-[10px]">
                    กรมธรรม์: <strong>{foundCustomer.policyNumber}</strong> • อายุ: {foundCustomer.age} ปี • แผนปัจจุบัน: {allPlans.find(p => p.id === foundCustomer.existingPlanId)?.name || foundCustomer.existingPlanId}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2 px-3 rounded-lg border border-[#0088cc] text-[#0088cc] hover:bg-sky-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ย้อนกลับ</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplySearch}
                  disabled={!foundCustomer}
                  className="w-full py-2 px-3 rounded-lg bg-[#00509d] hover:bg-[#003e7a] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ดึงแผนเดิมและเปรียบเทียบ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
