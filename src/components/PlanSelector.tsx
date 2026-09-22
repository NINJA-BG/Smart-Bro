import React, { useState } from 'react';
import { InsurancePlan, CustomerProfile, CustomerPolicyItem, PlanCategory } from '../types';
import { formatCurrency } from '../data/plans';
import { calculatePolicyDuration } from '../data/customers';
import {
  Check,
  X,
  Layers,
  UserCheck,
  Calendar,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Settings,
  Clock,
  Activity,
  Plus,
  FileText,
} from 'lucide-react';

interface PlanSelectorProps {
  allPlans: InsurancePlan[];
  selectedPlanIds: string[];
  onTogglePlan: (planId: string) => void;
  onSetSelection: (planIds: string[]) => void;
  currentAge?: number | null;
  existingCustomer?: CustomerProfile | null;
  onResetCustomer?: () => void;
  onOpenPlanSettings?: () => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  allPlans,
  selectedPlanIds,
  onTogglePlan,
  onSetSelection,
  currentAge = null,
  existingCustomer = null,
  onResetCustomer,
  onOpenPlanSettings,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'health' | 'pa'>('all');
  const MAX_SELECTION = 4;
  const isMaxSelected = selectedPlanIds.length >= MAX_SELECTION;

  const existingCustomerPlan = existingCustomer
    ? allPlans.find((p) => p.id === existingCustomer.existingPlanId) || null
    : null;

  const isExistingPlanSelected = existingCustomerPlan
    ? selectedPlanIds.includes(existingCustomerPlan.id)
    : false;

  const policyDuration = existingCustomer
    ? calculatePolicyDuration(existingCustomer.startDate)
    : null;

  const filteredPlans = allPlans.filter((plan) => {
    if (activeCategoryTab === 'health') return plan.category === 'health';
    if (activeCategoryTab === 'pa') return plan.category === 'pa';
    return true;
  });

  const healthPlansCount = allPlans.filter((p) => p.category === 'health').length;
  const paPlansCount = allPlans.filter((p) => p.category === 'pa').length;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 sm:p-5 mb-4">
      {/* 1. ข้อมูลลูกค้าเดิมและแผนที่ถือครอง (เด่น ชัดเจน แยกกับส่วนอื่น) */}
      {existingCustomer && (() => {
        const customerPolicies: CustomerPolicyItem[] =
          existingCustomer.policies && existingCustomer.policies.length > 0
            ? existingCustomer.policies
            : [
                {
                  policyNumber: existingCustomer.policyNumber,
                  planId: existingCustomer.existingPlanId,
                  startDate: existingCustomer.startDate,
                  lossClaimRate: existingCustomer.lossClaimRate,
                  lossClaimStatus: existingCustomer.lossClaimStatus,
                },
              ];

        let totalExistingMonthly = 0;
        let totalExistingAnnual = 0;

        return (
          <div className="mb-6 rounded-2xl border-2 border-emerald-500/80 bg-white shadow-md overflow-hidden ring-4 ring-emerald-500/10">
            {/* Header: Customer Info & Status Bar - โดดเด่น ชัดเจน */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white backdrop-blur-xs shrink-0 shadow-inner">
                  <UserCheck className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-300 text-emerald-950 text-[10.5px] font-black tracking-wide uppercase shadow-2xs">
                      ลูกค้าเดิมในระบบ
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                      คุณ{existingCustomer.fullName}
                    </span>
                    <span className="text-xs text-emerald-200 font-medium">
                      (อายุ {existingCustomer.age} ปี)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-emerald-100/90 flex-wrap">
                    <span>เลขบัตร: <strong className="font-mono text-white">{existingCustomer.idCard}</strong></span>
                    <span className="text-emerald-400/60">•</span>
                    <span className="inline-flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded text-[11px] border border-emerald-500/30">
                      LINE OA: <strong className="text-white">{existingCustomer.lineOaStatusText}</strong>
                    </span>
                    <span className="text-emerald-400/60">•</span>
                    <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[11px] border border-white/15 text-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      {customerPolicies.length > 1 ? `ถือครอง ${customerPolicies.length} กรมธรรม์` : 'ถือครอง 1 กรมธรรม์'}
                    </span>
                  </div>
                </div>
              </div>

              {onResetCustomer && (
                <button
                  type="button"
                  onClick={onResetCustomer}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-center"
                >
                  เปลี่ยนลูกค้า
                </button>
              )}
            </div>

            {/* Policies list in clean, distinctive rows */}
            <div className="divide-y divide-emerald-100/80 bg-gradient-to-b from-emerald-50/20 to-white">
              {customerPolicies.map((pol, idx) => {
                const plan = allPlans.find((p) => p.id === pol.planId);
                const duration = calculatePolicyDuration(pol.startDate);
                const isSelected = selectedPlanIds.includes(pol.planId);
                const monthly = plan?.monthlyPremium || 0;
                const annual = plan?.annualPremium || 0;
                totalExistingMonthly += monthly;
                totalExistingAnnual += annual;

                const lossStatus = pol.lossClaimStatus || existingCustomer.lossClaimStatus;

                return (
                  <div
                    key={`${pol.planId}-${idx}`}
                    className="p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 hover:bg-emerald-50/40 transition-colors border-l-4 border-l-emerald-600"
                  >
                    {/* Left: Plan Info & Indicators */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm sm:text-base">
                          {idx + 1}. {plan?.name || pol.planId}
                        </span>
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                          แผนเดิมที่ถือครอง
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          กรมธรรม์ {pol.policyNumber}
                        </span>

                        {plan?.category === 'health' ? (
                          plan.opd.illness.covered ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                              <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" /> คุ้มครอง OPD {plan.opd.illness.perVisit ? `฿${formatCurrency(plan.opd.illness.perVisit)}/ครั้ง` : ''}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                              <X className="w-3.5 h-3.5 text-slate-400" /> ไม่คุ้มครอง OPD
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                            <Check className="w-3.5 h-3.5 text-sky-600 stroke-[2.5]" /> OPD อุบัติเหตุ ฿${formatCurrency(plan?.opd.accident || 0)}
                          </span>
                        )}
                      </div>

                      {/* Dates & Loss Claim status - ชัดเจนและอ่านง่าย */}
                      <div className="flex items-center gap-2 sm:gap-3.5 mt-2 text-xs text-slate-600 flex-wrap">
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>วันที่ทำ: <strong className="text-slate-800 font-bold">{pol.startDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 text-emerald-900 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>ทำประกันมาแล้ว: <strong className="font-extrabold text-emerald-950">{duration.displayText}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 text-amber-950 shadow-2xs">
                          <Activity className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>Loss Claim: <strong className="font-extrabold text-amber-900">{lossStatus}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Premium & Compare Action Button */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-emerald-100">
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] text-slate-500 font-medium block">เบี้ยประกันภัยแผนเดิม</span>
                        <div className="text-sm sm:text-base font-black text-emerald-900">
                          ฿{formatCurrency(monthly)}<span className="text-xs text-slate-500 font-normal">/ด.</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          ฿{formatCurrency(annual)}/ปี
                        </div>
                      </div>

                      {plan && (
                        <button
                          type="button"
                          onClick={() => onTogglePlan(plan.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-emerald-700 text-white hover:bg-emerald-800 ring-2 ring-emerald-600/30'
                              : 'bg-white border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 hover:shadow-sm'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-200 stroke-[2.5]" />
                              <span>แสดงในตารางเปรียบเทียบแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                              <span>นำแผนเดิมเข้าตาราง</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary bar if multiple policies */}
            {customerPolicies.length > 1 && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 px-4 py-2.5 border-t-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-700">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  รวมเบี้ยประกันภัยแผนเดิมทั้งหมด ({customerPolicies.length} แผน):
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-emerald-900 text-sm sm:text-base">
                    ฿{formatCurrency(totalExistingMonthly)}/ด.
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    (฿{formatCurrency(totalExistingAnnual)}/ปี)
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Visual Section Divider: แยกส่วนแผนเดิม กับ แผนใหม่ที่จะเปรียบเทียบ อย่างชัดเจน */}
      {existingCustomer && (
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t-2 border-dashed border-slate-200" />
          </div>
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-300/80 rounded-full text-xs font-bold text-slate-700 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>เลือกแผนประกันภัยใหม่ด้านล่างเพื่อเปรียบเทียบ / Top-up</span>
          </div>
        </div>
      )}

      {/* Age filter banner if NO existing customer but age filter is active */}
      {!existingCustomer && currentAge !== null && (
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="font-semibold text-slate-700">
              กรองตามอายุ: {currentAge} ปี
            </span>
          </div>

          {onResetCustomer && (
            <button
              type="button"
              onClick={onResetCustomer}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              เปลี่ยนข้อมูล
            </button>
          )}
        </div>
      )}

      {/* Clean & Minimal Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {existingCustomer ? 'เลือกแผนที่จะเปรียบเทียบ / Top-up' : 'เลือกแผนเปรียบเทียบ'}
          </h2>
          <span className="text-[11px] text-slate-400">
            (สูงสุด {MAX_SELECTION} แผน)
          </span>
        </div>

        {/* Minimal Category Tabs & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          {/* Category Tabs */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveCategoryTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ทั้งหมด ({allPlans.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('health')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'health'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              สุขภาพ ({healthPlansCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('pa')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'pa'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              PA ({paPlansCount})
            </button>
          </div>

          {/* Settings Button */}
          {onOpenPlanSettings && (
            <button
              type="button"
              onClick={onOpenPlanSettings}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
              title="ตั้งค่าความคุ้มครองและชื่อแผนประกัน"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">ตั้งค่าแผน</span>
            </button>
          )}

          {/* Selection Counter Pill */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
              selectedPlanIds.length > 0
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            เลือก {selectedPlanIds.length}/{MAX_SELECTION}
          </span>

          {selectedPlanIds.length > 0 && (
            <button
              onClick={() => onSetSelection([])}
              className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer underline ml-0.5"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Subtle Minimal Presets Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 text-[11px] text-slate-500 border-b border-slate-100/80 scrollbar-none">
        <span className="font-medium text-slate-400 shrink-0">
          ชุดแนะนำ:
        </span>
        <button
          type="button"
          onClick={() => onSetSelection(['plan-15-i', 'plan-pa-60'])}
          className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 cursor-pointer transition-colors"
        >
          15-I + PA60 (ยอดนิยม)
        </button>
        <button
          type="button"
          onClick={() => onSetSelection(['plan-15-o', 'plan-pa-90'])}
          className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 cursor-pointer transition-colors"
        >
          15-O + PA90 (คุ้มครองครบ)
        </button>
        <button
          type="button"
          onClick={() => onSetSelection(['plan-pa-60', 'plan-pa-90', 'plan-pa-120', 'plan-pa-150'])}
          className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 cursor-pointer transition-colors"
        >
          เปรียบเทียบ PA 4 แผน
        </button>
        <button
          type="button"
          onClick={() => onSetSelection(['plan-15-i', 'plan-15-o'])}
          className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 cursor-pointer transition-colors"
        >
          15-I vs 15-O
        </button>
      </div>

      {/* Plan Selection Grid - Minimal, Crisp & Balanced */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
        {filteredPlans.map((plan) => {
          const isSelected = selectedPlanIds.includes(plan.id);
          const isExistingCustomerPlan = existingCustomer?.existingPlanId === plan.id;
          const isPa = plan.category === 'pa';

          // Check age eligibility if age filter is specified
          const isAgeIneligible =
            currentAge !== null && (currentAge < plan.minAge || currentAge > plan.maxAge);
          const isDisabled = (!isSelected && isMaxSelected) || isAgeIneligible;

          return (
            <div
              key={plan.id}
              onClick={() => {
                if (!isDisabled) {
                  onTogglePlan(plan.id);
                }
              }}
              className={`relative rounded-xl p-3 transition-all duration-150 text-left flex flex-col justify-between border select-none ${
                isAgeIneligible
                  ? 'border-slate-200 bg-slate-50/60 opacity-40 cursor-not-allowed'
                  : isSelected
                  ? 'border-slate-900 bg-slate-50/80 shadow-xs ring-1 ring-slate-900 cursor-pointer'
                  : isDisabled
                  ? 'border-slate-200 bg-slate-50/40 opacity-50 cursor-not-allowed'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs cursor-pointer active:scale-[0.99]'
              }`}
            >
              {/* Header: Name + Status Badge + Checkbox */}
              <div>
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">
                      {plan.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isExistingCustomerPlan ? 'แผนเดิม' : isPa ? 'อุบัติเหตุ PA' : 'สุขภาพ'}
                    </span>
                  </div>

                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 text-[10px] transition-colors mt-0.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : isAgeIneligible
                        ? 'border border-slate-200 bg-slate-100 text-slate-300'
                        : 'border border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    {isAgeIneligible ? (
                      <Lock className="w-2.5 h-2.5" />
                    ) : (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </span>
                </div>

                {/* OPD Coverage Indicator - Minimal Chip */}
                <div className="my-1.5">
                  {plan.category === 'health' ? (
                    plan.opd.illness.covered ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-emerald-50 text-emerald-700">
                        <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>มี OPD {plan.opd.illness.perVisit ? `฿${formatCurrency(plan.opd.illness.perVisit)}/ครั้ง` : ''}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-normal bg-slate-100 text-slate-500">
                        <X className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>ไม่มี OPD</span>
                      </div>
                    )
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium bg-sky-50 text-sky-800">
                      <Check className="w-2.5 h-2.5 text-sky-600 shrink-0" />
                      <span>OPD อุบัติเหตุ ฿{formatCurrency(plan.opd.accident)}</span>
                    </div>
                  )}
                </div>

                {/* Age Range */}
                <div className="text-[11px] text-slate-400 mt-1">
                  <span>อายุ </span>
                  <span
                    className={
                      isAgeIneligible
                        ? 'text-rose-600 font-bold'
                        : 'text-slate-600 font-medium'
                    }
                  >
                    {plan.ageRangeText}
                  </span>
                  {isAgeIneligible && (
                    <span className="text-[10px] text-rose-600 ml-1">(ไม่ตรงเกณฑ์)</span>
                  )}
                </div>
              </div>

              {/* Price Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between gap-1">
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    ฿{formatCurrency(plan.monthlyPremium)}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">/ด.</span>
                </div>
                <div className="text-[10px] text-slate-400 font-normal">
                  ฿{formatCurrency(plan.annualPremium)}/ปี
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
