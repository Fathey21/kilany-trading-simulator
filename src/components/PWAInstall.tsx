/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Download, Monitor, Smartphone, Check, ArrowLeft, ArrowRight, Laptop, HelpCircle } from "lucide-react";

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStep, setInstallStep] = useState<"choose" | "android" | "ios" | "pc">("choose");

  useEffect(() => {
    // Check if or already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm transition-all text-right" id="pwa-installer">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 text-indigo-600 font-bold mb-2">
            <span className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold">تطبيق خفيف ومثالي</span>
            <Download size={18} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-850 font-sans">تثبيت تطبيق "أكاديمية الكيلاني" على جهازك</h2>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            لا داعي للمتاجر الرسمية! يمكنك تنزيل منصة التداول والتعليم مباشرة كـتطبيق PWA خفيف الحجم وسريع الاستجابة على هاتفك أو كمبيوترك بنقرة واحدة.
          </p>
        </div>

        {isInstalled ? (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700">
            <div className="bg-emerald-600 text-white p-2 rounded-full shadow-sm">
              <Check size={20} className="stroke-[3]" />
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">التطبيق مثبت بالفعل!</p>
              <p className="text-xs text-emerald-700/80">أنت تتصفح الأكاديمية عبر نسختها الخاصة بالأجهزة الآن.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {deferredPrompt && (
              <button
                onClick={handleNativeInstall}
                className="bg-indigo-600 hover:bg-indigo-705 active:scale-95 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/15"
                id="native-install-btn"
              >
                <Download size={18} />
                تثبيت ذكي الآن
              </button>
            )}
            <button
              onClick={() => setInstallStep(installStep === "android" ? "choose" : "android")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                installStep === "android"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 text-slate-655 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Smartphone size={14} />
              للأندرويد
            </button>
            <button
              onClick={() => setInstallStep(installStep === "ios" ? "choose" : "ios")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                installStep === "ios"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 text-slate-655 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Smartphone size={14} />
              للآيفون (iOS)
            </button>
            <button
              onClick={() => setInstallStep(installStep === "pc" ? "choose" : "pc")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                installStep === "pc"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-slate-50 text-slate-655 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Monitor size={14} />
              للكمبيوتر ويندوز/ماك
            </button>
          </div>
        )}
      </div>

      {installStep !== "choose" && !isInstalled && (
        <div className="mt-4 pt-4 border-t border-slate-150 text-right text-sm text-slate-700 transition-all">
          {installStep === "android" && (
            <div className="space-y-2">
              <span className="text-amber-600 font-extrabold block text-xs">📱 خطوات تثبيت أندرويد (متصفح كروم / سامسونج):</span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-500">
                <li>اضغط على زر <span className="text-indigo-700 font-extrabold">القائمة (الثلاث نقاط)</span> بأعلى أو أسفل المتصفح.</li>
                <li>اختر <span className="text-indigo-700 font-extrabold">"إضافة إلى الشاشة الرئيسية"</span> أو <span className="text-indigo-700 font-extrabold">"تثبيت التطبيق"</span>.</li>
                <li>ستظهر أيقونة الأكاديمية على سطح هاتفك كتطبيق حقيقي خفيف للغاية وسريع التصفح!</li>
              </ol>
            </div>
          )}

          {installStep === "ios" && (
            <div className="space-y-2">
              <span className="text-amber-600 font-extrabold block text-xs">🍎 خطوات تثبيت الآيفون والآيباد (متصفح سفاري Safari):</span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-500">
                <li>افتح هذا الرابط على متصفح <span className="text-indigo-700 font-semibold">سفاري الافتراضي</span>.</li>
                <li>اضغط على زر <span className="text-indigo-700 font-extrabold">قائمة المشاركة 📤 (الأيقونة في الأسفل على شكل سهم لأعلى)</span>.</li>
                <li>اسحب الخيارات لأسفل واضغط على زر <span className="text-indigo-700 font-extrabold">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</span>.</li>
                <li>اضغط "إضافة" في الأعلى، وتم! سيظهر كتطبيق على جهازك.</li>
              </ol>
            </div>
          )}

          {installStep === "pc" && (
            <div className="space-y-2">
              <span className="text-amber-600 font-extrabold block text-xs">💻 خطوات تثبيت الكمبيوتر (كروم أو إيدج على Windows/Mac):</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                انظر لشريط العنوان في الأعلى بالمتصفح، ستلاحظ أيقونة <span className="text-indigo-700 font-semibold">شاشة عليها سهم للأسفل ⬇️</span> أو اضغط على خيارات المتصفح ثم <span className="text-indigo-700 font-extrabold">"تثبيت التطبيق" (Install App)</span> ليتم تنزيله وتثبيته فوراً كنافذة مستقلة فائقة السرعة.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
