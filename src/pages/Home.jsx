import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  LogIn,
  Bell,
  Flame,
  QrCode,
  ScanLine,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Activity,
  FileText,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Info,
  RefreshCw,
  Home as HomeIcon,
  BookOpen,
  User,
  GraduationCap,
  Camera,
  Check,
  SunMedium,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export default function Home() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('home');

  // Interactive Modals State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTreeInfoOpen, setIsTreeInfoOpen] = useState(false);

  // Dynamic QR Code Countdown Timer simulation (refreshes every 30s)
  const [qrCountdown, setQrCountdown] = useState(24);
  const [qrToken, setQrToken] = useState('HADER-20230894-SESSION-8842');
  const [toastMessage, setToastMessage] = useState(null);

  // Excuse Form State
  const [excuseLecture, setExcuseLecture] = useState('design');
  const [excuseReason, setExcuseReason] = useState('medical');
  const [excuseNote, setExcuseNote] = useState('');
  const [isSubmittingExcuse, setIsSubmittingExcuse] = useState(false);

  // Countdown timer effect for QR rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          const randomNonce = Math.floor(1000 + Math.random() * 9000);
          setQrToken(`HADER-20230894-SESSION-${randomNonce}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleExcuseSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingExcuse(true);
    setTimeout(() => {
      setIsSubmittingExcuse(false);
      setIsExcuseModalOpen(false);
      setExcuseNote('');
      triggerToast('تم تشفير وإرسال طلب العذر بنجاح إلى رئيس القسم وأستاذ المادة ✅');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-24 lg:pb-12 relative overflow-x-hidden" dir="rtl">
      
      {/* =========================================================================
          AMBIENT LIQUID BACKGROUND ORBS (SUBTLE HAILINE REFRACTIONS)
         ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-500/8 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '11s' }}></div>
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '13s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Toast Alert Banner with Liquid Glass Effect */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#0B0F17]/90 text-white px-4 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center gap-3 backdrop-blur-2xl transition-all duration-300 border border-emerald-500/30">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-200">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          MAIN RESPONSIVE CONTAINER (Mobile-First to Desktop/Laptop)
         ========================================================================= */}
      <div className="max-w-md md:max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8 space-y-5 md:space-y-6 relative z-10">

        {/* =========================================================================
            HEADER: FLOATING LIQUID GLASS BAR
           ========================================================================= */}
        <header className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 md:p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-white/20">
          <div className="flex items-center justify-between gap-3">
            
            {/* Student Info */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 md:w-13 md:h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-base md:text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/30">
                  <span>JM</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#070B12] rounded-full shadow-[0_0_8px_#34D399]"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base md:text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                    أهلاً، جوفاني 👋
                  </h1>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    قسم تكنولوجيا التعليم
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>الفرقة 3</span>
                </div>
              </div>
            </div>

            {/* Actions: Streak, Notifications, Login/Switch */}
            <div className="flex items-center gap-2">
              <div 
                className="bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.12)] cursor-pointer active:scale-95 transition-all"
                title="أيام الالتزام المتتالية بالحضور"
                onClick={() => triggerToast('أحسنت! 12 يوماً من الحضور والالتزام بدون أي غياب 🔥')}
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>12 يوم</span>
              </div>

              <button
                type="button"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 active:scale-95 transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                aria-label="التنبيهات والإشعارات"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399] ring-2 ring-[#070B12]"></span>
              </button>

              <Link
                to="/auth"
                className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-emerald-400 border border-white/10 active:scale-95 transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-center"
                title="تسجيل الدخول / تبديل الحساب"
                aria-label="بوابة الدخول وإنشاء الحساب"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </header>

        {/* =========================================================================
            BENTO GRID ARCHITECTURE (Desktop & Tablet Split Layout)
            - Order 1 on Mobile: Main Column (Hero Next Lecture, Quick Actions, Schedule)
            - Order 2 on Mobile: Right Column (Compact Growth Tree, GPA & Stats, Library)
            - On Desktop md/lg (dir="rtl"): Right Column (35%) sits on Right, Left/Main (65%) sits on Left
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
          
          {/* =======================================================================
              MAIN / LEFT COLUMN (Desktop 65% width)
             ======================================================================= */}
          <div className="order-1 md:order-2 md:col-span-7 lg:col-span-8 space-y-5">
            
            {/* -------------------------------------------------------------------
                PRIORITY 1: UPCOMING LECTURE HERO (PROMOTED TO TOP POSITION)
               ------------------------------------------------------------------- */}
            <section className="relative overflow-hidden bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 md:p-6 border border-emerald-500/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_12px_40px_rgba(0,0,0,0.45)] hover:border-emerald-500/40 transition-all duration-300 group">
              
              {/* Internal Bioluminescent Refraction */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              {/* Top Meta Row: Live Status & Department Pill */}
              <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    المحاضرة القادمة
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>تبدأ بعد 25 دقيقة</span>
                  </span>
                </div>
              </div>

              {/* Lecture Name & Professor */}
              <div className="space-y-1 relative z-10">
                <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                  تصميم وإنتاج الوسائط المتعددة التعليمية
                </h2>
                <p className="text-xs md:text-sm text-slate-300 flex items-center gap-1.5 pt-0.5">
                  <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>المحاضر: <strong className="font-semibold text-slate-100">أ.د / حسام الدين مصطفى</strong></span>
                </p>
              </div>

              {/* Details Badges Grid (Time, Location, Status) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 mt-4 border-t border-white/10 relative z-10 text-xs">
                
                {/* Time Slot */}
                <div className="flex items-center gap-2 text-slate-200 bg-white/[0.03] border border-white/5 rounded-2xl p-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block font-medium">التوقيت</span>
                    <span className="font-bold font-mono">10:30 ص - 12:00 م (90 دقيقة)</span>
                  </div>
                </div>

                {/* Location Venue */}
                <div className="flex items-center gap-2 text-slate-200 bg-white/[0.03] border border-white/5 rounded-2xl p-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block font-medium">المكان</span>
                    <span className="font-bold">معمل الحاسب 3 • مبنى د • الدور 2</span>
                  </div>
                </div>

              </div>

              {/* Department Urgent Schedule Notice Banner */}
              <div className="mt-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-200 relative z-10">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 block">تنبيه تغيير قاعة اليوم:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px] md:text-xs">
                    محاضرة <span className="text-amber-200 font-semibold">الذكاء الاصطناعي في التعليم</span> (12:30 م) تم نقلها استثنائياً إلى <span className="font-semibold underline text-amber-300">قاعة 302</span> بدلاً من المدرج المركزي.
                  </p>
                </div>
              </div>

            </section>

            {/* -------------------------------------------------------------------
                PRIORITY 2: PRIMARY QUICK ACTIONS (1-TAP RAPID ACCESS)
               ------------------------------------------------------------------- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Main Attendance QR Button */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-200 p-4 rounded-3xl border border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.15),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-98 transition-all duration-300 flex items-center justify-between text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <QrCode className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-300/80 font-medium block">تسجيل الحضور الفوري</span>
                    <span className="text-base font-bold text-white block">كودي للحضور</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                  <ChevronLeft className="w-5 h-5 text-emerald-300" />
                </div>
              </button>

              {/* Secondary Button: Scan Lecture Hall QR (Lecturer / Student Leader) */}
              <button
                type="button"
                onClick={() => setIsScannerModalOpen(true)}
                className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-200 p-4 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] active:scale-98 transition-all duration-300 flex items-center justify-between text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-slate-300 group-hover:scale-105 transition-transform">
                    <ScanLine className="w-6 h-6 text-slate-200" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">تسجيل قاعة</span>
                    <span className="text-xs text-slate-400 font-medium block">خاص بمندوب الدفعة والمحاضر</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                </div>
              </button>

            </section>

            {/* -------------------------------------------------------------------
                PRIORITY 4: TODAY'S REMAINING SCHEDULE (جدول محاضرات اليوم)
               ------------------------------------------------------------------- */}
            <section className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 space-y-3.5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white">
                    جدول محاضرات اليوم (الخميس)
                  </h3>
                </div>

                <span className="text-xs bg-white/[0.06] text-slate-300 border border-white/10 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>3 محاضرات مجدولة</span>
                </span>
              </div>

              {/* Timeline Items List */}
              <div className="space-y-2.5 pt-1">
                
                {/* Lecture 1: Upcoming / Active */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-bold text-white">تصميم وإنتاج الوسائط المتعددة</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold">
                          المحاضرة القادمة
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        أ.د / حسام الدين مصطفى • معمل الحاسب 3 (مبنى د)
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-left self-start sm:self-center font-mono text-xs font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    10:30 ص - 12:00 م
                  </div>
                </div>

                {/* Lecture 2: Afternoon */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] text-slate-300 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-bold text-slate-200">الذكاء الاصطناعي في التعليم</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                          قاعة 302 ⚠️
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        د / مروة كامل • مبنى د
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-left self-start sm:self-center font-mono text-xs font-medium text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">
                    12:30 م - 02:00 م
                  </div>
                </div>

                {/* Lecture 3: Later */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] text-slate-300 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-bold text-slate-300">تطبيقات الواقع الافتراضي والمعزز</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        د / تامر فؤاد • المدرج المركزي 2
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-left self-start sm:self-center font-mono text-xs font-medium text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg">
                    02:15 م - 03:45 م
                  </div>
                </div>

              </div>

            </section>

          </div>

          {/* =======================================================================
              RIGHT COLUMN (Desktop 35% width)
              - Compact Growth Tree mini-widget
              - Quick GPA / Attendance metrics
              - Companion study library shortcut
             ======================================================================= */}
          <div className="order-2 md:order-1 md:col-span-5 lg:col-span-4 space-y-5">
            
            {/* -------------------------------------------------------------------
                PRIORITY 3: COMPACT GROWTH TREE (LOW-PROFILE MINI-WIDGET)
               ------------------------------------------------------------------- */}
            <section className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 md:p-5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] group">
              
              {/* Top Row: Mini Glowing Badge & Level Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {/* Miniature Glowing Tree Icon Container */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-700/20 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform">
                    <span className="text-xl">🌳</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold">
                        المستوى 4
                      </span>
                      <span className="text-xs font-bold text-white">شجرة مثمرة</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                      واحة الحضور الأكاديمي
                    </span>
                  </div>
                </div>

                {/* Info Guide Trigger */}
                <button
                  type="button"
                  onClick={() => setIsTreeInfoOpen(true)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-white/[0.06] transition-colors"
                  title="دليل شجرة النمو"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Miniature Progress Bar & Points */}
              <div className="space-y-1.5 bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">التقدم نحو المستوى 5</span>
                  <span className="text-emerald-400 font-bold font-mono">75%</span>
                </div>

                {/* Progress Trough */}
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                  <div 
                    className="h-full bg-gradient-to-l from-emerald-400 via-teal-400 to-emerald-500 rounded-full transition-all duration-700 relative shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: '75%' }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="font-mono text-emerald-300 font-bold">425 / 500 نقطة</span>
                  <span className="text-slate-500">متبقي 75 نقطة</span>
                </div>
              </div>

              {/* Clean Navigation Button */}
              <button
                type="button"
                onClick={() => setIsTreeInfoOpen(true)}
                className="w-full mt-3 py-2 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-emerald-300 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group/btn"
              >
                <span>عرض واحة الشجرة بالكامل</span>
                <span className="group-hover/btn:-translate-x-1 transition-transform">←</span>
              </button>

            </section>

            {/* -------------------------------------------------------------------
                QUICK GPA & ATTENDANCE METRICS
               ------------------------------------------------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3.5">
              
              {/* Metric 1: GPA Department Rank */}
              <div className="bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-transparent backdrop-blur-2xl rounded-3xl p-4 border border-violet-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between hover:border-violet-500/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">ترتيبي بالقسم</span>
                  <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.25)]">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black text-white tracking-tight">
                    المركز #14
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    من بين 100 طالب بالدفعة
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-violet-300 font-bold bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 rounded-md">
                    أعلى 15% 🌟
                  </span>
                  <span className="text-slate-500 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>مشفر وخاص</span>
                  </span>
                </div>
              </div>

              {/* Metric 2: Attendance Commitment */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-transparent backdrop-blur-2xl rounded-3xl p-4 border border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">نسبة الالتزام التراكمية</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                    <span>94%</span>
                    <span className="text-xs text-slate-400 font-normal">ممتاز</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    32 محاضرة حضرية • 2 غياب
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">المسموح:</span>
                  <span className="font-semibold text-emerald-300">متبقي 4 غيابات</span>
                </div>
              </div>

              {/* Action Card: Excuse Request Trigger */}
              <div 
                onClick={() => setIsExcuseModalOpen(true)}
                className="bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between cursor-pointer active:scale-98 transition-all duration-300 group hover:border-blue-500/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">تقديم عذر</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    طلب عذر غياب رسمي
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    إرسال تقرير طبي أو إفادة معتمدة مباشرة لأستاذ المادة
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-400 font-bold">
                  <span>تقديم طلب عذر جديد</span>
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                </div>
              </div>

            </div>

            {/* -------------------------------------------------------------------
                COMPANION STUDY LIBRARY SHORTCUT
               ------------------------------------------------------------------- */}
            <a
              href="https://drive.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] hover:border-indigo-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        مكتبة ملخصات القسم
                      </h4>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-bold px-1.5 py-0.5 rounded-md">
                        سحابي
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      سلايدات، مذكرات المقررات وبنك الأسئلة للأسبوع 8
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-slate-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </a>

          </div>

        </div>

      </div>

      {/* =========================================================================
          FLOATING LIQUID BOTTOM DOCK (Clean on Mobile, Gracefully Pinned)
         ========================================================================= */}
      <nav 
        className="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40 bg-[#0B0F17]/80 backdrop-blur-2xl border border-white/10 rounded-full px-3 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]"
        aria-label="شريط التنقل السفلي"
      >
        <div className="flex items-center justify-between px-1">
          
          {/* Item 1: Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'home' 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'home' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : ''}`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الرئيسية</span>
          </button>

          {/* Item 2: Schedule */}
          <Link
            to="/schedule"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-emerald-400 font-medium transition-all"
            title="جدول المحاضرات الأكاديمي"
          >
            <div className="p-1.5 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الجدول</span>
          </Link>

          {/* Center Floating Neon Emerald Pill: Attendance QR */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="flex flex-col items-center -mt-6 group active:scale-95 transition-transform"
            title="كود الحضور السريع"
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-300/40 group-hover:scale-105 transition-all">
              <QrCode className="w-6 h-6 text-[#07090E]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-300 mt-1">كود الحضور</span>
          </button>

          {/* Item 4: Excuses */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('excuses');
              setIsExcuseModalOpen(true);
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'excuses' 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'excuses' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الأعذار</span>
          </button>

          {/* Item 5: Profile */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              triggerToast('بيانات الطالب: جوفاني مجدي • كود 20230894');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'profile' 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'profile' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px]">حسابي</span>
          </button>

        </div>
      </nav>

      {/* =========================================================================
          MODAL 1: STUDENT ATTENDANCE QR CODE MODAL (HIGH-CONTRAST SCANNABLE)
         ========================================================================= */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div 
            className="bg-[#0B0F17]/95 border border-white/15 w-full max-w-sm rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden transition-all duration-300"
            role="dialog" 
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">رمز الحضور الذكي</h3>
                  <p className="text-[11px] text-slate-400">كود مشفر ديناميكي لمنع التحايل</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: High Contrast Scannable White Card Container */}
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              
              {/* Dynamic Countdown Pill */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>يتجدد الرمز خلال {qrCountdown} ثانية</span>
              </div>

              {/* High Contrast Clean White Inner Card for Optical Scanning Quality */}
              <div className="relative p-5 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center">
                <QRCodeSVG
                  value={qrToken}
                  size={190}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'><circle cx='12' cy='12' r='10'/><path d='M9 12l2 2 4-4' stroke='white' stroke-width='2' fill='none'/></svg>",
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
                <span className="text-[10px] text-slate-500 font-mono font-bold mt-2 tracking-wider">
                  {qrToken.split('-')[2]} • VERIFIED
                </span>
              </div>

              {/* Student Metadata Card */}
              <div className="w-full bg-white/[0.04] p-3 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>جوفاني مجدي كامل</span>
                  <span className="font-mono text-emerald-400">#20230894</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>تكنولوجيا التعليم • عام</span>
                  <span>جلسة: 15 أكتوبر 2026</span>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerToast('تم رفع سطوع الشاشة لأعلى درجة لقراءة أسرع للكود ☀️');
                }}
                className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-slate-200 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <SunMedium className="w-4 h-4 text-amber-400" />
                <span>زيادة السطوع</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  triggerToast('تم إغلاق رمز الحضور');
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-[#07090E] py-2.5 rounded-2xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                تم المسح بنجاح
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SCANNER CAMERA SIMULATION (FOR LECTURER / REP)
         ========================================================================= */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#0B0F17] text-white w-full max-w-sm rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
            
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold">ماسح الحضور الذكي</h3>
              </div>
              <button 
                onClick={() => setIsScannerModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Camera Viewfinder */}
            <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
              <div className="w-56 h-56 border border-emerald-500/40 rounded-3xl relative flex items-center justify-center">
                <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg shadow-[0_0_10px_#10B981]"></span>
                <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg shadow-[0_0_10px_#10B981]"></span>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg shadow-[0_0_10px_#10B981]"></span>
                <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg shadow-[0_0_10px_#10B981]"></span>

                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_#10B981] animate-pulse"></div>

                <p className="text-xs text-slate-400 text-center px-4 font-medium">
                  وجّه الكاميرا نحو كود الطالب أو شاشة المحاضر
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsScannerModalOpen(false);
                  triggerToast('تم تسجيل حضور الطالب: أحمد محمود (20230712) بنجاح ✅');
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#07090E] py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Check className="w-4 h-4" />
                <span>محاكاة مسح كود ناجح</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: SUBMIT ABSENCE EXCUSE (MODAL / FORM)
         ========================================================================= */}
      {isExcuseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#0B0F17] w-full max-w-md rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
            
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">تقديم عذر غياب رسمي</h3>
                  <p className="text-[11px] text-slate-400">يُرسل مشفراً إلى منسق المادة ورئيس القسم</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExcuseModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExcuseSubmit} className="p-5 space-y-4">
              
              {/* Lecture Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  المحاضرة المراد تقديم العذر لها:
                </label>
                <select
                  value={excuseLecture}
                  onChange={(e) => setExcuseLecture(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                >
                  <option value="design" className="bg-[#0B0F17] text-white">تصميم الوسائط المتعددة (د. حسام مصطفى)</option>
                  <option value="ai" className="bg-[#0B0F17] text-white">الذكاء الاصطناعي في التعليم (د. مروة كامل)</option>
                  <option value="vr" className="bg-[#0B0F17] text-white">تطبيقات الواقع الافتراضي (د. تامر فؤاد)</option>
                </select>
              </div>

              {/* Reason Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نوع العذر:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'medical', label: 'عذر طبي 🏥' },
                    { id: 'emergency', label: 'ظرف طارئ ⚠️' },
                    { id: 'travel', label: 'عذر رسمي 📄' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setExcuseReason(r.id)}
                      className={`py-2 px-1 text-xs rounded-xl font-bold border transition-all text-center ${
                        excuseReason === r.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-white/[0.04] border-white/10 text-slate-400 hover:bg-white/[0.08]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Attachment Mockup */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  المستند المؤيد (تقرير طبي أو إفادة):
                </label>
                <div className="border-2 border-dashed border-white/15 hover:border-emerald-400/50 rounded-2xl p-4 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-slate-200 block">انقر لرفع ملف التقرير الطبي</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">صيغ مدعومة: PDF, JPG, PNG (حد أقصى 5 ميجابايت)</span>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ملاحظات توضيحية إضافية:
                </label>
                <textarea
                  rows={2}
                  value={excuseNote}
                  onChange={(e) => setExcuseNote(e.target.value)}
                  placeholder="اكتب شرحاً مختصراً لسبب الغياب إن وجد..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-3 text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExcuseModalOpen(false)}
                  className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 py-2.5 rounded-2xl text-xs font-bold transition-all border border-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExcuse}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-[#07090E] py-2.5 rounded-2xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5"
                >
                  {isSubmittingExcuse ? (
                    <span>جارِ الإرسال...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>إرسال الطلب</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: NOTIFICATIONS & ALERTS DRAWER
         ========================================================================= */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in pt-16">
          <div className="bg-[#0B0F17] w-full max-w-sm rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
            
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">إشعارات القسم (3 جديدة)</h3>
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-white/10 max-h-80 overflow-y-auto">
              
              <div className="p-3.5 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">تم تسجيل حضور المحاضرة</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">تم تأكيد حضورك بمحاضرة الوسائط المتعددة (الساعة 10:32 ص).</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">منذ 15 دقيقة</span>
                </div>
              </div>

              <div className="p-3.5 hover:bg-white/[0.03] transition-colors flex items-start gap-3 bg-amber-500/[0.03]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-300">نقل قاعة المحاضرة</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">محاضرة الذكاء الاصطناعي ستعقد بقاعة 302 اليوم.</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">منذ ساعة</span>
                </div>
              </div>

              <div className="p-3.5 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">ترقية في شجرة النمو 🌱</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">وصلت إلى 425 نقطة وأوشكت على بلوغ المستوى الخامس!</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">أمس</span>
                </div>
              </div>

            </div>

            <div className="p-3 bg-white/[0.02] text-center border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(false);
                  triggerToast('تم تحديد جميع الإشعارات كمقروءة');
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                تحديد الكل كمقروء
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: TREE STAGES GUIDE MODAL
         ========================================================================= */}
      {isTreeInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#0B0F17] w-full max-w-sm rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">نظام شجرة الحضور الأكاديمي</h3>
              <button 
                onClick={() => setIsTreeInfoOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                كل حضور لمحاضرة أو معمل يمنحك <strong className="text-emerald-400 font-bold">+25 نقطة نمو</strong> لشجرتك الافتراضية.
              </p>
              
              <div className="space-y-2 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between font-medium">
                  <span>المستوى 1: بذرة البداية</span>
                  <span className="font-mono text-slate-500">0 - 100 نقطة</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>المستوى 2: شتلة واعدة</span>
                  <span className="font-mono text-slate-500">101 - 250 نقطة</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>المستوى 3: شجرة شابة</span>
                  <span className="font-mono text-slate-500">251 - 400 نقطة</span>
                </div>
                <div className="flex items-center justify-between font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2 py-1 rounded-lg">
                  <span>المستوى 4: شجرة مثمرة (أنت هنا)</span>
                  <span className="font-mono">401 - 500 نقطة</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>المستوى 5: شجرة وارفة وشهادة تميز</span>
                  <span className="font-mono text-slate-500">+500 نقطة</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/[0.02] text-center border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsTreeInfoOpen(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#07090E] py-2 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
