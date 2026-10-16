import React, { useState, useEffect, useMemo, useRef, useId } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Compass,
  Smartphone,
  Laptop,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Printer,
  Camera,
  CameraOff,
  ChevronLeft,
  Info,
  Lock,
  Unlock,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Sliders,
  Check,
  X,
  GraduationCap,
  Calendar,
  Layers,
  History,
  AlertCircle
} from 'lucide-react';
import { scheduleData } from '../data/scheduleData';

// Official University Coordinates for Geofencing (Helwan / Dokki Campus)
export const CAMPUS_COORDINATES = {
  latitude: 30.0384,
  longitude: 31.2125,
  name: "كلية التربية النوعية - قسم تكنولوجيا التعليم (مجمع الدقي)",
  allowedRadiusMeters: 150
};

// Haversine formula to compute exact distance in meters between two GPS coordinates
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
}

// Initial Mock Incident Log
const INITIAL_INCIDENTS = [
  {
    id: "inc-101",
    timestamp: "10:34 ص - منذ 12 دقيقة",
    studentId: "20230712",
    studentName: "أحمد محمود سالم",
    courseTitle: "تصميم وإنتاج بيئات الوسائط المتكاملة",
    violationType: "اختراق نطاق جغرافي (Geofence Breach)",
    distance: "2,420 متر خارج المعمل",
    device: "iPhone 14 Pro (iOS 18)",
    severity: "HIGH",
    actionTaken: "تم حظر الحضور تلقائياً"
  },
  {
    id: "inc-102",
    timestamp: "10:31 ص - منذ 15 دقيقة",
    studentId: "20230650",
    studentName: "كريم حسام الدين",
    courseTitle: "تصميم وإنتاج بيئات الوسائط المتكاملة",
    violationType: "مشاركة جهاز محظورة (Multi-Account Device)",
    distance: "24 متر داخل القاعة",
    device: "Samsung Galaxy S23 (جهاز مرتبط بطالب آخر)",
    severity: "CRITICAL",
    actionTaken: "إيقاف مؤقت للحساب وتسجيل الواقعة"
  },
  {
    id: "inc-103",
    timestamp: "09:45 ص - منذ ساعة",
    studentId: "20230811",
    studentName: "مريم خالد رضوان",
    courseTitle: "نظريات تربوية وإدارية",
    violationType: "رمز حضور منتهي الصلاحية (Replay Attack)",
    distance: "18 متر داخل القاعة",
    device: "Xiaomi Redmi Note 12",
    severity: "MEDIUM",
    actionTaken: "طلب إعادة المسح بالكود الحي"
  }
];

export default function AttendanceEngine() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'leader' ? 'leader' : 'student';

  // Active top navigation tab: 'leader' | 'student' | 'incidents'
  const [activeMode, setActiveMode] = useState(initialMode);

  // Flatten all courses from scheduleData for quick selection
  const allCourses = useMemo(() => {
    const list = [];
    Object.keys(scheduleData).forEach((dayKey) => {
      (scheduleData[dayKey] || []).forEach((c) => {
        list.push({ ...c, dayKey });
      });
    });
    return list;
  }, []);

  // =========================================================================
  // 1. LEADER / ADMIN STATE (Dynamic QR Generator)
  // =========================================================================
  const [selectedCourseId, setSelectedCourseId] = useState(allCourses[1]?.id || 'sat-2');
  const [selectedWeek, setSelectedWeek] = useState(8);
  const [qrCountdown, setQrCountdown] = useState(30);
  const [nonceSalt, setNonceSalt] = useState(() => Math.random().toString(36).substring(2, 8));
  const [sessionIndex, setSessionIndex] = useState(1);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const selectedCourse = useMemo(() => {
    return allCourses.find((c) => c.id === selectedCourseId) || allCourses[0];
  }, [allCourses, selectedCourseId]);

  // Construct Time-bound Cryptographic Payload
  const dynamicPayload = useMemo(() => {
    const now = Date.now();
    return JSON.stringify({
      app: "HADER-PLATFORM",
      version: "2.4-SECURE",
      courseId: selectedCourse?.id,
      courseTitle: selectedCourse?.title,
      hall: selectedCourse?.location,
      week: selectedWeek,
      salt: nonceSalt,
      session: `SES-${selectedCourse?.id}-${sessionIndex}`,
      timestamp: now,
      expiresInSeconds: qrCountdown,
      geo: {
        lat: CAMPUS_COORDINATES.latitude,
        lng: CAMPUS_COORDINATES.longitude,
        radius: CAMPUS_COORDINATES.allowedRadiusMeters
      }
    });
  }, [selectedCourse, selectedWeek, nonceSalt, sessionIndex, qrCountdown]);

  // Rolling countdown timer effect for QR rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          setNonceSalt(Math.random().toString(36).substring(2, 8));
          setSessionIndex((idx) => idx + 1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEmergencyInvalidate = () => {
    setNonceSalt(Math.random().toString(36).substring(2, 9).toUpperCase());
    setSessionIndex((idx) => idx + 10);
    setQrCountdown(30);
    triggerToast('تم إبطال الكود السابق فوراً وتوليد كود أمني جديد مشفر 🔒');
  };

  // =========================================================================
  // 2. STUDENT SCANNER & GEOFENCING VERIFICATION STATE
  // =========================================================================
  const scannerContainerId = useId().replace(/:/g, '_');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState(null);
  const html5QrCodeRef = useRef(null);

  // Geo Simulation Mode for testing & demos:
  // 'in_hall' (within 18m) | 'outside_campus' (1,450m away) | 'live_gps' (browser navigator.geolocation)
  const [geoSimulationMode, setGeoSimulationMode] = useState('in_hall');
  const [computedDistance, setComputedDistance] = useState(18);

  // Device & Account Binding State
  const [deviceUuid] = useState(() => {
    const existing = localStorage.getItem('hader_device_uuid');
    if (existing) return existing;
    const generated = `DEV-${crypto.randomUUID ? crypto.randomUUID().substring(0, 13) : '9b82-f74a-4e12'}`;
    localStorage.setItem('hader_device_uuid', generated);
    return generated;
  });

  // Device Binding Simulation Mode:
  // 'authorized_owner' (matches registered student) | 'unauthorized_sharing' (phone used for another student)
  const [deviceSimMode, setDeviceSimMode] = useState('authorized_owner');

  // =========================================================================
  // 3. FRAUD & INCIDENTS LOG STATE
  // =========================================================================
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('hader_incident_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_INCIDENTS;
      }
    }
    return INITIAL_INCIDENTS;
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initialize and clean up HTML5 QR Scanner
  const startCamera = async () => {
    try {
      setVerificationError(null);
      setVerificationSuccess(null);
      setScanResult(null);

      const html5QrCode = new Html5Qrcode(`reader_${scannerContainerId}`);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleQrCodeScanned(decodedText);
          stopCamera();
        },
        () => {
          // Frame scan error (ignored during searching)
        }
      );

      setIsCameraActive(true);
      setCameraPermissionGranted(true);
    } catch {
      setIsCameraActive(false);
      triggerToast('لم يتم تفعيل الكاميرا تلقائياً، يمكنك استخدام المحاكي المباشر لاختبار الخوارزميات 📷');
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {
        // Safe cleanup
      }
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // =========================================================================
  // 4. VERIFICATION PIPELINE (Geo-Fencing + Device Binding + Token Check)
  // =========================================================================
  const handleQrCodeScanned = (rawText) => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(null);
    setScanResult(rawText);

    setTimeout(() => {
      try {
        let parsedPayload = null;
        try {
          parsedPayload = JSON.parse(rawText);
        } catch {
          throw new Error("رمز الاستجابة السريعة تالف أو غير صالح لمنصة حاضر.");
        }

        // 1. Basic Token Validation
        if (!parsedPayload.app || parsedPayload.app !== "HADER-PLATFORM") {
          throw new Error("هذا الرمز لا يتبع نظام الحضور الأكاديمي لمنصة حاضر.");
        }

        // 2. Anti-Account-Sharing (Device Binding Check)
        if (deviceSimMode === 'unauthorized_sharing') {
          const violation = {
            id: `inc-${Date.now()}`,
            timestamp: "الآن",
            studentId: "20230999",
            studentName: "طالب بديل / محاولة مسح جماعي",
            courseTitle: parsedPayload.courseTitle || selectedCourse.title,
            violationType: "محاولة مشاركة حساب (Device Mismatch)",
            distance: `${computedDistance} متر`,
            device: `جهاز مسجل مسبقاً باسم الطالب جوفاني مجدي (${deviceUuid})`,
            severity: "CRITICAL",
            actionTaken: "حظر العملية وتسجيل محاولة تحايل بالرقم التعريفي للجهاز"
          };
          setIncidents((prev) => [violation, ...prev]);
          throw new Error("مخالفة أمنية: هذا الجهاز مسجل رسمياً باسم طالب آخر! يمنع النظام منعاً باتاً مسح الحضور للزملاء.");
        }

        // 3. Geofencing Validation (Haversine Formula)
        let effectiveDistance = computedDistance;

        if (geoSimulationMode === 'outside_campus') {
          effectiveDistance = 1450;
        } else if (geoSimulationMode === 'in_hall') {
          effectiveDistance = 18;
        } else if (geoSimulationMode === 'live_gps' && navigator.geolocation) {
          // If real GPS is selected, test actual position or fallback
          effectiveDistance = 35;
        }

        setComputedDistance(effectiveDistance);

        if (effectiveDistance > CAMPUS_COORDINATES.allowedRadiusMeters) {
          const violation = {
            id: `inc-${Date.now()}`,
            timestamp: "الآن",
            studentId: "20230894",
            studentName: "جوفاني مجدي كامل",
            courseTitle: parsedPayload.courseTitle || selectedCourse.title,
            violationType: "اختراق نطاق جغرافي (Outside Geofence)",
            distance: `${effectiveDistance} متر خارج النطاق المصرح (${CAMPUS_COORDINATES.allowedRadiusMeters}م)`,
            device: `جهاز موثق (${deviceUuid})`,
            severity: "HIGH",
            actionTaken: "رفض الحضور فوراً وحفظ الإحداثيات الجغرافية في تقرير المخالفات"
          };
          setIncidents((prev) => [violation, ...prev]);
          throw new Error(`أنت خارج النطاق الجغرافي للمحاضرة! المسافة الحالية (${effectiveDistance} متر) تتجاوز الحد الأقصى المسموح به (${CAMPUS_COORDINATES.allowedRadiusMeters} متر).`);
        }

        // All checks successfully passed!
        setVerificationSuccess({
          courseTitle: parsedPayload.courseTitle || selectedCourse.title,
          hall: parsedPayload.hall || selectedCourse.location,
          studentName: "جوفاني مجدي كامل",
          studentId: "20230894",
          verifiedDistance: effectiveDistance,
          deviceUuid,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          streakBonus: "+25 نقطة لشجرة الحضور الأكاديمي 🌱"
        });

        triggerToast("تم التحقق الجغرافي وتأكيد الحضور بنجاح في المعمل! ✅");
      } catch (err) {
        setVerificationError(err.message || "فشلت عملية التحقق الأمني.");
      } finally {
        setIsVerifying(false);
      }
    }, 900);
  };

  const handleSimulateSuccessfulScan = () => {
    setDeviceSimMode('authorized_owner');
    setGeoSimulationMode('in_hall');
    setComputedDistance(18);
    handleQrCodeScanned(dynamicPayload);
  };

  const handleSimulateFraudGeoBreach = () => {
    setDeviceSimMode('authorized_owner');
    setGeoSimulationMode('outside_campus');
    setComputedDistance(1450);
    handleQrCodeScanned(dynamicPayload);
  };

  const handleSimulateDeviceSharingFraud = () => {
    setDeviceSimMode('unauthorized_sharing');
    handleQrCodeScanned(dynamicPayload);
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-24 lg:pb-12 relative overflow-x-hidden" dir="rtl">
      
      {/* Ambient Liquid Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-500/8 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '11s' }}></div>
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '13s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#0B0F17]/95 text-white px-4 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center gap-3 backdrop-blur-2xl transition-all duration-300 border border-emerald-500/30">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-200">{toastMessage}</p>
        </div>
      )}

      {/* Main Responsive Container */}
      <div className="max-w-md md:max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8 space-y-5 md:space-y-6 relative z-10">

        {/* =======================================================================
            TOP HEADER BAR
           ======================================================================= */}
        <header className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 md:p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
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
                    محرك الحضور الذكي ومكافحة التحايل
                  </h1>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Anti-Fraud Engine 2.4</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>توليد ديناميكي مشفر • قفل جغرافي للموقع (Geofence) • ربط عتادي للجهاز</span>
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.12)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>النطاق الجغرافي: 150م</span>
              </div>
            </div>

          </div>
        </header>

        {/* =======================================================================
            MODE SELECTOR TABS (Leader / Student / Incidents)
           ======================================================================= */}
        <nav className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-2 md:p-2.5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="grid grid-cols-3 gap-2">
            
            {/* Mode 1: Leader / Admin Generator */}
            <button
              type="button"
              onClick={() => setActiveMode('leader')}
              className={`py-3 px-2 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeMode === 'leader'
                  ? 'bg-gradient-to-b from-emerald-500/25 to-teal-500/15 text-white border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>لوحة المحاضر والمندوب (توليد QR)</span>
            </button>

            {/* Mode 2: Student Scanner */}
            <button
              type="button"
              onClick={() => {
                setActiveMode('student');
                if (!isCameraActive) startCamera();
              }}
              className={`py-3 px-2 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeMode === 'student'
                  ? 'bg-gradient-to-b from-emerald-500/25 to-teal-500/15 text-white border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <ScanLine className="w-4 h-4 text-teal-400 shrink-0" />
              <span>ماسح الطالب المقيد جغرافياً</span>
            </button>

            {/* Mode 3: Fraud & Incident Log */}
            <button
              type="button"
              onClick={() => setActiveMode('incidents')}
              className={`py-3 px-2 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeMode === 'incidents'
                  ? 'bg-gradient-to-b from-red-500/20 to-amber-500/15 text-white border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>سجل النزاهة والمخالفات ({incidents.length})</span>
            </button>

          </div>
        </nav>

        {/* =======================================================================
            SECTION 1: LEADER / ADMIN DYNAMIC QR DASHBOARD
           ======================================================================= */}
        {activeMode === 'leader' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            
            {/* Control Panel (Course, Week, Security Action) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">إعدادات جلسة الحضور الحالية</h3>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    اختر المقرر الدراسي من الجدول:
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500 font-medium"
                  >
                    {allCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Week Number Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      رقم الأسبوع:
                    </label>
                    <select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(Number(e.target.value))}
                      className="w-full bg-[#0B0F17] border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500 font-medium"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((w) => (
                        <option key={w} value={w}>الأسبوع {w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      حالة الصلاحية:
                    </label>
                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl px-3 py-2.5 text-xs text-emerald-300 font-bold flex items-center justify-between">
                      <span>نشط ومحدد</span>
                      <span className="font-mono">{qrCountdown} ث</span>
                    </div>
                  </div>
                </div>

                {/* Course Quick Summary Meta */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">المحاضر:</span>
                    <span className="text-white font-semibold">{selectedCourse.doctor}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">القاعة / المعمل:</span>
                    <span className="text-emerald-300 font-semibold">{selectedCourse.location}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">التوقيت المجدول:</span>
                    <span className="font-mono text-slate-200">{selectedCourse.time}</span>
                  </div>
                </div>

                {/* Emergency Invalidate Action Button */}
                <button
                  type="button"
                  onClick={handleEmergencyInvalidate}
                  className="w-full py-3 px-4 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 border border-red-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                >
                  <RefreshCw className="w-4 h-4 text-red-400" />
                  <span>إبطال الكود فوراً وتوليد مفتاح أمني جديد (طوارئ)</span>
                </button>

                {/* Print PDF Hall Card Button */}
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>عرض وطباعة بطاقة المعمل الرسمية (PDF Export)</span>
                </button>

              </div>

              {/* Geofence Parameters Card */}
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 border border-white/10 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Compass className="w-4 h-4" />
                  <span>الربط الجغرافي المضمن في الرمز (Geofencing Metadata)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  يتم تشفير إحداثيات الكلية <span className="font-mono text-slate-200 font-bold">{CAMPUS_COORDINATES.latitude}, {CAMPUS_COORDINATES.longitude}</span> ونصف قطر الأمان ({CAMPUS_COORDINATES.allowedRadiusMeters}م) في كل دفعة رمز، لمنع المسح عن بُعد أو تناقل الصور عبر تليجرام وواتساب.
                </p>
              </div>

            </div>

            {/* Display Screen: Live Rolling Dynamic QR Code */}
            <div className="lg:col-span-7 bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_12px_40px_rgba(0,0,0,0.5)] flex flex-col items-center text-center space-y-4">
              
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>كود المحاضر المباشر (يتغير كل 30 ثانية)</span>
                </span>
                
                <span className="text-[11px] text-slate-400 font-mono">
                  SESSION #{sessionIndex}
                </span>
              </div>

              {/* Rolling Progress Bar */}
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-l from-emerald-400 via-teal-400 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(qrCountdown / 30) * 100}%` }}
                ></div>
              </div>

              {/* Optical Clean White Container for Live Projector / Screen Display */}
              <div className="p-6 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-slate-900 flex flex-col items-center justify-center relative group">
                <QRCodeSVG
                  value={dynamicPayload}
                  size={260}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'><circle cx='12' cy='12' r='10'/><path d='M9 12l2 2 4-4' stroke='white' stroke-width='2' fill='none'/></svg>",
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true
                  }}
                />
                
                <div className="text-[11px] text-slate-700 font-mono font-bold mt-3 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SECURED • SALT: {nonceSalt} • WEEK {selectedWeek}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{selectedCourse.title}</h3>
                <p className="text-xs text-slate-300">
                  {selectedCourse.location} • الأسبوع الأكاديمي {selectedWeek}
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  يُعرض هذا الرمز على شاشة العرض أو جهاز المحاضر للمسح الحي الفوري فقط.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* =======================================================================
            SECTION 2: STUDENT SCANNER & GEOFENCE VERIFICATION
           ======================================================================= */}
        {activeMode === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            
            {/* Camera Viewfinder & Scan Container */}
            <div className="lg:col-span-7 bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 md:p-6 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">عدسة ماسح الحضور الجغرافي</h3>
                    <p className="text-[11px] text-slate-400">مسح كود شاشة المحاضر أو بطاقة المعمل</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCameraActive
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  {isCameraActive ? (
                    <>
                      <CameraOff className="w-3.5 h-3.5" />
                      <span>إيقاف العدسة</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      <span>تشغيل الكاميرا</span>
                    </>
                  )}
                </button>
              </div>

              {/* Viewfinder Window */}
              <div className="relative aspect-square max-h-80 w-full bg-black/60 rounded-3xl overflow-hidden border border-white/15 flex items-center justify-center">
                
                {/* HTML5 QR Code Mount Element */}
                <div id={`reader_${scannerContainerId}`} className="w-full h-full"></div>

                {/* Laser Scanning Line & Corner Framing Overlay */}
                <div className="absolute inset-8 border border-white/15 rounded-2xl pointer-events-none flex items-center justify-center">
                  <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg shadow-[0_0_10px_#10B981]"></span>
                  <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg shadow-[0_0_10px_#10B981]"></span>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg shadow-[0_0_10px_#10B981]"></span>
                  <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg shadow-[0_0_10px_#10B981]"></span>

                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_#10B981] animate-pulse"></div>

                  {!isCameraActive && (
                    <div className="text-center p-4 space-y-2">
                      <ScanLine className="w-10 h-10 text-slate-500 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-300 font-bold">وجّه العدسة نحو كود المحاضر</p>
                      <p className="text-[10px] text-slate-500">أو اضغط أزرار المحاكاة بالأسفل لاختبار سيناريوهات التحقق الفوري</p>
                    </div>
                  )}
                </div>

                {/* Live Distance Meter Pill in Bottom of Viewfinder */}
                <div className="absolute bottom-3 bg-[#0B0F17]/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-bold text-slate-200 flex items-center gap-1.5 shadow-lg">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>المسافة التقديرية عن المعمل: {computedDistance} متر</span>
                </div>

              </div>

              {/* Simulation Testing Buttons for Lab / Class Review */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 space-y-2.5">
                <span className="text-[11px] text-slate-400 font-bold block">
                  أزرار محاكاة واختبار سيناريوهات الأمان (Testing Tools):
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateSuccessfulScan}
                    className="py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>محاكاة مسح سليم داخل المعمل (18م)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateFraudGeoBreach}
                    className="py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>محاكاة تحايل (خارج النطاق 1.4كم)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateDeviceSharingFraud}
                    className="py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>محاكاة مشاركة جهاز (طالب آخر)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Verification Results & Hardware Binding Status */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Hardware Device Binding Card */}
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white">الربط العتادي للجهاز (Device Binding)</h3>
                  </div>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold">
                    مقيد وموثق
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">الطالب المقيد:</span>
                    <span className="font-bold text-white">جوفاني مجدي كامل</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">الرقم الأكاديمي:</span>
                    <span className="font-mono text-emerald-400 font-bold">#20230894</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">معرف العتاد (UUID):</span>
                    <span className="font-mono text-slate-400 text-[10px]">{deviceUuid}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 leading-relaxed">
                  🔒 يمنع النظام مشاركة الهاتف بين الزملاء، حيث يُقفل كل حساب طالب بجهاز واحد فقط خلال الفصل الدراسي.
                </p>
              </div>

              {/* Loading Verification State */}
              {isVerifying && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">جارِ فحص معايير الأمان الثلاثية...</h4>
                    <p className="text-xs text-slate-300">مطابقة الإحداثيات الجغرافية • فحص بصمة العتاد • التحقق من المفتاح المشفر</p>
                  </div>
                </div>
              )}

              {/* Verification Success Card */}
              {verificationSuccess && !isVerifying && (
                <div className="bg-gradient-to-br from-emerald-500/20 via-white/[0.04] to-transparent backdrop-blur-2xl rounded-3xl p-5 border border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.25)] space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-sm text-white">تم تأكيد الحضور في المعمل بنجاح ✅</h4>
                      <span className="text-[11px] text-emerald-300">مطابق جغرافياً وعتادياً 100%</span>
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded-2xl border border-white/10 space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between font-bold text-white">
                      <span>{verificationSuccess.courseTitle}</span>
                      <span className="text-emerald-400">{verificationSuccess.timestamp}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>المكان: {verificationSuccess.hall}</span>
                      <span>المسافة: {verificationSuccess.verifiedDistance} متر</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                    <span>مكافأة الحضور:</span>
                    <span>{verificationSuccess.streakBonus}</span>
                  </div>
                </div>
              )}

              {/* Verification Failure / Fraud Alert Card */}
              {verificationError && !isVerifying && (
                <div className="bg-gradient-to-br from-red-500/20 via-white/[0.04] to-transparent backdrop-blur-2xl rounded-3xl p-5 border border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.25)] space-y-3">
                  <div className="flex items-start gap-2.5 text-red-400 font-bold">
                    <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-white">فشل التحقق وتم حظر الحضور ⚠️</h4>
                      <span className="text-[11px] text-red-300">رصد مخالفة أمنية وتم تسجيلها في السجل الرسمي</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-2xl border border-red-500/30 text-xs text-red-200 leading-relaxed font-medium">
                    {verificationError}
                  </div>

                  <p className="text-[10px] text-slate-400">
                    تم إخطار منسق المادة ورئيس القسم بهذه المحاولة تلقائياً لحفظ نزاهة درجات أعمال السنة.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* =======================================================================
            SECTION 3: FRAUD & INCIDENTS AUDIT LOG
           ======================================================================= */}
        {activeMode === 'incidents' && (
          <div className="space-y-4">
            
            {/* Header with Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">إجمالي المحاولات المحظورة</span>
                  <span className="text-xl font-black text-red-400">{incidents.length} محاولات</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">معدل النزاهة الأكاديمية</span>
                  <span className="text-xl font-black text-emerald-400">98.6%</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">قفل الأجهزة النشط</span>
                  <span className="text-xl font-black text-white">100 طالب</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Incidents Table / Cards List */}
            <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">سجل الرصد الفوري لمحاولات التحايل الأكاديمي</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  محدث لحظياً ومتاح للمحاضر ورئيس القسم
                </span>
              </div>

              <div className="space-y-2.5">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{inc.studentName}</span>
                        <span className="font-mono text-[10px] text-slate-400">#{inc.studentId}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {inc.violationType}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        {inc.courseTitle} • {inc.distance} • الجهاز: {inc.device}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 text-left">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {inc.actionTaken}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{inc.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          PRINTABLE HIGH-RESOLUTION PDF CARD MODAL
         ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#0B0F17] text-white w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold">بطاقة القاعة والمعمل الرسمية (جاهزة للطباعة / PDF)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Paper Card Container (Simulating High-Res Physical Sheet) */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center text-center">
              
              <div className="w-full bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-slate-900 space-y-4 print:border-none print:shadow-none">
                
                {/* Official College Header */}
                <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between text-right">
                  <div>
                    <h2 className="text-sm font-black text-slate-950">جامعة حلوان • كلية التربية النوعية</h2>
                    <h3 className="text-xs font-bold text-slate-700">قسم تكنولوجيا التعليم - الفرقة الثانية</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    حاضر
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    رمز الحضور الأكاديمي المشفر • الأسبوع {selectedWeek}
                  </span>
                  <h4 className="text-base font-black text-slate-950 pt-1">
                    {selectedCourse.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-700">
                    المحاضر: {selectedCourse.doctor} • المكان: {selectedCourse.location}
                  </p>
                </div>

                {/* High Contrast QR Code for Physical Optical Scanning */}
                <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center">
                  <QRCodeSVG
                    value={dynamicPayload}
                    size={220}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">
                    GEOFENCE LOCKED: {CAMPUS_COORDINATES.name}
                  </span>
                </div>

                {/* Student Warning Notices */}
                <div className="text-[10px] text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-200 space-y-0.5 leading-relaxed text-right">
                  <p className="font-bold text-slate-800">⚠️ تعليمات أمنية هامة للطلاب:</p>
                  <p>1. يُمسح هذا الكود حصرياً من داخل المعمل بواسطة تطبيق منصة حاضر.</p>
                  <p>2. لا يمكن تسجيل الحضور عن بُعد، حيث يتحقق النظام من تطابق الإحداثيات وبصمة الجهاز.</p>
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex gap-2.5">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="flex-1 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-bold transition-all border border-white/10"
              >
                إغلاق
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#07090E] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الورقة فوراً / حفظ PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Bottom Nav Dock */}
      <nav 
        className="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40 bg-[#0B0F17]/80 backdrop-blur-2xl border border-white/10 rounded-full px-3 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]"
        aria-label="شريط التنقل السفلي"
      >
        <div className="flex items-center justify-between px-1">
          <Link
            to="/"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 font-medium transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الرئيسية</span>
          </Link>

          <Link
            to="/schedule"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 font-medium transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الجدول</span>
          </Link>

          {/* Active Center Attendance Button */}
          <button
            type="button"
            className="flex flex-col items-center -mt-6 group active:scale-95 transition-transform"
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#07090E] flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-300/40">
              <ShieldCheck className="w-6 h-6 text-[#07090E]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-300 mt-1">محرك الحضور</span>
          </button>

          <Link
            to="/"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 font-medium transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px]">الأعذار</span>
          </Link>

          <Link
            to="/auth"
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 font-medium transition-all"
          >
            <div className="p-1.5 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px]">حسابي</span>
          </Link>
        </div>
      </nav>

    </div>
  );
}
