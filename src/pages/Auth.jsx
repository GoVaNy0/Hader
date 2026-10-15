import React, { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Hash,
  School,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  KeyRound,
  QrCode,
  GraduationCap,
  Check,
  ChevronDown,
  X
} from 'lucide-react';

export default function Auth({ initialMode = 'login', onAuthSuccess }) {
  const navigate = useNavigate();
  const baseId = useId();

  // Active view tab: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState(initialMode);

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, sent: false });

  // Registration Success Modal with generated QR code
  const [createdStudent, setCreatedStudent] = useState(null);

  // Global Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // =========================================================================
  // LOGIN FORM STATE
  // =========================================================================
  const [loginForm, setLoginForm] = useState({
    identifier: '', // University ID or Academic Email
    password: '',
    rememberMe: true
  });
  const [loginLoading, setLoginLoading] = useState(false);

  // =========================================================================
  // SIGN UP FORM STATE
  // =========================================================================
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    studentCode: '',
    academicDivision: 'sec2_tech_general',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [signupLoading, setSignupLoading] = useState(false);

  const divisionOptions = [
    { value: 'sec1_tech', label: 'الفرقة الأولى - تكنولوجيا تعليم' },
    { value: 'sec2_tech_general', label: 'الفرقة الثانية - تكنولوجيا تعليم (عام)' },
    { value: 'sec2_tech_teacher', label: 'الفرقة الثانية - إعداد معلم حاسب آلي' },
    { value: 'sec3_tech_instructional', label: 'الفرقة الثالثة - تكنولوجيا وتصميم تعليمي' },
    { value: 'sec4_tech_graduation', label: 'الفرقة الرابعة - تكنولوجيا ومشاريع التخرج' }
  ];

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.identifier.trim()) {
      showToast('يرجى إدخال الرقم الجامعي أو البريد الأكاديمي', 'error');
      return;
    }
    if (!loginForm.password) {
      showToast('يرجى إدخال كلمة المرور', 'error');
      return;
    }

    setLoginLoading(true);

    // Realistic authentication simulation
    setTimeout(() => {
      setLoginLoading(false);
      showToast('تم تسجيل الدخول بنجاح! جاري توجيهك إلى لوحة المتابعة...', 'success');

      if (onAuthSuccess) {
        onAuthSuccess({
          name: 'جوفاني مجدي كامل',
          code: loginForm.identifier.includes('@') ? '20230894' : loginForm.identifier,
          division: 'الفرقة الثانية - تكنولوجيا تعليم'
        });
      }

      setTimeout(() => {
        navigate('/');
      }, 900);
    }, 950);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!signupForm.fullName.trim() || signupForm.fullName.trim().split(' ').length < 2) {
      showToast('يرجى كتابة الاسم الثلاثي أو الرباعي كاملاً', 'error');
      return;
    }

    if (!signupForm.studentCode.trim() || signupForm.studentCode.trim().length < 6) {
      showToast('يرجى إدخال كود الطالب أو الرقم القومي بشكل صحيح (6 أرقام على الأقل)', 'error');
      return;
    }

    if (!signupForm.email.trim() || !signupForm.email.includes('@')) {
      showToast('يرجى إدخال بريد إلكتروني صالح', 'error');
      return;
    }

    if (signupForm.password.length < 6) {
      showToast('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام', 'error');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      showToast('كلمتا المرور غير متطابقتين', 'error');
      return;
    }

    if (!signupForm.agreeTerms) {
      showToast('يرجى الموافقة على لوائح الحضور وسياسة الاستخدام أولاً', 'error');
      return;
    }

    setSignupLoading(true);

    // Simulate account creation and offline attendance token generation
    setTimeout(() => {
      setSignupLoading(false);
      const divisionObj = divisionOptions.find((d) => d.value === signupForm.academicDivision);
      const studentData = {
        fullName: signupForm.fullName.trim(),
        studentCode: signupForm.studentCode.trim(),
        divisionLabel: divisionObj ? divisionObj.label : 'تكنولوجيا تعليم',
        email: signupForm.email.trim(),
        // Permanent attendance token with cryptographically structured student identifier
        qrToken: `HADER-${signupForm.studentCode.trim()}-STU-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setCreatedStudent(studentData);
      showToast('تم إنشاء الحساب بنجاح وتوليد كود الحضور الذكي!', 'success');
    }, 1100);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      showToast('يرجى كتابة بريدك الإلكتروني الأكاديمي لإرسال رابط الاستعادة', 'error');
      return;
    }

    setForgotStatus({ loading: true, sent: false });
    setTimeout(() => {
      setForgotStatus({ loading: false, sent: true });
      showToast('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');
    }, 1200);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#070B12] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans"
    >
      {/* =========================================================================
          1. AMBIENT LIQUID BACKGROUND ORBS & SUBTLE BLUEPRINT GRID
         ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Emerald Bioluminescent Orb */}
        <div
          className="absolute -top-32 -right-32 w-[34rem] h-[34rem] bg-emerald-500/15 rounded-full blur-[130px] animate-pulse"
          style={{ animationDuration: '9s' }}
        />
        {/* Mid-Left Oceanic Deep Cyan/Teal Orb */}
        <div
          className="absolute top-1/3 -left-40 w-[30rem] h-[30rem] bg-teal-500/12 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: '11s' }}
        />
        {/* Bottom-Right Deep Indigo/Violet Glow */}
        <div
          className="absolute -bottom-32 -right-20 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"
          style={{ animationDuration: '13s' }}
        />
        {/* Structural Blueprint Grid (Subtle Hairline Texture) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_65%,transparent_100%)]" />
      </div>

      {/* =========================================================================
          2. TOAST NOTIFICATION BANNER
         ========================================================================= */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center gap-3 backdrop-blur-2xl transition-all border border-emerald-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
              toast.type === 'error'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
          <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-200">
            {toast.message}
          </p>
        </div>
      )}

      {/* =========================================================================
          3. TOP NAVIGATION / BRANDING BAR
         ========================================================================= */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded-2xl p-1"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.35)] border border-emerald-400/40 transition-transform duration-300 group-hover:scale-105">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight">حاضر</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Hader
              </span>
            </div>
            <span className="text-[11px] text-slate-400">قسم تكنولوجيا التعليم</span>
          </div>
        </Link>

        {/* Back to Home Quick Link */}
        <Link
          to="/"
          className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-xl"
        >
          <span>الرئيسية</span>
          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
        </Link>
      </header>

      {/* =========================================================================
          4. MAIN FLOATING GLASS CONTAINER
         ========================================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.04] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl p-6 md:p-8 relative">
          
          {/* Subtle Inset Hairline Glow Effect */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" />

          {/* Header & Logo Icon with Pulse Glow */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(5,150,105,0.3)]">
              {activeTab === 'login' ? (
                <KeyRound className="w-7 h-7 text-emerald-400" />
              ) : (
                <Sparkles className="w-7 h-7 text-emerald-400" />
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {activeTab === 'login' ? 'مرحباً بعودتك إلى حاضر' : 'انضم لمنصة حاضر'}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
              {activeTab === 'login'
                ? 'سجّل دخولك لمتابعة سجل حضورك، جدول محاضراتك، ونمو شجرتك الأكاديمية'
                : 'أنشئ حسابك كطالب بقسم تكنولوجيا التعليم لتوليد رمز الحضور الذكي المعتمد'}
            </p>
          </div>

          {/* =====================================================================
              INTERACTIVE GLASS STATE SWITCHER (LOGIN / SIGN UP)
             ===================================================================== */}
          <div className="bg-white/[0.03] border border-white/10 p-1 rounded-2xl flex items-center mb-6 relative">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-emerald-500 text-[#070B12] shadow-[0_0_20px_rgba(16,185,129,0.35)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-emerald-500 text-[#070B12] shadow-[0_0_20px_rgba(16,185,129,0.35)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>

          {/* =====================================================================
              TAB 1: SIGN IN (تسجيل الدخول)
             ===================================================================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Field: University ID or Academic Email */}
              <div className="space-y-1.5 text-right">
                <label
                  htmlFor={`${baseId}-login-identifier`}
                  className="block text-xs font-medium text-slate-300"
                >
                  الرقم الجامعي أو البريد الأكاديمي
                </label>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id={`${baseId}-login-identifier`}
                    type="text"
                    required
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    placeholder="مثال: 20230894 أو student@edu.helwan.edu.eg"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-11 pl-4 py-3.5 outline-none transition-all duration-200 text-xs md:text-sm font-sans"
                  />
                </div>
              </div>

              {/* Field: Password */}
              <div className="space-y-1.5 text-right">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`${baseId}-login-password`}
                    className="block text-xs font-medium text-slate-300"
                  >
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setForgotStatus({ loading: false, sent: false });
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id={`${baseId}-login-password`}
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-11 pl-11 py-3.5 outline-none transition-all duration-200 text-xs md:text-sm font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label={showLoginPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action: Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded-lg bg-white/[0.04] border border-white/20 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500"
                  />
                  <span>تذكر بيانات دخولي على هذا الجهاز</span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-xs md:text-sm"
              >
                {loginLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري التحقق من بياناتك...</span>
                  </>
                ) : (
                  <>
                    <span>دخول المنصة</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

              {/* Quick Mock Credentials Helper */}
              <div className="pt-3 border-t border-white/5 text-center">
                <p className="text-[11px] text-slate-500">
                  كود طالب تجريبي سريع: <span className="text-slate-400 font-mono">20230894</span> • كلمة المرور: <span className="text-slate-400 font-mono">••••••</span>
                </p>
              </div>
            </form>
          )}

          {/* =====================================================================
              TAB 2: SIGN UP (إنشاء حساب جديد)
             ===================================================================== */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              
              {/* Field: Full Name */}
              <div className="space-y-1.5 text-right">
                <label
                  htmlFor={`${baseId}-signup-fullname`}
                  className="block text-xs font-medium text-slate-300"
                >
                  الاسم الثلاثي أو الرباعي (باللغة العربية)
                </label>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id={`${baseId}-signup-fullname`}
                    type="text"
                    required
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    placeholder="مثال: جوفاني مجدي كامل ميخائيل"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-11 pl-4 py-3 outline-none transition-all duration-200 text-xs md:text-sm font-sans"
                  />
                </div>
              </div>

              {/* Field: Student Code / National ID */}
              <div className="space-y-1.5 text-right">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`${baseId}-signup-studentcode`}
                    className="block text-xs font-medium text-slate-300"
                  >
                    الرقم القومي أو كود الطالب الجامعي
                  </label>
                  <span className="text-[10px] text-emerald-400">لتوليد كود الحضور</span>
                </div>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    id={`${baseId}-signup-studentcode`}
                    type="text"
                    required
                    value={signupForm.studentCode}
                    onChange={(e) => setSignupForm({ ...signupForm, studentCode: e.target.value })}
                    placeholder="مثال: 20230894 أو الرقم القومي"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-11 pl-4 py-3 outline-none transition-all duration-200 text-xs md:text-sm font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Field: Academic Division Dropdown */}
              <div className="space-y-1.5 text-right">
                <label
                  htmlFor={`${baseId}-signup-division`}
                  className="block text-xs font-medium text-slate-300"
                >
                  الفرقة والشعبة الدراسية
                </label>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <School className="w-4 h-4" />
                  </div>
                  <select
                    id={`${baseId}-signup-division`}
                    value={signupForm.academicDivision}
                    onChange={(e) => setSignupForm({ ...signupForm, academicDivision: e.target.value })}
                    className="w-full bg-[#0D111A] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 rounded-2xl pr-11 pl-10 py-3 outline-none transition-all duration-200 text-xs md:text-sm appearance-none cursor-pointer"
                  >
                    {divisionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0A0E17] text-slate-100 py-1">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Field: Student Email */}
              <div className="space-y-1.5 text-right">
                <label
                  htmlFor={`${baseId}-signup-email`}
                  className="block text-xs font-medium text-slate-300"
                >
                  البريد الإلكتروني (الأكاديمي أو الشخصي)
                </label>
                <div className="relative">
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id={`${baseId}-signup-email`}
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-11 pl-4 py-3 outline-none transition-all duration-200 text-xs md:text-sm font-sans text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Grid: Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Password */}
                <div className="space-y-1.5 text-right">
                  <label
                    htmlFor={`${baseId}-signup-password`}
                    className="block text-xs font-medium text-slate-300"
                  >
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id={`${baseId}-signup-password`}
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-4 pl-9 py-2.5 outline-none transition-all duration-200 text-xs md:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                      aria-label="إظهار أو إخفاء كلمة المرور"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5 text-right">
                  <label
                    htmlFor={`${baseId}-signup-confirm`}
                    className="block text-xs font-medium text-slate-300"
                  >
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id={`${baseId}-signup-confirm`}
                      type={showSignupConfirmPassword ? 'text' : 'password'}
                      required
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-4 pl-9 py-2.5 outline-none transition-all duration-200 text-xs md:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                      aria-label="إظهار أو إخفاء تأكيد كلمة المرور"
                    >
                      {showSignupConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action: Terms Agreement Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300 leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    checked={signupForm.agreeTerms}
                    onChange={(e) => setSignupForm({ ...signupForm, agreeTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded-lg bg-white/[0.04] border border-white/20 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 shrink-0"
                  />
                  <span>
                    أوافق على سياسة الاستخدام ولوائح الحضور الأكاديمي بقسم تكنولوجيا التعليم
                  </span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-xs md:text-sm"
              >
                {signupLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري إنشاء الحساب وتوليد الرمز الذكي...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>إنشاء حساب وتوليد كود الحضور</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* =========================================================================
          5. FOOTER / ATTRIBUTION
         ========================================================================= */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
          <span>منظومة الحضور الذكي والأنشطة الطلابية • قسم تكنولوجيا التعليم</span>
        </div>
        <p className="font-mono text-[11px] text-slate-500">
          Hader Platform © 2026 • كلية التربية النوعية
        </p>
      </footer>

      {/* =========================================================================
          6. FORGOT PASSWORD GLASS MODAL
         ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0C101A] border border-white/10 rounded-3xl p-6 shadow-2xl relative text-right space-y-4">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl bg-white/[0.04] border border-white/10"
              aria-label="إغلاق النافذة"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">استعادة كلمة المرور</h3>
                <p className="text-xs text-slate-400">قسم تكنولوجيا التعليم</p>
              </div>
            </div>

            {forgotStatus.sent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  تم إرسال رابط تأكيد الاستعادة إلى البريد الأكاديمي المسجل. يرجى مراجعة صندوق الوارد لديك.
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="mt-3 w-full bg-emerald-500 text-[#070B12] font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-400 transition-colors"
                >
                  حسناً، فهمت
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  أدخل بريدك الأكاديمي أو كود الطالب المسجل وسنرسل لك رابطاً مشفراً لإعادة تعيين كلمة المرور فوراً.
                </p>

                <div className="space-y-1.5">
                  <label htmlFor={`${baseId}-forgot-email`} className="block text-xs font-medium text-slate-300">
                    البريد الإلكتروني أو كود الطالب
                  </label>
                  <div className="relative">
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id={`${baseId}-forgot-email`}
                      type="text"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@edu.helwan.edu.eg"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder:text-slate-500 rounded-2xl pr-11 pl-4 py-3 outline-none text-xs text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 py-3 rounded-2xl text-xs font-semibold border border-white/10 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={forgotStatus.loading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white py-3 rounded-2xl text-xs font-bold transition-all disabled:opacity-60"
                  >
                    {forgotStatus.loading ? 'جاري الإرسال...' : 'إرسال الرابط'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          7. SIGN UP SUCCESS & OFFLINE ATTENDANCE QR CODE PREVIEW MODAL
         ========================================================================= */}
      {createdStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#0A0E17] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative text-center space-y-4">
            
            {/* Success Icon */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                أهلاً بك يا {createdStudent.fullName.split(' ')[0]}! 🎉
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تم اعتماد حسابك بنجاح وتوليد رمز الحضور الدائم
              </p>
            </div>

            {/* Optical High Contrast QR Card */}
            <div className="p-4 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center relative">
              <QRCodeSVG
                value={createdStudent.qrToken}
                size={170}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'><circle cx='12' cy='12' r='10'/><path d='M9 12l2 2 4-4' stroke='white' stroke-width='2' fill='none'/></svg>",
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true
                }}
              />
              <span className="text-[10px] text-slate-600 font-mono font-bold mt-2 tracking-wider">
                {createdStudent.qrToken}
              </span>
            </div>

            {/* Student Meta Pill */}
            <div className="bg-white/[0.04] p-3 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-1 text-right">
              <div className="flex justify-between font-bold text-white">
                <span>{createdStudent.fullName}</span>
                <span className="font-mono text-emerald-400">#{createdStudent.studentCode}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                {createdStudent.divisionLabel}
              </div>
            </div>

            {/* CTA Button to Enter Home */}
            <button
              type="button"
              onClick={() => {
                setCreatedStudent(null);
                navigate('/');
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-all text-xs md:text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>الانتقال إلى المنصة الرئيسية</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
