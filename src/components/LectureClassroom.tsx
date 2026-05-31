/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  GraduationCap, 
  Video, 
  CheckCircle, 
  PlusCircle, 
  Award, 
  Trophy, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  Youtube, 
  Trash2, 
  Eye, 
  CircleDot,
  FileText,
  Presentation,
  UploadCloud,
  Download,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  File,
  Users,
  Lock,
  Edit,
  Fingerprint,
  ShieldCheck
} from "lucide-react";
import { Course, Lesson, QuizQuestion } from "../types";
import { PRELOADED_COURSES } from "../data";
import AIVideoAcademy from "./AIVideoAcademy";

function PdfViewer({ lesson }: { lesson: Lesson }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 3;

  const getPageContent = (pageNum: number) => {
    switch (pageNum) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">الفصل الأول: البنية الأساسية والمقدمة الفنية</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              يرتكز مفهوم {lesson.title} على فهم ديناميكيات السيولة داخل الأسواق المالية. من خلال قراءة حركة السعر (Price Action)، يمكن للمتداول تحديد مناطق الدعم والمقاومة الجوهرية التي يتصارع فيها المشترون والبائعون.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 font-bold">
              💡 قاعدة الكيلاني الأساسية: السعر لا يتحرك عشوائيًا بل يتبع دائمًا مراكز السيولة ومناطق تجمع طلبات كبار المؤسسات المالية.
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              إن الهدف من هذا الملف التعليمي هو وضع دليل عملي مبسط بين يديك للرجوع إليه أثناء التداول الحي والمباشر دون الحاجة لتشغيل مواد مرئية طويلة.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">الفصل الثاني: شروط التطبيق الميداني والخطوات العملية</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              لتطبيق هذه الاستراتيجية المتقدمة بنجاح، يجب استيفاء الشروط الأربعة التالية بالترتيب الدقيق:
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono mt-0.5">1</span>
                <span>مراقبة الفريم الزمني الأكبر (مثال: فريم الأربع ساعات أو اليومي) لتحديد الاتجاه العام (Trend).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono mt-0.5">2</span>
                <span>تحديد منطقة التذبذب السعري أو النطاق العرضي وتعيين حدوده بدقة متناهية.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono mt-0.5">3</span>
                <span>انتظار تأكيد الإغلاق بشمعة كاملة خارج النطاق بجهود شرائية أو بيعية واضحة (Volume Spikes).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold font-mono mt-0.5">4</span>
                <span>وضع أمر الشراء/البيع المباشر مع تحديد الوقف الفني الآمن أسفل ذيل شمعة الاختراق مباشرة.</span>
              </li>
            </ul>
          </div>
        );
      case 3:
      default:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">الفصل الثالث: إدارة المخاطر وتجنب المصائد السعرية</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              إن الاختراقات الكاذبة هي شريك دائم في أسواق المال. لذلك، تذكر دوماً حماية رأس مالك:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-center">
                <span className="block text-[10px] text-red-500 font-extrabold max-w-full">صمام الأمان (Stop Loss)</span>
                <p className="text-[9px] text-slate-500 mt-1">يجب ألا تتجاوز نسبة الخسارة في الصفقة الواحدة 1% إلى 2% من إجمالي المحفظة.</p>
              </div>
              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-center">
                <span className="block text-[10px] text-emerald-600 font-extrabold max-w-full">معدل العائد للمخاطرة (RRR)</span>
                <p className="text-[9px] text-slate-500 mt-1">احرص على ألا تقل النسبة المستهدفة عن 1:2 لتغطية الصفقات الخاسرة عشوائياً.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed text-right mt-2 font-sans md:text-right">
              نشكرك على مراجعة دليل الدرس. نوصيك الآن بحل الكويز السريع لتوثيق نقاط التدريب وتثبيتها في ذهنك.
            </p>
          </div>
        );
    }
  };

  const downloadSimulatedFile = () => {
    alert(`📥 جاري تحميل المستند التدريبي: "${lesson.attachmentUrl || 'درس_التداول_أكاديمية_الكيلاني.pdf'}"... تم التحميل بنجاح في جهازك!`);
  };

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full min-h-[360px] text-right">
      {/* PDF Header bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs font-sans">
        <button
          onClick={downloadSimulatedFile}
          className="bg-indigo-650 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer text-[10px]"
        >
          <Download size={12} />
          تحميل كـ PDF 📁
        </button>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-[9px]">زوم: {zoom}%</span>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button 
              onClick={() => setZoom(Math.max(75, zoom - 25))} 
              className="px-1.5 py-0.5 font-bold text-slate-600 hover:bg-slate-200 rounded text-[10px] cursor-pointer"
            >
              -
            </button>
            <button 
              onClick={() => setZoom(Math.min(150, zoom + 25))} 
              className="px-1.5 py-0.5 font-bold text-slate-600 hover:bg-slate-200 rounded text-[10px] cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-slate-650 font-semibold text-[11px] font-sans">مستعرض الدليل التدريبي</span>
          <FileText className="text-rose-500 fill-rose-50" size={16} />
        </div>
      </div>

      {/* Actual Simulated PDF Page */}
      <div className="flex-1 p-6 flex justify-center items-center overflow-auto bg-slate-200/50">
        <div 
          className="bg-white shadow-lg border border-slate-250 p-6 rounded-lg w-full max-w-sm sm:max-w-md text-right transition-all duration-300 transform"
          style={{ width: `${zoom}%` }}
        >
          {/* Page top brand */}
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2 mb-4">
            <span className="text-[8px] text-slate-400 font-mono">أكاديمية الكيلاني للتداول الذكي</span>
            <span className="text-[8px] text-indigo-700 font-bold font-sans">مستند دراسة معتمد</span>
          </div>

          <h3 className="text-xs text-indigo-650 font-bold mb-1 font-mono uppercase bg-indigo-50 inline-block px-1.5 py-0.5 rounded">الكيلاني - المرجع الفني</h3>
          <h2 className="text-md font-extrabold text-slate-900 font-sans mb-3 text-right">{lesson.title}</h2>

          {/* Render the dynamically resolved chapter */}
          {getPageContent(currentPage)}

          {/* Footer watermark */}
          <div className="mt-6 pt-2 border-t border-slate-101 flex justify-between items-center text-[8px] text-slate-400">
            <span>حقوق الطبع محفوظة © 2026</span>
            <span>صفحة {currentPage} من {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Pages switcher footer */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-center gap-4 text-xs">
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="p-1 px-2 border border-slate-205 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:border-slate-200 disabled:text-slate-400 rounded-lg transition-all flex items-center gap-1 font-sans cursor-pointer text-[10px]"
        >
          <ChevronRight size={14} />
          <span>التالي</span>
        </button>

        <span className="text-[11px] font-bold text-slate-700 font-sans">
          صفحة {currentPage} من {totalPages}
        </span>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="p-1 px-2 border border-slate-205 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:border-slate-200 disabled:text-slate-400 rounded-lg transition-all flex items-center gap-1 font-sans cursor-pointer text-[10px]"
        >
          <span>السابق</span>
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
}

function PptViewer({ lesson }: { lesson: Lesson }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalSlides = 4;

  // Autoplay handler
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const slideContents = [
    {
      title: lesson.title,
      subtitle: "دورة تداول احترافية - أكاديمية الكيلاني",
      badge: "عرض تقديمي شامل",
      body: (
        <div className="text-center py-6 space-y-4">
          <div className="inline-block bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold font-sans">
            🌟 مرحباً بك في المعرفة التدريبية الفائقة
          </div>
          <h2 className="text-md md:text-lg font-extrabold text-white font-sans max-w-md mx-auto leading-relaxed">
            {lesson.title}
          </h2>
          <p className="text-xs text-indigo-200 max-w-sm mx-auto leading-relaxed">
            هذا الدليل والمخلص التفاعلي تم إعداده خصيصاً لمساعدتك على إتقان الأدوات الفنية وصقل مهاراتك بشكل احترافي.
          </p>
          <div className="text-[10px] text-slate-400 py-2">
            انقر على أسهم التبديل التفاعلية بالأسفل لاستعراض كافة شرائح الدرس.
          </div>
        </div>
      )
    },
    {
      title: "أهداف الدرس الأكاديمية",
      subtitle: "ماذا سنحقق من هذا المبحث؟",
      badge: "أهداف المحاضرة",
      body: (
        <div className="space-y-3 py-2 text-right">
          <p className="text-xs text-indigo-205 mb-3 leading-relaxed">
            يهدف هذا الدرس إلى نقلك من المستوى النظري العادي لأسواق المال إلى الفهم الفني العميق:
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-indigo-900/30">
              <CheckCircle size={14} className="text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-100 font-sans font-semibold">استيعاب الهيكل الدقيق لحركة السعر (Price Action) وتحديد الاتجاه العام.</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-indigo-900/30">
              <CheckCircle size={14} className="text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-100 font-sans font-semibold">تحديد الثغرات ونقاط الانعكاس المحتملة التي تتميز بعائد مخاطرة ممتاز.</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-indigo-900/30">
              <CheckCircle size={14} className="text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-100 font-sans font-semibold">مقاومة العواطف السلبية مثل الخوف والـ FOMO من خلال خطة مسبقة للإغلاق والوقف.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "مخطط الشمعة اليابانية التوضيحي",
      subtitle: "قراءة بنية الشمعة باحترافية",
      badge: "نموذج توضيحي تفاعلي",
      body: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1 items-center">
          {/* Custom rendered candlestick inside slide! */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center select-none shadow-inner">
            <span className="text-[9px] text-emerald-400 font-bold mb-1 font-mono">أعلى سعر (High)</span>
            <div className="w-0.5 h-6 bg-emerald-400" />
            <div className="w-10 bg-gradient-to-b from-emerald-500 to-emerald-700 border-2 border-emerald-400 rounded p-1 text-center shadow-md">
              <span className="text-[9px] text-white font-extrabold block">جسم الشمعة صاعد</span>
            </div>
            <div className="w-0.5 h-6 bg-emerald-400" />
            <span className="text-[9px] text-emerald-400 font-bold mt-1 font-mono">أدنى سعر (Low)</span>
          </div>

          <div className="text-right space-y-2">
            <h5 className="text-xs font-bold text-amber-400 font-sans">💡 قراءة النموذج بالشكل السليم:</h5>
            <p className="text-[11px] text-slate-205 leading-relaxed font-sans">
              يمثل الذيل العلوي الطويل قوة البائعين في دفع السعر للأسفل، بينما يعكس الجسم الممتلئ باللون الأخضر سيطرة المشترين طوال مدة الشمعة.
            </p>
            <p className="text-[11px] text-indigo-300 leading-relaxed font-sans">
              القاعدة الذهبية للكيلاني: لا تتداول قبل إغلاق شمعة الفاصل الزمني المعتمد لضمان دقة الإشارة الفنية وتجنب الشراك.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "صيغة النجاح والخطوات العملية والتطبيقات",
      subtitle: "خاتمة وتكليف للتدريب الشخصي",
      badge: "استدعاء الفعل والمثابرة",
      body: (
        <div className="space-y-3 py-2 text-right">
          <p className="text-xs text-indigo-205 mb-2 font-sans">
            الآن بعد انتهاءك من هذا العرض، يوصى بالالتزام بالثلاثي الذهبي للتداول:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900 border border-indigo-950 p-2.5 rounded-xl text-center space-y-1">
              <span className="text-amber-400 text-xs font-extrabold block">1. التحليل أولاً</span>
              <p className="text-[9px] text-slate-300 leading-relaxed">حلل الأسواق دون الدخول الفوري بمدى ساعة.</p>
            </div>
            <div className="bg-slate-900 border border-indigo-950 p-2.5 rounded-xl text-center space-y-1">
              <span className="text-amber-400 text-xs font-extrabold block">2. تجربة حرة</span>
              <p className="text-[9px] text-slate-300 leading-relaxed">استخدم المحاكي في تكرار التجربة 10 مرات.</p>
            </div>
            <div className="bg-slate-900 border border-indigo-950 p-2.5 rounded-xl text-center space-y-1">
              <span className="text-amber-400 text-xs font-extrabold block">3. حل الكويز</span>
              <p className="text-[9px] text-slate-300 leading-relaxed">احصل على وسام المتداول بإجابة الاختبار.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const active = slideContents[currentSlide];

  return (
    <div className="bg-slate-950 border border-indigo-950 rounded-3xl overflow-hidden flex flex-col h-full min-h-[365px] text-right text-gray-100 relative shadow-2xl">
      {/* Slide Top bar info */}
      <div className="bg-slate-900/90 border-b border-indigo-950/60 px-5 py-3 flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-1.5 font-bold font-sans">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] cursor-pointer transition-colors ${
              isPlaying 
                ? "bg-amber-600 hover:bg-amber-700 text-white" 
                : "bg-slate-800 hover:bg-slate-700 text-indigo-200"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={12} />
                <span>إيقاف التشغيل التلقائي</span>
              </>
            ) : (
              <>
                <Play size={12} className="fill-current" />
                <span>تشغيل تلقائي للعرض</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] bg-indigo-950 border border-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
            {active.badge}
          </span>
          <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">شريحة {currentSlide + 1} من {totalSlides}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-extrabold text-[11px] font-sans">العرض التقديمي للكيلاني</span>
          <Presentation className="text-amber-400 fill-amber-400/10" size={16} />
        </div>
      </div>

      {/* Main Slide Screen Display box */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center select-none relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
        
        {/* Abstract slide watermark backdrop symbol */}
        <div className="absolute right-4 bottom-4 text-indigo-500 opacity-[0.03]">
          <Presentation size={150} />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="space-y-1.5 max-w-lg">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 font-mono">
              {active.subtitle}
            </h4>
            <h3 className="text-xs sm:text-sm font-extrabold text-white text-right leading-tight font-sans">
              {active.title}
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-transparent to-indigo-500 w-1/4 mt-1" />
          </div>

          <div className="min-h-[160px] flex flex-col justify-center pt-2">
            {active.body}
          </div>
        </div>
      </div>

      {/* Slide Navigation controls */}
      <div className="bg-slate-900/90 border-t border-indigo-950/60 px-5 py-3 flex items-center justify-between text-xs">
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
          className="p-1.5 border border-indigo-900 hover:border-indigo-500 text-indigo-300 hover:text-white rounded-xl transition-all flex items-center gap-1 font-sans cursor-pointer text-[10px]"
        >
          <ChevronRight size={14} />
          <span>الشريحة التالية</span>
        </button>

        {/* Slide progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide 
                  ? "bg-amber-400 scale-125 shadow-md shadow-amber-400/50" 
                  : "bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
          className="p-1.5 border border-indigo-900 hover:border-indigo-500 text-indigo-300 hover:text-white rounded-xl transition-all flex items-center gap-1 font-sans cursor-pointer text-[10px]"
        >
          <span>الشريحة السابقة</span>
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
}

export function LectureClassroom() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subTab, setSubTab] = useState<"courses" | "ai-videos">("courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  
  // Certificate states
  const [selectedCertCourse, setSelectedCertCourse] = useState<Course | null>(null);
  const [certificateName, setCertificateName] = useState("");
  const [watermarkPhone, setWatermarkPhone] = useState("");
  
  // Quiz evaluation states
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizState, setQuizState] = useState<"not_started" | "answering" | "finished">("not_started");

  // Premium course access states
  const [approvedCourseIds, setApprovedCourseIds] = useState<string[]>([]);
  const [showPaymentModalForCourse, setShowPaymentModalForCourse] = useState<Course | null>(null);
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Vodafone Cash");
  const [paymentScreenshotBase64, setPaymentScreenshotBase64] = useState<string | null>(null);
  const [paymentScreenshotName, setPaymentScreenshotName] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<{ id: string; name: string; details: string }[]>([]);
  const [levelPrices, setLevelPrices] = useState<Record<string, number>>({ basics: 450, analysis: 650, "risk-management": 850 });

  // Referrals states
  const [myReferrals, setMyReferrals] = useState<any[]>([]);
  const [copiedRefLink, setCopiedRefLink] = useState(false);
  const [referralUrlTemplate, setReferralUrlTemplate] = useState<string>("");
  const [clientFingerprintRegistered, setClientFingerprintRegistered] = useState(() => {
    return localStorage.getItem("kilany_student_fingerprint_registered") === "true";
  });

  // Admin form state for adding custom classes
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [hasAdminSecret, setHasAdminSecret] = useState(false);

  // Custom Teacher Gate Login states
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [teacherPasscodeInput, setTeacherPasscodeInput] = useState("");
  const [teacherLoginError, setTeacherLoginError] = useState("");

  useEffect(() => {
    const handleSync = () => {
      setClientFingerprintRegistered(localStorage.getItem("kilany_student_fingerprint_registered") === "true");
    };
    window.addEventListener("student-fingerprint-changed", handleSync);
    return () => window.removeEventListener("student-fingerprint-changed", handleSync);
  }, []);

  useEffect(() => {
    const syncSecret = async () => {
      const token = localStorage.getItem("kilany_admin_token");
      if (!token) {
        setHasAdminSecret(false);
        return;
      }
      try {
        const response = await fetch("/api/admin/verify-passcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: token })
        });
        if (response.ok) {
          setHasAdminSecret(true);
        } else if (response.status === 404) {
          // Fallback for static hosts (Netlify)
          setHasAdminSecret(token === "1112002" || token === "kilany2026");
        } else {
          setHasAdminSecret(false);
        }
      } catch (err) {
        setHasAdminSecret(token === "1112002" || token === "kilany2026");
      }
    };
    syncSecret();
    window.addEventListener("admin-token-changed", syncSecret);
    return () => window.removeEventListener("admin-token-changed", syncSecret);
  }, []);

  const handleAdminLockToggle = () => {
    if (hasAdminSecret) {
      setIsAdminMode(!isAdminMode);
    } else {
      setTeacherLoginError("");
      setTeacherPasscodeInput("");
      setShowTeacherLoginModal(true);
    }
  };
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDuration, setNewDuration] = useState("10:00");
  const [targetCourseId, setTargetCourseId] = useState("basics");
  const [newIsPaid, setNewIsPaid] = useState<boolean>(true);

  // States for adding dynamic new courses (Programming, Business, Trading, etc.)
  const [customCoursesMetadata, setCustomCoursesMetadata] = useState<Course[]>([]);
  const [adminSubTab, setAdminSubTab] = useState<"add-lesson" | "add-course">("add-lesson");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("برمجة");
  const [newCourseCustomCategory, setNewCourseCustomCategory] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseDifficulty, setNewCourseDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [newCourseEstTime, setNewCourseEstTime] = useState("12 ساعة");

  // States for Editing existing lessons
  const [editingLessonCourseId, setEditingLessonCourseId] = useState<string>("");
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  // New lecture attachment upload states
  const [attachmentType, setAttachmentType] = useState<"video" | "pdf" | "ppt">("video");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileSize, setUploadedFileSize] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Load courses and progress from the server database
  const loadCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const metadataRes = await fetch("/api/custom-courses-metadata");
      
      let customMeta: Course[] = [];
      if (metadataRes.ok) {
        customMeta = await metadataRes.json();
        setCustomCoursesMetadata(customMeta);
      }
      
      if (res.ok) {
        const customData = await res.json();
        const combined = [...PRELOADED_COURSES, ...customMeta].map(course => {
          const customLessons = customData[course.id] || [];
          return {
            ...course,
            lessons: [...(course.lessons || []), ...customLessons]
          };
        });
        setCourses(combined);
      } else {
        throw new Error("سيرفر المحاضرات غير متصل");
      }
    } catch (err) {
      console.warn("Using offline fallback local storage due to network", err);
      const savedCourses = localStorage.getItem("kilany_courses");
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      } else {
        setCourses(PRELOADED_COURSES);
      }
    }
  };

  const loadApprovedStatuses = async () => {
    try {
      const deviceId = localStorage.getItem("kilany_device_id");
      if (!deviceId) return;
      const res = await fetch(`/api/pay/status?sessionId=${deviceId}`);
      if (res.ok) {
        const body = await res.json();
        setApprovedCourseIds(body.approvedCourses || []);
      }
    } catch (e) {
      console.warn("Could not load approved premium course statuses:", e);
    }
  };

  const loadMyReferrals = async () => {
    try {
      const deviceId = localStorage.getItem("kilany_device_id");
      if (!deviceId) return;
      const res = await fetch(`/api/visitor/referrals?sessionId=${deviceId}`);
      if (res.ok) {
        const body = await res.json();
        setMyReferrals(body);
      }
    } catch (e) {
      console.warn("Could not load my referral records:", e);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendPaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentPhone.trim() || !paymentScreenshotBase64) {
      alert("الرجاء إدخال تفاصيل التحول وإرفاق صورة إيصال الدفع!");
      return;
    }
    setIsSubmittingPayment(true);
    try {
      const deviceId = localStorage.getItem("kilany_device_id");
      const response = await fetch("/api/pay/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: deviceId,
          courseId: showPaymentModalForCourse?.id,
          method: paymentMethod,
          studentPhone: paymentPhone,
          screenshot: paymentScreenshotBase64
        })
      });

      if (response.ok) {
        setPaymentSuccessMsg("🎉 تم إرسال طلب الاشتراك والمستندات بنجاح! جاري المراجعة والتحقق الفوري بواسطة الأستاذ كحيلاني وتفعيل مسارك التعليمي.");
        setPaymentPhone("");
        setPaymentScreenshotBase64(null);
        setPaymentScreenshotName("");
        loadApprovedStatuses();
      } else {
        const err = await response.json();
        alert(err.error || "خطأ أثناء محاولة إرسال المستندات للسيرفر.");
      }
    } catch (err) {
      console.error(err);
      alert("عذراً، فشل الاتصال بالسيرفر لإتمام إرسال الإيصال.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const isLessonLocked = (courseId: string, lesson: any, lessonIndex: number) => {
    if (hasAdminSecret) return false; // Mr. Elkilany gets everything free!
    
    // Explicit paid attribute
    if (lesson && lesson.isPaid !== undefined) {
      if (!lesson.isPaid) return false;
      return !approvedCourseIds.includes(courseId);
    }

    if (courseId === "basics" || courseId === "analysis") {
      if (lessonIndex === 0) return false; // First lesson is free
      return !approvedCourseIds.includes(courseId);
    }
    if (courseId === "risk-management") {
      return !approvedCourseIds.includes(courseId); // Level 3 is fully paid
    }
    return false;
  };

  const loadPaymentSettings = async () => {
    try {
      const response = await fetch("/api/payment-settings");
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.methods || []);
        setLevelPrices(data.prices || { basics: 450, analysis: 650, "risk-management": 850 });
        setReferralUrlTemplate(data.referralUrlTemplate || "");
        if (data.methods && data.methods.length > 0) {
          setPaymentMethod(data.methods[0].name);
        }
      }
    } catch (e) {
      console.warn("Could not load dynamic payment settings:", e);
    }
  };

  useEffect(() => {
    loadCourses();
    loadApprovedStatuses();
    loadMyReferrals();
    loadPaymentSettings();

    const savedProgress = localStorage.getItem("kilany_completed_lessons");
    if (savedProgress) {
      setCompletedLessonIds(JSON.parse(savedProgress));
    }

    // Attempt to load profile and set certificateName default auto-seeded
    const loadProfileAndSeed = async () => {
      try {
        const deviceId = localStorage.getItem("kilany_device_id");
        if (!deviceId) return;
        const res = await fetch("/api/visitor/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: deviceId })
        });
        if (res.ok) {
          const body = await res.json();
          if (body.studentName) {
            setCertificateName(body.studentName);
          }
          if (body.studentPhone) {
            setWatermarkPhone(body.studentPhone);
          }
        }
      } catch (e) {
        console.warn("Could not seed certificate name from real-live registration:", e);
      }
    };
    loadProfileAndSeed();

    // Refresh referral records on an interval so tree stays active in real-time
    const interval = setInterval(loadMyReferrals, 12000);
    return () => clearInterval(interval);
  }, []);

  // Save progress when user completes lessons
  const handleCompleteProgress = (lessonId: string) => {
    const nextCompleted = [...completedLessonIds];
    if (!nextCompleted.includes(lessonId)) {
      nextCompleted.push(lessonId);
      setCompletedLessonIds(nextCompleted);
      localStorage.setItem("kilany_completed_lessons", JSON.stringify(nextCompleted));
    }
  };

  const handleStartEditLesson = (courseId: string, lesson: any) => {
    setEditingLessonCourseId(courseId);
    setEditingLesson({ ...lesson });
  };

  const handleSaveEditedLesson = async () => {
    if (!editingLesson || !editingLessonCourseId) return;

    try {
      const res = await fetch("/api/courses/edit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-passcode": localStorage.getItem("kilany_admin_token") || ""
        },
        body: JSON.stringify({
          courseId: editingLessonCourseId,
          lessonId: editingLesson.id,
          updatedLesson: editingLesson
        })
      });

      if (res.ok) {
        const serverRes = await res.json();
        const combined = [...PRELOADED_COURSES, ...customCoursesMetadata].map(course => {
          const customLessons = serverRes.data[course.id] || [];
          return {
            ...course,
            lessons: [...(course.lessons || []), ...customLessons]
          };
        });

        setCourses(combined);
        localStorage.setItem("kilany_courses", JSON.stringify(combined));

        if (selectedLesson?.id === editingLesson.id) {
          setSelectedLesson(editingLesson);
        }
        
        const updatedSelectedCourse = combined.find((c) => c.id === (selectedCourse?.id || ""));
        if (updatedSelectedCourse) setSelectedCourse(updatedSelectedCourse);

        setEditingLesson(null);
        setEditingLessonCourseId("");
        alert("تم تعديل وحفظ بيانات المحاضرة بنجاح! 🎉");
      } else {
        const err = await res.json();
        alert(err.error || "فشل تعديل المحاضرة.");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء إجراء التعديل الفني.");
    }
  };

  const handleAddCustomLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("الرجاء ملء حقول العنوان والملخص كتابياً.");
      return;
    }

    // Standardize normal Youtube URLs to embedded versions automatically
    let cleanVideoUrl = newVideoUrl.trim();
    if (cleanVideoUrl.includes("watch?v=")) {
      const parts = cleanVideoUrl.split("watch?v=");
      const videoId = parts[1].split("&")[0];
      cleanVideoUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (cleanVideoUrl.includes("youtu.be/")) {
      const videoId = cleanVideoUrl.split("youtu.be/")[1].split("?")[0];
      cleanVideoUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (!cleanVideoUrl && attachmentType === "video") {
      // Sample direct placeholder video url
      cleanVideoUrl = "https://www.youtube.com/embed/F3QpgXBtDeo";
    }

    const newLesson: Lesson = {
      id: "custom-" + Date.now(),
      title: newTitle,
      description: newDesc,
      videoUrl: attachmentType === "video" ? cleanVideoUrl : "",
      duration: newDuration,
      content: newContent,
      attachmentType: attachmentType,
      attachmentUrl: (attachmentType === "pdf" || attachmentType === "ppt")
        ? (uploadedFileName || (attachmentType === "pdf" ? "دليل_التداول_الذكي.pdf" : "عرض_التحليل_الفني.pptx"))
        : "",
      isPaid: newIsPaid,
      quiz: [
        {
          id: "cq-" + Date.now(),
          question: `سؤال مخصص: ما هي الفكرة الأساسية من درس "${newTitle}"؟`,
          options: [
            "تطبيق الاستراتيجية وإدارة رأس المال بحذر لتفادي الخسائر",
            "الدخول بالرافعة المالية القصوى 100x فوراً وتصفية الحساب",
            "تجاهل نماذج الشموع اليابانية والاعتماد على الحظ والصدفة",
            "التداول دون وضع صمام الأمان لمنع تصف الحساب"
          ],
          correctAnswerIndex: 0
        }
      ]
    };

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-passcode": localStorage.getItem("kilany_admin_token") || ""
        },
        body: JSON.stringify({ courseId: targetCourseId, lesson: newLesson })
      });

      if (!response.ok) throw new Error();

      const serverRes = await response.json();
      const combined = [...PRELOADED_COURSES, ...customCoursesMetadata].map(course => {
        const customLessons = serverRes.data[course.id] || [];
        return {
          ...course,
          lessons: [...(course.lessons || []), ...customLessons]
        };
      });

      setCourses(combined);
      localStorage.setItem("kilany_courses", JSON.stringify(combined));

      // Reset Form
      setNewTitle("");
      setNewDesc("");
      setNewVideoUrl("");
      setNewContent("");
      setNewDuration("10:00");
      setAttachmentType("video");
      setUploadedFileName("");
      setUploadedFileSize("");
      setNewIsPaid(true);
      alert("تم نشر المحاضرة التعليمية على السيرفر بنجاح! سيتمكن الآن جميع الزوار والأعضاء المنضمين من تصفحها فورًا.");

      const updatedSelected = combined.find((c) => c.id === (selectedCourse?.id || ""));
      if (updatedSelected) setSelectedCourse(updatedSelected);
    } catch (err) {
      console.error(err);
      alert("فشل نشر المحاضرة على السيرفر المباشر.");
    }
  };

  const handleDeleteLesson = async (courseId: string, lessonId: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذه المحاضرة؟")) return;

    try {
      const response = await fetch("/api/courses/delete", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-passcode": localStorage.getItem("kilany_admin_token") || ""
        },
        body: JSON.stringify({ courseId, lessonId })
      });

      if (!response.ok) throw new Error();

      const serverRes = await response.json();
      const combined = [...PRELOADED_COURSES, ...customCoursesMetadata].map(course => {
        const customLessons = serverRes.data[course.id] || [];
        return {
          ...course,
          lessons: [...(course.lessons || []), ...customLessons]
        };
      });

      setCourses(combined);
      localStorage.setItem("kilany_courses", JSON.stringify(combined));

      if (selectedLesson?.id === lessonId) setSelectedLesson(null);
      const updatedSelected = combined.find((c) => c.id === (selectedCourse?.id || ""));
      if (updatedSelected) setSelectedCourse(updatedSelected);
      alert("تم حذف المحاضرة بنجاح من على السيرفر! 🗑️");
    } catch (err) {
      console.error(err);
      alert("فشل حذف المحاضرة من السيرفر المباشر.");
    }
  };

  const handleAddCustomCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim() || !newCourseDesc.trim()) {
      alert("الرجاء ملء عنوان المسار التعليمي ووصفه أولاً.");
      return;
    }

    const finalCategory = newCourseCategory === "custom" 
      ? (newCourseCustomCategory.trim() || "عام") 
      : newCourseCategory;

    // Unique course key
    const cleanId = "course-" + Date.now();

    const newCourseObj: Course = {
      id: cleanId,
      title: newCourseTitle.trim(),
      category: finalCategory,
      description: newCourseDesc.trim(),
      difficulty: newCourseDifficulty,
      estimatedTime: newCourseEstTime.trim(),
      lessons: []
    };

    try {
      const response = await fetch("/api/custom-courses-metadata", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-passcode": localStorage.getItem("kilany_admin_token") || ""
        },
        body: JSON.stringify({ course: newCourseObj })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل إنشاء المسار على السيرفر.");
      }

      alert("🎉 تم تأسيس المسار الأكاديمي المخصص بنجاح! يمكنك الآن نشر المحاضرات والفصول المتقدمة بداخله.");
      
      // Reset State
      setNewCourseTitle("");
      setNewCourseDesc("");
      setNewCourseEstTime("12 ساعة");
      setNewCourseCustomCategory("");
      setTargetCourseId(cleanId); // Auto switch dropdown target to this new course
      setAdminSubTab("add-lesson"); // Jump back to lessons publishing

      await loadCourses();
    } catch (err: any) {
      alert(err.message || "فشل إنشاء المسار التعليمي المخصص.");
    }
  };

  const handleDeleteCustomCourse = async (courseId: string) => {
    if (!window.confirm("🚨 هل أنت متأكد من حذف هذا المسار التعليمي بالكامل مع كافة محاضراته واختباراته المدرجة نهائياً؟")) return;

    try {
      const response = await fetch("/api/custom-courses-metadata/delete", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-passcode": localStorage.getItem("kilany_admin_token") || ""
        },
        body: JSON.stringify({ courseId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل حذف السجل.");
      }

      alert("🗑️ تم تنظيف وحذف المسار بالمنصة بنجاح.");
      setSelectedCourse(null);
      await loadCourses();
    } catch (err: any) {
      alert(err.message || "فشل إجراء عملية حذف السجل.");
    }
  };

  // Progress metrics calculation
  const totalLessonsCount = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedCount = completedLessonIds.filter((id) => 
    courses.some((c) => c.lessons.some((l) => l.id === id))
  ).length;

  const totalProgressPercentage = totalLessonsCount > 0 
    ? Math.round((completedCount / totalLessonsCount) * 100) 
    : 0;

  // Handle Quiz submissions
  const startQuizForLesson = (lesson: Lesson) => {
    if (!lesson.quiz || lesson.quiz.length === 0) return;
    setActiveQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizState("answering");
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuizQuestion = (lesson: Lesson) => {
    if (!lesson.quiz || selectedAnswer === null) return;

    const currentQuestion = lesson.quiz[activeQuizIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    const nextScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizScore(nextScore);

    if (activeQuizIndex + 1 < lesson.quiz.length) {
      setActiveQuizIndex(activeQuizIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizState("finished");
      const passed = nextScore === lesson.quiz.length;
      if (passed) {
        handleCompleteProgress(lesson.id);
      }
    }
  };

  return (
    <div className="space-y-6" id="classroom-platform">
      
      {/* ProgressBar & Certificate Board */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-right">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-500 fill-amber-200" />
            <h2 className="text-lg font-bold text-slate-800 font-sans">تتبع مسار تعلّمك للتداول</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            تم إكمال {completedCount} مغلقة من إجمالي {totalLessonsCount} درس متاح ({totalProgressPercentage}%)
          </span>
        </div>

        {/* Real progress line */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4 border border-slate-200">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${totalProgressPercentage}%` }}
          />
        </div>

        {/* Active badge */}
        {totalProgressPercentage === 100 && totalLessonsCount > 0 ? (
          <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-right flex-1 select-none">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white animate-bounce">
                <Award size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-md font-extrabold text-indigo-950">🎉 تبارك الله! لقد تخرّجت وحصلت على وسام "تداول مميز"!</h4>
                <p className="text-xs text-indigo-900 mt-1">لقد أتممت كافة الفصول بنجاح وحللت كافّة الاختبارات التفاعلية بنسبة 100%.</p>
              </div>
            </div>
            
            {/* Download/Share Cert */}
            <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl text-center shadow-md">
              <h5 className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold font-mono">الكيلاني - شهادة فخرية</h5>
              <p className="text-slate-800 text-xs font-bold mt-1">متداول محترف معتمد</p>
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-amber-500 my-1.5" />
              <p className="text-[9px] text-slate-400 font-medium">منصوح به بناءً على سجل التدريب</p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-sans">
            💡 أكمل جميع الفصول والاختبارات للحصول على وسام المتداول المحترف لـأكاديمية الكيلاني للتداول الذكي رسمياً ولفتح التحديات المتقدّمة!
          </div>
        )}
      </div>

      {/* Primary classroom view container */}
      {selectedCourse === null ? (
        <div className="space-y-6 text-right">
          
          {/* Sub Tab Switcher: Academy tracks vs AI video generator */}
          <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSubTab("courses");
                  if (isAdminMode) setIsAdminMode(false);
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  subTab === "courses" && !isAdminMode
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 shadow-xs"
                }`}
              >
                <BookOpen size={13} />
                <span>المسارات الأكاديمية الشاملة 📚</span>
              </button>
              
              <button
                onClick={() => {
                  setSubTab("ai-videos");
                  if (isAdminMode) setIsAdminMode(false);
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  subTab === "ai-videos" && !isAdminMode
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/10"
                    : "text-slate-600 hover:text-indigo-600 bg-white border border-slate-200"
                }`}
              >
                <Video size={13} />
                <span>شروحات الفيديو بالذكاء الاصطناعي 🤖🎬</span>
              </button>
            </div>

            <button
              onClick={handleAdminLockToggle}
              className="bg-white hover:bg-slate-50 text-indigo-650 hover:text-indigo-700 border border-slate-205 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <PlusCircle size={15} />
              {hasAdminSecret 
                ? (isAdminMode ? "الرجوع للفصول الدراسية 🎓" : "تحميل شرح يدوي (أستاذ الكيلاني) 🛠️") 
                : "بوابة المعلم (رفع محاضرات جديدة) 🛡️"
              }
            </button>
          </div>

          {isAdminMode ? (
            <div className="space-y-6">
              {/* Admin inner SubTab Switcher */}
              <div className="bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl flex items-center justify-start gap-2.5 shadow-sm animate-fade-in" dir="rtl">
                <button
                  type="button"
                  onClick={() => setAdminSubTab("add-lesson")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminSubTab === "add-lesson"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-indigo-650 bg-white border border-slate-200"
                  }`}
                >
                  <Video size={13} />
                  <span>نشر محاضرة/مادة جديدة 🎬</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminSubTab("add-course")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminSubTab === "add-course"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-indigo-650 bg-white border border-slate-200"
                  }`}
                >
                  <BookOpen size={13} />
                  <span>تأسيس مسار تعليمي جديد (برمجة، بيزنس...) 📚</span>
                </button>
              </div>

              {adminSubTab === "add-lesson" ? (
                /* Publish custom lectures screen */
                <form onSubmit={handleAddCustomLecture} className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-md text-right">
                  <h4 className="text-slate-800 font-bold text-md mb-2 flex items-center justify-end gap-2">
                    <span>نشر محاضرة تداول جديدة للأعضاء</span>
                    <BookOpen size={18} className="text-indigo-600" />
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 block">العنوان المطلوب للمحاضرة:</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="مثال: كيفية التداول بإستراتيجية الاختراق الكاذب"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 block">اختر فئة المسار التعليمي:</label>
                      <select
                        value={targetCourseId}
                        onChange={(e) => setTargetCourseId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-800 text-right outline-none cursor-pointer"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.title} [{c.category}]
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

              {/* Lecture Type Switcher */}
              <div className="space-y-1.5 pb-2">
                <label className="text-xs font-bold text-slate-700 block text-right">نوع المحاضرة المرفوع:</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttachmentType("video")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      attachmentType === "video"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    <Video size={15} />
                    <span>فيديو تعليمي (يوتيوب)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttachmentType("pdf")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      attachmentType === "pdf"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    <FileText size={15} />
                    <span>ملف تعليمي (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttachmentType("ppt")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      attachmentType === "ppt"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    <Presentation size={15} />
                    <span>عرض تقديمي (PowerPoint)</span>
                  </button>
                </div>
              </div>

              {/* Conditional Media Attachment Input Box */}
              {attachmentType === "video" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 block">رابط الفيديو (رابط يوتيوب أو فيديو مباشر):</label>
                    <input
                      type="url"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="مثال: https://www.youtube.com/watch?v=ZgRka0qP_fU"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 block">مدة الدرس:</label>
                      <input
                        type="text"
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        placeholder="مثال: 15:30"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 block">وصف قصير للغلاف:</label>
                      <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="شرح موجز يظهر للأعضاء من الخارج"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Elegant Drag-And-Drop / Click File Uploader */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs text-slate-500 block">
                      {attachmentType === "pdf" ? "رفع ملف المحاضرة (PDF / DOC):" : "رفع ملف العرض التقديمي (PowerPoint / PPTX):"}
                    </label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          setUploadedFileName(file.name);
                          setUploadedFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");
                        }
                      }}
                      onClick={() => document.getElementById("file-attachment-input")?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-indigo-600 bg-indigo-50/50"
                          : uploadedFileName 
                          ? "border-emerald-500 bg-emerald-50/10"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                      }`}
                    >
                      <input
                        id="file-attachment-input"
                        type="file"
                        accept={attachmentType === "pdf" ? ".pdf" : ".ppt,.pptx"}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedFileName(file.name);
                            setUploadedFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");
                          }
                        }}
                      />
                      
                      <div className="flex flex-col items-center justify-center space-y-2">
                        {uploadedFileName ? (
                          <>
                            <div className="bg-emerald-500 text-white p-2 text-center rounded-full shadow-md">
                              <CheckCircle size={18} className="stroke-[2.5]" />
                            </div>
                            <p className="text-xs font-bold text-emerald-800 font-sans line-clamp-1">{uploadedFileName}</p>
                            <p className="text-[10px] text-emerald-600 font-mono font-bold">الحجم التقريبي: {uploadedFileSize}</p>
                            <p className="text-[9px] text-slate-400">انقر لتغيير أو استبدال الملف المرفوع</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={24} className="text-indigo-600 hover:scale-105 transition-transform" />
                            <p className="text-xs font-bold text-slate-705">اسحب الملف وأفلته هنا أو تصفحه يدوياً</p>
                            <p className="text-[10px] text-slate-400">
                              يدعم صيغ
                              {attachmentType === "pdf" ? " PDF, DOC " : " PPTX, PPT "}
                              بحد أقصى 50 ميجابايت
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 block">عدد الصفحات / مدة القراءة:</label>
                      <input
                        type="text"
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        placeholder="مثال: 12 صفحة أو 15 دقيقة"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 block">وصف قصير للغلاف:</label>
                      <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="شرح موجز يظهر للأعضاء من الخارج"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-500 block">ملخص المقالة التعليمية والتحليلات بالشرح الكامل للدراسة (يدعم التنسيقات):</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="اكتب بالتفصيل هنا الشرح الأكاديمي، نصائح استخراج الأنماط، ومفاتيح الاستراتيجية لتظهر للعضو ويقرأها بعناية..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none text-right"
                />
              </div>

              {/* Paid Status choice during lesson publication */}
              <div className="space-y-1.5 text-right pb-2">
                <label className="text-xs font-bold text-slate-700 block text-right">خيار التسعير والوصول للمحاضرة:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewIsPaid(false)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      !newIsPaid
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    🔓 مجانية لكافة الزوار والأعضاء
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewIsPaid(true)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      newIsPaid
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-extrabold"
                        : "bg-slate-50 border-slate-100 text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    🔒 مدفوعة (تتطلب تفعيل المسار)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                حفظ ونشر المحاضرة للأعضاء الآن
              </button>
            </form>
          ) : (
            /* CREATE NEW COURSE / TRACK FORM */
            <form onSubmit={handleAddCustomCourse} className="bg-white border border-indigo-200 p-6 rounded-3xl space-y-5 shadow-lg text-right animate-fade-in" dir="rtl">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-slate-900 font-black text-sm flex items-center gap-2 font-sans">
                    <BookOpen className="text-indigo-600" size={18} />
                    <span>تأسيس مسار أكاديمي جديد للمنصة (برمجة، تجارة، بيزنس...)</span>
                  </h4>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    قم بتسجيل وتعميم تخصصات جديدة تماماً في الأكاديمية وإدراج المحاضرات واختبارات التشغيل بداخلها.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">عنوان المسار التعليمي الجديد:</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="مثال: دبلومة البرمجة بلغة جافا سكريبت وتطوير الويب"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">التصنيف أو التخصص الرئيسي:</label>
                  <div className="flex gap-2">
                    <select
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none w-1/3 cursor-pointer"
                    >
                      <option value="برمجة">برمجة 💻</option>
                      <option value="تجارة">تجارة 📈</option>
                      <option value="بيزنس">بيزنس وإدارة 💼</option>
                      <option value="تسويق">تسويق إلكتروني 📣</option>
                      <option value="تداول">تداول وأسواق مال 📊</option>
                      <option value="custom">تصنيف مخصص... ✍️</option>
                    </select>
                    {newCourseCategory === "custom" ? (
                      <input
                        type="text"
                        required
                        value={newCourseCustomCategory}
                        onChange={(e) => setNewCourseCustomCategory(e.target.value)}
                        placeholder="اكتب اسم التصنيف المخصص..."
                        className="bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-805 text-right outline-none flex-1 font-sans"
                      />
                    ) : (
                      <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 flex items-center justify-center flex-1 font-sans font-bold">
                        القسم المختار: {newCourseCategory}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">مستوى الصعوبة المقترح للمسار الدراسي:</label>
                  <select
                    value={newCourseDifficulty}
                    onChange={(e) => setNewCourseDifficulty(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none cursor-pointer"
                  >
                    <option value="beginner">مبتدئ (Beginner) 🟢</option>
                    <option value="intermediate">متوسط (Intermediate) 🟡</option>
                    <option value="advanced">متقدم (Advanced) 🔴</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">المدة المقدرة لإكمال المسار:</label>
                  <input
                    type="text"
                    required
                    value={newCourseEstTime}
                    onChange={(e) => setNewCourseEstTime(e.target.value)}
                    placeholder="مثال: 15 ساعة أو 4 أسابيع"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">شرح تعريفي مبسط وخلفية للمسار:</label>
                <textarea
                  rows={3}
                  required
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="صف للأعضاء بكلمات واضحة ما الذي سيتعلمونه في هذا التخصص وما الفائدة العملية منه..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-800 text-right outline-none text-right font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer shadow-md text-xs flex items-center justify-center gap-2"
              >
                <PlusCircle size={15} />
                <span>تأسيس هذا التخصص وحفظه بمسارات الأكاديمية 🚀</span>
              </button>
            </form>
          )}
        </div>
      ) : subTab === "ai-videos" ? (
        <AIVideoAcademy />
      ) : (
            <>
              {/* General Courses grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => {
                const isCompletedCourse = course.lessons.every((l) => completedLessonIds.includes(l.id));
                const completedCountCourse = course.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md p-5 rounded-3xl transition-all duration-200 cursor-pointer group flex flex-col justify-between text-right"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                          course.difficulty === "beginner" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          course.difficulty === "intermediate" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        }`}>
                          {course.difficulty === "beginner" ? "مبتدئ" :
                           course.difficulty === "intermediate" ? "متوسط" : "متقدم"}
                        </span>
                        
                        <div className="text-slate-400 text-xs flex items-center gap-1">
                          <span>{course.estimatedTime}</span>
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors font-sans line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-401 font-mono">
                          {completedCountCourse} من أصل {course.lessons.length} دروس مكتملة
                        </span>
                        <div className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1">
                          دخول المسار
                          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {isCompletedCourse && course.lessons.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCertCourse(course);
                          }}
                          className="w-full mt-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer active:scale-95 transition-all"
                        >
                          <Trophy size={14} className="animate-spin duration-1000" />
                          <span>استخرج شهادة التقدير بنجاح 🏆</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Referral Tree & Share Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-500/20 p-6 rounded-3xl text-white text-right shadow-xl space-y-5 mt-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                    <Users size={22} />
                  </div>
                  <div>
                    <h4 className="text-md sm:text-lg font-black leading-tight font-sans">برنامج سفراء الكيلاني (التسويق بالعمولة والشجرة الإلكترونية) 🤝</h4>
                    <p className="text-xs text-indigo-200 mt-1">شارك الأكاديمية مع أصدقائك وتتبع شبكتك الإلكترونية لزيادة نسبة أرباحك وتتبع المشاهدات!</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Share link input */}
                <div className="bg-indigo-950/40 border border-indigo-500/10 rounded-2xl p-4 space-y-3">
                  <label className="text-xs text-indigo-300 font-bold block">رابط الإحالة المباشر الخاص بك للشراكة:</label>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    انسخ هذا الرابط الفردي وشاركه مع زوارك. أي زائر يدخل المنصة من خلالك سيسجل فوراً في شبكتك وسيظهر ضمن الشجرة الإلكترونية والتحليلات الخاصة بك!
                  </p>
                  <div className="flex overflow-hidden bg-slate-900 rounded-xl border border-indigo-900/50 p-1">
                    <button
                      onClick={() => {
                        const studentId = localStorage.getItem("kilany_device_id") || "student";
                        const link = referralUrlTemplate && referralUrlTemplate.trim() !== ""
                          ? (referralUrlTemplate.toLowerCase().includes("{id}")
                              ? referralUrlTemplate.replace(/\{id\}/gi, studentId)
                              : referralUrlTemplate + (referralUrlTemplate.includes("?") ? "&" : "?") + "ref=" + studentId)
                          : window.location.origin + "?ref=" + studentId;
                        navigator.clipboard.writeText(link);
                        setCopiedRefLink(true);
                        setTimeout(() => setCopiedRefLink(false), 3000);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer shrink-0"
                    >
                      {copiedRefLink ? "✅ تم النسخ!" : "نسخ الرابط 🔗"}
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={
                        referralUrlTemplate && referralUrlTemplate.trim() !== ""
                          ? (referralUrlTemplate.toLowerCase().includes("{id}")
                              ? referralUrlTemplate.replace(/\{id\}/gi, localStorage.getItem("kilany_device_id") || "student")
                              : referralUrlTemplate + (referralUrlTemplate.includes("?") ? "&" : "?") + "ref=" + (localStorage.getItem("kilany_device_id") || "student"))
                          : window.location.origin + "?ref=" + (localStorage.getItem("kilany_device_id") || "student")
                      }
                      className="w-full bg-transparent border-none outline-none text-left text-xs font-mono text-indigo-200 px-3 flex-1 select-all"
                    />
                  </div>
                </div>

                {/* Technician Edit Referral URL Template */}
                {hasAdminSecret && (
                  <div className="bg-slate-900 border border-amber-550/20 rounded-2xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-500 font-sans tracking-tight flex items-center gap-1.5 justify-start">
                        <span>🛡️ قالب رابط الإحالة (خاص بالفنيين والمعلمين)</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-1 leading-relaxed">
                        يمكنك تعديل الرابط الذي تُبنى عليه إحالات الأعضاء وسفراء الأكاديمية بالكامل. استخدم الرمز <code className="text-amber-400 font-mono font-bold font-sans">{`{id}`}</code> لتحديد موقع رقم العضو التعريفي في الرابط لتجنب الخلط.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <input
                        type="text"
                        value={referralUrlTemplate}
                        onChange={(e) => setReferralUrlTemplate(e.target.value)}
                        placeholder="مثال: https://al-kilany-academy.com/?ref={id}"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-amber-500 transition-all text-left"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const passcode = localStorage.getItem("kilany_admin_token") || "";
                            const res = await fetch("/api/payment-settings/update-referral", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
                              body: JSON.stringify({ referralUrlTemplate })
                            });
                            if (res.ok) {
                              alert("✅ تم حفظ وتحديث قالب رابط الإحالة بنجاح في النظام!");
                            } else {
                              const err = await res.json();
                              alert(err.error || "فشل التحديث.");
                            }
                          } catch (e) {
                            alert("حدث خطأ أثناء تعديل قالب رابط الإحالة.");
                          }
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md select-none shrink-0"
                      >
                        حفظ القالب 💾
                      </button>
                    </div>
                  </div>
                )}

                {/* Electronics Tree referrals view */}
                <div className="bg-slate-950/60 border border-indigo-550/10 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs text-amber-400 font-black mb-1 select-none flex items-center justify-end gap-1.5 font-sans">
                      <span>الشجرة الإلكترونية للأعضاء المسجلين عبر رابطك</span>
                      <Award size={14} />
                    </h5>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed mb-3">
                      تتضمن هذه الشجرة قائمة حية بالأعضاء النشطين الذين قاموا بزيارة الأكاديمية تحت اسمك.
                    </p>
                  </div>

                  {myReferrals.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                      🔍 لم يسجل أي عضو عبر الرابط الخاص بك بعد.
                      <span className="block text-[10px] text-indigo-300 mt-1 font-sans">ابدأ بمشاركة الرابط وسيبدأون بالظهور هنا وفي لوحة الأرباح فوراً!</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                      {myReferrals.map((item, idx) => (
                        <div key={idx} className="bg-indigo-950/40 border border-indigo-900/30 p-2.5 rounded-xl flex items-center justify-between gap-2.5 text-right font-sans">
                          <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">نشط بالشبكة ✓</span>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-200 font-mono">ID: {item.sessionId.substring(15, 23)}</p>
                            <p className="text-[9px] text-slate-400 font-sans">الموقع: {item.location} | متصفح: {item.activeTab}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 🔒 Biometrics FaceID / TouchID Student Panel */}
              <div className="mt-5 bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/10 rounded-2xl p-5 text-right font-sans">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-right w-full">
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl shrink-0">
                      <Fingerprint size={24} className="animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-amber-400 flex items-center justify-start gap-1.5">
                        <span>تسجيل بصمة الإصبع الحالية للجهاز للدخول السريع 👆</span>
                        {clientFingerprintRegistered && (
                          <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black animate-pulse">فوري ونشط 🛡️</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        قم بربط حساب الطالب الخاص بك بمستشعر البصمة الحيوي المدمج بالهاتف أو الحاسب لتتمكن من الدخول الفوري دون إعاقة لإدخال الاسم أو الهاتف يدوياً في المرات القادمة!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const studentName = certificateName || localStorage.getItem("kilany_remembered_credential") || "student";
                        window.dispatchEvent(new CustomEvent("register-student-fingerprint", {
                          detail: { name: studentName }
                        }));
                      }}
                      className="w-full md:w-auto shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-3 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 shadow-md shadow-amber-500/10"
                    >
                      <Fingerprint size={14} />
                      <span>{clientFingerprintRegistered ? "إعادة تسجيل البصمة 🔄" : "تسجيل بصمة الإصبع 👆"}</span>
                    </button>

                    {clientFingerprintRegistered && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("kilany_student_fingerprint_registered");
                          localStorage.removeItem("kilany_student_fingerprint_credential");
                          window.dispatchEvent(new Event("student-fingerprint-changed"));
                          alert("🗑️ تم إلغاء تنشيط بصمة الدخول السريع لهذا الجهاز بنجاح.");
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3.5 py-3 rounded-xl border border-slate-700 cursor-pointer transition-all active:scale-95 shrink-0"
                        title="إيقاف البصمة"
                      >
                        إلغاء البصمة ❌
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
          )}
        </div>
      ) : (
        /* Inside Course Dashboard Screen */
        <div className="space-y-6 text-right">
          {/* Dashboard control back */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedCourse(null);
                setSelectedLesson(null);
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-bold text-xs px-4 py-2 rounded-xl border border-slate-250 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <ArrowRight size={14} />
              رجوع للفصول الكاملة
            </button>
            <div className="flex items-center gap-3">
              {hasAdminSecret && customCoursesMetadata.some(c => c.id === selectedCourse.id) && (
                <button
                  type="button"
                  onClick={() => handleDeleteCustomCourse(selectedCourse.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Trash2 size={12} />
                  <span>حذف هذا المسار 🗑️</span>
                </button>
              )}
              <div className="text-right">
                <h3 className="text-base font-bold text-slate-850 font-sans">{selectedCourse.title}</h3>
                <p className="text-xs text-slate-400">{selectedCourse.category}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left sidebar: Lessons timeline list */}
            <div className="space-y-3 lg:col-span-1 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm max-h-[500px] overflow-y-auto">
              <span className="text-xs text-slate-500 font-bold block mb-2 border-b border-slate-100 pb-1.5">جدول محاضرات القسم:</span>
              
              {selectedCourse.lessons.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-400 text-xs font-semibold leading-relaxed border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  ⚠️ لا توجد محاضرات منشورة بعد في هذا القسم.
                  <span className="block text-[10px] text-slate-405 mt-2.5 font-sans">يمكنك استخدام استمارة "نشر محاضرة جديدة" بالأسفل لرفع وتجهيز محاضراتك يدوياً!</span>
                </div>
              ) : (
                selectedCourse.lessons.map((lesson, index) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isSelected = selectedLesson?.id === lesson.id;
                  const isLocked = isLessonLocked(selectedCourse.id, lesson, index);
                  return (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-right flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? "bg-indigo-55/85 border-indigo-500 shadow-sm"
                          : isLocked
                          ? "bg-slate-100/70 border-slate-205 opacity-80 hover:bg-slate-100 text-slate-500"
                          : "bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-700"
                      }`}
                      onClick={() => {
                        if (isLocked) {
                          setPaymentSuccessMsg("");
                          setShowPaymentModalForCourse(selectedCourse);
                        } else {
                          setSelectedLesson(lesson);
                          setQuizState("not_started");
                        }
                      }}
                    >
                      {/* Delete & Edit Admin controls */}
                      {hasAdminSecret && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditLesson(selectedCourse.id, lesson);
                            }}
                            className="text-amber-600 hover:text-amber-800 p-1 rounded hover:bg-slate-200/50 transition-all cursor-pointer"
                            title="تعديل المحاضرة"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLesson(selectedCourse.id, lesson.id);
                            }}
                            className="text-red-550 hover:text-red-700 p-1 rounded hover:bg-slate-200/50 transition-all cursor-pointer"
                            title="حذف المحاضرة"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}

                      <div className="flex-1 flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          {isLocked ? (
                            <span className="bg-amber-100 text-amber-800 font-sans font-bold px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5">
                              🔒 مدفوع
                            </span>
                          ) : (
                            <span className="text-slate-400">{lesson.duration}</span>
                          )}
                          <div className="flex items-center gap-1 font-sans text-[9px] font-extrabold">
                            {(!lesson.attachmentType || lesson.attachmentType === "video") ? (
                              <span className="bg-indigo-50 border border-indigo-200/60 text-indigo-700 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-sans">
                                📹 فيديو VIDEO
                              </span>
                            ) : lesson.attachmentType === "pdf" ? (
                              <span className="bg-rose-50 border border-rose-200/65 text-rose-700 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-sans">
                                📄 مستند PDF
                              </span>
                            ) : (
                              <span className="bg-amber-50 border border-amber-200/70 text-amber-700 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-sans">
                                📊 عرض PPT
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle size={15} className="text-emerald-600 fill-emerald-500/10 shrink-0" />
                          ) : isLocked ? (
                            <CircleDot size={14} className="text-slate-400 shrink-0" />
                          ) : (
                            <CircleDot size={14} className="text-slate-350 shrink-0" />
                          )}
                          <span className={`font-semibold text-right ${isSelected ? "text-indigo-700" : isLocked ? "text-slate-500 font-medium" : "text-slate-700"}`}>{lesson.title}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right main workspace: selected lesson details */}
            <div className="lg:col-span-2">
              {selectedLesson === null ? (
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                  <GraduationCap size={48} className="text-indigo-600 mb-4 animate-pulse" />
                  <h4 className="text-slate-800 font-bold text-md">ابتدئ دراستك الآن!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    اختر أي محاضرة من جدول المحاضرات على اليمين لبدء تشغيل الفيديو التعليمي ومراجعة المقال الكامل وحل الاختبار التفاعلي.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-4 text-right relative overflow-hidden">
                  {/* Title lesson */}
                  <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                    <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-xl text-xs font-mono">
                      ⏱️ {selectedLesson.duration}
                    </span>
                    <h4 className="text-md font-bold text-slate-850 font-sans">{selectedLesson.title}</h4>
                  </div>

                   {/* Dynamic Lecture Attachment View: Video, PDF or PowerPoint Slide Deck */}
                  {(!selectedLesson.attachmentType || selectedLesson.attachmentType === "video") ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-slate-200">
                      {selectedLesson.videoUrl ? (
                        <>
                          <iframe
                            src={selectedLesson.videoUrl}
                            title={selectedLesson.title}
                            className="absolute inset-0 h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          
                          {/* 🛡️ ULTRA-SECURE VIDEO WATERMARK */}
                          <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden" style={{ direction: "rtl" }}>
                            {/* Drifting diagonal watermarks across the video */}
                            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.09] p-4 text-[10px] md:text-xs text-white">
                              <div className="text-right font-bold tracking-wide">
                                <span>أكاديمية الكيلاني الذكية 🎓</span>
                              </div>
                              <div className="text-left font-bold tracking-wide">
                                <span>بث آمن للعضو: {hasAdminSecret ? "الأستاذ فتحي الكيلاني (المدير العام) 👑" : (certificateName || "عضو تجريبي أكاديمي")}</span>
                              </div>
                              <div className="text-right font-bold tracking-wide mt-auto">
                                <span>ممنوع التصوير والنسخ 🚫</span>
                              </div>
                              <div className="text-left font-bold tracking-wide mt-auto font-mono text-[9px]">
                                <span>{hasAdminSecret ? "رمز التفعيل: الإدارة الفنية" : (watermarkPhone || "مُعرّف آمن: " + (localStorage.getItem("kilany_device_id")?.slice(0, 8) || "guest"))}</span>
                              </div>
                            </div>
                            
                            {/* Central rotating watermark */}
                            <div className="absolute inset-0 flex items-center justify-center rotate-[-12deg] opacity-[0.14] select-none pointer-events-none">
                              <div className="text-center font-black text-white">
                                <h4 className="text-[12px] sm:text-md uppercase tracking-wider">أكاديمية الكيلاني للتداول الذكي</h4>
                                <p className="text-[9px] sm:text-[11px] mt-1">مشاهدة حية وموثقة للعضو: {hasAdminSecret ? "الأستاذ فتحي الكيلاني (المدير العام) 👑" : (certificateName || "عضو تجريبي أكاديمي")}</p>
                                <p className="text-[9px] sm:text-[10px] mt-0.5 font-mono text-amber-400">{hasAdminSecret ? "رمز التفعيل: نشط ومصدق" : (watermarkPhone || "مُعرّف آمن: " + (localStorage.getItem("kilany_device_id")?.slice(0, 8) || "guest"))}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                          <Video size={40} className="text-slate-400" />
                          <p className="text-sm text-slate-500 mt-2">لا يتوفر مشغل فيديو مدمج.</p>
                        </div>
                      )}
                    </div>
                  ) : selectedLesson.attachmentType === "pdf" ? (
                    <PdfViewer lesson={selectedLesson} />
                  ) : (
                    <PptViewer lesson={selectedLesson} />
                  )}

                  {/* Syllabus Notes Text with Markdown structure */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed font-sans space-y-3 whitespace-pre-line text-right">
                    <span className="text-indigo-600 font-extrabold block text-xs border-b border-slate-100 pb-1">📖 الملحوظات والمستخلص التعليمي:</span>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {selectedLesson.content}
                    </p>
                  </div>

                  {/* Interactive Quizzes sections */}
                  {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 text-right space-y-3">
                      <h5 className="text-slate-800 font-bold text-xs flex items-center justify-end gap-1.5 border-b border-slate-150 pb-2">
                        <span>الاختبار السريع لتأكيد الفهم وحفظ التقدم</span>
                        <Award size={15} className="text-amber-500 fill-amber-300" />
                      </h5>

                      {quizState === "not_started" && (
                        <div className="flex justify-between items-center bg-white border border-slate-150 p-3 rounded-xl shadow-sm">
                          <button
                            onClick={() => startQuizForLesson(selectedLesson)}
                            className="bg-indigo-650 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-650/15"
                          >
                            ابدأ الاختبار التفاعلي
                          </button>
                          <p className="text-[11px] text-slate-500">
                            يحتوي هذا الدرس على اختبار من {selectedLesson.quiz.length} سؤال. اجتيازك للاختبار يعلّم الدرس كمكتمل رسمياً!
                          </p>
                        </div>
                      )}

                      {quizState === "answering" && selectedLesson.quiz[activeQuizIndex] && (
                        <div className="space-y-3 text-right">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-mono">سؤال {activeQuizIndex + 1} من {selectedLesson.quiz.length}</span>
                            <span className="text-slate-850 font-bold font-sans">{selectedLesson.quiz[activeQuizIndex].question}</span>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {selectedLesson.quiz[activeQuizIndex].options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectAnswer(oIdx)}
                                className={`w-full text-right p-3 rounded-xl text-xs border transition-all ${
                                  selectedAnswer === oIdx
                                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-start">
                            <button
                              onClick={() => handleNextQuizQuestion(selectedLesson)}
                              disabled={selectedAnswer === null}
                              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1 transition-all"
                            >
                              الذهاب للسؤال التالي
                            </button>
                          </div>
                        </div>
                      )}

                      {quizState === "finished" && (
                        <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-150 text-center space-y-2">
                          <h6 className="text-amber-600 font-extrabold text-sm flex items-center justify-center gap-1">
                            <span>نتيجة الاختبار</span>
                          </h6>
                          <p className="text-xs text-slate-800">
                            لقد أجبت بنجاح على {quizScore} من أصل {selectedLesson.quiz?.length || 0} أسئلة!
                          </p>
                          
                          {quizScore === (selectedLesson.quiz?.length || 0) ? (
                            <p className="text-emerald-600 font-bold text-xs">🎉 ممتاز! تم حفظ الدرس كمكتمل بنجاح!</p>
                          ) : (
                            <div className="space-y-1.5">
                              <p className="text-amber-600 text-xs font-semibold">تحتاج لإجابة كافة الأسئلة بشكل صحيح لتخطي الدرس.</p>
                              <button
                                onClick={() => startQuizForLesson(selectedLesson)}
                                className="bg-white hover:bg-slate-100 text-slate-705 border border-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
                              >
                                إعادة المحاولة
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🛡️ SECURITY ANTI-PIRACY WORKSPACE WATERMARK */}
                  <div className="absolute inset-0 pointer-events-none select-none z-[1] overflow-hidden" style={{ direction: "rtl" }}>
                    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 opacity-[0.03] p-12 text-slate-900 select-none pointer-events-none">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col justify-center items-center rotate-[-15deg] text-center">
                          <p className="text-sm font-black">أكاديمية الكيلاني للتداول الذكي 🎓</p>
                          <p className="text-[10px] font-bold mt-1">عضو: {hasAdminSecret ? "الأستاذ فتحي الكيلاني (المدير العام) 👑" : (certificateName || "عضو تجريبي أكاديمي")}</p>
                          <p className="text-[9px] font-mono mt-0.5">{hasAdminSecret ? "رمز التفعيل: نشط ومصدق" : (watermarkPhone || "مُعرّف آمن: " + (localStorage.getItem("kilany_device_id")?.slice(0, 8) || "guest"))}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 🔒 Custom Student Premium Subscription / Payment Request Modal */}
      {showPaymentModalForCourse && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in text-right" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowPaymentModalForCourse(null);
                setPaymentSuccessMsg("");
              }}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-md sm:text-lg font-black text-slate-900 font-sans mb-1 flex items-center gap-2">
              <span className="text-indigo-600">🔐</span>
              <span>تنشيط المسار التعليمي المدفوع</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-sans leading-relaxed">
              هذه المحاضرة تقع ضمن المستوى التعليمي المدفوع في مسار <strong>({showPaymentModalForCourse.title})</strong>. يُرجى إرسال رسوم التنشيط وتأكيد التحويل لفتح المسار بالكامل.
            </p>

            {paymentSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl text-center space-y-3">
                <div className="text-emerald-650 text-2xl">✓</div>
                <p className="text-xs font-bold text-emerald-800 leading-relaxed font-sans">{paymentSuccessMsg}</p>
                <button
                  onClick={() => {
                    setShowPaymentModalForCourse(null);
                    setPaymentSuccessMsg("");
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                >
                  حسناً، إغلاق النافذة
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendPaymentRequest} className="space-y-4 font-sans">
                {/* Details box */}
                <div className="bg-indigo-50/50 border border-indigo-150 rounded-2xl p-4 space-y-3 text-xs text-right">
                  <div className="flex justify-between items-center font-bold text-slate-850 border-b border-indigo-100 pb-2">
                    <span>قيمة الدعم المطلوبة:</span>
                    <span className="text-indigo-700 font-black text-sm">
                      {levelPrices[showPaymentModalForCourse.id] || (showPaymentModalForCourse.id === "basics" ? "450" : showPaymentModalForCourse.id === "analysis" ? "650" : "850")} جنيه مصري
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-slate-500 font-bold">يرجى التحويل إلى أي من الحسابات الفعالة التالية:</p>
                    {(paymentMethods && paymentMethods.length > 0 ? paymentMethods : [
                      { id: "vodafone_cash", name: "فودافون كاش (Vodafone Cash)", details: "رقم فودافون كاش المسجل: 01095018521" },
                      { id: "instapay", name: "انستا باي (InstaPay)", details: "رقم انستا باي المعتمد: 01095018521@instapay" }
                    ]).map(m => (
                      <div key={m.id} className="bg-white/80 border border-slate-150 rounded-xl p-2.5 flex flex-col gap-0.5">
                        <span className="font-extrabold text-slate-700 text-[10px]">{m.name}</span>
                        <span className="font-mono font-bold text-indigo-950 text-[11px] block">{m.details}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">وسيلة التحويل المستخدمة:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 selection:bg-indigo-100 outline-none"
                  >
                    {(paymentMethods && paymentMethods.length > 0 ? paymentMethods : [
                      { id: "vodafone_cash", name: "فودافون كاش (Vodafone Cash)", details: "رقم فودافون كاش المسجل: 01095018521" },
                      { id: "instapay", name: "انستا باي (InstaPay)", details: "رقم انستا باي المعتمد: 01095018521@instapay" }
                    ]).map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">رقم الهاتف المرسل منه القيمة:</label>
                  <input
                    type="tel"
                    required
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="أدخل رقم المحفظة أو الحساب المحول منه"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-center font-mono outline-none"
                  />
                </div>

                {/* Screenshot Upload box */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">صورة إيصال التحويل (لقطة شاشة):</label>
                  <div 
                    onClick={() => document.getElementById("screenshot-file-picker")?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
                  >
                    <input
                      id="screenshot-file-picker"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleScreenshotChange}
                    />
                    
                    {paymentScreenshotBase64 ? (
                      <div className="space-y-2">
                        <div className="inline-block bg-indigo-55 w-10 h-10 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                          ✓
                        </div>
                        <p className="text-xs font-bold text-indigo-900 line-clamp-1">{paymentScreenshotName}</p>
                        <p className="text-[10px] text-slate-400">انقر لتغيير الصورة المرفقة</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-indigo-600 text-lg mx-auto">📁</div>
                        <p className="text-xs text-slate-605 font-bold">اضغط هنا لإرفاق لقطة شاشة لإيصـال الدفع</p>
                        <p className="text-[9px] text-slate-400">يقبل صيغ الصور JPG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-350 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  {isSubmittingPayment ? "جاري الإرسال الموثق..." : "تأكيد إيصال الدفع وطلب التنشيط"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 🔐 Custom Teacher Login Modal (Interactive UI replacing browser prompts) */}
      {showTeacherLoginModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in text-right" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 font-sans mb-1 flex items-center gap-2">
              <span className="text-rose-600">👨‍🏫</span>
              <span>بوابة المعلم (أستاذ الكيلاني)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
              الرجاء إدخال رمز المرور للتكامل مع لوحة النشر والتحكم في المحاضرات المخصصة ومراقبة الأعضاء.
            </p>

            <input
              type="password"
              value={teacherPasscodeInput}
              onChange={(e) => {
                setTeacherPasscodeInput(e.target.value);
                setTeacherLoginError("");
              }}
              placeholder="أدخل رمز المرور المعتمد..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-center outline-none transition-colors mb-2 font-mono"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!teacherPasscodeInput) return;
                  fetch("/api/admin/verify-passcode", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passcode: teacherPasscodeInput })
                  }).then(res => {
                    if (res.ok) {
                      localStorage.setItem("kilany_admin_token", teacherPasscodeInput);
                      setHasAdminSecret(true);
                      setIsAdminMode(true);
                      window.dispatchEvent(new Event("admin-token-changed"));
                      setShowTeacherLoginModal(false);
                      setTeacherPasscodeInput("");
                    } else if (res.status === 404 && (teacherPasscodeInput === "1112002" || teacherPasscodeInput === "kilany2026")) {
                      localStorage.setItem("kilany_admin_token", teacherPasscodeInput);
                      setHasAdminSecret(true);
                      setIsAdminMode(true);
                      window.dispatchEvent(new Event("admin-token-changed"));
                      setShowTeacherLoginModal(false);
                      setTeacherPasscodeInput("");
                      alert("تم تفعيل صلاحية المعلم محليّاً! 🎓");
                    } else {
                      setTeacherLoginError("رمز المرور المعتمد لكبار المعلمين غير صحيح!");
                    }
                  }).catch(() => {
                    if (teacherPasscodeInput === "1112002" || teacherPasscodeInput === "kilany2026") {
                      localStorage.setItem("kilany_admin_token", teacherPasscodeInput);
                      setHasAdminSecret(true);
                      setIsAdminMode(true);
                      window.dispatchEvent(new Event("admin-token-changed"));
                      setShowTeacherLoginModal(false);
                      setTeacherPasscodeInput("");
                    } else {
                      setTeacherLoginError("خطأ في الاتصال بالسيرفر.");
                    }
                  });
                }
              }}
            />

            {teacherLoginError && (
              <p className="text-red-600 text-xs font-semibold mb-3 text-center">{teacherLoginError}</p>
            )}

            <div className="flex gap-2 font-bold text-xs">
              <button
                onClick={() => {
                  if (!teacherPasscodeInput) return;
                  fetch("/api/admin/verify-passcode", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passcode: teacherPasscodeInput })
                  }).then(res => {
                    if (res.ok) {
                      localStorage.setItem("kilany_admin_token", teacherPasscodeInput);
                      setHasAdminSecret(true);
                      setIsAdminMode(true);
                      window.dispatchEvent(new Event("admin-token-changed"));
                      setShowTeacherLoginModal(false);
                      setTeacherPasscodeInput("");
                    } else if (res.status === 404 && (teacherPasscodeInput === "1112002" || teacherPasscodeInput === "kilany2026")) {
                      localStorage.setItem("kilany_admin_token", teacherPasscodeInput);
                      setHasAdminSecret(true);
                      setIsAdminMode(true);
                      window.dispatchEvent(new Event("admin-token-changed"));
                      setShowTeacherLoginModal(false);
                      setTeacherPasscodeInput("");
                      alert("تم تفعيل صلاحية المعلم محليّاً! 🎓");
                    } else {
                      setTeacherLoginError("رمز المرور المعتمد لكبار المعلمين غير صحيح!");
                    }
                  }).catch(() => {
                    if (teacherPasscodeInput === "1112002" || teacherPasscodeInput === "kilany2026") {
                      localStorage.setItem("kilany_admin_token", teacherPasscodeInput);
                      setHasAdminSecret(true);
                      setIsAdminMode(true);
                      window.dispatchEvent(new Event("admin-token-changed"));
                      setShowTeacherLoginModal(false);
                      setTeacherPasscodeInput("");
                    } else {
                      setTeacherLoginError("خطأ في الاتصال بالسيرفر.");
                    }
                  });
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                تأكيد المرور
              </button>
              <button
                onClick={() => {
                  setShowTeacherLoginModal(false);
                  setTeacherPasscodeInput("");
                  setTeacherLoginError("");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-705 px-4 py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🏆 Custom Printable Certificate of Appreciation Modal */}
      {selectedCertCourse && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in text-right" dir="rtl">
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body {
                background: white !important;
                color: black !important;
              }
              header, main, footer, .no-print {
                display: none !important;
                visibility: hidden !important;
              }
              .modal-container {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 105% !important;
                background: white !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              #printable-certificate {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                border: 12px double #b45309 !important;
                background: white !important;
                box-shadow: none !important;
                margin: 0 !important;
                page-break-inside: avoid !important;
              }
            }
          `}} />
          <div className="bg-white border border-slate-205 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative modal-container no-print">
            <button
              onClick={() => {
                setSelectedCertCourse(null);
                setCertificateName("");
              }}
              className="absolute top-4 left-4 text-slate-450 hover:text-slate-700 font-bold text-sm bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer no-print z-50 animate-fade-in"
            >
              ✕
            </button>

            <h3 className="text-md sm:text-lg font-black text-slate-900 font-sans mb-1 flex items-center gap-2 no-print">
              <span className="text-amber-500">🏆</span>
              <span>استخراج شهادة التقدير والتفوّق</span>
            </h3>
            <p className="text-xs text-slate-505 mb-4 font-sans leading-relaxed no-print">
              تهانينا الحارة! لقد أنجزت جميع متطلبات المستوى <strong>({selectedCertCourse.title})</strong>. أدخل اسمك للحصول على الشهادة فورا والاحتفاظ بها للتاريخ!
            </p>

            {/* Name input */}
            <div className="space-y-1 mb-6 no-print">
              <label className="text-xs font-bold text-slate-700 block text-right">اسم العضو المراد كتابته بالكامل على الشهادة:</label>
              <input
                type="text"
                required
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="أدخل اسمك رباعياً للتكريم (مثال: فتحي الكيلاني)"
                className="w-full bg-slate-50 border border-slate-250 focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-right outline-none font-bold"
              />
            </div>

            {/* Certificate visual preview container */}
            <div 
              id="printable-certificate"
              className="bg-gradient-to-br from-amber-50/20 via-white to-amber-50/10 border-8 double border-amber-600 p-6 sm:p-10 rounded-2xl relative text-center overflow-hidden shadow-inner font-sans select-all min-h-[380px] flex flex-col justify-between"
            >
              {/* Corner vector decorations */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-500 rounded-tr-xl m-2 opacity-60" />
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-500 rounded-tl-xl m-2 opacity-60" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-500 rounded-br-xl m-2 opacity-60" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-500 rounded-tl-xl m-2 opacity-60" />

              {/* Background watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                <span className="text-9xl font-black text-amber-900 leading-none">الكيلاني</span>
              </div>

              {/* Header block */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-center items-center gap-2 text-amber-600">
                  <span className="text-amber-500 animate-pulse text-lg">★</span>
                  <span className="text-base sm:text-xl font-black tracking-widest text-amber-700 font-sans uppercase">شـهـادة تـقـديـر وتـكـريـم</span>
                  <span className="text-amber-500 animate-pulse text-lg">★</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">أكاديمية الكيلاني للتداول الذكي وأسواق المال</p>
              </div>

              {/* Mid text */}
              <div className="space-y-4 my-6 relative z-10">
                <p className="text-slate-500 text-xs font-sans leading-relaxed">
                  بفيضِ من الفخر والاعتزاز، تشهد إدارة أكاديمية الكيلاني للتداول الذكي بأن العضو:
                </p>
                <div className="py-2.5 px-6 border-b-2 border-dashed border-amber-500/30 max-w-lg mx-auto inline-block">
                  <span className="text-lg sm:text-2xl font-black text-amber-900 font-sans tracking-wide drop-shadow-sm select-text">
                    {certificateName || "« اسـم الـعـضـو الـمـبـدع »"}
                  </span>
                </div>
                <p className="text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed max-w-xl mx-auto font-sans">
                  قد اجتاز بنجاح وتفوق المستوى التعليمي: <strong className="text-amber-700 italic">({selectedCertCourse.title})</strong>
                  <span className="block mt-1 font-normal text-xs text-slate-500">
                    استوفى شروط الدراسة التفاعلية وحل الاختبارات الفنية المصاحبة للمساق بنجاح باهر جهوداً مشكورة.
                  </span>
                </p>
              </div>

              {/* Signatures & Seal Bottom */}
              <div className="flex justify-between items-end gap-4 mt-4 relative z-10 px-4">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">تاريخ الاعتماد الرسمي:</p>
                  <p className="text-xs font-bold font-mono text-slate-800">{new Date().toLocaleDateString("ar-EG")}</p>
                </div>

                {/* Simulated original seal */}
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-white text-white rounded-full flex flex-col items-center justify-center text-[8px] font-black shadow-lg relative transform rotate-6 scale-95 border-amber-500 select-none">
                  <span className="leading-tight">أكاديمية</span>
                  <span className="text-slate-905 font-bold leading-none">الكيلاني</span>
                  <span className="text-[6px] text-amber-100">معتمد ✓</span>
                </div>

                <div className="text-left text-xs space-y-0.5">
                  <p className="text-[10px] text-slate-400">توقيع مؤسس الأكاديمية:</p>
                  <p className="font-extrabold text-amber-800 text-sm font-sans italic relative">
                        أ. فـتـحـي الـكـيـلانـي
                    <span className="absolute -bottom-1 left-0 w-24 h-[1px] bg-amber-400" />
                  </p>
                </div>
              </div>

            </div>

            {/* Print/Dismiss Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print font-bold text-xs">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-650 hover:to-amber-750 text-slate-950 py-3 rounded-xl transition-all cursor-pointer shadow-md select-none text-center flex items-center justify-center gap-2 font-black"
              >
                <span>طباعة شهادة التقدير بنجاح 🖨️ / حفظ كـ PDF</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCertCourse(null);
                  setCertificateName("");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl transition-all cursor-pointer select-none text-center"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛠️ Edit Lesson Modal for Admin */}
      {editingLesson && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 text-right" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-md font-black text-slate-800 border-b border-slate-150 pb-2 flex items-center justify-start gap-2">
              <span>تعديل بيانات المحاضرة ⚙️</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="text-xs text-slate-500 block">عنوان المحاضرة:</label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs text-slate-500 block">الوصف القصير للغلاف:</label>
                <input
                  type="text"
                  value={editingLesson.description}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="text-xs text-slate-500 block">رابط تضمين يوتيوب / الملف المرفق:</label>
                <input
                  type="text"
                  value={editingLesson.videoUrl}
                  onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none font-sans"
                  placeholder="رابط تضمين يوتيوب"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs text-slate-500 block">المدة / عدد الصفحات:</label>
                <input
                  type="text"
                  value={editingLesson.duration}
                  onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none font-sans"
                />
              </div>
            </div>

            {/* Paid Toggle Option */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-bold text-slate-700 block text-right">خيارات الوصول والتسعير:</label>
              <div className="flex items-center gap-4 mt-1 bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                <label className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="editIsPaid"
                    checked={editingLesson.isPaid === false}
                    onChange={() => setEditingLesson({ ...editingLesson, isPaid: false })}
                    className="accent-indigo-600"
                  />
                  <span>🔓 مجانية للجميع</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="editIsPaid"
                    checked={editingLesson.isPaid === true || editingLesson.isPaid === undefined}
                    onChange={() => setEditingLesson({ ...editingLesson, isPaid: true })}
                    className="accent-indigo-600"
                  />
                  <span>🔒 مدفوعة (تتطلب تفعيل الاشتراك وموافقة الإدارة)</span>
                </label>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <label className="text-xs text-slate-500 block font-bold">محتوى الشرح الأكاديمي والملخص الكامل:</label>
              <textarea
                rows={5}
                required
                value={editingLesson.content}
                onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none text-right"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveEditedLesson}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
              >
                حفظ التعديلات ونشرها فوراً ✅
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingLesson(null);
                  setEditingLessonCourseId("");
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                إلغاء وإغلاق ❌
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
