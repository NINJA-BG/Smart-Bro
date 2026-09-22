import React, { useState, useMemo } from 'react';
import { InsurancePlan, ViewFilterMode, ExportMeta, CustomerProfile } from '../types';
import { formatCurrency, analyzeDifferences } from '../data/plans';
import { MOCK_EXISTING_CUSTOMERS } from '../data/customers';
import {
  ShieldCheck,
  Gift,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  Layers,
  PlusCircle,
  Check,
  Zap,
  HeartPulse,
  UserCheck,
  Stethoscope,
  Activity,
  Plus,
} from 'lucide-react';

interface ComparisonTableProps {
  selectedPlans: InsurancePlan[];
  allPlans: InsurancePlan[];
  filterMode: ViewFilterMode;
  onFilterModeChange: (mode: ViewFilterMode) => void;
  highlightDiffs: boolean;
  onToggleHighlightDiffs: () => void;
  exportMeta?: ExportMeta;
  printMode?: boolean;
  existingCustomer?: CustomerProfile | null;
  currentAge?: number | null;
  onSelectExistingCustomer?: (customer: CustomerProfile | null) => void;
  onTogglePlan?: (planId: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  selectedPlans,
  allPlans,
  filterMode,
  onFilterModeChange,
  highlightDiffs,
  onToggleHighlightDiffs,
  exportMeta,
  printMode = false,
  existingCustomer = null,
  currentAge = null,
  onSelectExistingCustomer,
  onTogglePlan,
}) => {
  const [showCombinedColumn, setShowCombinedColumn] = useState<boolean>(true);

  // Identify existing plan if customer is active
  const existingCustomerPlan = useMemo(() => {
    if (!existingCustomer) return null;
    return allPlans.find((p) => p.id === existingCustomer.existingPlanId) || null;
  }, [existingCustomer, allPlans]);

  const isExistingPlanSelected = useMemo(() => {
    if (!existingCustomerPlan) return false;
    return selectedPlans.some((p) => p.id === existingCustomerPlan.id);
  }, [existingCustomerPlan, selectedPlans]);

  // Determine which plans are combined:
  // If existing customer is active and only 1 proposed plan is selected (and it's not the existing plan),
  // we combine [existingCustomerPlan, selectedPlans[0]] so that the combined column immediately shows
  // the existing customer combined total (Top-up)!
  const plansForCombined = useMemo(() => {
    if (selectedPlans.length === 0) return [];
    if (
      existingCustomer &&
      existingCustomerPlan &&
      selectedPlans.length === 1 &&
      !isExistingPlanSelected
    ) {
      return [existingCustomerPlan, selectedPlans[0]];
    }
    return selectedPlans;
  }, [selectedPlans, existingCustomer, existingCustomerPlan, isExistingPlanSelected]);

  // Pre-calculate differences
  const diffItems = useMemo(() => analyzeDifferences(selectedPlans), [selectedPlans]);
  const diffMap = useMemo(() => {
    const map = new Map<string, boolean>();
    diffItems.forEach((item) => {
      map.set(item.id, item.isDifferent);
    });
    return map;
  }, [diffItems]);

  const differentCount = useMemo(() => {
    return diffItems.filter((item) => item.isDifferent).length;
  }, [diffItems]);

  // Calculate combined totals for plansForCombined
  const combinedTotals = useMemo(() => {
    if (plansForCombined.length === 0) return null;

    const count = plansForCombined.length;
    const monthlyPremium = plansForCombined.reduce((sum, p) => sum + p.monthlyPremium, 0);
    const annualPremium = plansForCombined.reduce((sum, p) => sum + p.annualPremium, 0);

    // 1. Room
    const roomNormalPerNight = plansForCombined.reduce((sum, p) => sum + p.roomNormal.perNight, 0);
    const roomNormalMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomNormal.maxLimit, 0);

    const roomICUPerNight = plansForCombined.reduce((sum, p) => sum + p.roomICU.perNight, 0);
    const roomICUMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomICU.maxLimit, 0);
    const roomCombinedMaxLimit = roomNormalMaxLimit + roomICUMaxLimit;

    // 2. Medical & Surgery
    const medicalGeneral = plansForCombined.reduce((sum, p) => sum + p.medicalGeneralPerVisit, 0);
    const surgery = plansForCombined.reduce((sum, p) => sum + p.surgeryPerDisorder, 0);
    const inpatientMedicalSubtotal = medicalGeneral + surgery;

    const doctorVisitPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.doctorVisitPerNight.perNight,
      0
    );
    const doctorVisitMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.doctorVisitPerNight.maxLimit,
      0
    );
    const inpatientMedicalMaxLimit =
      roomNormalMaxLimit + medicalGeneral + surgery + doctorVisitMaxLimit;

    // 3. OPD
    const opdAccident = plansForCombined.reduce((sum, p) => sum + p.opd.accident, 0);
    const opdCoveredPlans = plansForCombined.filter((p) => p.opd.illness.covered);
    const hasOpdIllness = opdCoveredPlans.length > 0;
    const opdIllnessPerVisit = opdCoveredPlans.reduce(
      (sum, p) => sum + (p.opd.illness.perVisit || 0),
      0
    );
    const opdIllnessMaxVisits = opdCoveredPlans.reduce(
      (sum, p) => sum + (p.opd.illness.maxVisitsPerYear || 0),
      0
    );
    const opdIllnessMaxPerYear = opdCoveredPlans.reduce(
      (sum, p) =>
        sum + (p.opd.illness.perVisit || 0) * (p.opd.illness.maxVisitsPerYear || 0),
      0
    );
    const opdTotalPerVisit = opdAccident + (hasOpdIllness ? opdIllnessPerVisit : 0);

    // 4. Daily compensation
    const dailyCompPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.dailyCompensation.perNight,
      0
    );
    const dailyCompMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.dailyCompensation.maxLimit,
      0
    );

    // Other rights
    const otherRightsNormalPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsNormalRoom.perNight,
      0
    );
    const otherRightsNormalMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsNormalRoom.maxLimit,
      0
    );

    const otherRightsICUPerNight = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsICU.perNight,
      0
    );
    const otherRightsICUMaxLimit = plansForCombined.reduce(
      (sum, p) => sum + p.otherRightsICU.maxLimit,
      0
    );

    // 5. Life & Accident
    const lifeAccidentGeneral = plansForCombined.reduce(
      (sum, p) => sum + p.life.accidentGeneral,
      0
    );
    const lifeMurder = plansForCombined.reduce((sum, p) => sum + p.life.murderAssault, 0);
    const lifeMotorcycle = plansForCombined.reduce((sum, p) => sum + p.life.motorcycle, 0);
    const lifeFuneral = plansForCombined.reduce((sum, p) => sum + p.life.funeralBenefit, 0);

    // Age bounds
    const minEligibleAge = Math.max(...plansForCombined.map((p) => p.minAge));
    const maxEligibleAge = Math.min(...plansForCombined.map((p) => p.maxAge));

    // Premium calculations for existing customer
    const existingMonthly = existingCustomerPlan ? existingCustomerPlan.monthlyPremium : 0;
    const addedMonthly = Math.max(0, monthlyPremium - existingMonthly);
    const existingAnnual = existingCustomerPlan ? existingCustomerPlan.annualPremium : 0;
    const addedAnnual = Math.max(0, annualPremium - existingAnnual);

    return {
      count,
      monthlyPremium,
      annualPremium,
      existingMonthly,
      addedMonthly,
      existingAnnual,
      addedAnnual,
      roomNormalPerNight,
      roomNormalMaxLimit,
      roomICUPerNight,
      roomICUMaxLimit,
      roomCombinedMaxLimit,
      medicalGeneral,
      surgery,
      inpatientMedicalSubtotal,
      doctorVisitPerNight,
      doctorVisitMaxLimit,
      inpatientMedicalMaxLimit,
      opdAccident,
      hasOpdIllness,
      opdIllnessPerVisit,
      opdIllnessMaxVisits,
      opdIllnessMaxPerYear,
      opdTotalPerVisit,
      dailyCompPerNight,
      dailyCompMaxLimit,
      otherRightsNormalPerNight,
      otherRightsNormalMaxLimit,
      otherRightsICUPerNight,
      otherRightsICUMaxLimit,
      lifeAccidentGeneral,
      lifeMurder,
      lifeMotorcycle,
      lifeFuneral,
      minEligibleAge,
      maxEligibleAge,
    };
  }, [plansForCombined, existingCustomerPlan]);

  if (selectedPlans.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-8 sm:p-12 text-center text-slate-500">
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">ยังไม่ได้เลือกแผนเปรียบเทียบ</h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          กรุณาเลือกแผนประกันอย่างน้อย 1 แผนจากด้านบนเพื่อแสดงตารางเปรียบเทียบ
        </p>
      </div>
    );
  }

  const shouldShowRow = (rowId: string) => {
    if (filterMode === 'all') return true;
    return diffMap.get(rowId) === true;
  };

  const isRowDiff = (rowId: string) => {
    return highlightDiffs && diffMap.get(rowId) === true;
  };

  const hasMultiplePlans = plansForCombined.length >= 2;
  const isCombinedVisible = hasMultiplePlans && showCombinedColumn && combinedTotals !== null;
  const totalColumnsCount = selectedPlans.length + (isCombinedVisible ? 2 : 1);

  return (
    <div
      id="comparison-report-element"
      className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden"
    >
      {/* Optional Metadata Header for PDF/Print view */}
      {exportMeta && (
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 text-white p-4 sm:p-5 border-b border-sky-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg md:text-xl font-black tracking-tight">
                  เอกสารเปรียบเทียบความคุ้มครองแผนประกันภัย
                </span>
                <span className="text-[11px] bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded-full border border-sky-400/30">
                  {selectedPlans.length} แผน
                  {isCombinedVisible && ' + รวมวงเงินและเบี้ย'}
                </span>
              </div>
              <p className="text-xs text-sky-200/80 mt-0.5">
                สรุปความคุ้มครอง สิทธิประโยชน์ และคำนวณยอดเบี้ยประกันภัยรายบุคคล
              </p>
            </div>

            <div className="text-xs text-sky-100/90 space-y-1 sm:text-right bg-sky-950/40 p-2.5 rounded-lg border border-sky-800/50">
              <div>
                <span className="text-sky-300">เสนอ: </span>
                <span className="font-semibold text-white">
                  {exportMeta.customerName || 'ลูกค้าทั่วไป (ไม่ระบุชื่อ)'}
                </span>
              </div>
              {existingCustomer && (
                <div className="text-[11px] text-sky-200">
                  <span>Loss: </span>
                  <strong className="text-white">{existingCustomer.lossClaimStatus}</strong>
                  <span className="mx-1">•</span>
                  <span>LINE OA: </span>
                  <strong className="text-white">{existingCustomer.lineOaStatusText}</strong>
                </div>
              )}
              {(exportMeta.agentFirstName || exportMeta.agentLastName) && (
                <div>
                  <span className="text-sky-300">ผู้แทน: </span>
                  <span className="text-white font-medium">
                    {exportMeta.agentFirstName} {exportMeta.agentLastName}
                  </span>
                  {exportMeta.agentOfficeCode && (
                    <span className="text-sky-200 text-[11px] ml-1">
                      (สนง. {exportMeta.agentOfficeCode})
                    </span>
                  )}
                </div>
              )}
              {exportMeta.agentPhone && (
                <div>
                  <span className="text-sky-300">โทร: </span>
                  <span className="text-white">{exportMeta.agentPhone}</span>
                </div>
              )}
              <div>
                <span className="text-sky-300">วันที่: </span>
                {exportMeta.date || new Date().toLocaleDateString('th-TH')}
              </div>
            </div>
          </div>

          {exportMeta.notes && (
            <div className="mt-2.5 text-xs bg-white/10 rounded-md p-2 text-sky-100 border border-white/10">
              <span className="font-semibold text-sky-200">หมายเหตุ: </span>
              {exportMeta.notes}
            </div>
          )}
        </div>
      )}

      {/* iPad-Optimized Integrated Function Toolbar */}
      {!printMode && (
        <div className="no-print p-3 sm:p-4 bg-slate-50/90 border-b border-slate-200 space-y-2.5">
          {/* Main Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* View Mode (All vs Differences Only) */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                โหมด:
              </span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onFilterModeChange('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    filterMode === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  แสดงทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => onFilterModeChange('differences_only')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                    filterMode === 'differences_only'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>เฉพาะจุดที่ต่างกัน</span>
                  <span
                    className={`px-1 py-0.2 rounded text-[10px] font-bold ${
                      filterMode === 'differences_only'
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {differentCount}
                  </span>
                </button>
              </div>

              {/* Highlight diffs toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium ml-1">
                <input
                  type="checkbox"
                  checked={highlightDiffs}
                  onChange={onToggleHighlightDiffs}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span className="flex items-center gap-1 text-[11px] sm:text-xs">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  เน้นสีจุดต่าง
                </span>
              </label>
            </div>

            {/* Combined Column Toggle & Plan Counter */}
            <div className="flex items-center gap-3 text-xs self-start md:self-center flex-wrap">
              {hasMultiplePlans && (
                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold cursor-pointer select-none transition-colors hover:bg-emerald-100/70">
                  <input
                    type="checkbox"
                    checked={showCombinedColumn}
                    onChange={(e) => setShowCombinedColumn(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300 cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-xs flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {existingCustomer
                      ? `แสดงช่องรวมกรณีลูกค้าเดิม (${plansForCombined.length} แผน)`
                      : `แสดงช่องรวม (${selectedPlans.length} แผน)`}
                  </span>
                </label>
              )}

              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-slate-500 text-[11px] sm:text-xs">
                เปรียบเทียบ <strong className="text-slate-800">{selectedPlans.length}</strong> แผน
              </span>
            </div>
          </div>

          {/* Dedicated Existing Customer Medical & Top-up Card */}
          {existingCustomer && combinedTotals && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#f0f7fd] via-[#e8f3fc] to-white border-2 border-[#b9ddf8] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-sky-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00509d] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm md:text-base">
                        ช่องรวมค่ารักษาพยาบาลกรณีลูกค้าเดิม
                      </span>
                      <span className="text-[10px] font-bold bg-sky-100 text-[#00509d] border border-sky-200 px-2 py-0.5 rounded-full">
                        Top-up เพิ่มความคุ้มครอง
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      ลูกค้า: <strong className="text-slate-800">คุณ{existingCustomer.fullName}</strong> • กรมธรรม์: {existingCustomer.policyNumber} • แผนเดิม: <strong className="text-[#00509d]">{existingCustomerPlan?.name || 'แผนเดิม'}</strong> (เบี้ย ฿{formatCurrency(combinedTotals.existingMonthly)}/ด.)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!isExistingPlanSelected && existingCustomerPlan && onTogglePlan && (
                    <button
                      type="button"
                      onClick={() => onTogglePlan(existingCustomerPlan.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00509d] hover:bg-[#094f92] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>แสดงแผนเดิม ({existingCustomerPlan.code}) ในตาราง</span>
                    </button>
                  )}
                  {onSelectExistingCustomer && (
                    <button
                      type="button"
                      onClick={() => onSelectExistingCustomer(null)}
                      className="text-slate-500 hover:text-slate-800 text-[11px] underline cursor-pointer"
                    >
                      เปลี่ยนลูกค้า
                    </button>
                  )}
                </div>
              </div>

              {/* Medical Totals Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-sky-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">รวมค่ารักษาพยาบาลผู้ป่วยใน:</span>
                  <div className="font-black text-[#00509d] text-sm sm:text-base">
                    ฿{formatCurrency(combinedTotals.inpatientMedicalSubtotal)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    (ทั่วไป ฿{formatCurrency(combinedTotals.medicalGeneral)} + ผ่าตัด ฿{formatCurrency(combinedTotals.surgery)})
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-sky-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">รวมค่าห้องปกติ / ICU:</span>
                  <div className="font-black text-[#00509d] text-sm sm:text-base">
                    ฿{formatCurrency(combinedTotals.roomNormalPerNight)} <span className="text-[11px] font-normal text-slate-600">/คืน</span>
                  </div>
                  <span className="text-[10px] text-sky-700 font-semibold">
                    ICU ฿{formatCurrency(combinedTotals.roomICUPerNight)} / สูงสุด ฿{formatCurrency(combinedTotals.roomCombinedMaxLimit)}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-sky-200 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-medium">รวมค่าแพทย์ + OPD ต่อครั้ง:</span>
                  <div className="font-black text-[#00509d] text-sm sm:text-base">
                    ฿{formatCurrency(combinedTotals.doctorVisitPerNight)} <span className="text-[11px] font-normal text-slate-600">/คืน</span>
                  </div>
                  <span className="text-[10px] text-slate-600">
                    OPD อุบัติเหตุ ฿{formatCurrency(combinedTotals.opdAccident)} {combinedTotals.hasOpdIllness ? `• OPD ทั่วไป ฿${formatCurrency(combinedTotals.opdIllnessPerVisit)}` : ''}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-[#094f92] to-[#00509d] text-white p-2.5 rounded-lg shadow-2xs">
                  <span className="text-sky-100 block text-[10px] font-semibold">เบี้ยรวมทั้งสิ้น (แผนเดิม+ใหม่):</span>
                  <div className="font-black text-white text-base sm:text-lg">
                    ฿{formatCurrency(combinedTotals.monthlyPremium)} <span className="text-xs font-normal text-sky-200">/ด.</span>
                  </div>
                  <span className="text-[10px] text-sky-100 font-bold block">
                    {combinedTotals.addedMonthly > 0 ? `ลูกค้าเดิมจ่ายเพิ่ม +฿${formatCurrency(combinedTotals.addedMonthly)}/ด.` : 'รวมเบี้ยตามแผน'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Existing Customer Selector when no customer is selected */}
          {!existingCustomer && onSelectExistingCustomer && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-slate-700">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  ช่องรวมค่ารักษาพยาบาลกรณีลูกค้าเดิม:
                </span>
                <span className="text-slate-500 hidden sm:inline">
                  คลิกเลือกลูกค้าเดิมเพื่อดึงแผนเดิมมาคำนวณ Top-up รวมทันที
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {MOCK_EXISTING_CUSTOMERS.map((cust) => (
                  <button
                    key={cust.idCard}
                    type="button"
                    onClick={() => onSelectExistingCustomer(cust)}
                    className="px-2 py-1 rounded-md bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
                  >
                    คุณ{cust.fullName.split(' ')[0]} ({cust.existingPlanId.replace('plan-', '').toUpperCase()})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Combined Insights Strip (When NOT existing customer & multiple plans selected) */}
          {!existingCustomer && isCombinedVisible && combinedTotals && (
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-white border border-sky-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00509d] text-white font-bold text-[11px]">
                  <Check className="w-3 h-3" /> รวม {selectedPlans.length} แผน
                </span>
                <span className="text-slate-600 text-[11px]">
                  ({selectedPlans.map((p) => p.code).join(' + ')})
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700">
                  ค่าห้องปกติรวม:{' '}
                  <strong className="text-slate-900 font-bold">
                    ฿{formatCurrency(combinedTotals.roomNormalPerNight)}
                  </strong>
                  /คืน
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700">
                  ค่ารักษาทั่วไปรวม:{' '}
                  <strong className="text-slate-900 font-bold">
                    ฿{formatCurrency(combinedTotals.medicalGeneral)}
                  </strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700">
                  ผ่าตัดรวม:{' '}
                  <strong className="text-slate-900 font-bold">
                    ฿{formatCurrency(combinedTotals.surgery)}
                  </strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700">
                  ชดเชยรายวันรวม:{' '}
                  <strong className="text-slate-900 font-bold">
                    ฿{formatCurrency(combinedTotals.dailyCompPerNight)}
                  </strong>
                  /คืน
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-sky-200 shrink-0">
                <span className="text-slate-500 text-[11px]">เบี้ยรวม:</span>
                <span className="font-extrabold text-[#00509d] text-sm">
                  ฿{formatCurrency(combinedTotals.monthlyPremium)}
                </span>
                <span className="text-slate-500 text-[10px]">
                  /ด. (฿{formatCurrency(combinedTotals.annualPremium)}/ปี)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Insurance Comparison Table (iPad responsive & clean) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px] md:min-w-[720px]">
          {/* Header Row */}
          <thead>
            <tr className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-800 text-white">
              {/* Coverage Column Header */}
              <th className="p-3 md:p-3.5 w-[32%] text-left font-bold text-sm md:text-base tracking-wide border-r border-sky-600/50">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-sky-200" />
                  <span>ความคุ้มครอง</span>
                </div>
              </th>

              {/* Selected Plans Headers */}
              {selectedPlans.map((plan) => {
                const isExistingCustomerPlan = existingCustomer?.existingPlanId === plan.id;
                const columnWidth = isCombinedVisible
                  ? `${48 / selectedPlans.length}%`
                  : `${68 / selectedPlans.length}%`;

                return (
                  <th
                    key={plan.id}
                    className="p-3 md:p-3.5 text-center border-r border-sky-600/50 align-top"
                    style={{ width: columnWidth }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {isExistingCustomerPlan && (
                        <span className="inline-block bg-emerald-500 text-white font-black text-[9px] uppercase px-1.5 py-0.2 rounded-full shadow-2xs">
                          แผนเดิมของลูกค้า
                        </span>
                      )}
                      <div className="inline-block bg-white/20 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md text-sm md:text-base font-black tracking-wide border border-sky-300/30">
                        {plan.name}
                      </div>
                      <div className="text-[11px] font-semibold text-sky-200">
                        ฿{formatCurrency(plan.monthlyPremium)}/ด.
                      </div>
                    </div>
                  </th>
                );
              })}

              {/* Combined Total Column Header */}
              {isCombinedVisible && combinedTotals && (
                <th
                  className="p-3 md:p-3.5 text-center bg-gradient-to-b from-[#094f92] via-[#00509d] to-[#003e7a] text-white border-l-2 border-sky-300 align-top shadow-md"
                  style={{ width: '22%' }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    {existingCustomer ? (
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-white/30 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-sky-200" />
                        กรณีลูกค้าเดิม (Top-up)
                      </span>
                    ) : (
                      <span className="inline-block bg-white/20 backdrop-blur-xs text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-white/30 shadow-2xs">
                        ความคุ้มครองรวม
                      </span>
                    )}

                    <div className="inline-block bg-white text-[#00509d] px-3 py-1 rounded-md text-xs sm:text-sm md:text-base font-black tracking-wide shadow-xs">
                      ช่องรวมค่ารักษาพยาบาล
                    </div>

                    <div className="text-[11px] text-sky-100 font-medium">
                      {existingCustomer ? 'สิทธิประโยชน์รวมแผนเดิมและแผนใหม่' : 'สิทธิประโยชน์ความคุ้มครองรวม'}
                    </div>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {/* ============================================================== */}
            {/* SECTION 0: เกณฑ์อายุที่รับประกันภัย */}
            {/* ============================================================== */}
            <tr className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
              <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-900">เกณฑ์อายุที่รับประกันภัย</span>
                </div>
              </td>
              {selectedPlans.map((plan) => {
                const isMatchAge =
                  currentAge !== null
                    ? currentAge >= plan.minAge && currentAge <= plan.maxAge
                    : true;
                return (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-200 text-xs md:text-sm"
                  >
                    <span className="font-bold text-slate-800 block">{plan.ageRangeText}</span>
                    {currentAge !== null && (
                      <span
                        className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          isMatchAge
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isMatchAge ? `ตรงเกณฑ์` : `ไม่ตรงเกณฑ์`}
                      </span>
                    )}
                  </td>
                );
              })}
              {isCombinedVisible && combinedTotals && (
                <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] text-xs md:text-sm border-l-2 border-[#b9ddf8] font-bold text-[#00509d]">
                  {combinedTotals.minEligibleAge} - {combinedTotals.maxEligibleAge} ปี
                  <span className="block text-[10px] text-sky-700 font-normal">
                    (ช่วงอายุที่สมัครคู่กันได้)
                  </span>
                </td>
              )}
            </tr>

            {/* ============================================================== */}
            {/* SECTION 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล */}
            {/* ============================================================== */}
            <tr className="bg-sky-100/90 text-sky-950 font-bold border-y-2 border-sky-300">
              <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4 text-xs md:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  ส่วนที่ 1 : ความคุ้มครองค่าห้อง ค่าอาหาร และค่าบริการพยาบาล
                </span>
              </td>
            </tr>

            {/* Subsection 1 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                1. ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล กรณีผู้ป่วยใน
              </td>
            </tr>

            {/* Row 1.1 - Room Normal */}
            {shouldShowRow('room-normal') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('room-normal')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    1.1 ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล ผู้ป่วยปกติ ต่อคืน
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.roomNormal.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.roomNormal.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.roomNormalPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.roomNormalMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 1.2 - Room ICU */}
            {shouldShowRow('room-icu') && (
              <tr
                className={`border-b border-slate-200 transition-colors ${
                  isRowDiff('room-icu')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    1.2 ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล ผู้ป่วยหนัก ICU ต่อคืน
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุดไม่เกิน 30 คืนต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.roomICU.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.roomICU.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.roomICUPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.roomICUMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 1.3 - Combined Room Limit */}
            {shouldShowRow('room-combined-max-limit') && (
              <tr className="bg-slate-50/50 border-b border-slate-200 transition-colors hover:bg-slate-100/60 font-medium">
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span>1.3 รวมวงเงินค่าห้องปกติ + ICU สูงสุดต่อครั้ง</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (คำนวณจากห้องปกติ 45 คืน + ICU 30 คืน)
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planRoomMax = plan.roomNormal.maxLimit + plan.roomICU.maxLimit;
                  return (
                    <td
                      key={plan.id}
                      className="py-2 px-3 sm:px-4 text-center border-r border-slate-100 font-semibold text-sky-800 text-xs sm:text-sm"
                    >
                      {formatCurrency(planRoomMax)}
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.roomCombinedMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Subsection 2 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                2. ค่ารักษาพยาบาล กรณีผู้ป่วยใน
              </td>
            </tr>

            {/* Row 2.1 - Medical General */}
            {shouldShowRow('med-general') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('med-general')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    2.1 ค่ารักษาพยาบาล และค่าบริการทั่วไป ต่อครั้ง
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.medicalGeneralPerVisit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.medicalGeneral)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.2 - Surgery */}
            {shouldShowRow('surgery') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('surgery')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    2.2 การรักษาโดยการผ่าตัด ต่อโรค
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (เบิกตามค่าใช้จ่ายจริง ไม่เกินวงเงินในแผน)
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.surgeryPerDisorder)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.surgery)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.3 - Doctor Visit */}
            {shouldShowRow('doctor-visit') && (
              <tr
                className={`border-b border-slate-200 transition-colors ${
                  isRowDiff('doctor-visit')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    2.3 การดูแลโดยแพทย์ (ค่าแพทย์เยี่ยมไข้ ผู้ป่วยใน) สูงสุดต่อคืน
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.doctorVisitPerNight.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.doctorVisitPerNight.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.doctorVisitPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.doctorVisitMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.4 - Combined Inpatient Medical (General + Surgery) */}
            {shouldShowRow('med-inpatient-subtotal') && (
              <tr className="bg-[#f0f7fd]/70 border-b border-sky-200 transition-colors hover:bg-sky-50">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-sky-950 font-bold">
                    <HeartPulse className="w-4 h-4 text-[#00509d] shrink-0" />
                    <span>2.4 รวมค่ารักษาพยาบาลผู้ป่วยใน (ค่ารักษาทั่วไป + ค่าผ่าตัด)</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-700 font-semibold mt-0.5">
                    {existingCustomer
                      ? `⭐ รวมค่ารักษาพยาบาลกรณีลูกค้าเดิม (Top-up เพิ่มจากแผนเดิม ${existingCustomerPlan?.code || ''})`
                      : '⭐ รวมค่ารักษาทั่วไป + ค่าผ่าตัด ต่อการรักษาครั้งหนึ่ง'}
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planMedicalSubtotal = plan.medicalGeneralPerVisit + plan.surgeryPerDisorder;
                  return (
                    <td
                      key={plan.id}
                      className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(planMedicalSubtotal)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        (ทั่วไป {formatCurrency(plan.medicalGeneralPerVisit)} + ผ่าตัด {formatCurrency(plan.surgeryPerDisorder)})
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2.5 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-sm sm:text-base md:text-lg">
                      {formatCurrency(combinedTotals.inpatientMedicalSubtotal)}
                    </div>
                    <div className="text-[10px] font-bold text-[#00509d]">
                      {existingCustomer ? 'วงเงินรักษารวมของลูกค้าเดิม' : `รวม ${plansForCombined.length} แผน`}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 2.5 - Total Inpatient Maximum Limit */}
            {shouldShowRow('med-inpatient-max-limit') && (
              <tr className="bg-sky-50/40 border-b-2 border-slate-200 transition-colors hover:bg-sky-100/40">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>2.5 รวมผลประโยชน์ค่ารักษาผู้ป่วยในสูงสุด ต่อครั้ง ต่อโรค</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (รวมค่าห้องปกติ 45 คืน + ค่ารักษาทั่วไป + ผ่าตัด + ค่าแพทย์ 45 คืน)
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planInpatientMax =
                    plan.roomNormal.maxLimit +
                    plan.medicalGeneralPerVisit +
                    plan.surgeryPerDisorder +
                    plan.doctorVisitPerNight.maxLimit;
                  return (
                    <td
                      key={plan.id}
                      className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-black text-blue-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(planInpatientMax)}
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2.5 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-sm sm:text-base md:text-lg">
                      {formatCurrency(combinedTotals.inpatientMedicalMaxLimit)}
                    </div>
                    <div className="text-[10px] font-bold text-[#00509d]">
                      วงเงินสูงสุดรวมต่อครั้ง
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Subsection 3 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                3. ค่ารักษาพยาบาล กรณีผู้ป่วยนอก OPD ต่อครั้ง
              </td>
            </tr>

            {/* Row 3.1 - OPD Accident */}
            {shouldShowRow('opd-accident') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('opd-accident')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    3.1 กรณีอุบัติเหตุ ไม่จำกัดจำนวนครั้ง
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.opd.accident)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.opdAccident)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.2 - OPD Illness */}
            {shouldShowRow('opd-illness') && (
              <tr
                className={`border-b-2 border-sky-200 transition-colors ${
                  isRowDiff('opd-illness')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80 font-medium'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                    <span>3.2 กรณีโรคภัยไข้เจ็บ</span>
                    {isRowDiff('opd-illness') && (
                      <span className="text-[9px] sm:text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                        จุดต่างสำคัญ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    (การพบแพทย์รักษาแบบผู้ป่วยนอกทั่วไป ไม่ต้องนอน รพ.)
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    {plan.opd.illness.covered ? (
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                          {formatCurrency(plan.opd.illness.perVisit || 0)}
                        </div>
                        <div className="text-[11px] font-semibold text-sky-600">
                          {plan.opd.illness.maxVisitsPerYear} ครั้ง/ปี
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-rose-600 text-xs md:text-sm flex items-center justify-center gap-1">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>ไม่คุ้มครอง</span>
                      </div>
                    )}
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    {combinedTotals.hasOpdIllness ? (
                      <div>
                        <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                          {formatCurrency(combinedTotals.opdIllnessPerVisit)}
                        </div>
                        <div className="text-[11px] font-bold text-sky-700">
                          รวม {combinedTotals.opdIllnessMaxVisits} ครั้ง/ปี
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">ไม่คุ้มครอง</span>
                    )}
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.3 - Total OPD per visit */}
            {shouldShowRow('opd-total-per-visit') && (
              <tr className="bg-[#f0f7fd]/70 border-b-2 border-sky-300 transition-colors hover:bg-sky-50">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="flex items-center gap-1.5 text-sky-950 font-bold">
                    <Stethoscope className="w-4 h-4 text-[#00509d] shrink-0" />
                    <span>3.3 รวมวงเงินค่ารักษา OPD ต่อครั้ง (อุบัติเหตุ + โรคทั่วไป)</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-700 font-medium mt-0.5">
                    (รวมสิทธิ์ OPD ทุกกรณี ต่อครั้งที่เข้ารับการรักษาแบบผู้ป่วยนอก)
                  </div>
                </td>
                {selectedPlans.map((plan) => {
                  const planOpdTotal =
                    plan.opd.accident +
                    (plan.opd.illness.covered ? plan.opd.illness.perVisit || 0 : 0);
                  return (
                    <td
                      key={plan.id}
                      className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100"
                    >
                      <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                        {formatCurrency(planOpdTotal)}
                      </div>
                    </td>
                  );
                })}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2.5 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                    <div className="font-black text-[#003e7a] text-sm sm:text-base md:text-lg">
                      {formatCurrency(combinedTotals.opdTotalPerVisit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* ============================================================== */}
            {/* SECTION 2: สิทธิพิเศษเพิ่มเติม / ค่าชดเชยการนอนรักษาพยาบาล */}
            {/* ============================================================== */}
            <tr className="bg-gradient-to-r from-sky-700 to-blue-700 text-white font-bold">
              <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4 text-xs md:text-sm">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-sky-200" />
                  <span>ส่วนที่ 2 : สิทธิพิเศษเพิ่มเติม / ค่าชดเชยการนอนรักษาพยาบาลผู้ป่วยใน</span>
                </div>
              </td>
            </tr>

            {/* Section 2 - Row 1 - Daily Compensation */}
            {shouldShowRow('daily-comp') && (
              <tr
                className={`border-b border-slate-200 transition-colors ${
                  isRowDiff('daily-comp')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4">
                  <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <span>1. ค่าชดเชยการนอนรักษาพยาบาลผู้ป่วยใน ต่อคืน</span>
                    {isRowDiff('daily-comp') && (
                      <span className="text-[9px] sm:text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                        จุดต่างสำคัญ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                    สูงสุด ต่อครั้ง ต่อโรค
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div
                      className={`text-xs sm:text-sm md:text-base ${
                        plan.dailyCompensation.perNight >= 1000
                          ? 'font-black text-blue-900'
                          : 'font-bold text-slate-900'
                      }`}
                    >
                      {formatCurrency(plan.dailyCompensation.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.dailyCompensation.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.dailyCompPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.dailyCompMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Section 2 - Row 2 Header */}
            <tr className="bg-slate-50/80 font-bold text-slate-800 border-b border-slate-200 text-xs">
              <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                2. ใช้สิทธิ์เบิกค่ารักษาพยาบาลจากหน่วยงานอื่น เช่น ส่วนราชการ, รัฐวิสาหกิจ, ประกันสังคม
                <span className="text-sky-600 font-normal ml-1 text-[11px]">(กรณีไม่ใช้ส่วนที่ 1)</span>
              </td>
            </tr>

            {/* Section 2 - Row 2.1 */}
            {shouldShowRow('other-rights-normal') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('other-rights-normal')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    ค่าชดเชยการนอนรักษาพยาบาล ห้องปกติ ต่อคืน
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div
                      className={`text-xs sm:text-sm md:text-base ${
                        plan.otherRightsNormalRoom.perNight > 1500
                          ? 'font-black text-blue-900'
                          : 'font-bold text-slate-900'
                      }`}
                    >
                      {formatCurrency(plan.otherRightsNormalRoom.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.otherRightsNormalRoom.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.otherRightsNormalPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.otherRightsNormalMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Section 2 - Row 2.2 */}
            {shouldShowRow('other-rights-icu') && (
              <tr
                className={`border-b-2 border-sky-200 transition-colors ${
                  isRowDiff('other-rights-icu')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-6 sm:pl-7">
                  <div className="text-slate-800 font-medium">
                    ค่าชดเชยการนอนรักษาพยาบาล ห้อง ICU ต่อคืน
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.otherRightsICU.perNight)}
                    </div>
                    <div className="text-[11px] font-semibold text-sky-600">
                      {formatCurrency(plan.otherRightsICU.maxLimit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.otherRightsICUPerNight)}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      {formatCurrency(combinedTotals.otherRightsICUMaxLimit)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* ============================================================== */}
            {/* SECTION 3: ความคุ้มครองการเสียชีวิต */}
            {/* ============================================================== */}
            <tr className="bg-sky-100/90 text-sky-950 font-bold border-y-2 border-sky-300">
              <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4 text-xs md:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  ส่วนที่ 3 : ความคุ้มครองการเสียชีวิต
                </span>
              </td>
            </tr>

            {/* Row 3.1 - Accident General */}
            {shouldShowRow('life-accident') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('life-accident')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80 font-medium'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-700 font-semibold text-[11px] sm:text-xs whitespace-nowrap mt-0.5">
                      เสียชีวิตอุบัติเหตุ (อบ.2)
                    </span>
                    <div className="text-slate-800">
                      เสียชีวิต สูญเสียอวัยวะหรือทุพพลภาพถาวรจากอุบัติเหตุทั่วไป
                    </div>
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div
                      className={`text-xs sm:text-sm md:text-base ${
                        plan.life.accidentGeneral >= 100000
                          ? 'font-bold text-slate-900'
                          : 'font-semibold text-slate-600'
                      }`}
                    >
                      {formatCurrency(plan.life.accidentGeneral)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeAccidentGeneral)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.2 - Murder */}
            {shouldShowRow('life-murder') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('life-murder')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-8 sm:pl-12">
                  <div className="text-slate-800 font-normal">
                    เสียชีวิตจากการถูกฆาตกรรมหรือถูกลอบทำร้ายร่างกาย
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.life.murderAssault)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeMurder)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.3 - Motorcycle */}
            {shouldShowRow('life-motorcycle') && (
              <tr
                className={`border-b border-slate-100 transition-colors ${
                  isRowDiff('life-motorcycle')
                    ? 'bg-amber-50/50 hover:bg-amber-100/40'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-8 sm:pl-12">
                  <div className="text-slate-800 font-normal">
                    เสียชีวิตจากการขับขี่หรือโดยสารรถจักรยานยนต์
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.life.motorcycle)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeMotorcycle)}
                    </div>
                  </td>
                )}
              </tr>
            )}

            {/* Row 3.4 - Funeral */}
            {shouldShowRow('life-funeral') && (
              <tr
                className={`border-b-2 border-slate-300 transition-colors ${
                  isRowDiff('life-funeral')
                    ? 'bg-amber-100/60 hover:bg-amber-100/80 font-medium'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-100 pl-4">
                  <div className="text-slate-800 font-medium">
                    2. ค่าปลงศพหรือจัดการงานศพ กรณีเสียชีวิตจากการเจ็บป่วย
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    (ระยะเวลารอคอย 180 วัน)
                  </div>
                </td>
                {selectedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-100"
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                      {formatCurrency(plan.life.funeralBenefit)}
                    </div>
                  </td>
                ))}
                {isCombinedVisible && combinedTotals && (
                  <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                    <div className="font-black text-[#00509d] text-xs sm:text-sm md:text-base">
                      {formatCurrency(combinedTotals.lifeFuneral)}
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>

          {/* Table Footer: Premiums (รายเดือน & รายปี) + Combined Premium */}
          <tfoot>
            <tr className="bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 text-white border-t-2 border-sky-400">
              <td className="p-3.5 sm:p-4 font-bold text-base md:text-lg border-r border-sky-800">
                <div className="tracking-wide">เบี้ยประกันภัย</div>
                <div className="text-[11px] font-normal text-sky-300 mt-0.5">
                  (คำนวณแบ่งจ่ายรายเดือน และรายปี รวมภาษี/อากร)
                </div>
              </td>

              {selectedPlans.map((plan) => (
                <td
                  key={plan.id}
                  className="p-3 sm:p-4 text-center border-r border-sky-800 align-middle"
                >
                  <div className="flex items-baseline justify-center">
                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {formatCurrency(plan.monthlyPremium)}
                    </span>
                    <span className="text-xs font-normal text-sky-200 ml-1">บาท/ด.</span>
                  </div>
                  <div className="text-[11px] font-semibold text-sky-300 mt-1 bg-sky-950/70 py-0.5 px-2 rounded-full inline-block border border-sky-800/40">
                    {formatCurrency(plan.annualPremium)} บาท/ปี
                  </div>
                </td>
              ))}

              {/* Combined Total Premium Footer Cell */}
              {isCombinedVisible && combinedTotals && (
                <td className="p-3.5 sm:p-4 text-center bg-gradient-to-b from-[#0a4882] via-[#094f92] to-[#002f5c] text-white border-l-2 border-sky-300 align-middle">
                  <div className="text-[10px] font-bold text-sky-200 mb-0.5 tracking-wide">
                    {existingCustomer
                      ? `เบี้ยรวมแผนเดิม + ใหม่ (${plansForCombined.length} แผน)`
                      : `เบี้ยรวม (${selectedPlans.length} แผน)`}
                  </div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                      {formatCurrency(combinedTotals.monthlyPremium)}
                    </span>
                    <span className="text-xs font-normal text-sky-200 ml-1">บาท/ด.</span>
                  </div>
                  <div className="text-[11px] font-bold text-sky-100 mt-1 bg-white/15 py-0.5 px-2.5 rounded-full inline-block border border-sky-300/40 shadow-xs">
                    {formatCurrency(combinedTotals.annualPremium)} บาท/ปี
                  </div>
                  {existingCustomer && combinedTotals.addedMonthly > 0 && (
                    <div className="mt-1.5 text-[10px] font-extrabold text-sky-100 bg-sky-900/80 border border-sky-400/50 py-0.5 px-2 rounded-md">
                      ลูกค้าเดิมจ่ายเพิ่มเพียง +฿{formatCurrency(combinedTotals.addedMonthly)}/ด.
                    </div>
                  )}
                </td>
              )}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
