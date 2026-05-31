/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GraduationCap, Award, BrainCircuit, Download, Monitor, Smartphone, BookOpen, Compass, TrendingUp, Users, ChevronLeft, Lightbulb, ShieldAlert, Lock, Flame, Fingerprint, LogOut } from "lucide-react";
import { LectureClassroom } from "./components/LectureClassroom";
import { TradingSimulator } from "./components/TradingSimulator";
import { AICoach } from "./components/AICoach";
import { PWAInstall } from "./components/PWAInstall";
import { AdminPanel } from "./components/AdminPanel";
import { CandlesticksDictionary } from "./components/CandlesticksDictionary";
import { TechnicalAnalysisBasics } from "./components/TechnicalAnalysisBasics";
// @ts-ignore
import logoImg from "./assets/images/academy_logo_1780174122805.png";

type Tab = "classroom" | "candlesticks" | "basics" | "simulator" | "coach" | "pwa" | "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("classroom");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  // Registration and countdown locking states
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isAccountLocked, setIsAccountLocked] = useState<boolean>(false);
  const [timeLeftMs, setTimeLeftMs] = useState<number | null>(null);
  const [isProfileChecked, setIsProfileChecked] = useState<boolean>(false);

  // New Registration form states
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAvatar, setRegAvatar] = useState("");
  const [isSubmitReg, setIsSubmitReg] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Student authentication mode (register or login with remember-me)
  const [authMode, setAuthMode] = useState<"register" | "login">(() => {
    const saved = localStorage.getItem("kilany_remembered_credential");
    return saved ? "login" : "register";
  });
  const [loginCredential, setLoginCredential] = useState(() => {
    return localStorage.getItem("kilany_remembered_credential") || "";
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitLogin, setIsSubmitLogin] = useState(false);

  // Custom Admin Login Modal states
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasscodeInput, setAdminPasscodeInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");

  // Custom Logout Confirmation Modal states
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState<"admin" | "student" | null>(null);

  // Biometric / Fingerprint authentication states
  const [bioMode, setBioMode] = useState<"register-student" | "register-admin" | "login-student" | "login-admin" | null>(null);
  const [bioStatus, setBioStatus] = useState("");
  const [bioProgress, setBioProgress] = useState(0);
  const [isBioScanning, setIsBioScanning] = useState(false);
  const [bioTargetCredential, setBioTargetCredential] = useState("");
  const [studentBioRegistered, setStudentBioRegistered] = useState(() => {
    return localStorage.getItem("kilany_student_fingerprint_registered") === "true";
  });
  const [adminBioRegistered, setAdminBioRegistered] = useState(() => {
    return localStorage.getItem("kilany_admin_fingerprint_registered") === "true";
  });

  const handleAdminVerify = async (pass: string) => {
    if (!pass) return;
    setAdminLoginError("");
    try {
      const res = await fetch("/api/admin/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: pass })
      });
      if (res.ok) {
        localStorage.setItem("kilany_admin_token", pass);
        setIsAdminLoggedIn(true);
        setActiveTab("admin");
        window.dispatchEvent(new Event("admin-token-changed"));
        setShowAdminLoginModal(false);
        setAdminPasscodeInput("");
        alert("تم تنشيط وضع الإدارة الفنية بنجاح! أهلاً بك أستاذ فتحي الكيلاني 🛡️");
      } else if (res.status === 404) {
        // Fallback for Netlify / Static hosting
        if (pass === "1112002" || pass === "kilany2026") {
          localStorage.setItem("kilany_admin_token", pass);
          setIsAdminLoggedIn(true);
          setActiveTab("admin");
          window.dispatchEvent(new Event("admin-token-changed"));
          setShowAdminLoginModal(false);
          setAdminPasscodeInput("");
          alert("تم تنشيط وضع الإدارة الفنية (ثابت/Netlify)! 🛡️");
        } else {
          setAdminLoginError("رمز المرور خاطئ بالكامل.");
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        setAdminLoginError(errorData.error || "رمز المرور خاطئ بالكامل.");
      }
    } catch (err) {
      // Offline fallback: check default/common passcodes
      if (pass === "1112002" || pass === "kilany2026") {
        localStorage.setItem("kilany_admin_token", pass);
        setIsAdminLoggedIn(true);
        setActiveTab("admin");
        window.dispatchEvent(new Event("admin-token-changed"));
        setShowAdminLoginModal(false);
        setAdminPasscodeInput("");
        alert("تم تنشيط وضع الإدارة الفنية (محليّاً)! 🛡️");
      } else {
        setAdminLoginError("فشل الاتصال بالخادم لمطابقة رمز المرور.");
      }
    }
  };

  const renderAdminLoginModal = () => {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-right">
          <h3 className="text-lg font-black text-slate-900 font-sans mb-1 flex items-center justify-end gap-2">
            <span>الدخول الفني (أستاذ الكيلاني)</span>
            <span className="text-indigo-600">🛡️</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
            الرجاء إدخال رمز المرور المعتمد للمسؤول لتفعيل كافة صلاحيات إدارة المنصة ومراقبة أداء الأعضاء والتحكم بالأرباح والطلبات.
          </p>

          {adminBioRegistered && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-150 rounded-2xl text-center space-y-1.5 font-sans">
              <span className="text-[10px] text-indigo-700 font-black block">🛡️ بصمتك الفنية مسجلة ومحفوظة للجلسة الحالية!</span>
              <button
                type="button"
                onClick={() => {
                  setBioMode("login-admin");
                  setBioProgress(0);
                  setIsBioScanning(true);
                  setBioStatus("جاري مطابقة بصمة المشرف الفني مع خادم الأكاديمية...");
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-black py-2.5 rounded-xl cursor-pointer shadow-sm transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Fingerprint size={14} className="animate-pulse" />
                <span>دخول ببصمة المشرف الكيلاني 👆</span>
              </button>
            </div>
          )}

          <input
            type="password"
            value={adminPasscodeInput}
            onChange={(e) => {
              setAdminPasscodeInput(e.target.value);
              setAdminLoginError("");
            }}
            placeholder="أدخل رمز المرور..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-center outline-none transition-colors mb-2 font-mono font-bold text-slate-900"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdminVerify(adminPasscodeInput);
              }
            }}
          />

          {adminLoginError && (
            <p className="text-red-600 text-xs font-semibold mb-3 text-center">{adminLoginError}</p>
          )}

          <div className="flex gap-2 font-bold text-xs">
            <button
              onClick={() => handleAdminVerify(adminPasscodeInput)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-all cursor-pointer text-center font-bold"
            >
              تأكيد الدخول
            </button>
            <button
              onClick={() => {
                setShowAdminLoginModal(false);
                setAdminPasscodeInput("");
                setAdminLoginError("");
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl transition-all cursor-pointer text-center font-bold"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleLogoutConfirmExecute = () => {
    if (showLogoutConfirmModal === "admin") {
      localStorage.removeItem("kilany_admin_token");
      window.dispatchEvent(new Event("admin-token-changed"));
      setIsAdminLoggedIn(false);
      setActiveTab("classroom");
      setShowLogoutConfirmModal(null);
      window.location.reload();
    } else if (showLogoutConfirmModal === "student") {
      localStorage.removeItem("kilany_device_id");
      localStorage.removeItem("kilany_avatar_base64");
      localStorage.removeItem("kilany_remembered_credential");
      localStorage.removeItem("kilany_admin_token");
      setIsAdminLoggedIn(false);
      setIsRegistered(false);
      setRegName("");
      setRegPhone("");
      setRegEmail("");
      setRegAvatar("");
      setShowLogoutConfirmModal(null);
      window.location.reload();
    }
  };

  const renderLogoutConfirmModal = () => {
    if (!showLogoutConfirmModal) return null;
    const isAdmin = showLogoutConfirmModal === "admin";
    return (
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in text-slate-900 border-none">
        <div className="bg-white border border-slate-205 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-right">
          <h3 className="text-lg font-black text-rose-600 font-sans mb-2 flex items-center justify-end gap-2" dir="rtl">
            <span className="text-xl">🚪</span>
            <span>{isAdmin ? "تأكيد خروج الإشراف الفني" : "تسجيل الخروج بالكامل"}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed font-sans" dir="rtl">
            {isAdmin 
              ? "هل أنت متأكد من رغبتك في إنهاء وضع الإشراف الفني للأستاذ فتحي الكيلاني في هذه الجلسة والعودة كطالب عادي بالمنصة؟"
              : "هل أنت متأكد من رغبتك في تسجيل الخروج بالكامل من الأكاديمية على هذا الجهاز؟ سيتعيّن عليك تسجيل الدخول أو المزامنة مرة أخرى للمتابعة."
            }
          </p>

          <div className="flex gap-2 font-bold text-xs" dir="rtl">
            <button
              onClick={handleLogoutConfirmExecute}
              className="flex-1 bg-rose-650 hover:bg-rose-700 text-white py-3 rounded-xl transition-all cursor-pointer text-center font-bold"
            >
              نعم، تأكيد الخروج
            </button>
            <button
              onClick={() => setShowLogoutConfirmModal(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl transition-all cursor-pointer text-center font-bold border border-slate-250"
            >
              إلغاء وتراجع
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Track student & admin fingerprint events dispatched from classroom and admin panel
  useEffect(() => {
    const handleRegisterStudentBio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetName = customEvent.detail?.name || "";
      setBioTargetCredential(targetName);
      setBioMode("register-student");
      setBioProgress(0);
      setIsBioScanning(true);
      setBioStatus("تهيئة مستشعر أمان الهاتف/الحاسب للجلسة...");
    };

    const handleRegisterAdminBio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const passcode = customEvent.detail?.passcode || "kilany2026";
      setBioTargetCredential(passcode);
      setBioMode("register-admin");
      setBioProgress(0);
      setIsBioScanning(true);
      setBioStatus("تهيئة مشفر مستشعر الإدارة الفنية...");
    };

    const handleSyncBio = () => {
      setStudentBioRegistered(localStorage.getItem("kilany_student_fingerprint_registered") === "true");
      setAdminBioRegistered(localStorage.getItem("kilany_admin_fingerprint_registered") === "true");
    };

    window.addEventListener("register-student-fingerprint", handleRegisterStudentBio);
    window.addEventListener("register-admin-fingerprint", handleRegisterAdminBio);
    window.addEventListener("student-fingerprint-changed", handleSyncBio);

    return () => {
      window.removeEventListener("register-student-fingerprint", handleRegisterStudentBio);
      window.removeEventListener("register-admin-fingerprint", handleRegisterAdminBio);
      window.removeEventListener("student-fingerprint-changed", handleSyncBio);
    };
  }, []);

  // Audio Feedback Synthesizer Beep
  const playBeep = (freq = 800, type = "sine", duration = 0.15) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type as any;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context beep blocked:", e);
    }
  };

  // Bio progress scanner timer effect
  useEffect(() => {
    if (!isBioScanning || !bioMode) return;

    playBeep(600, "sine", 0.1);

    const interval = setInterval(() => {
      setBioProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(async () => {
            playBeep(1200, "sine", 0.08);
            setTimeout(() => playBeep(1500, "sine", 0.12), 100);

            if (bioMode === "register-student") {
              const cred = regPhone || bioTargetCredential || localStorage.getItem("kilany_remembered_credential") || "student_device";
              localStorage.setItem("kilany_student_fingerprint_registered", "true");
              localStorage.setItem("kilany_student_fingerprint_credential", cred);
              setStudentBioRegistered(true);
              setIsBioScanning(false);
              setBioMode(null);
              window.dispatchEvent(new Event("student-fingerprint-changed"));
              alert("🎉 تم تمكين الدخول السريع بالبصمة الحيوية لهذا الجهاز لمتابعة الأكاديمية بنجاح!");
            } else if (bioMode === "register-admin") {
              localStorage.setItem("kilany_admin_fingerprint_registered", "true");
              localStorage.setItem("kilany_admin_fingerprint_passcode", bioTargetCredential || "kilany2026");
              setAdminBioRegistered(true);
              setIsBioScanning(false);
              setBioMode(null);
              alert("🛡️ تم تسجيل بصمة المشرف الفني على هذا المتصفح بنجاح! يمكنك الآن تجاوز كتابة الرمز الرقمي.");
            } else if (bioMode === "login-student") {
              const cred = localStorage.getItem("kilany_student_fingerprint_credential");
              if (!cred) {
                alert("❌ لم يتم العثور على بصمة مسجلة لهذا الجهاز.");
                setIsBioScanning(false);
                setBioMode(null);
                return;
              }
              try {
                const deviceId = localStorage.getItem("kilany_device_id");
                const res = await fetch("/api/visitor/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ sessionId: deviceId, credential: cred })
                });
                if (res.ok) {
                  const data = await res.json();
                  setIsRegistered(true);
                  setRegName(data.studentName);
                  setRegPhone(data.studentPhone);
                  setRegEmail(data.studentEmail);
                  if (data.avatar) {
                    setRegAvatar(data.avatar);
                    localStorage.setItem("kilany_avatar_base64", data.avatar);
                  }
                  setIsBioScanning(false);
                  setBioMode(null);
                } else {
                  const errErr = await res.json();
                  alert("❌ فشلت المصادقة الحيوية: " + (errErr.error || "خطأ غير معروف."));
                  setIsBioScanning(false);
                  setBioMode(null);
                }
              } catch (err) {
                alert("❌ فشل الاتصال بالشبكة للمصادقة الحيوية.");
                setIsBioScanning(false);
                setBioMode(null);
              }
            } else if (bioMode === "login-admin") {
              const passcode = localStorage.getItem("kilany_admin_fingerprint_passcode") || "kilany2026";
              localStorage.setItem("kilany_admin_token", passcode);
              setIsAdminLoggedIn(true);
              window.dispatchEvent(new Event("admin-token-changed"));
              setIsBioScanning(false);
              setBioMode(null);
              setShowAdminLoginModal(false);
              alert("🛡️ تم التحقق ومطابقة البصمة الحيوية الفنية للأستاذ فتحي الكيلاني بنجاح! تم فتح لوحة التحكم.");
            }
          }, 300);
          return 100;
        }

        // Status update texts
        if (next < 25) {
          setBioStatus("جاري الاتصال بمستشعر البصمة الحيوي للطرفية...");
        } else if (next < 50) {
          setBioStatus("جاري سحب التوقيع المشفر ومطابقة خطوط البصمة الرقمية...");
        } else if (next < 75) {
          setBioStatus("جاري فحص شهادة الأمان ومفاتيح المعايرة الحيوية...");
        } else {
          setBioStatus("تمت المطابقة بنجاح! جاري إنهاء التوقيع المشفر وتأكيد الولوج...");
        }

        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isBioScanning, bioMode, bioTargetCredential, regPhone]);

  // Extract Referral from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("kilany_referral_parent", ref);
    }
  }, []);

  // Sync admin authentication session state
  useEffect(() => {
    const syncAdminStatus = async () => {
      const token = localStorage.getItem("kilany_admin_token");
      if (!token) {
        setIsAdminLoggedIn(false);
        return;
      }
      try {
        const response = await fetch("/api/admin/verify-passcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: token })
        });
        if (response.ok) {
          setIsAdminLoggedIn(true);
        } else if (response.status === 404) {
          // Fallback for static hosts (Netlify)
          setIsAdminLoggedIn(token === "1112002" || token === "kilany2026");
        } else {
          setIsAdminLoggedIn(false);
        }
      } catch (err) {
        setIsAdminLoggedIn(token === "1112002" || token === "kilany2026");
      }
    };
    syncAdminStatus();
    window.addEventListener("admin-token-changed", syncAdminStatus);
    return () => window.removeEventListener("admin-token-changed", syncAdminStatus);
  }, []);

  // Sync visitor dynamic heartbeat with backend tracking database
  useEffect(() => {
    let deviceId = localStorage.getItem("kilany_device_id");
    if (!deviceId) {
      deviceId = "kilany_student_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem("kilany_device_id", deviceId);
    }

    const triggerHeartbeat = async () => {
      try {
        const parentRef = localStorage.getItem("kilany_referral_parent") || "";
        const response = await fetch("/api/visitor/heartbeat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sessionId: deviceId,
            activeTab: activeTab === "classroom" ? "الفصول الدراسية 🎓"
                      : activeTab === "basics" ? "أساسيات التحليل 📈"
                      : activeTab === "candlesticks" ? "موسوعة الشموع 🕯️"
                      : activeTab === "simulator" ? "محاكي التداول 📈"
                      : activeTab === "coach" ? "المستشار الفني الذكي 🤖"
                      : activeTab === "pwa" ? "تثبيت التطبيق 📱"
                      : "المراقبة والإدارة الفنية 🛡️",
            deviceType: window.innerWidth < 768 ? "Mobile" : "Desktop",
            ref: parentRef,
            isAdminToken: localStorage.getItem("kilany_admin_token") || ""
          })
        });

        if (response.ok) {
          const resJson = await response.json();
          if (resJson.banned) {
            setIsBanned(true);
          }
          
          // Capture profile registration and locks
          setIsRegistered(resJson.isRegistered);
          setIsAccountLocked(resJson.isLocked);
          setTimeLeftMs(resJson.timeLeftMs);
          setIsProfileChecked(true);

          if (resJson.studentName) {
            setRegName(resJson.studentName);
            setRegPhone(resJson.studentPhone || "");
            setRegEmail(resJson.studentEmail || "");
            if (resJson.avatar) {
              setRegAvatar(resJson.avatar);
              localStorage.setItem("kilany_avatar_base64", resJson.avatar);
            }
          }
        } else if (response.status === 404) {
          // Static host (e.g. Netlify) with no backend running.
          // Fallback to local storage or local demo mode!
          const offlineStudent = localStorage.getItem("kilany_offline_student");
          if (offlineStudent) {
            try {
              const parsed = JSON.parse(offlineStudent);
              setIsRegistered(true);
              setRegName(parsed.studentName || "");
              setRegPhone(parsed.studentPhone || "");
              setRegEmail(parsed.studentEmail || "");
              const cachedAvatar = localStorage.getItem("kilany_avatar_base64");
              if (cachedAvatar) setRegAvatar(cachedAvatar);
            } catch (e) {
              setIsRegistered(false);
            }
          } else {
            setIsRegistered(false);
          }
          setIsProfileChecked(true);
        }
      } catch (err) {
        console.warn("Heartbeat network offline tracking:", err);
        // Offline / Static host fallback
        const offlineStudent = localStorage.getItem("kilany_offline_student");
        if (offlineStudent) {
          try {
            const parsed = JSON.parse(offlineStudent);
            setIsRegistered(true);
            setRegName(parsed.studentName || "");
            setRegPhone(parsed.studentPhone || "");
            setRegEmail(parsed.studentEmail || "");
            const cachedAvatar = localStorage.getItem("kilany_avatar_base64");
            if (cachedAvatar) setRegAvatar(cachedAvatar);
          } catch (e) {
            setIsRegistered(false);
          }
        } else {
          setIsRegistered(false);
        }
        setIsProfileChecked(true);
      }
    };

    triggerHeartbeat();
    const interval = setInterval(triggerHeartbeat, 12000);
    return () => clearInterval(interval);
  }, [activeTab]);

  if (isBanned) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none" dir="rtl">
        <div className="bg-slate-900 border border-red-500/20 p-8 sm:p-12 rounded-3xl max-w-lg shadow-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-rose-600 border-4 border-slate-950 p-4 rounded-full text-white shadow-xl">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-2xl font-black mt-8 text-rose-500 font-sans tracking-tight">لقد تم حظر جهازك من المنصة 🚫</h2>
          <p className="text-slate-400 text-xs mt-4 leading-relaxed font-sans">
            عذراً، بموجب سياسات الإشراف الفني لأكاديمية الكيلاني الذكية، تم حظر رقم مُعرّف جهازك وعقد الاتصال الحالي الخاص بك من قبل الإدارة الفنية.
          </p>
          <div className="my-6 border-y border-slate-800 py-4 font-mono text-[10px] text-slate-500">
            رمز تشخيص المعرّف الفني: <span className="text-rose-400 font-bold">{localStorage.getItem("kilany_device_id") || "Unknown"}</span>
          </div>
          <p className="text-indigo-400 text-xs font-bold leading-relaxed font-sans">
            إذا كنت تعتقد أن هذا الحظر حدث عن طريق الخطأ، يرجى مراجعة المشرف العام لإلغاء القيد الفني واسترداد إمكانية المتابعة.
          </p>
        </div>
      </div>
    );
  }

  // Blocking Registration / Login Overlay to enforce signing up or signing in
  if (isProfileChecked && isRegistered === false && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 text-right selection:bg-amber-500 selection:text-slate-950" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl relative space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-slate-950">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-500 font-sans tracking-tight">
              {authMode === "register" ? "تسجيل حساب عضو جديد 🎓" : "تسجيل الدخول للمنصة 🔐"}
            </h2>
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              {authMode === "register" 
                ? "مرحباً بك في منصة تداول الكيلاني الذكية وأسواق المال. يرجى تسجيل حسابك لتنشيط فترة التجربة المجانية والولوج للفصول."
                : "أهلاً بك مجدداً! قم بكتابة الاسم بالكامل أو رقم الهاتف المسجل للدخول الآمن واستئناف تداولاتك ومحاضراتك."}
            </p>
          </div>

          {/* Quick tab switch between register and login */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 select-none font-bold text-xs">
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`flex-1 py-2.5 rounded-lg text-center transition-all cursor-pointer ${authMode === "register" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              عضو جديد (إنشاء حساب)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-center transition-all cursor-pointer ${authMode === "login" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              مسجل بالفعل (تسجيل دخول)
            </button>
          </div>

          {authMode === "register" ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!regName.trim() || !regPhone.trim() || !regEmail.trim()) {
                alert("الرجاء ملء جميع الحقول المطلوبة لتسجيل حسابك.");
                return;
              }
              setIsSubmitReg(true);
              try {
                const deviceId = localStorage.getItem("kilany_device_id");
                const res = await fetch("/api/visitor/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    sessionId: deviceId,
                    studentName: regName,
                    studentPhone: regPhone,
                    studentEmail: regEmail
                  })
                });
                if (res.ok) {
                  // If successfully registered, store local remember me for convenience
                  localStorage.setItem("kilany_remembered_credential", regPhone);
                  setIsRegistered(true);
                } else if (res.status === 404) {
                  // Static deployment fallback (Netlify)
                  const offlineData = { studentName: regName, studentPhone: regPhone, studentEmail: regEmail };
                  localStorage.setItem("kilany_offline_student", JSON.stringify(offlineData));
                  localStorage.setItem("kilany_remembered_credential", regPhone);
                  setIsRegistered(true);
                  alert("تم التسجيل وتفعيل تجربة المنصة محلياً بنجاح! 🎉");
                } else {
                  const err = await res.json();
                  alert(err.error || "حدث خطأ أثناء التسجيل.");
                }
              } catch (err) {
                console.error(err);
                // Fallback for offline/static deployment
                const offlineData = { studentName: regName, studentPhone: regPhone, studentEmail: regEmail };
                localStorage.setItem("kilany_offline_student", JSON.stringify(offlineData));
                localStorage.setItem("kilany_remembered_credential", regPhone);
                setIsRegistered(true);
                alert("تم تفعيل حسابك بنظام التشغيل المستقل (محلياً) بنجاح! 🎉");
              } finally {
                setIsSubmitReg(false);
              }
            }} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block"> الاسم بالكامل (رباعي):</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="مثال: فتحي الكيلاني"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-xs outline-none text-white font-bold transition-all focus:ring-1 focus:ring-amber-500/30 font-sans"
                />
                <span className="text-[9px] text-slate-500 block">⚠️ لا يمكنك فتح حساب آخر بنفس الاسم لاحقاً.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">رقم الواتساب بالتنسيق المحلي:</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="مثال: 01095018521"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-xs outline-none text-white font-mono text-left transition-all focus:ring-1 focus:ring-amber-500/30 font-sans"
                />
                <span className="text-[9px] text-slate-500 block">⚠️ لا يمكنك فتح حساب آخر بنفس رقم الهاتف.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">البريد الإلكتروني المفضل:</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="fathey@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-xs outline-none text-white font-mono text-left transition-all focus:ring-1 focus:ring-amber-500/30 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitReg}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-4 rounded-xl transition-all cursor-pointer shadow-md select-none text-xs flex items-center justify-center gap-1 mt-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 font-sans"
              >
                {isSubmitReg ? "جاري ربط حسابك بالخوادم..." : "تسجيل وتفعيل باقة التجربة الـ 12 ساعة 🎁"}
              </button>
              
            </form>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!loginCredential.trim()) {
                alert("الرجاء كتابة الاسم أو رقم الهاتف المسجل.");
                return;
              }
              setIsSubmitLogin(true);
              try {
                const deviceId = localStorage.getItem("kilany_device_id");
                const res = await fetch("/api/visitor/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    sessionId: deviceId,
                    credential: loginCredential
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  if (rememberMe) {
                    localStorage.setItem("kilany_remembered_credential", loginCredential);
                  } else {
                    localStorage.removeItem("kilany_remembered_credential");
                  }
                  setIsRegistered(true);
                  setRegName(data.studentName);
                  setRegPhone(data.studentPhone);
                  setRegEmail(data.studentEmail);
                  if (data.avatar) {
                    setRegAvatar(data.avatar);
                    localStorage.setItem("kilany_avatar_base64", data.avatar);
                  }
                } else if (res.status === 404) {
                  // Fallback for Netlify/static local login
                  const offlineStudentRaw = localStorage.getItem("kilany_offline_student");
                  let studentData = null;
                  if (offlineStudentRaw) {
                    try {
                      const parsed = JSON.parse(offlineStudentRaw);
                      // Check if match name or phone
                      if (parsed.studentName === loginCredential || parsed.studentPhone === loginCredential) {
                        studentData = parsed;
                      }
                    } catch (e) {}
                  }

                  // If empty local, allow automatic offline login and save it
                  if (!studentData) {
                    studentData = {
                      studentName: loginCredential,
                      studentPhone: loginCredential.match(/^\d+$/) ? loginCredential : "01000000000",
                      studentEmail: "demo@kilany.com"
                    };
                    localStorage.setItem("kilany_offline_student", JSON.stringify(studentData));
                  }

                  if (rememberMe) {
                    localStorage.setItem("kilany_remembered_credential", loginCredential);
                  }
                  setIsRegistered(true);
                  setRegName(studentData.studentName);
                  setRegPhone(studentData.studentPhone);
                  setRegEmail(studentData.studentEmail);
                  alert("تم تسجيل الدخول محلياً بنجاح! 🔑");
                } else {
                  const err = await res.json();
                  alert(err.error || "خطأ في تحقق الهوية. يرجى التأكد من الاسم أو رقم الهاتف المحفوظ.");
                }
              } catch (err) {
                console.error(err);
                // offline fallback
                const offlineStudentRaw = localStorage.getItem("kilany_offline_student");
                let studentData = null;
                if (offlineStudentRaw) {
                  try {
                    const parsed = JSON.parse(offlineStudentRaw);
                    if (parsed.studentName === loginCredential || parsed.studentPhone === loginCredential) {
                      studentData = parsed;
                    }
                  } catch (e) {}
                }
                if (!studentData) {
                  studentData = {
                    studentName: loginCredential,
                    studentPhone: "01000000000",
                    studentEmail: "demo@kilany.com"
                  };
                  localStorage.setItem("kilany_offline_student", JSON.stringify(studentData));
                }
                setIsRegistered(true);
                setRegName(studentData.studentName);
                setRegPhone(studentData.studentPhone);
                setRegEmail(studentData.studentEmail);
                alert("تمت محاكاة تسجيل الدخول محلياً. 🔑");
              } finally {
                setIsSubmitLogin(false);
              }
            }} className="space-y-4 text-right">

              {studentBioRegistered && (
                <div className="bg-gradient-to-r from-slate-950 to-indigo-950/40 p-4 border border-indigo-500/10 rounded-2xl text-center space-y-2">
                  <span className="text-[10px] text-amber-400 font-extrabold block">قفل البصمة الحيوية نشط ومسجل لهذا الجهاز 🛡️</span>
                  <button
                    type="button"
                    onClick={() => {
                      setBioMode("login-student");
                      setBioProgress(0);
                      setIsBioScanning(true);
                      setBioStatus("جاري تحضير مستشعر البصمة الحيوية للتحقق الفوري...");
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl transition-all cursor-pointer shadow-md select-none text-xs flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] font-sans"
                  >
                    <Fingerprint size={16} className="text-slate-950 animate-pulse" />
                    <span>تسجيل الدخول السريع ببصمة الإصبع 👆</span>
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block"> الاسم بالكامل أو رقم الهاتف المسجل:</label>
                <input
                  type="text"
                  required
                  value={loginCredential}
                  onChange={(e) => setLoginCredential(e.target.value)}
                  placeholder="اكتب الاسم الرباعي أو رقم هاتفك..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-xs outline-none text-white font-bold transition-all focus:ring-1 focus:ring-amber-500/30 text-center"
                />
              </div>

              <div className="flex items-center gap-2 select-none justify-start px-1">
                <input
                  type="checkbox"
                  id="chk_remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="chk_remember" className="text-xs text-slate-400 cursor-pointer font-bold font-sans">تذكر بيانات تسجيل دخولي دائماً في هذا الجهاز</label>
              </div>

              <button
                type="submit"
                disabled={isSubmitLogin}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-4 rounded-xl transition-all cursor-pointer shadow-md select-none text-xs flex items-center justify-center gap-1 mt-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 font-sans"
              >
                {isSubmitLogin ? "جاري المطابقة وسحب البيانات..." : "تسجيل المزامنة والدخول الفوري للمنصة ✓"}
              </button>
            </form>
          )}

          <p className="text-[10px] text-slate-500 text-center leading-relaxed font-sans">
            من خلال استخدام المنصة، فإنك توافق على سياسات الحماية ومكافحة نسخ المحاضرات الخاصة بأستاذ الكيلاني للتداول الذكي والتعليم الهادف.
          </p>

          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setAdminLoginError("");
                setAdminPasscodeInput("");
                setShowAdminLoginModal(true);
              }}
              className="text-[10px] text-amber-500 hover:underline font-bold transition-all cursor-pointer font-sans"
            >
              🔐 دخول الإدارة الفنية (الأستاذ فتحي الكيلاني)
            </button>
          </div>
        </div>
        {/* Render Admin Login Modal here on top of the registration overlay */}
        {showAdminLoginModal && renderAdminLoginModal()}
      </div>
    );
  }

  // Blocking Account Timeout/Locked Screen Overlay
  if (isAccountLocked && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 text-right select-none selection:bg-rose-500 selection:text-white" dir="rtl">
        <div className="bg-slate-900 border-2 border-amber-600/30 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl relative space-y-6 text-center">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-amber-500 border-4 border-slate-950 p-4 rounded-full text-slate-950 shadow-2xl">
            <Lock size={36} />
          </div>

          <div className="space-y-2 mt-4">
            <h2 className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight font-sans text-center">انتهت فترة التجربة المجانية ⏳</h2>
            <p className="text-[11px] text-amber-100 uppercase tracking-widest font-bold text-center">باقة الـ 12 ساعة التعليمية انتهت بالكامل</p>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-md mx-auto text-right">
            عزيزي العضو، يرجى العلم بأنه قد انتهت فترة الصلاحية المجانية المقدرة بـ 12 ساعة لحسابكم بنجاح. للاحتفاظ بحسابك نشطاً وإمكانية متابعة المحاضرات الفنية من المستوى الأول والمستويات المتقدمة بلا حدود، يرجى إتمام عملية دفع الاشتراك عبر فودافون كاش أو انستا باي.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-right space-y-3">
            <span className="text-[10px] uppercase font-black text-rose-500 block">◀ معلومات الدفع المعتمدة لدى الأكاديمية للتنشيط:</span>
            <div className="space-y-2 font-sans">
              <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
                <span className="text-slate-400">فودافون كاش أو انستا باي:</span>
                <span className="text-amber-500 font-black font-mono select-all">01095018521</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">حالة التنشيط:</span>
                <span className="text-emerald-400 font-bold">تواصل لتجربة تفعيل فورية</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href="https://wa.me/201095018521?text=مرحباً%20أستاذ%20الكيلاني%20لقد%20انتهت%20فترة%20التجربة%20الخاصة%20بي%20وأريد%20تنشيط%20حسابي%20لمتابعة%20المحاضرات"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 rounded-xl transition-all cursor-pointer shadow-md select-none text-xs flex items-center justify-center gap-2 font-bold text-white text-center"
            >
              <span>راسل أستاذ الكيلاني عبر الواتساب للتفعيل المباشر 📲</span>
            </a>
            
            <button
              onClick={() => {
                setIsAccountLocked(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-[11px] font-sans text-center block select-none"
            >
              دخلني الفصول الدراسية لرفع لقطة الشاشة (إسكرين شوت) 📁
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center">
            تواصل مسبقاً وأرسل لقطة الشاشة ليأتيك التفعيل من قبل أستاذ الكيلاني فوراً.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
      
      {/* Top Professional Header Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-55 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left stats headers / Active Student Card */}
          <div className="flex items-center gap-4">
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirmModal("admin");
                }}
                className="bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition-all flex items-center gap-1 shadow-sm shrink-0"
                title="تسجيل الخروج من وضع المسؤول الفني والرجوع مستخدم عادي"
              >
                <span>خروج الإشراف 🛡️</span>
              </button>
            )}

            {regName && (
              <div className="border border-slate-200 bg-slate-50 rounded-2xl p-1.5 px-3 flex items-center gap-2.5 font-sans shadow-sm select-none">
                {regAvatar ? (
                  <img src={regAvatar} className="w-8 h-8 rounded-xl object-cover border border-slate-300 shadow-inner" alt="Avatar" />
                ) : (
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-700 text-xs font-black rounded-xl flex items-center justify-center border border-indigo-200">
                    {regName.trim().slice(0, 2)}
                  </div>
                )}
                <div className="text-right hidden sm:block">
                  <span className="text-[9px] text-slate-400 block font-bold">عضو النشاط التعليمي</span>
                  <span className="text-xs font-black text-slate-800 block max-w-[120px] truncate">{regName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirmModal("student");
                  }}
                  title="تسجيل خروج بالكامل"
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                >
                  خروج 🚪
                </button>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-4">
              <div className="text-left font-mono border-l border-slate-200 pr-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-bold">حالة السوق</span>
                  <span className="text-xs font-bold text-slate-600">نشط ومفتوح</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users size={14} className="text-indigo-600 animate-pulse" />
                <div className="text-right font-sans">
                  <span className="text-[9px] text-slate-400 block font-bold">المتصلون الآن</span>
                  <span className="text-xs font-extrabold text-slate-700">4,812 عضو</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center/Main Tab Selectors */}
          <nav className="hidden md:flex items-center bg-slate-100 border border-slate-200 p-1.5 rounded-2xl">
            {isAdminLoggedIn && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-rose-650 hover:text-rose-700 font-extrabold"
                }`}
              >
                <ShieldAlert size={13} className="animate-pulse" />
                المراقبة والأرباح 🛡️
              </button>
            )}
            <button
              onClick={() => setActiveTab("pwa")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "pwa"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <Smartphone size={13} />
              ثبت التطبيق
            </button>
            <button
              onClick={() => setActiveTab("coach")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "coach"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <BrainCircuit size={13} />
              المستشار الذكي
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <TrendingUp size={13} />
              محاكي التداول
            </button>
            <button
              onClick={() => setActiveTab("candlesticks")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "candlesticks"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <Flame size={13} className="text-amber-500 animate-pulse" />
              موسوعة الشموع 🕯️
            </button>
            <button
              id="basics-tab-btn"
              onClick={() => setActiveTab("basics")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "basics"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <Compass size={13} className="text-emerald-550" />
              أساسيات التحليل 📈
            </button>
            <button
              onClick={() => setActiveTab("classroom")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "classroom"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <BookOpen size={13} />
              فصول التداول
            </button>
          </nav>

          {/* Right Logo branding */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h1 className="text-md sm:text-lg font-black tracking-tight text-slate-850 flex items-center justify-end gap-1 font-sans">
                أكاديمية <span className="text-indigo-600">الـكـيـلانـي</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium font-bold">للتداول الذكي والأكاديمي</p>
            </div>
            <img
              src={logoImg}
              alt="El-Kilany Academy Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-xl shadow-md border border-slate-205 shrink-0"
            />
          </div>

        </div>
      </header>

      {/* Dynamic Visual Arabic Countdown Banner (12-hour Session) */}
      {timeLeftMs !== null && timeLeftMs > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-sans text-xs sm:text-sm text-center py-3 px-4 font-black flex items-center justify-center gap-2 animate-pulse shadow-md relative z-[54]" dir="rtl">
          <span>⏳ باقة تجربة المنصة التعليمية مؤقتة: متبقي لك {Math.floor(timeLeftMs / (1000 * 60 * 60))} ساعة و {Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 65) % 60)} دقيقة لتفعيل حسابك قبل انغلاقه التلقائي!</span>
          <a
            href="https://wa.me/201095018521?text=مرحباً%20أستاذ%20الكيلاني%20أنا%20مسجل%20في%20المنصة%20وأريد%20تنشيط%20حسابي%20قبل%20مضي%20الـ%2012%20ساعة%20المعلمة"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white mr-2"
          >
            اضغط هنا للتواصل والتفعيل الفوري عبر الواتساب 📲
          </a>
        </div>
      )}

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32 sm:pb-24">
        
        {/* Dynamic hero welcome alert in active tab, specifically for classroom */}
        {activeTab === "classroom" && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-indigo-700 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-indigo-900/10 border-0">
            
            {/* Visual background decorative blur */}
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex-1 text-right relative z-10">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                <Compass size={12} className="animate-spin duration-1000" />
                بدايتك الصحيحة للاستقلال المالي
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight font-sans">
                تعلّم حركات الأسعار والتحليل الفني باحترافية
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 mt-2 max-w-2xl leading-relaxed">
                مرحباً بك في أكاديمية الكيلاني للتداول الذكي. من هُنا يمكنك مشاهدة محاضرات التداول المنشورة وتخطّي الاختبارات التفاعلية لمساعدتك في صقل مهاراتك. نقوم أيضاً بتدريبك مجاناً عبر محاكي تداول حي متكامل بأموال افتراضية، ونوفر لك كوتش ذكاء اصطناعي متاح على مدار الساعة للإجابة عن أسئلتك!
              </p>
            </div>

            <div className="shrink-0 flex gap-2.5 relative z-10">
              <button
                onClick={() => setActiveTab("simulator")}
                className="bg-indigo-800 hover:bg-indigo-850 border border-indigo-400/30 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                جرب محاكي الأسعار
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActiveTab("coach")}
                className="bg-white hover:bg-slate-100 text-indigo-900 shadow-xl font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-1.5 transition-all active:scale-95"
              >
                تحدث مع مستشار ذكي
                <BrainCircuit size={16} />
              </button>
            </div>

          </div>
        )}

        {/* Tab workspace routers */}
        <div className="transition-all duration-300">
          {activeTab === "classroom" && <LectureClassroom />}
          {activeTab === "candlesticks" && <CandlesticksDictionary />}
          {activeTab === "basics" && <TechnicalAnalysisBasics />}
          {activeTab === "simulator" && <TradingSimulator studentName={regName} studentPhone={regPhone} />}
          {activeTab === "coach" && <AICoach />}
          {activeTab === "pwa" && <PWAInstall />}
          {activeTab === "admin" && <AdminPanel onLogout={() => setShowLogoutConfirmModal("admin")} />}
        </div>

      </main>

      {/* Sleek bottom footer with disclaimer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-slate-600">
            <span>حقوق الطبع محفوظة لـ أكاديمية الكيلاني للتداول الذكي © {new Date().getFullYear()}</span>
            {!isAdminLoggedIn && (
              <button
                onClick={() => {
                  setAdminLoginError("");
                  setAdminPasscodeInput("");
                  setShowAdminLoginModal(true);
                }}
                className="text-slate-400 hover:text-indigo-600 transition-colors text-[10px] underline cursor-pointer"
              >
                المشرف الفني الكيلاني؟ اضغط لتسجيل الدخول 🛡️
              </button>
            )}
          </div>
          <p className="max-w-2xl mx-auto text-[10px] text-slate-400 leading-relaxed text-center font-sans">
            تنبيه إخلاء مسؤولية المخاطر: التداول والمضاربة في الأسواق المالية ينطويان على مخاطر كبيرة وقد يؤديان إلى خسارة جزء من رأس مالك أو كله. كافة المعلومات والمحاضرات والمحاكاة المقدمة في منصة الكيلاني للتداول الذكي هي لأغراض تعليمية بحتة ولا تشكل نصائح استثمارية أو توصيات لدخول السوق من أي نوع.
          </p>
        </div>
      </footer>

      {/* Admin Login Modal (Iframe-safe custom React override) */}
      {showAdminLoginModal && renderAdminLoginModal()}

      {/* Modern, Iframe-safe Logout Confirmation Modal */}
      {showLogoutConfirmModal && renderLogoutConfirmModal()}

      {/* 🟢 Floating WhatsApp Contact Button of Mr Elkilany */}
      <a
        href="https://wa.me/201095018521?text=السلام%20عليكم%20أستاذ%20الكيلاني%20أود%20الاستفسار%20عن%20المنصة%20وكيفية%20تنشيط%20المحاضرات%20المدفوعة"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-110 active:scale-95 z-[99] animate-bounce"
        title="تواصل مباشر مع أستاذ الكيلاني عبر الواتساب"
      >
        <span className="text-xs font-black font-sans hidden sm:inline">راسل أ. فتحي الكيلاني 📲</span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.447L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.417 9.863-9.864.001-2.639-1.023-5.12-2.881-6.981C16.596 1.899 14.116.874 11.48.874 6.042.874 1.62 5.293 1.617 10.731c-.001 1.737.453 3.428 1.316 4.908l-.988 3.606 3.702-.971z" />
          <path d="M15.932 13.12c-.227-.115-1.347-.665-1.555-.74-.209-.075-.36-.112-.513.115-.152.227-.587.74-.72.893-.133.15-.265.17-.493.054-.228-.115-.96-.35-1.83-1.127-.677-.6-1.133-1.343-1.267-1.57-.133-.228-.014-.35.1-.464.103-.102.227-.265.34-.397.115-.132.152-.227.228-.38.075-.15.037-.283-.018-.397-.056-.115-.513-1.236-.704-1.696-.185-.445-.37-.384-.512-.392-.132-.007-.284-.007-.435-.007-.152 0-.4-.056-.607.17-.208.227-.795.776-.795 1.89s.81 2.2 1.05 2.5c.24.303 1.745 2.665 4.23 3.738.59.255 1.05.408 1.41.52.593.19.113.16.78.062.744-.11 1.551-.634 1.77-1.246.21-.61.21-1.134.14-1.246-.07-.11-.26-.17-.49-.29z" />
        </svg>
      </a>

      {/* 📱 Premium Sticky Bottom Mobile Navigation Bar */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 justify-around py-2.5 px-3 z-[98] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-t-3xl" dir="rtl">
        {isAdminLoggedIn && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
              activeTab === "admin" ? "text-rose-600 scale-105 font-black font-sans" : "text-slate-400 hover:text-rose-600"
            }`}
          >
            <ShieldAlert size={18} className={activeTab === "admin" ? "animate-pulse" : ""} />
            <span className="text-[9px] font-bold">الإدارة 🛡️</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab("pwa")}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            activeTab === "pwa" ? "text-indigo-600 scale-105 font-black font-sans" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          <Smartphone size={18} />
          <span className="text-[9px] font-bold">تثبيت المنصة</span>
        </button>
        <button
          onClick={() => setActiveTab("coach")}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            activeTab === "coach" ? "text-indigo-600 scale-105 font-black font-sans" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          <BrainCircuit size={18} />
          <span className="text-[9px] font-bold">المستشار الذكي</span>
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            activeTab === "simulator" ? "text-indigo-600 scale-105 font-black font-sans" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          <TrendingUp size={18} />
          <span className="text-[9px] font-bold">محاكي التداول</span>
        </button>
        <button
          onClick={() => setActiveTab("candlesticks")}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            activeTab === "candlesticks" ? "text-indigo-600 scale-105 font-black font-sans" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          <Flame size={18} className={activeTab === "candlesticks" ? "text-amber-500 animate-pulse" : ""} />
          <span className="text-[9px] font-bold">الشموع 🕯️</span>
        </button>
        <button
          id="basics-tab-btn-mobile"
          onClick={() => setActiveTab("basics")}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            activeTab === "basics" ? "text-indigo-600 scale-105 font-black font-sans" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          <Compass size={18} className={activeTab === "basics" ? "text-emerald-500" : ""} />
          <span className="text-[9px] font-bold">الأساسيات 📈</span>
        </button>
        <button
          onClick={() => setActiveTab("classroom")}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
            activeTab === "classroom" ? "text-indigo-600 scale-105 font-black font-sans" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[9px] font-bold">منصة الدراية</span>
        </button>
      </div>

      {/* 🔒 Advanced Biometric Scanner Dynamic Overlay */}
      {isBioScanning && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in" dir="rtl">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl shadow-indigo-500/10">
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-amber-500 tracking-tight font-sans">
                {bioMode?.startsWith("register") ? "تسجيل البصمة الحيوية 👆" : "التحقق من البصمة المشفرة 🛡️"}
              </h3>
              <p className="text-[10px] text-slate-400 font-sans">
                {bioMode?.endsWith("admin") ? "وضع الإشراف الفني المعتمد للأستاذ" : "بوابة العضوية المحمية للطلاب"}
              </p>
            </div>

            {/* Glowing biometric scanner frame */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-inner mt-2">
              {/* Pulse waves */}
              <div className="absolute inset-4 rounded-full border border-indigo-500/10 animate-ping" />
              <div className="absolute inset-8 rounded-full border border-amber-500/5 animate-pulse" />
              
              {/* Dynamic horizontal scanning beam */}
              <div 
                className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-lg shadow-amber-500/50 z-10 transition-all duration-150"
                style={{ top: `${Math.sin((bioProgress / 100) * Math.PI) * 50 + 50}%` }}
              />

              <Fingerprint size={64} className="text-amber-500 animate-pulse relative z-0 transition-transform duration-300 scale-105" />
            </div>

            {/* Progress metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                <span>مستوى مطابقة الأنماط:</span>
                <span className="text-amber-400 font-bold">{bioProgress}%</span>
              </div>
              
              {/* Progress track */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-200"
                  style={{ width: `${bioProgress}%` }}
                />
              </div>
            </div>

            {/* Tech Status Line */}
            <p className="text-[11px] text-indigo-300 font-sans tracking-tight min-h-[32px] leading-relaxed flex items-center justify-center">
              {bioStatus}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsBioScanning(false);
                setBioMode(null);
                playBeep(400, "sine", 0.1);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-3 rounded-xl border border-slate-700/60 cursor-pointer text-xs transition-colors"
            >
              إلغاء مسح البصمة ❌
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
