/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  LineChart, 
  ShieldAlert, 
  HelpCircle, 
  Search, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Activity, 
  BarChart2, 
  PieChart, 
  Sparkles, 
  Layers, 
  Info,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";

interface TechnicalConcept {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: React.ReactNode;
  shortDesc: string;
  category: "basics" | "advanced" | "risk";
  tags: string[];
  definition: string;
  howToApply: string;
  kilanyProTip: string;
  interactiveType?: "resistance" | "trendline" | "indicator" | "riskCalc";
}

export function TechnicalAnalysisBasics() {
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "basics" | "advanced" | "risk">("all");

  // Interactive state parameters for conceptual visual widgets
  const [indicatorType, setIndicatorType] = useState<"ma" | "rsi" | "macd">("rsi");
  const [rsiValue, setRsiValue] = useState<number>(30); // for RSI simulator
  const [maType, setMaType] = useState<"golden" | "death">("golden"); // for MA simulator
  const [accruedRisk, setAccruedRisk] = useState<number>(2); // 1% to 10%
  const [accountSize, setAccountSize] = useState<number>(10000); // balance
  const [stopLossPips, setStopLossPips] = useState<number>(50); // Stop Loss margin points

  const toggleAccordion = (id: string) => {
    setActiveAccordionId(activeAccordionId === id ? null : id);
  };

  const concepts: TechnicalConcept[] = [
    {
      id: "intro",
      titleAr: "مفهوم التحليل الفني وقراءة حركة السعر",
      titleEn: "What is Technical Analysis & Price Action?",
      icon: <BookOpen className="text-indigo-650" size={18} />,
      shortDesc: "حجر الزاوية في فهم أسواق المال: دراسة حركة الأسعار الماضية عبر الرسم البياني لتوقع حركتها القادمة.",
      category: "basics",
      tags: ["الأساسيات", "حركة السعر", "الشارت"],
      definition: "التحليل الفني هو أسلوب منهجي يُستخدم لدراسة وتقييم الأوراق المالية والعملات الرقمية بناءً على إحصاءات حركة السعر التاريخية وحجم التداول (Volume). بدلاً من قياس القيمة الذاتية للأصول (كالتحليل الأساسي)، يعتمد المحلل الفني على الرسوم البيانية والأدوات الفنية والمؤشرات لتحديد النماذج والاتجاهات المتكررة التي تشير إلى شهية السوق المستقبلية وعلم النفس الجمعي للمستثمرين.",
      howToApply: "لتطبيق القراءة الفنية بنجاح، يجب أن تفهم عقائد نظرية داو (Dow Theory) الثلاث الكبرى:\n1. السوق يحسم كل شيء: حركة السقر الحالية تعكس بالفعل كافة الأخبار والبيانات المخفية والعلنية.\n2. الأسعار تتحرك في اتجاهات (Trends): السعر يميل لمواصلة اتجاهه الصاعد أو الهابط بدلاً من الحركة العشوائية حتى تظهر إشارة واضحة على الانعكاس.\n3. التاريخ يعيد نفسه: السلوك البشري وعاطفة الخوف والطمع تؤدي دائماً إلى تكرار نفس النماذج السعرية على مر العقود.",
      kilanyProTip: "يا بني، تذكر دائماً أن الشارت مرآة لنفسية المتداولين. عندما ترى شمعة صاعدة قوية، فلا تبحث فقط عن خطوط فنية، بل فكّر في 'أين تكمن سيولة البائعين وكيف يهرعون لشراء عقودهم لتأمين مراكزهم'. السعر لا يتحرك لأن المعادلة الحسابية قالت ذلك، بل لأن قوى العرض والطلب الحقيقية تفوق بعضها!"
    },
    {
      id: "support_resistance",
      titleAr: "خطوط الدعم والمقاومة وبنية المستويات",
      titleEn: "Support & Resistance Levels",
      icon: <Layers className="text-emerald-600" size={18} />,
      shortDesc: "الأعمدة الحقيقية للسوق: مستويات سعرية تاريخية تعيق السعر وتدفعه للارتداد، أو ينفجر السعر فوقها عند كسرها.",
      category: "basics",
      tags: ["الدعم والمقاومة", "مستويات فنية", "تبادل الأدوار"],
      definition: "تمثل الخطوط الفنية الأفقية جغرافيا الصراع المباشر بين المشتري والبائع:\n- مستوى الدعم (Support): هو مستوى يتواجد عنده اهتمام شرائي تركيزي مكثف يمنع السعر من الهبوط أكثر، حيث يرى المشترون أن السعر مغرٍ جداً لبدء صفقات (Long).\n- مستوى المقاومة (Resistance): هو مستوى يتواجد عنده ضغط بيعي مركّز يعوق الارتفاع الإضافي، حيث يرى البائعون أن السعر وصل لقمة الذروة ويبدأون في جني الأرباح وفتح صفقات (Short).",
      howToApply: "ابحث عن القمم السابقة التي تراجع منها السعر مرتين أو أكثر لتحديد 'المقاومة'، وابحث عن القيعان التي ارتد منها السعر لتحديد 'الدعم'. مبدأ 'تبادل الأدوار' (Role Reversal) أساسي جداً: بمجرد أن ينجح السعر في كسر منطقة المقاومة للأعلى، فإنها تتحول مستقبلياً إلى منطقة دعم تحمي السعر من الهبوط، والعكس في حال كسر مستويات الدعم.",
      kilanyProTip: "خطوط ا لدعم والمقاومة ليست خطوطاً رفيعة بل هي 'مناطق سعرية' (Zones). احذر الكسر الكاذب (Fakeout)! يفرط صناع السوق في ضرب مستويات الدعم لتفعيل أوامر وقف الخسارة قبل صعود السعر، لذا لا تتسرع بالدخول بالكسر إلا بعد إغلاق شمعة كاملة وإعادة الاختبار (Retest).",
      interactiveType: "resistance"
    },
    {
      id: "trendlines_channels",
      titleAr: "خطوط الاتجاه والقنوات السعرية",
      titleEn: "Trendlines & Price Channels",
      icon: <LineChart className="text-amber-500" size={18} />,
      shortDesc: "صديقك الأبدي في السوق: كيف ترسم حركة التريند الصاعد والهابط لتسبق الجميع وتتداول في اتجاه الزخم البنيوي الرئيسي.",
      category: "basics",
      tags: ["التريند الصاعد", "التريند الهابط", "القنوات السعرية"],
      definition: "خط الاتجاه (Trendline) هو أداة كلاسيكية تهدف لوصل القيعان المتتالية (في المسار الصاعد) أو القمم المتتالية (في المسار الهابط) لتحديد الزاوية والسرعة الحركية للاتجاه الحالي. عندما نقوم برسم خط موازٍ لخط الاتجاه على القمم المقابلة، نحصل على 'قناة سعرية' (Price Channel) تؤطر المسار بالكامل وتحدد مناطق جني الأرباح التلقائية.",
      howToApply: "يرسم خط الاتجاه الصاعد عبر ربط قاعين صاعدين كحد أدنى (يفضل ثلاثة تلامسات للتأكيد كأمان قوي). ما دام السعر يتداول أعلى الخط، فالتريند صاعد ويُمنع تماماً فتح صفقات بيع (Short). إذا كسر السعر خط الاتجاه وأبدى مقاومة تحته، فهذا نذير بانتهاء القوة وبدء تريند معاكس أو حركة تصحيحية.",
      kilanyProTip: "الفني المحترف لا يتداول أبداً ضد اتجاه التريند! تذكّر مقولتي الدائمة لطلابي بالأكاديمية: 'التريند هو صديقك الأوفى حتى يقرر الرحيل' (The trend is your friend until the end). دائماً اشترِ في ارتدادات التريند الصاعد وبيّع في ارتدادات التريند الهابط لتستفيد من تسارع الزخم.",
      interactiveType: "trendline"
    },
    {
      id: "indicators_power",
      titleAr: "أهم المؤشرات الفنية للزخم والقوة",
      titleEn: "Technical Indicators (RSI, EMA, MACD)",
      icon: <Activity className="text-indigo-650" size={18} />,
      shortDesc: "رادارات المتداول الفني: معادلات رياضية لحظية تفحص تشبعات الشراء، زخم السيولة، والتقاطعات السحرية للقمم.",
      category: "advanced",
      tags: ["RSI", "المتوسّطات المتحركة", "MACD", "الزخم"],
      definition: "المؤشرات الفنية هي دوال رياضية يتم احتسابها من بيانات الأسعار وأحجام التداول اللحظية لتبسيط الفهم البصري للرسوم البيانية وتنقسم إلى:\n1. مؤشرات الاتجاه (Trend): مثل المتوسطات المتحركة (Exponential Moving Average - EMA) التي تنقي الضوضاء من الشارت.\n2. مؤشرات الزخم (Oscillators): مثل مؤشر القوة النسبية (RSI) ومؤشر الماكد (MACD) التي تكشف مدى تسارع قوى الشراء أو تآكلها.",
      howToApply: "استخدم المتوسطات كمقاومة ودعم ديناميكي (مثل EMA 50 و EMA 200). تقاطع المتوسط السريع فوق المتوسط البطيء يسمى 'التقاطع الذهبي' (Golden Cross) وهو إشارة شراء تفاعلية كبرى. بينما تشير قراءات RSI تحت 30 إلى تشبع بيعي مفرط (فرصة شراء) وفوق 70 إلى تشبع شرائي مفرط (فرصة حذر).",
      kilanyProTip: "المؤشرات أدوات مساعدة وليست صانعة القرار الأساسية. لا تجعل شاشتك مكدسة بأربعين مؤقتاً ومؤشراً فتصاب بعقدة شلل التحليل (Analysis Paralysis). حركة السعر العارية (Pure Price Action) والشموع اليابانية تأتي في المقام الأول، ويؤكدها حجم التداول ثم تأتي المؤشرات لاحقاً.",
      interactiveType: "indicator"
    },
    {
      id: "risk_sizing",
      titleAr: "إدارة المخاطر الحسابية وحسب الحجم الآمن",
      titleEn: "Dynamic Risk & Position Sizing Management",
      icon: <ShieldAlert className="text-rose-650" size={18} />,
      shortDesc: "السر الخفي للمتداول الناجح: كيف تنشئ حساباً حديدياً لا يتعرض للتصفية وتقاوم عواصف انعكاس السوق والترنحات الحادة.",
      category: "risk",
      tags: ["إدارة المخاطر", "وقف الخسارة", "حساب الهامش"],
      definition: "إدارة المخاطر هي العملية التشغيلية التي تضمن ألا تؤدي صفقة واحدة خاسرة أو حتى سلسلة صفقات خاسرة متتالية إلى تدمير محفظتك الاستثمارية. تتألف من تطبيق حازم لنظريات 'حجم المركز المحمي' (Position Sizing) وتحديد نسب الخسارة الكلية المقبولة لكل صفقة مقارنة بحجم رأس المال بالكامل.",
      howToApply: "طبّق دوماً قاعدتين ذهبيتين بالأكاديمية:\n1. قاعدة الـ 2%: لا تخاطر أبداً بأكثر من 2% من رأس مالك الكلي في أي صفقة تداول مفردة.\n2. فَعّل أمر وقف الخسارة (Stop Loss) اللحظي فور دخول السوق. وقف الخسارة هو عقد التأمين الوحيد في عالم المال الرقمي الشرس ضد الانزلاق السعري وانهيارات السيولة المفاجئة.",
      kilanyProTip: "إدارة المخاطر هي الفرق الفاصل بين المتداول المحترف الذي يرى التداول كمهنة علمية، وبين المضارب الهاوي الذي يتعامل معه كلعبة كازينو! من يفتح صفقات برافعة مالية 100x وبطمع أعمى سيلقى التصفية المؤلمة عاجلاً أم آجلاً. كن حكيماً والزم قواعد الأمان لتستقر في صدارة الرابحين.",
      interactiveType: "riskCalc"
    }
  ];

  // Filters logic
  const filteredConcepts = concepts.filter(c => {
    const matchesSearch = c.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4 sm:p-6 lg:p-8 space-y-8 text-right font-sans" dir="rtl" id="tech-basics-page">
      
      {/* Decorative Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border-0">
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex-1 space-y-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-indigo-500/25 text-indigo-200 text-[10px] font-black px-2.5 py-1 rounded-full">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            مرجع الطالب الأكاديمي الشامل
          </span>
          <h2 className="text-lg sm:text-2xl font-black leading-tight">أساسيات ومفاهيم التحليل الفني الكلاسيكي 📈</h2>
          <p className="text-[11px] sm:text-xs text-indigo-150 leading-relaxed max-w-3xl">
            نقدم لك من خلال هذه الصفحة المخصصة، خلاصة أسرار التداول وإدارة المخاطر وتحديد خطوط التريند ومستويات الدعم وقوة الزخم. اضغط على أي مفهوم فني لفتحه ومراجعته وتجربة محاكاته الفنية التفاعلية!
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-center p-3.5 bg-white/10 rounded-2xl border border-white/15 text-center min-w-[150px]">
          <span className="text-[10px] text-amber-300 font-extrabold block mb-0.5">مدرس المساق</span>
          <span className="text-xs font-black block">أ. فتحي الكيلاني</span>
          <span className="text-[9px] text-indigo-200 block border-t border-white/10 mt-1.5 pt-1">دروس مع قنوات تفاعلية</span>
        </div>
      </div>

      {/* Searching and Categorization Filters Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search Field */}
        <div className="relative w-full md:max-w-md">
          <input
            id="concept-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مفهوم فني (مثال: دعم، تريند، وقف الخسارة)..."
            className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 outline-none transition-all font-sans"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold font-sans cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        {/* Tab Selection Filter */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-150 gap-1 w-full md:w-auto font-sans font-bold text-xs">
          <button
            id="cat-filter-all"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all ${
              selectedCategory === "all" ? "bg-white text-indigo-700 shadow-xs font-black" : "text-slate-550 hover:text-indigo-600"
            }`}
          >
            الكل ({concepts.length})
          </button>
          <button
            id="cat-filter-basics"
            onClick={() => setSelectedCategory("basics")}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all ${
              selectedCategory === "basics" ? "bg-white text-indigo-700 shadow-xs font-black" : "text-slate-550 hover:text-indigo-600"
            }`}
          >
            مبادئ التحليل الأساسية
          </button>
          <button
            id="cat-filter-advanced"
            onClick={() => setSelectedCategory("advanced")}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all ${
              selectedCategory === "advanced" ? "bg-white text-indigo-700 shadow-xs font-black" : "text-slate-550 hover:text-indigo-600"
            }`}
          >
            المؤشرات والنماذج المعقدة
          </button>
          <button
            id="cat-filter-risk"
            onClick={() => setSelectedCategory("risk")}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all ${
              selectedCategory === "risk" ? "bg-white text-indigo-700 shadow-xs font-black" : "text-slate-550 hover:text-indigo-600"
            }`}
          >
            قوانين المخاطرة وبقاء رأس المال
          </button>
        </div>

      </div>

      {/* Accordion Concepts Area */}
      <div className="space-y-4">
        {filteredConcepts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-12 text-center text-slate-400 font-medium">
            <HelpCircle size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs">عذراً، لم نجد أي مفهوم فني يتطابق مع كلمتك البحثية.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-3 text-indigo-600 hover:underline text-xs font-bold"
            >
              استعادة ضبط التصفيف والبحث الكامل
            </button>
          </div>
        ) : (
          filteredConcepts.map((concept, index) => {
            const isOpen = activeAccordionId === concept.id;
            return (
              <div 
                key={concept.id}
                className={`bg-white border rounded-2xl transition-all shadow-sm overflow-hidden ${
                  isOpen 
                    ? "border-indigo-650/40 ring-2 ring-indigo-500/5 shadow-md" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Accordion Header Trigger Button */}
                <button
                  type="button"
                  id={`accordion-trigger-${concept.id}`}
                  onClick={() => toggleAccordion(concept.id)}
                  className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-2.5 transition-all ${
                      isOpen ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {concept.icon}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-800 font-sans flex items-center gap-1.5 flex-wrap">
                        <span>{concept.titleAr}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold font-sans">({concept.titleEn})</span>
                      </h3>
                      <p className="text-[10px] text-slate-500 line-clamp-1 max-w-[280px] sm:max-w-lg md:max-w-xl font-medium mt-0.5">
                        {concept.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-md hidden sm:inline-block border ${
                      concept.category === "basics" 
                        ? "bg-slate-50 text-slate-600 border-slate-200" 
                        : concept.category === "advanced" 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>
                      {concept.category === "basics" ? "مستوى تأسيسي" : concept.category === "advanced" ? "مستوى متقدم" : "متطلب أمان"}
                    </span>
                    {isOpen ? <ChevronUp className="text-slate-400" size={16} /> : <ChevronDown className="text-slate-400" size={16} />}
                  </div>
                </button>

                {/* Accordion Body Content Panel */}
                {isOpen && (
                  <div className="border-t border-slate-100 p-4 sm:p-6 space-y-6 bg-slate-50/40 animate-fade-in text-right">
                    
                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5">
                      {concept.tags.map(t => (
                        <span key={t} className="text-[9px] bg-slate-105 border border-slate-200 text-slate-650 px-2.5 py-0.5 rounded-full font-bold">
                          # {t}
                        </span>
                      ))}
                    </div>

                    {/* Divided Details Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      
                      {/* Left Article Texts */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-slate-900 border-r-2 border-indigo-600 pr-2">أولاً: ما هو المعنى والمفهوم النظري؟</h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                            {concept.definition}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-slate-905 border-r-2 border-emerald-500 pr-2">ثانياً: كيف تقوم بتطبيق هذا المبدأ على الشارت؟</h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                            {concept.howToApply}
                          </p>
                        </div>
                      </div>

                      {/* Right Pro Tips and Custom Interactive Layout elements! */}
                      <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-inner">
                        
                        {/* Coach Tip */}
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 space-y-2.5">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] text-indigo-700 font-extrabold">نصيحة الأستاذ فتحي الكيلاني للمتلاميذ:</span>
                            <Lightbulb size={13} className="text-indigo-600 animate-pulse" />
                          </div>
                          <p className="text-[10.5px] text-slate-700 leading-relaxed font-sans italic text-right">
                            "{concept.kilanyProTip}"
                          </p>
                        </div>

                        {/* CUSTOM INTERACTIVE CONCEPT SIMULATOR ACCORDION WIDGETS */}
                        {concept.interactiveType && (
                          <div className="border-t border-slate-100 pt-4 space-y-3">
                            <span className="text-[9.5px] font-black text-slate-400 block">📉 أداة التفاعل التوضيحي والمحاكاة الذكية:</span>
                            
                            {/* Simulator Type 1: Support / Resistance Interactive */}
                            {concept.interactiveType === "resistance" && (
                              <div className="bg-slate-950 text-white rounded-xl p-3 font-mono text-[10px] space-y-3 border border-slate-800">
                                <div className="flex items-center justify-between text-[9px] text-slate-400">
                                  <span>مخطط بياني توضيحي لمناطق الحصار السعري</span>
                                  <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[8px] animate-pulse">مباشر ومحاكي</span>
                                </div>

                                <div className="relative h-28 border-l border-b border-slate-800 w-full flex flex-col justify-between py-1.5 px-3 overflow-hidden select-none">
                                  {/* Resistance top Line */}
                                  <div className="absolute top-4 left-0 right-0 border-t border-dashed border-red-500 flex items-center justify-between px-2">
                                    <span className="text-[8px] text-red-500 bg-slate-950 px-1 font-bold">منطقة مقاومة رئيسية (قمة بيع) - Resistance 🛑</span>
                                    <span className="text-[7.5px] text-red-400 font-bold">$120.00</span>
                                  </div>

                                  {/* Support bottom Line */}
                                  <div className="absolute bottom-4 left-0 right-0 border-t border-dashed border-emerald-500 flex items-center justify-between px-2">
                                    <span className="text-[8px] text-emerald-400 bg-slate-950 px-1 font-bold">منطقة دعم رئيسية (قاع شراء) - Support 🏹</span>
                                    <span className="text-[7.5px] text-emerald-305 font-bold">$100.00</span>
                                  </div>

                                  {/* Bounce Wave visualization */}
                                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path 
                                      d="M 5,80 L 20,20 L 35,80 L 50,20 L 65,80 L 80,45 L 98,40" 
                                      fill="none" 
                                      stroke="#38bdf8" 
                                      strokeWidth="2" 
                                      className="stroke-cyan-400"
                                    />
                                    {/* Bounce indicators dots */}
                                    <circle cx="20" cy="20" r="3" fill="#ef4444" className="animate-ping" />
                                    <circle cx="50" cy="20" r="3" fill="#ef4444" />
                                    
                                    <circle cx="5" cy="80" r="3" fill="#10b981" />
                                    <circle cx="35" cy="80" r="3" fill="#10b981" className="animate-ping" />
                                    <circle cx="65" cy="80" r="3" fill="#10b981" />
                                  </svg>

                                  {/* Fake labels absolute placement */}
                                  <div className="absolute top-8 left-[18%] text-[7.5px] text-rose-300">ارتداد هابط 📉</div>
                                  <div className="absolute top-8 left-[48%] text-[7.5px] text-rose-300">ارتداد هابط 📉</div>
                                  <div className="absolute bottom-8 left-[30%] text-[7.5px] text-emerald-300">ارتداد صاعد 📈</div>
                                  <div className="absolute bottom-8 left-[60%] text-[7.5px] text-emerald-300">ارتداد صاعد 📈</div>
                                  <div className="absolute top-10 left-[75%] text-[7.5px] text-cyan-300 font-bold">تذبذب وكسر وشيك...</div>
                                </div>

                                <p className="text-[9.5px] text-slate-350 leading-relaxed">
                                  💡 يرتد السعر للأسفل مراراً كلما واجه السعر المقاومة المقدرة (120 دولار) لتوافر كميات بيع وصانعي سوق، ويرتد لأعلى عند ملامسة الدعم التاريخي (100 دولار) لتوافر مشترين.
                                </p>
                              </div>
                            )}

                            {/* Simulator Type 2: Trendline Interactive */}
                            {concept.interactiveType === "trendline" && (
                              <div className="bg-slate-950 text-white rounded-xl p-3 font-mono text-[10px] space-y-3 border border-slate-800">
                                <div className="flex items-center justify-between text-[9px] text-slate-400">
                                  <span>مفهوم الاتجاه الصاعد (القيعان والقمم الصاعدة)</span>
                                  <span className="bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded text-[8px]">محاكاة التريند</span>
                                </div>

                                <div className="relative h-28 border-l border-b border-slate-800 w-full flex flex-col justify-between py-1.5 px-3 overflow-hidden select-none">
                                  {/* Trend Line diagonal */}
                                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* The support trendline */}
                                    <line x1="5" y1="85" x2="95" y2="25" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                                    {/* The Price trace */}
                                    <path 
                                      d="M 5,85 L 18,50 L 30,70 L 45,35 L 58,52 L 75,20 L 88,34 L 98,10" 
                                      fill="none" 
                                      stroke="#3b82f6" 
                                      strokeWidth="2" 
                                    />
                                    {/* Trend touches */}
                                    <circle cx="5" cy="85" r="3" fill="#f59e0b" />
                                    <circle cx="30" cy="70" r="3" fill="#f59e0b" className="animate-ping" />
                                    <circle cx="58" cy="52" r="3" fill="#f59e0b" />
                                  </svg>

                                  <div className="absolute bottom-6 left-[1%] text-[7px] text-indigo-300 font-black">قاع 1</div>
                                  <div className="absolute bottom-11 right-[65%] text-[7px] text-indigo-300 font-black">قاع صاعد 2 ⭐</div>
                                  <div className="absolute bottom-16 right-[38%] text-[7px] text-indigo-300 font-black">قاع صاعد 3 ⭐</div>
                                  <div className="absolute top-4 right-[10%] text-[7.5px] text-amber-400 font-extrabold">خط اتجاه صاعد مائل 📈</div>
                                </div>

                                <p className="text-[9.5px] text-slate-350 leading-relaxed">
                                  💡 يُمثل خط الدعم المائل حائط صد يمنع السعر من الانتقال للهبوط. شراءك حول مستويات (القاع الصاعد 2 و 3) يوفر لك أعلى هامش ربح مقابل أقل مخاطرة.
                                </p>
                              </div>
                            )}

                            {/* Simulator Type 3: Technical Indicators with custom dynamic controller sliders */}
                            {concept.interactiveType === "indicator" && (
                              <div className="bg-slate-905 border border-slate-200 text-slate-900 rounded-xl p-3 text-xs space-y-3 font-sans">
                                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 gap-1 w-full text-[9px] font-bold">
                                  <button
                                    type="button"
                                    onClick={() => setIndicatorType("rsi")}
                                    className={`flex-1 py-1 rounded transition-all cursor-pointer ${indicatorType === "rsi" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}
                                  >
                                    مؤشر RSI
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIndicatorType("ma")}
                                    className={`flex-1 py-1 rounded transition-all cursor-pointer ${indicatorType === "ma" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}
                                  >
                                    تقاطعات EMA
                                  </button>
                                </div>

                                {/* RSI Controller Sub-Simulator */}
                                {indicatorType === "rsi" && (
                                  <div className="space-y-2 text-right">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-bold">مستوى مؤشر RSI الحالي:</span>
                                      <span className={`font-mono font-black ${rsiValue >= 70 ? "text-red-650" : rsiValue <= 30 ? "text-emerald-600" : "text-neutral-600"}`}>
                                        {rsiValue}
                                      </span>
                                    </div>
                                    <input 
                                      id="rsi-slider"
                                      type="range" 
                                      min="10" 
                                      max="90" 
                                      value={rsiValue} 
                                      onChange={(e) => setRsiValue(parseInt(e.target.value))}
                                      className="w-full accent-indigo-600"
                                    />
                                    
                                    <div className="p-2.5 rounded-lg border text-[9.5px]" style={{
                                      backgroundColor: rsiValue >= 70 ? "#fff1f2" : rsiValue <= 30 ? "#f0fdf4" : "#f8fafc",
                                      borderColor: rsiValue >= 70 ? "#fecdd3" : rsiValue <= 30 ? "#bbf7d0" : "#cbd5e1",
                                    }}>
                                      {rsiValue >= 70 ? (
                                        <span className="text-red-700 font-extrabold">🚨 منطقة تشبع شرائي مفرط (Overbought): يتجاوز السعر 70. الصعود الحالي مفرط ومستنفذ، يوصى بالحذر فوراً ولا ننصح بالمغامرة بشراء عقود صاعدة لتوقع الهبوط التصحيحي الوشيك!</span>
                                      ) : rsiValue <= 30 ? (
                                        <span className="text-emerald-700 font-extrabold">🟢 منطقة تشبع بيعي مفرط (Oversold): يتداول المؤشر تحت 30. ضغوط البيع مبالغ فيها وبنية السعر قد تعكس صعوداً قوياً، ابحث عن شموع انعكاسية للشراء!</span>
                                      ) : (
                                        <span className="text-slate-500">⚖️ تداول آمن ومعتدل (المنطقة الرمادية): يتذبذب المؤشر في المستويات الطبيعية بين 30 و 70. قوة دفع السعر مستقرة وتبحث عن محفزات حركة جديدة.</span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* EMA Cross Sub-Simulator */}
                                {indicatorType === "ma" && (
                                  <div className="space-y-3 text-right">
                                    <div className="flex justify-between items-center text-[9.5px]">
                                      <span className="font-bold">اختر نوع تقاطع المتوسطات الحسابية:</span>
                                      <span className="text-[8.5px] bg-slate-100 border px-1.5 py-0.5 rounded text-indigo-700 font-extrabold">مؤشر الاتجاه</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                      <button
                                        type="button"
                                        id="ma-cross-golden"
                                        onClick={() => setMaType("golden")}
                                        className={`p-2 rounded-xl border transition-all text-center cursor-pointer ${
                                          maType === "golden" ? "border-emerald-555 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/10" : "border-slate-200"
                                        }`}
                                      >
                                        👑 التقاطع الذهبي (صعودي)
                                      </button>
                                      <button
                                        type="button"
                                        id="ma-cross-death"
                                        onClick={() => setMaType("death")}
                                        className={`p-2 rounded-xl border transition-all text-center cursor-pointer ${
                                          maType === "death" ? "border-red-500 bg-red-50 text-red-800 ring-2 ring-red-555/10" : "border-slate-200"
                                        }`}
                                      >
                                        💀 تقاطع الموت (هبوطي)
                                      </button>
                                    </div>

                                    <div className="p-2.5 rounded-lg border text-[9.5px]" style={{
                                      backgroundColor: maType === "golden" ? "#f0fdf4" : "#fff1f2",
                                      borderColor: maType === "golden" ? "#bbf7d0" : "#fecdd3",
                                    }}>
                                      {maType === "golden" ? (
                                        <span className="text-emerald-700">
                                          <strong>👑 التقاطع الذهبي (Golden Cross):</strong> يحدث تقاطع المتوسط المتحرك السريع (EMA 50) للأعلى مخترقاً المتوسط المتحرك البطيء الطويل (EMA 200). يعتبر صانعو القرار هذا التقاطع مؤشراً صريحاً على بدء تريند صاعد طويل المدى، ويدعم الشراء التراكمي.
                                        </span>
                                      ) : (
                                        <span className="text-red-700">
                                          <strong>💀 تقاطع الموت (Death Cross):</strong> يحدث تقاطع هابط للمتوسط السريع (EMA 50) للأسفل مخترقاً المتوسط البطيء (EMA 200). هذه الإشارة من أخطر إشارات الانهيار في التحليل الفني، وتعلن نهاية الترند الصاعد وبدء سيطرة الدببة.
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Simulator Type 4: Position Sizing and Capital Risk Calculator */}
                            {concept.interactiveType === "riskCalc" && (
                              <div className="bg-slate-905 border border-slate-200 text-slate-900 rounded-xl p-3 text-xs space-y-3 font-sans max-w-full">
                                <div className="text-[9.5px] font-black text-slate-500 border-b border-slate-100 pb-1 flex justify-between items-center flex-wrap gap-1">
                                  <span>حساب القيمة والمركز بناء على مبادئ إدارة المخاطر</span>
                                  <span className="text-rose-600 font-extrabold">قانون بقاء المحفظة 🛡️</span>
                                </div>

                                <div className="space-y-2 text-right">
                                  <div className="grid grid-cols-2 gap-2 text-[9.5px] font-mono">
                                    <div className="space-y-1">
                                      <label className="text-slate-500 block">رأس المال الإجمالي ($):</label>
                                      <input 
                                        id="risk-balance-input"
                                        type="number" 
                                        value={accountSize} 
                                        onChange={(e) => setAccountSize(Math.max(100, parseInt(e.target.value) || 0))}
                                        className="w-full bg-slate-50 border p-1 rounded-md text-slate-800 font-bold"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-slate-500 block">حجم الوقف بالنقاط (Pips/Ticks):</label>
                                      <input 
                                        id="risk-pips-input"
                                        type="number" 
                                        value={stopLossPips} 
                                        onChange={(e) => setStopLossPips(Math.max(5, parseInt(e.target.value) || 0))}
                                        className="w-full bg-slate-50 border p-1 rounded-md text-slate-800 font-bold"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-bold">المخاطرة المعتمدة لكل صفقة (%):</span>
                                      <span className="font-mono font-black text-rose-600">{accruedRisk}%</span>
                                    </div>
                                    <input 
                                      id="risk-percent-slider"
                                      type="range" 
                                      min="1" 
                                      max="10" 
                                      value={accruedRisk} 
                                      onChange={(e) => setAccruedRisk(parseInt(e.target.value))}
                                      className="w-full accent-rose-600"
                                    />
                                  </div>

                                  {/* Result computations */}
                                  {(() => {
                                    const dollarRiskAllowed = accountSize * (accruedRisk / 100);
                                    const positionSizeNeeded = dollarRiskAllowed / (stopLossPips / 100);
                                    return (
                                      <div className="bg-slate-950 text-white rounded-xl p-3 text-[10px] space-y-2 font-mono">
                                        <div className="flex justify-between border-b border-slate-850 pb-1.5">
                                          <span className="text-slate-400">الحد الأقصى للخسارة المقبولة ($):</span>
                                          <span className="text-rose-400 font-bold">${dollarRiskAllowed.toLocaleString("en-US", { maximumFractionDigits: 1 })}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-850 pb-1.5">
                                          <span className="text-slate-400">حجم لوت التداول المثالي المقترح:</span>
                                          <span className="text-amber-400 font-bold">${(positionSizeNeeded / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })} (هامش مقدر)</span>
                                        </div>
                                        <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-350 leading-relaxed">
                                          {accruedRisk <= 2 ? (
                                            <span className="text-emerald-400 font-bold">🟢 إدارة مخاطر نموذجية! إذا خسرت هذه الصفقة لا قدر الله، ستحافظ على 98%+ من رأس مالك كاملاً، وتستطيع استئناف المسار بمزاج هادئ دون ضغوط الخوف.</span>
                                          ) : accruedRisk <= 5 ? (
                                            <span className="text-amber-400 font-bold">🟡 درجة أمان متوسطة. يرجى تتبع حركة الأسعار بحذر. السلسلة المتتالية من الخسائر قد تلتهم نسبة واضحة من الرصيد.</span>
                                          ) : (
                                            <span className="text-red-400 font-bold">🔴 خطر داهم بنسبة مخاطرة تبلغ {accruedRisk}%! هذه المخاطرة العالية تهدد بطمس حسابك بالكامل في حال واجهتك سلسلة من 5 صفقات خاسرة ممتالية. خفّض المخاطرة فوراً.</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                      </div>

                    </div>

                    {/* Footer confirmation badge */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>المرجع: شهادات التحليل الفني لجامعات أسواق المال</span>
                      <span className="flex items-center gap-1 text-indigo-600 font-bold font-sans">
                        <span>تمت دراسته بنجاح ✓</span>
                        <CheckCircle2 size={11} className="text-emerald-500" />
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Grid of quick FAQ conceptual tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-8" id="basics-faq-section">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-right space-y-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <TrendingUp size={15} />
          </div>
          <h4 className="text-xs font-black text-slate-800 font-sans">هل التحليل الفني ناجح بنسبة 100%؟</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
            مطلقاً يا بني! لا يوجد في أسواق المال أي أداة أو استراتيجية تضمن الفوز المطلق. التحليل الفني يوفر لك 'احتمالية نصر أعلى مقارنة باحتمالية الخسارة'. الذكاء يكمن في تطبيق التداول المستمر مع إدارة صارمة للمخاطر لتكون محصلتك رابحة على المدى البعيد.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-right space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Compass size={15} />
          </div>
          <h4 className="text-xs font-black text-slate-800 font-sans">ما هو الفريم الزمني الأمثل للمبتدئين؟</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
            يُفضل المتداولون الجدد دوماً الأطر الزمنية الكبيرة (فريم اليوم فريم والـ 4 ساعات) لأنها توفر حركة أسعار هادئة وشموعاً مستقرة خالية من الضجيج والتقلبات الحادة للسكالبينج السريع، مما يسمح بدراسة هادئة للقمم والقيعان.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-right space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert size={15} />
          </div>
          <h4 className="text-xs font-black text-slate-800 font-sans">أهمية الجمع بين حركة السعر والمؤشرات؟</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
            حركة السعر (Price Action) تعبر عن الحقيقة الفورية بالسوق، بينما تعتبر المؤشرات بمثابة عامل تأكيدي وحسب. دائماً اعتمد على اتجاه حركة الترند وقمم الشموع أولاً، ثم استدعِ مؤشر RSI أو المتوسطات لتوقيت وتأكيد دقة نقطة الدخول بامتياز.
          </p>
        </div>

      </div>

    </div>
  );
}
