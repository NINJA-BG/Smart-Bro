import React from 'react';
import {
  Menu,
  LayoutGrid,
  ClipboardList,
  Bell,
  Printer,
  FileDown,
  User,
  History,
  Settings,
} from 'lucide-react';
import { ExportMeta, CustomerProfile } from '../types';

interface SmileSaleHeaderProps {
  onToggleSidebar: () => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  onOpenPlanSettings?: () => void;
  onPrint: () => void;
  historyCount: number;
  markedCount: number;
  exportMeta: ExportMeta;
  existingCustomer?: CustomerProfile | null;
}

export const SmileSaleHeader: React.FC<SmileSaleHeaderProps> = ({
  onToggleSidebar,
  onOpenHistory,
  onOpenExport,
  onOpenPlanSettings,
  onPrint,
  historyCount,
  markedCount,
  exportMeta,
  existingCustomer,
}) => {
  const agentDisplayName = exportMeta.agentFirstName
    ? `${exportMeta.agentFirstName} (${exportMeta.agentOfficeCode || '05741'})`
    : 'บรรจง (05741)';

  return (
    <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      <div className="px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="เปิด/ปิดเมนูแถบข้าง"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#00509d] tracking-tight">
            Smart Brochure
          </h1>
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Print & Export Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onPrint}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="พิมพ์เอกสารเปรียบเทียบ"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>พิมพ์</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00509d] hover:bg-[#003e7a] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              title="ส่งออกเอกสาร PDF หรือบันทึก"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>ส่งออก / บันทึก</span>
            </button>
          </div>

          {/* Grid App Launcher */}
          <button
            type="button"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="เมนูระบบแอปพลิเคชัน"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* History / Clipboard Tasks */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="ประวัติการบันทึกเอกสารเปรียบเทียบ"
          >
            <ClipboardList className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
            {markedCount > 0 && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="การแจ้งเตือน"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {/* User Profile Badge (Orange/Gold badge as in screenshot) */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-2xs border-2 border-white ring-1 ring-amber-300">
              <span className="text-[10px]">สยาม</span>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-800">
              {agentDisplayName}
            </span>
          </div>
        </div>
      </div>

      {/* Subheader / Breadcrumb as in screenshot */}
      <div className="px-4 sm:px-6 py-1.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-600">Smart Brochure</span>
          {existingCustomer && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
              ลูกค้าเดิม: คุณ{existingCustomer.fullName} ({existingCustomer.policyNumber})
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firebase: smart-brochure-3195e</span>
          </span>
          <span className="hidden sm:inline">Siam Smile Insurance Broker</span>
        </div>
      </div>
    </header>
  );
};
