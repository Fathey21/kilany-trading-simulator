/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CandlesticksDictionary Component
 * Displays a premium database of all key japanese candlesticks, their visual representations,
 * names, reliability ratings, full descriptions, and precise strategic actions to take under them.
 */

import React, { useState } from "react";
import { Search, Flame, Sparkles, AlertCircle, TrendingUp, TrendingDown, BookOpen, Check, RefreshCw } from "lucide-react";

interface CandlestickPattern {
  id: string;
  nameAr: string;
  nameEn: string;
  category: "bullish" | "bearish" | "neutral" | "continuation";
  reliability: "high" | "medium" | "low";
  candleModel: {
    isGreen: boolean;
    bodyHeight: number; // percentage
    upperWick: number;  // percentage
    lowerWick: number;  // percentage
    bodyOffset: number; // percentage from top
  };
  condition: string; // سياق الظهور
  definition: string; // التعريف
  tradeAction: string; // كيف تتعامل معها؟
  stopLoss: string; // أين تضع وقف الخسارة؟
  confirmation: string; // إشارة التأكيد
}

const CANDLESTICK_PATTERNS: CandlestickPattern[] = [
  {
    id: "hammer",
    nameAr: "شمعة المطرقة",
    nameEn: "Hammer",
    category: "bullish",
    reliability: "high",
    candleModel: {
      isGreen: true,
      bodyHeight: 25,
      upperWick: 5,
      lowerWick: 70,
      bodyOffset: 10
    },
    condition: "تظهر في نهاية مسار هابط لتشير إلى انتهاء سيطرة الدببة (البائعين).",
    definition: "جسم صغير في الأعلى وظل سفلي طويل يبلغ ضعفي حجم الجسم على الأقل. يعكس نجاح المشترين في دفع السعر للأعلى بعد هبوط حاد.",
    tradeAction: "ابحث عن فرصة شراء (Long). قوة الدفع الشرائية تحولت لصالح الثيران ويمكن الدخول بعد إغلاق هذه الشمعة مباشرة.",
    stopLoss: "أسفل أدنى نقطة وصل إليها الظل السفلي للشمعة (الدعم الحالي).",
    confirmation: "ظهور شمعة صاعدة تالية تأكيدية تغلق أعلى من سعر إغلاق شمعة المطرقة."
  },
  {
    id: "shooting_star",
    nameAr: "شمعة الشهاب الساقط",
    nameEn: "Shooting Star",
    category: "bearish",
    reliability: "high",
    candleModel: {
      isGreen: false,
      bodyHeight: 25,
      upperWick: 70,
      lowerWick: 5,
      bodyOffset: 70
    },
    condition: "تظهر في نهاية مسار صاعد لتشير إلى انتهاء قوة الدفع الشرائية وعجز الثيران عن مواصلة الارتقاء.",
    definition: "جسم صغير في الأسفل وظل علوي طويل جداً يعكس رفض السعر للمستويات المرتفعة وضغط البائعين المكثف لإرجاع السعر للأسفل قبل الإغلاق.",
    tradeAction: "ابحث عن فرصة بيع (Short). يمثل الظل العلوي الطويل مقاومة شديدة تفشل في الاستمرار.",
    stopLoss: "أعلى قمة وصل إليها الظل العلوي للشهاب الساقط بـ 2-5 نقاط.",
    confirmation: "شمعة هابطة تالية قوية تغلق أسفل جسم شمعة الشهاب."
  },
  {
    id: "doji",
    nameAr: "شمعة دوجي",
    nameEn: "Doji",
    category: "neutral",
    reliability: "medium",
    candleModel: {
      isGreen: true,
      bodyHeight: 4,
      upperWick: 48,
      lowerWick: 48,
      bodyOffset: 48
    },
    condition: "تظهر في أي مكان على الرسم البياني، ولكن خطورتها القصوى تكمن في قمم الصعود وقيعان الهبوط.",
    definition: "سعر الافتتاح يكاد يتطابق بدقة مع سعر الإغلاق، مما يجعل الشمعة تبدو كعلامة زائد (+) أو صليب. تمثل حيرة شديدة وتكافؤ كامل بين المشترين والبائعين.",
    tradeAction: "لا تدخل السوق حالاً! قف متفرجاً وراقب الاتجاه اللاحق. شمعة دوجي هي جرس إنذار باقتراب تغير حاد في الاتجاه.",
    stopLoss: "فوق قمة دوجي لصفقات البيع، أو تحت قاعها لصفقات الشراء بعد التأكيد.",
    confirmation: "الاتجاه اللاحق للشمعة التالية؛ فإذا كانت صاعدة قوية تشير للثبات، وإذا كانت هابطة تشير إلى بدء تصحيح قوي."
  },
  {
    id: "bullish_engulfing",
    nameAr: "الابتلاع الشرائي",
    nameEn: "Bullish Engulfing",
    category: "bullish",
    reliability: "high",
    candleModel: {
      isGreen: true,
      bodyHeight: 85,
      upperWick: 5,
      lowerWick: 10,
      bodyOffset: 5
    },
    condition: "تظهر عند قاع مسار هابط لتمثل هجوماً صاعقاً ومفاجئاً للمشترين.",
    definition: "نمط كلاسيكي يتكون من شمعتين؛ الأولى حمراء هابطة صغيرة، والثانية خضراء صاعدة عملاقة تفتتح من أسفل الشمعة الأولى وتبتلع جسمها بالكامل بمستويات الشراء الطاغية.",
    tradeAction: "قم بفتح مراكز شراء فوراً أو عند تراجع طفيف للشمعة التالية. هذا النمط هو الأقوى في التحليل الكلاسيكي.",
    stopLoss: "أسفل نقطة الافتتاح للشمعة الابتلاعية الصاعدة (القاع الجديد).",
    confirmation: "لا يتطلب تأكيداً كبيراً لثقة النموذج العالية، ولكن الإغلاق فوق قمة الجسم الابتلاعي يعطي أماناً مطلقاً."
  },
  {
    id: "bearish_engulfing",
    nameAr: "الابتلاع البيعي",
    nameEn: "Bearish Engulfing",
    category: "bearish",
    reliability: "high",
    candleModel: {
      isGreen: false,
      bodyHeight: 85,
      upperWick: 10,
      lowerWick: 5,
      bodyOffset: 10
    },
    condition: "تظهر في نهاية قمة مسار صاعد لتعلن الانهيار الوشيك.",
    definition: "شمعة صاعدة خضراء صغيرة يتبعها شمعة حمراء هابطة ضخمة تفتتح أعلى وتغلق أسفل جسم الشمعة السابقة بالكامل، مما يظهر قهر الدببة لآمال المشترين.",
    tradeAction: "افتح صفقة بيع (Short) مباشرة. تشير الشمعة إلى خروج السيولة الشرائية الضخمة ودخول سيولة بيعية مؤسساتية تلتهم السوق.",
    stopLoss: "أعلى سعر إغلاق/افتتاح الشمعة الابتلاعية الحمراء العملاقة بمسافة كافية.",
    confirmation: "إغلاق شمعة ثانية أسفل الشمعة الابتلاعية أو استمرار الزخم البيعي السريع."
  },
  {
    id: "marubozu_bullish",
    nameAr: "ماروبوزو شرائي",
    nameEn: "Bullish Marubozu",
    category: "continuation",
    reliability: "high",
    candleModel: {
      isGreen: true,
      bodyHeight: 98,
      upperWick: 1,
      lowerWick: 1,
      bodyOffset: 1
    },
    condition: "تظهر في بداية كسر المقاومات أو في طيات المسار الصاعد لتعزز ثقة الصعود المستمر.",
    definition: "شمعة صاعدة عملاقة ليس لها ظلال علوية أو سفلية على الإطلاق (أو ظلال متناهية الصغر توازي 1%). تعني كبديل حرفي أن المشترين سيطروا من أول ثانية في الجلسة وحتى آخرها.",
    tradeAction: "عزِّز صفقات الشراء الحالية فالسوق يمر بزخم صاعد خارق. تجنب تماماً البيع كعكس الاتجاه فالقطار سريع جداً.",
    stopLoss: "عند منتصف جسم شمعة ماروبوزو أو أسفلها مباشرة لتقليل حجم الخاطرة.",
    confirmation: "الزخم صريح، بمجرد كسر أعلى مستوى للشمعة يستمر الانفجار الشرائي."
  },
  {
    id: "morning_star",
    nameAr: "نجم الصباح الانعكاسي",
    nameEn: "Morning Star",
    category: "bullish",
    reliability: "high",
    candleModel: {
      isGreen: true,
      bodyHeight: 40,
      upperWick: 20,
      lowerWick: 20,
      bodyOffset: 15
    },
    condition: "نموذج ثلاثي يظهر في نهاية ترند هابط حاد كدليل قاطع على الارتقاء المالي.",
    definition: "يتألف من 3 شموع: شمعة هابطة حمراء طويلة، شمعة ثانية صغيرة جداً (غالباً دوجي أو مغزلية) تفتتح بفجوة سعرية للأسفل، وشمعة ثالثة خضراء صاعدة تخترق وتغلق فوق مستوى منتصف الشمعة الأولى.",
    tradeAction: "انتظر حتى تكتمل الشمعة الثالثة وتغلق، ثم افتح مراكز الشراء بكل ثقة.",
    stopLoss: "أسفل قاع الشمعة الصغيرة الوسطى (النجمة).",
    confirmation: "اكتمال نمط النجم الثلاثي وإغلاق الشمعة الثالثة أعلى من 50% من طول الشمعة الأولى."
  },
  {
    id: "hanging_man",
    nameAr: "الرجل المشنوق",
    nameEn: "Hanging Man",
    category: "bearish",
    reliability: "medium",
    candleModel: {
      isGreen: false,
      bodyHeight: 25,
      upperWick: 5,
      lowerWick: 70,
      bodyOffset: 10
    },
    condition: "تظهر في قمة الموجات الصاعدة المتقدمة للغاية كإنذار مخيف للمشترين.",
    definition: "تشبه المطرقة في الشكل الظاهري تماماً بحجم جسم صغير وظل سفلي طويل، ولكنها تتكون في قمة مسار صاعد لتوضح أن البائعين تمكنوا من الهبوط بالسعر بقوة قبل أن يرتد قليلاً.",
    tradeAction: "ابدأ بتصفية نصف مراكز الشراء وجني أرباحك تمهيداً لعكس الاتجاه. تجنب الشراء من هذه القمم العالية.",
    stopLoss: "فوق القمة العليا للشمعة بمسافة نقطتين أساسيتين.",
    confirmation: "ضروري جداً ظهور شمعة هابطة حمراء قوية تليها وتغلق في المستويات السفلية لتأكيد السقوط."
  }
];

export function CandlesticksDictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "bullish" | "bearish" | "neutral" | "continuation">("all");
  const [selectedPattern, setSelectedPattern] = useState<CandlestickPattern>(CANDLESTICK_PATTERNS[0]);
  
  // Interactive mini quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      imageSim: { isGreen: true, bodyHeight: 25, upperWick: 5, lowerWick: 70, bodyOffset: 10 },
      question: "أي من الشموع الآتية تمثل هذا المجسم (جسم صغير بالأعلى وظل سفلي طويل بضعفي الجسم على الأقل في الترند الهابط)؟",
      options: ["شمعة الشهاب الساقط", "شمعة دوجي الحائرة", "شمعة المطرقة الإيجابية", "ماروبوزو الصافي"],
      correct: 2,
      explanation: "هذه شمعة المطرقة (Hammer) الإيجابية؛ حيث تظهر عادةً في نهاية ترند هابط لتعلن بدء زوال سيطرة البائعين ودخول زخم شراء لرفع الأسعار."
    },
    {
      id: 2,
      imageSim: { isGreen: false, bodyHeight: 25, upperWick: 70, lowerWick: 5, bodyOffset: 70 },
      question: "عند ظهور شمعة 'الشهاب الساقط' (Shooting Star) في نهاية قمة مسار صاعد، ما هو الإجراء الأمثل الموثق فنياً للتداول المستقبلي؟",
      options: ["فتح صفقة شراء فوري بلوت كبير", "البحث عن فرصة بيع (Short) مع تأكيد ووضع وقف الخسارة أعلى القمة", "تجاهل الشامل وتداول في نفس الاتجاه الصاعد", "إغلاق المنصة نهائياً لعدم الأهمية"],
      correct: 1,
      explanation: "تمثل شمعة الشهاب مقاومة علوية قاسية نتيجة الرفض السعري للمستويات العالية، لذا يفضل البحث عن فرص بيع متدرب عليها ووضع وقف خسارتك بضع نقاط فوق القمة."
    },
    {
      id: 3,
      imageSim: { isGreen: true, bodyHeight: 4, upperWick: 48, lowerWick: 48, bodyOffset: 48 },
      question: "ما هو السلوك السعري الحقيقي الذي يقف خلف تكوين شمعة دوجي (Doji)؟",
      options: ["سيطرة البائعين المطلقة بضغط رهيب", "حيرة شديدة بالغة وتكافؤ كامل بين الباعة والمشترين بحيث يتطابق الافتتاح مع الإغلاق", "اندفاع المشترين للشراء بسعر السوق دون توقف", "بداية تفتح البنوك الأمريكية للودائع"],
      correct: 1,
      explanation: "سعر افتتاح شمعة دوجي يتطابق تماماً أو يكاد مع سعر إغلاقها، ما يبرز تساوياً مطلقاً بين قوى الشراء وقوى البيع وحيرة كبيرة بالمسار."
    }
  ];

  const handleAnswerSubmit = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIdx);
    setIsAnswered(true);
    if (optionIdx === quizQuestions[quizIndex].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setShowQuizResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // Filter patterns based on search and selected categories
  const filteredPatterns = CANDLESTICK_PATTERNS.filter((pat) => {
    const matchesSearch = pat.nameAr.includes(searchTerm) || pat.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || pat.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in text-right font-sans" dir="rtl">
      
      {/* Intro Header Banner with premium color theme */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-505/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles size={11} className="animate-pulse" />
            مرجع الشموع اليابانية التفاعلي 🕯️
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            قاموس وموسوعة الشموع اليابانية وسلوك الأسعار الذكي
          </h2>
          <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
            الشموع اليابانية هي بصمات المتداولين على الرسم البياني وسيكولوجية السوق الخفية. يوفر لك قاموس أكاديمية الكيلاني شرحاً كلاسيكياً تفصيلياً لأقوى نماذج الشموع وطرق قراءتها والاستفادة من حركاتها لتحقيق صفقات ناجحة وتجنب مصائد الخسائر بامتياز وثقة.
          </p>
        </div>
      </div>

      {/* Main Encyclopedia Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Details Panel (Details of Clicked Card) (7 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-850">{selectedPattern.nameAr}</h3>
                <span className="text-xs font-mono text-slate-400 font-bold">({selectedPattern.nameEn})</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{selectedPattern.condition}</p>
            </div>

            {/* Badges based on type & reliability */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                selectedPattern.category === "bullish" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                selectedPattern.category === "bearish" ? "bg-rose-50 text-rose-700 border-rose-300" :
                selectedPattern.category === "neutral" ? "bg-slate-50 text-slate-650 border-slate-300" :
                "bg-indigo-50 text-indigo-700 border-indigo-300"
              }`}>
                {selectedPattern.category === "bullish" ? "📈 نمط شرائي صاعد" :
                 selectedPattern.category === "bearish" ? "📉 نمط بيعي هابط" :
                 selectedPattern.category === "neutral" ? "⚖️ نمط حيرة وتكافؤ" :
                 "🔄 نمط استمراري للمسار"}
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-sans border ${
                selectedPattern.reliability === "high" ? "bg-amber-50 text-amber-700 border-amber-300" :
                selectedPattern.reliability === "medium" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                "bg-slate-50 text-slate-500 border-slate-200"
              }`}>
                مصداقية: {selectedPattern.reliability === "high" ? "مرتفعة جداً" : selectedPattern.reliability === "medium" ? "متوسطة" : "منخفضة"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Visual SVG Dynamic Representation of this specific candle */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-150 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden h-64 shadow-xs">
              <div className="absolute top-2 right-2 bg-white/80 border border-slate-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md text-slate-500">
                مُجسّم كروكي 📊
              </div>
              
              {/* Scaled Candlestick Render */}
              <div className="w-16 h-48 flex items-center justify-center relative">
                {/* Total range line (Wick background) */}
                <div className="absolute w-1 h-44 bg-slate-400 rounded-full" />
                
                {/* Visualizing wicks and real body precisely according to selected pattern values */}
                <div 
                  className={`absolute w-8 rounded-md transition-all duration-300 flex items-center justify-center font-bold text-[8px] text-white shadow-md ${
                    selectedPattern.candleModel.isGreen 
                      ? "bg-emerald-600/90 border border-emerald-500 shadow-emerald-500/10" 
                      : "bg-rose-600/90 border border-rose-500 shadow-rose-500/10"
                  }`}
                  style={{
                    height: `${selectedPattern.candleModel.bodyHeight}%`,
                    top: `${selectedPattern.candleModel.bodyOffset}%`,
                  }}
                >
                  <span className="text-[7.5px] scale-90 font-sans tracking-tighter opacity-80 select-none">الجسم</span>
                </div>

                {/* Vertical helper markings */}
                <span className="absolute top-0 text-[8px] font-mono font-bold text-indigo-500 right-10">أعلى سعر↑</span>
                <span className="absolute bottom-0 text-[8px] font-mono font-bold text-rose-500 right-10">أدنى سعر↓</span>
              </div>
              
              <div className="flex gap-4 text-[9px] font-sans font-bold text-slate-500 mt-4 leading-none select-none">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block" /> افتتاح/إغلاق صاعد</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-sm inline-block" /> افتتاح/إغلاق هابط</span>
              </div>
            </div>

            {/* Strategic Trading Action Content */}
            <div className="md:col-span-8 space-y-4">
              
              {/* Definition */}
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <span className="text-indigo-600">●</span> التعريف العلمي والهيكلي:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {selectedPattern.definition}
                </p>
              </div>

              {/* Action */}
              <div className="space-y-1">
                <h4 className="text-xs font-black text-emerald-800 flex items-center gap-1">
                  <span className="text-emerald-500">●</span> كيفية التعامل معها (إستراتيجية التداول):
                </h4>
                <p className="text-xs text-emerald-950 font-bold leading-relaxed font-sans bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                  💡 {selectedPattern.tradeAction}
                </p>
              </div>

              {/* Setup specifics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                  <span className="text-[10px] text-rose-600 font-bold block mb-0.5">🛡️ أمر وقف الخسارة المفضل:</span>
                  <p className="text-[11px] text-slate-750 font-black leading-relaxed">{selectedPattern.stopLoss}</p>
                </div>
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                  <span className="text-[10px] text-indigo-600 font-bold block mb-0.5">⚡ إشارة التأكيد والدخول الآمن:</span>
                  <p className="text-[11px] text-slate-750 font-black leading-relaxed">{selectedPattern.confirmation}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Prompting users to experiment in the Simulator tab */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-200/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="space-y-1 text-center sm:text-right">
              <h5 className="text-xs font-black text-indigo-905 flex items-center justify-center sm:justify-start gap-1">
                <span>جرب رصد هذه الشمعة وافتح صفقة الآن!</span>
                <span className="text-amber-500">💡</span>
              </h5>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                هل تفهم الآن نموذج {selectedPattern.nameAr}؟ اذهب فوراً إلى التبويب التالي "محاكي التداول" لتجربة البيع أو الشراء الفوري!
              </p>
            </div>
            <button 
              type="button"
              onClick={() => {
                // Dispatch event / custom tab changer to go to simulator
                const buttons = document.querySelectorAll("nav button");
                buttons.forEach(btn => {
                  if (btn.textContent?.includes("محاكي")) {
                    (btn as HTMLButtonElement).click();
                  }
                });
              }}
              className="bg-indigo-700 hover:bg-indigo-850 text-white font-bold text-[11px] px-4 py-2.5 rounded-xl block transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
            >
              افتح المحاكي الحقيقي 🚀
            </button>
          </div>

        </div>

        {/* Right Search & List Selection Side Rails (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Search Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-850 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>ابحث وصنِّف الشموع</span>
              <BookOpen size={13} className="text-indigo-600" />
            </h4>

            {/* Input field */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث باسم الشمعة... (مثال: مطرقة)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 text-right outline-none transition-colors"
              />
              <Search size={14} className="absolute right-3 top-3 text-slate-400" />
            </div>

            {/* Filter buttons based on type */}
            <div className="flex flex-wrap gap-1.5 pt-1.2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1 text-[10px] rounded-lg border font-bold transition-all cursor-pointer ${
                  activeCategory === "all" ? "bg-indigo-700 border-indigo-700 text-white shadow-xs" : "bg-slate-50 border-slate-300 text-slate-705 hover:bg-slate-100"
                }`}
              >
                الكل ({CANDLESTICK_PATTERNS.length})
              </button>
              <button
                onClick={() => setActiveCategory("bullish")}
                className={`px-3 py-1 text-[10px] rounded-lg border font-bold transition-all cursor-pointer ${
                  activeCategory === "bullish" ? "bg-emerald-700 border-emerald-700 text-white shadow-xs" : "bg-emerald-50 border-emerald-150 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                شرائية صاعدة 📈
              </button>
              <button
                onClick={() => setActiveCategory("bearish")}
                className={`px-3 py-1 text-[10px] rounded-lg border font-bold transition-all cursor-pointer ${
                  activeCategory === "bearish" ? "bg-rose-700 border-rose-700 text-white shadow-xs" : "bg-rose-50 border-rose-150 text-rose-800 hover:bg-rose-100"
                }`}
              >
                بيعية هابطة 📉
              </button>
              <button
                onClick={() => setActiveCategory("neutral")}
                className={`px-3 py-1 text-[10px] rounded-lg border font-bold transition-all cursor-pointer ${
                  activeCategory === "neutral" ? "bg-slate-700 border-slate-700 text-white shadow-xs" : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                }`}
              >
                محايدة حيرة ⚖️
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h4 className="text-xs font-black text-slate-850 border-b border-slate-100 pb-2">
              قائمة النماذج المتوفرة ({filteredPatterns.length})
            </h4>

            {filteredPatterns.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                لا توجد شموع يابانية مطابقة لبحثك الحالي.🎨
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredPatterns.map((pat) => (
                  <button
                    key={pat.id}
                    onClick={() => setSelectedPattern(pat)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedPattern.id === pat.id
                        ? "bg-indigo-50 border-indigo-500 shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-black block text-slate-850">{pat.nameAr}</span>
                      <span className="text-[10px] font-mono text-slate-400 block leading-none">{pat.nameEn}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded-md font-sans border ${
                        pat.category === "bullish" ? "bg-emerald-50 text-emerald-800 border-emerald-250" :
                        pat.category === "bearish" ? "bg-rose-50 text-rose-800 border-rose-250" :
                        "bg-slate-50 text-slate-705 border-slate-250"
                      }`}>
                        {pat.category === "bullish" ? "صعود" : pat.category === "bearish" ? "هبوط" : "حيرة"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans">◀</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Candlesticks Knowledge Game/Quiz */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-4">
            <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full">
                اختبر معرفتك الفنية 🏆
              </span>
              <h5 className="text-xs font-black text-amber-400">لعبة تحدي الشموع اليابانية</h5>
            </div>

            {!showQuizResult ? (
              <div className="space-y-4">
                
                {/* Visual Simulation of Candle in Quiz Question */}
                <div className="bg-slate-950 rounded-xl p-4 flex items-center justify-center relative overflow-hidden h-32 border border-slate-800/80">
                  <div className="w-10 h-28 flex items-center justify-center relative">
                    <div className="absolute w-0.5 h-24 bg-slate-500 rounded-full" />
                    <div 
                      className={`absolute w-5 rounded-sm flex items-center justify-center ${
                        quizQuestions[quizIndex].imageSim.isGreen 
                          ? "bg-emerald-500 border border-emerald-400" 
                          : "bg-rose-500 border border-rose-400"
                      }`}
                      style={{
                        height: `${quizQuestions[quizIndex].imageSim.bodyHeight}%`,
                        top: `${quizQuestions[quizIndex].imageSim.bodyOffset}%`,
                      }}
                    />
                  </div>
                  <span className="absolute bottom-1 bg-slate-900 text-slate-400 text-[8px] px-2 py-0.5 rounded-md font-mono">شكل الشمعة الحالي</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-bold">
                  {quizQuestions[quizIndex].id}. {quizQuestions[quizIndex].question}
                </p>

                {/* Option Buttons */}
                <div className="space-y-2">
                  {quizQuestions[quizIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === oIdx;
                    const isCorrect = oIdx === quizQuestions[quizIndex].correct;
                    let btnColor = "bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-800";
                    
                    if (isAnswered) {
                      if (isCorrect) {
                        btnColor = "bg-emerald-900/80 border-emerald-500 text-white font-bold";
                      } else if (isSelected) {
                        btnColor = "bg-rose-900/80 border-rose-500 text-white font-bold";
                      } else {
                        btnColor = "bg-slate-950 text-slate-500 border-slate-900 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleAnswerSubmit(oIdx)}
                        disabled={isAnswered}
                        className={`w-full text-right py-2 px-3.5 text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-between ${btnColor}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <span className="text-emerald-400 text-[10px] font-sans font-extrabold flex items-center gap-1">صح <Check size={11} /></span>}
                        {isAnswered && isSelected && !isCorrect && <span className="text-rose-400 text-[10px] font-sans font-extrabold">خطأ ✕</span>}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="space-y-3.5 animate-fade-in pt-1">
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                      <p className="text-[10px] text-amber-200 leading-relaxed font-bold">
                        💡 التفسير العلمي: {quizQuestions[quizIndex].explanation}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="w-full bg-indigo-700 hover:bg-indigo-650 text-white font-black py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                    >
                      {quizIndex === quizQuestions.length - 1 ? "مشاهدة النتيجة النهائية 📊" : "السؤال التالي ◀"}
                    </button>
                  </div>
                )}
                
                {/* Score indicators */}
                <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-2 border-t border-slate-800/80 font-bold">
                  <span>السؤال {quizIndex + 1} من {quizQuestions.length}</span>
                  <span>النقاط الحالية: {quizScore} / {quizQuestions.length}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4 animate-fade-in">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-xl font-sans animate-bounce">
                  🏆
                </div>
                <div className="space-y-1">
                  <h6 className="text-sm font-black text-amber-400">تهانينا! لقد أنهيت اختبار التحدي</h6>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    أحسنت صنعاً! لقد أجبت بشكل صحيح على <span className="text-amber-500 font-extrabold">{quizScore}</span> سؤال من أصل <span className="text-white font-black">{quizQuestions.length}</span>.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl text-[10.5px] text-indigo-200 font-bold max-w-xs mx-auto leading-relaxed">
                  {quizScore === quizQuestions.length 
                    ? "أنت متداول خارق ومؤهل تماماً لقراءة مسارات السوق باحترافية كاملة! 🚀" 
                    : "قراءة جيدة ولكن ننصحك بمراجعة باقي الشموع وتجربتها فوراً بالدخول إلى فصول التداول. 🕯️"}
                </div>

                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold py-2 px-6 rounded-xl text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={11} />
                  إعادة التحدي والتدريب
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
