import React from 'react';
import { InsurancePlan, CustomerProfile } from '../types';
import { formatCurrency } from '../data/plans';
import { Check, Layers, UserCheck, Calendar, Lock } from 'lucide-react';

interface PlanSelectorProps {
  allPlans: InsurancePlan[];
  selectedPlanIds: string[];
  onTogglePlan: (planId: string) => void;
  onSetSelection: (planIds: string[]) => void;
  currentAge?: number | null;
  existingCustomer?: CustomerProfile | null;
  onResetCustomer?: () => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  allPlans,
  selectedPlanIds,
  onTogglePlan,
  onSetSelection,
  currentAge = null,
  existingCustomer = null,
  onResetCustomer,
}) => {
  const isMaxSelected = selectedPlanIds.length >= 3;

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-3 sm:p-4 mb-4">
      {/* Existing customer or active age filter banner if active (Compact) */}
      {(existingCustomer || currentAge !== null) && (
        <div className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {existingCustomer ? (
              <span className="p-1 rounded bg-emerald-600 text-white shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="p-1 rounded bg-blue-600 text-white shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </span>
            )}
            <span className="font-bold text-slate-800">
              {existingCustomer
                ? `ลูกค้าเดิม: คุณ${existingCustomer.fullName}`
                : `กรองตามอายุ: ${currentAge} ปี`}
            </span>
            {existingCustomer && (
              <>
                <span className="text-slate-400">• กรมธรรม์ {existingCustomer.policyNumber}</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                  Loss: {existingCustomer.lossClaimStatus}
                </span>
              </>
            )}
          </div>

          {onResetCustomer && (
            <button
              type="button"
              onClick={onResetCustomer}
              className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold underline self-start sm:self-center cursor-pointer"
            >
              เปลี่ยนข้อมูล
            </button>
          )}
        </div>
      )}

      {/* Header and counter - Compact */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            เลือกแผนเปรียบเทียบ
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            (แตะเลือกสูงสุด 3 แผน)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
            selectedPlanIds.length === 3 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : selectedPlanIds.length === 0
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            เลือกแล้ว <strong className="font-bold">{selectedPlanIds.length}</strong>/3 แผน
          </span>

          {selectedPlanIds.length > 0 && (
            <button
              onClick={() => onSetSelection([])}
              className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer underline"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Compact Plan Selection Grid: Shows ONLY Name, Premium, Eligible Age */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 mt-2.5">
        {allPlans.map((plan) => {
          const isSelected = selectedPlanIds.includes(plan.id);
          const isExistingCustomerPlan = existingCustomer?.existingPlanId === plan.id;
          
          // Check age eligibility if age filter is specified
          const isAgeIneligible = currentAge !== null && (currentAge < plan.minAge || currentAge > plan.maxAge);
          const isDisabled = (!isSelected && isMaxSelected) || isAgeIneligible;

          return (
            <div
              key={plan.id}
              onClick={() => {
                if (!isDisabled) {
                  onTogglePlan(plan.id);
                }
              }}
              className={`relative rounded-xl p-2.5 sm:p-3 transition-all duration-150 text-left flex flex-col justify-between border select-none ${
                isAgeIneligible
                  ? 'border-slate-200 bg-slate-100/70 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? isExistingCustomerPlan
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1.5 ring-emerald-500/30 cursor-pointer'
                    : 'border-blue-600 bg-blue-50/50 shadow-xs ring-1.5 ring-blue-500/30 cursor-pointer'
                  : isDisabled
                  ? 'border-slate-200 bg-slate-50/60 opacity-60 cursor-not-allowed'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer active:scale-[0.99]'
              }`}
            >
              {/* Header: Plan Name + Check indicator */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    isSelected
                      ? isExistingCustomerPlan
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isAgeIneligible
                      ? 'border border-slate-300 bg-slate-200 text-slate-400'
                      : 'border border-slate-300 bg-white text-transparent'
                  }`}>
                    {isAgeIneligible ? <Lock className="w-2.5 h-2.5" /> : <Check className="w-3 h-3" />}
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {plan.name}
                  </span>
                </div>

                {isExistingCustomerPlan && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    เดิม
                  </span>
                )}
              </div>

              {/* Age Eligibility (อายุที่รับ) */}
              <div className="text-[11px] text-slate-500 my-0.5">
                <span>อายุ: </span>
                <strong className={isAgeIneligible ? 'text-rose-600 font-bold' : 'text-slate-700 font-semibold'}>
                  {plan.ageRangeText}
                </strong>
                {isAgeIneligible && (
                  <span className="text-[10px] text-rose-600 ml-1">(ไม่ตรงเกณฑ์)</span>
                )}
              </div>

              {/* Premium (เบี้ยรายเดือน & เบี้ยรายปี) */}
              <div className="mt-1 pt-1.5 border-t border-slate-100 flex items-baseline justify-between gap-1">
                <div>
                  <span className={`text-xs sm:text-sm font-extrabold ${isExistingCustomerPlan ? 'text-emerald-800' : 'text-blue-900'}`}>
                    ฿{formatCurrency(plan.monthlyPremium)}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-0.5">/ด.</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
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
