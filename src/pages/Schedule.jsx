import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  QrCode,
  Home as HomeIcon,
  FileText,
  X,
  RefreshCw,
  SunMedium,
  Coffee,
  LogIn
} from 'lucide-react';
import { scheduleData } from '../data/scheduleData';

// ONLY the 3 active university attendance days for Educational Technology - 2nd Year
const daysList = [
  { key: 'saturday', label: 'السبت', shortLabel: 'سبت', tag: 'بداية الأسبوع' },
  { key: 'sunday', label: 'الأحد', shortLabel: 'أحد', tag: 'يوم تطبيقي' },
  { key: 'wednesday', label: 'الأربعاء', shortLabel: 'أربعاء', tag: 'المحاضرات الأساسية' }
];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(() => {
    const day = typeof window !== 'undefined' ? new Date().getDay() : 6;
    if (day === 6) return 'saturday';
    if (day === 0) return 'sunday';
    if (day === 3) return 'wednesday';
    if (day === 1 || day === 2) return 'wednesday';
    return 'saturday';
  });

  const [currentAttendanceDay] = useState(() => {
    const day = typeof window !== 'undefined' ? new Date().getDay() : 6;
    if (day === 6) return 'saturday';
    if (day === 0) return 'sunday';
    if (day === 3) return 'wednesday';
    return null;
  });

  const isDayCurrentlyToday = (dayKey) => {
    return currentAttendanceDay === dayKey;
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'theory' | 'practical'
  const [toastMessage, setToastMessage] = useState(null);

  // QR Attendance Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedLectureForQr, setSelectedLectureForQr] = useState(null);
  const [qrCountdown, setQrCountdown] = useState(24);
  const [qrToken, setQrToken] = useState('HADER-20230894-SESSION-8842');

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

  const handleSelectToday = () => {
    const day = new Date().getDay();
    if (day === 6) {
      setSelectedDay('saturday');
      triggerToast('تم الانتقال إلى جدول اليوم (السبت) 📅');
    } else if (day === 0) {
      setSelectedDay('sunday');
      triggerToast('تم الانتقال إلى جدول اليوم (الأحد) 📅');
    } else if (day === 3) {
      setSelectedDay('wednesday');
      triggerToast('تم الانتقال إلى جدول اليوم (الأربعاء) 📅');
    } else {
      const nextDay = getSmartInitialDay();
      setSelectedDay(nextDay);
      const nextLabel = daysList.find(d => d.key === nextDay)?.label;
      triggerToast(`اليوم عطلة أكاديمية، تم الانتقال إلى أقرب يوم حضور (${nextLabel}) 🌿`);
    }
  };

  const openQrForLecture = (lecture) => {
    setSelectedLectureForQr(lecture);
    setIsQrModalOpen(true);
  };

  // Filter lectures for selected day
  const filteredLectures = useMemo(() => {
    const dayLectures = scheduleData[selectedDay] || [];
    return dayLectures.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());

      const isPractical =
        item.status === 'معمل' ||
        item.type.includes('تطبيقات') ||
        item.type.includes('معمل') ||
        item.type.includes('سكشن') ||
        item.type.includes('تدريب');

      const matchesType =
        filterType === 'all'
          ? true
          : filterType === 'practical'
          ? isPractical
          : !isPractical;

      return matchesSearch && matchesType;
    });
  }, [selectedDay, searchQuery, filterType]);

  const currentDayStats = useMemo(() => {
    const lectures = scheduleData[selectedDay] || [];
    const count = lectures.length;
    const practicalCount = lectures.filter(
      l => l.status === 'معمل' || l.type.includes('تطبيقات') || l.type.includes('معمل') || l.type.includes('سكشن') || l.type.includes('تدريب')
    ).length;
    const theoryCount = count - practicalCount;
    return { count, practicalCount, theoryCount };
  }, [selectedDay]);

  const activeDayIsToday = isDayCurrentlyToday(selectedDay);

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-24 lg:pb-12 relative overflow-x-hidden" dir="rtl">
      
      {/* =========================================================================
          AMBIENT LIQUID BACKGROUND ORBS (DARK OBSIDIAN & BIOLUMINESCENT GLOW)
         ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-500/8 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '11s' }}></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-cyan-600/8 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '13s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#0B0F17]/95 text-white px-4 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center gap-3 backdrop-blur-2xl transition-all duration-300 border border-emerald-500/30">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-200">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          MAIN CONTAINER (Mobile-First to Desktop/Laptop)
         ========================================================================= */}
      <div className="max-w-md md:max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8 space-y-5 md:space-y-6 relative z-10">

        {/* =======================================================================
            HEADER BAR
           ======================================================================= */}
        <header className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 md:p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Back button and title */}
            <div className="flex items-center gap-3.5">
              <Link
                to="/"
                className="w-11 h-11 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                title="الرجوع للرئيسية"
                aria-label="الرجوع للرئيسية"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-xl font-bold text-white tracking-tight">
                    جدول المحاضرات الأكاديمي
                  </h1>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold">
                    معتمد رسمياً
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>قسم تكنولوجيا التعليم • الفرقة الثانية • الفصل الدراسي الأول</span>
                </p>
              </div>
            </div>

            {/* Quick Actions (Today Button & Auth Link) */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleSelectToday}
                className="px-3.5 py-2 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>أيام الحضور (3 أيام)</span>
              </button>

              <Link
                to="/auth"
                className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-emerald-400 border border-white/10 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                title="تسجيل الدخول / تبديل الحساب"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </header>

        {/* =======================================================================
            DAY SWITCHER TABS (EXACTLY 3 ACTIVE ATTENDANCE DAYS)
            [السبت, الأحد, الأربعاء]
           ======================================================================= */}
        <section className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-2.5 md:p-3 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {daysList.map((day) => {
              const isSelected = selectedDay === day.key;
              const isToday = isDayCurrentlyToday(day.key);
              const lecturesCount = (scheduleData[day.key] || []).length;

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setSelectedDay(day.key)}
                  className={`relative py-3.5 px-2 sm:px-4 rounded-2xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-500/25 to-teal-500/15 text-white border border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {/* Today live indicator dot */}
                  {isToday && (
                    <span className="absolute top-2 left-2 sm:left-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse"></span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-base tracking-tight">{day.label}</span>
                    {isToday && (
                      <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded-md font-bold hidden sm:inline-block">
                        اليوم
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-semibold ${
                      isSelected
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                        : 'text-slate-400 bg-white/[0.03]'
                    }`}>
                      {lecturesCount} محاضرات
                    </span>
                    <span className="text-slate-500 hidden md:inline">• {day.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* =======================================================================
            DAY OVERVIEW & SEARCH / FILTER TOOLBAR (BENTO ROW)
           ======================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          
          {/* Day Overview Summary Card */}
          <div className="md:col-span-5 bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm md:text-base font-bold text-white">
                    جدول يوم {daysList.find(d => d.key === selectedDay)?.label}
                  </h2>
                  {activeDayIsToday && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                      اليوم
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  إجمالي {currentDayStats.count} محاضرات ({currentDayStats.practicalCount} معمل وتطبيقات • {currentDayStats.theoryCount} مدرجات وقاعات)
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="md:col-span-7 bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-3 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center gap-2.5">
            
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالمادة، الدكتور أو القاعة..."
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl pr-9 pl-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500/50 font-medium transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 justify-end">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'theory', label: 'نظري/مدرجات' },
                { id: 'practical', label: 'معامل/تطبيقات' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === f.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

          </div>

        </section>

        {/* =======================================================================
            LECTURES BENTO TIMELINE CARDS
           ======================================================================= */}
        <section className="space-y-4">
          
          {filteredLectures.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredLectures.map((lecture, index) => {
                const isFirst = index === 0 && activeDayIsToday;
                const isLab =
                  lecture.status === 'معمل' ||
                  lecture.type.includes('معمل') ||
                  lecture.type.includes('تطبيقات') ||
                  lecture.location.includes('معمل');

                return (
                  <div
                    key={lecture.id}
                    className={`relative overflow-hidden bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 border transition-all duration-300 hover:border-emerald-500/40 group ${
                      isFirst
                        ? 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                        : 'border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
                    }`}
                  >
                    {/* Top Accent Gradient Line on Hover */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Header Row: Timing & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {/* Time Badge */}
                        <div className="inline-flex items-center gap-1.5 bg-white/[0.06] text-slate-200 border border-white/10 px-3 py-1 rounded-xl text-xs font-bold font-mono">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lecture.time}</span>
                        </div>

                        {/* Status tag */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isLab
                            ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {lecture.status === 'معمل' ? 'معمل تطبيقي 💻' : 'قائمة بموعدها ✅'}
                        </span>
                      </div>

                      {/* Course Type Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                          {lecture.type}
                        </span>

                        {isFirst && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>المحاضرة القادمة</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lecture Title */}
                    <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                      {lecture.title}
                    </h3>

                    {/* Instructor / Doctor */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">
                        المحاضر: <strong className="text-slate-100 font-semibold">{lecture.doctor}</strong>
                      </span>
                    </div>

                    {/* Location Venue & Quick Attendance Trigger */}
                    <div className="flex items-center justify-between gap-3 pt-3.5 mt-3.5 border-t border-white/10 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium text-slate-200">{lecture.location}</span>
                      </div>

                      {/* Quick QR Attendance Button */}
                      <button
                        type="button"
                        onClick={() => openQrForLecture(lecture)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] active:scale-95 shrink-0"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>كود الحضور</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* ===================================================================
               EMPTY STATE FOR SEARCH FILTER MISSES
               =================================================================== */
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/10 text-center space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Coffee className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base md:text-lg font-bold text-white">
                  لم يتم العثور على محاضرات تطابق هذا البحث
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  تأكد من كتابة اسم المقرر أو المحاضر بشكل صحيح، أو أعد ضبط شريط التصفية بالأعلى.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="px-4 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-bold transition-all"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            </div>
          )}

        </section>

      </div>

      {/* =========================================================================
          FLOATING LIQUID BOTTOM DOCK (Mobile Tab Bar)
         ========================================================================= */}
      <nav 
        className="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40 bg-[#0B0F17]/80 backdrop-blur-2xl border border-white/10 rounded-full px-3 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]"
        aria-label="شريط التنقل السفلي"
      >
        <div className="flex items-center justify-between px-1">
          
          {/* Item 1: Home */}
          <Link
            to="/"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 font-medium transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الرئيسية</span>
          </Link>

          {/* Item 2: Schedule (Active) */}
          <button
            type="button"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-emerald-400 font-bold transition-all"
          >
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الجدول</span>
          </button>

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
          <Link
            to="/"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 font-medium transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الأعذار</span>
          </Link>

          {/* Item 5: Profile */}
          <Link
            to="/auth"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 font-medium transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px]">حسابي</span>
          </Link>

        </div>
      </nav>

      {/* =========================================================================
          ATTENDANCE QR CODE MODAL (HIGH CONTRAST OPTICAL SCANNER)
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
                  <p className="text-[11px] text-slate-400">
                    {selectedLectureForQr ? selectedLectureForQr.title : 'كود مشفر ديناميكي لمنع التحايل'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  setSelectedLectureForQr(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
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
                  <span>تكنولوجيا التعليم • الفرقة 2</span>
                  <span>{selectedLectureForQr ? selectedLectureForQr.location : 'جلسة الحضور'}</span>
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
                  setSelectedLectureForQr(null);
                  triggerToast('تم تأكيد الحضور بنجاح ✅');
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-[#07090E] py-2.5 rounded-2xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                تم المسح بنجاح
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
