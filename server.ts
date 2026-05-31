/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Lazily get Google GenAI client if key exists
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes("MY_GEMINI_API") || key === "") {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint: Intelligent Trading Advisor Chat
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "الرجاء إرسال رسائل صالحة." });
    }

    try {
      const ai = getAI();
      const lastMessage = messages[messages.length - 1]?.text || "مرحباً";

      // Map chat messages format to GenAI SDK contents
      // Wait, let's use standard Chat API as shown in gemini-api SKILL.md:
      // "Starts a chat and sends a message to the model."
      // Let's create a chat session or just send a prompt with prompt history
      const promptHistory = messages.map(msg => {
        return `${msg.sender === "user" ? "المستخدم" : "مساعد الكيلاني"}: ${msg.text}`;
      }).join("\n");

      const promptCommand = `سياق محادثات التداول السابقة:
${promptHistory}

الرجاء الرد على الرسالة الأخيرة للمستخدم بأسلوب تداول ذكي وتدريبي مبسط وممتاز باللغة العربية.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptCommand,
        config: {
          systemInstruction: "أنت هو 'مستشار التداول الذكي - الكيلاني' (Smart Trading Advisor - Elkilany) من أكاديمية الكيلاني للتداول الذكي. " +
            "مهمتك الرئيسية هي إرشاد الطلبة والرد على استفساراتهم التعليمية في أسواق المال بوضوح وصبر. " +
            "أنت خبير في الشموع اليابانية، استراتيجيات الدعم والمقاومة، التحليل الكلاسيكي، وإدارة المخاطر. " +
            "تذكر دائماً أن لا تقدم توصيات مباشرة للاستثمار المالي بشراء أو بيع سهم أو رمز بعينه، بل قم بتعليم السائل كيف يكتشف بنفسه الفرصة من خلال التحليل الفني. " +
            "تحدث باللغة العربية الفصحى أو بلهجة مصرية ودودة وجذابة، واستخدم أمثلة واقعية لتسهيل الفهم.",
          temperature: 0.75,
        }
      });

      const text = response.text || "مرحباً! يبدو أن السيرفر لم يولد أي إجابة.";
      return res.json({ text });

    } catch (err: any) {
      if (err.message === "GEMINI_API_KEY_MISSING") {
        // Fallback simulated expert responses when key is missing to keep the app working offline or in sandbox
        const lastUserText = messages[messages.length - 1]?.text || "";
        let fallbackReply = `مرحباً بك في أكاديمية الكيلاني للتداول الذكي! 📈

أنا مساعد التداول للتمرن. يبدو أن مفتاح Gemini لم يُربط بعد بسيرفر التطبيق. يمكنك تفعيل ذكائي الكامل بسؤال أي أسئلة وحقن مفاتيح الـ API في الإعدادات.

إليك إرشاد سريع لأهم المفاهيم لتتمرن عليها:
- **تحذير هام:** لا تخاطر أبداً بأكثر من 1% إلى 2% من رأس مال حسابك في أي صفقة واحدة.
- **الشموع اليابانية:** اقرأ شمعة "المطرقة" (Hammer) في قاع الهبوط كإشارة قوية للصعود.
- **التداول التجريبي:** لقد صممنا لك محاكياً رائعاً بالأعلى، اضغط على زر "محاكي التداول" للتحدي والمتاجرة بـ $10,000 وهمية وتطبيق ما تتعلمه!`;

        const normalizedText = lastUserText.toLowerCase();
        if (normalizedText.includes("شمع") || normalizedText.includes("شموع")) {
          fallbackReply = `الشموع اليابانية هي انعكاس لنفسية المشترين والبائعين على الرسم البياني:
1. **الشمعة الخضراء (الصاعدة):** سعر الإغلاق أعلى من الافتتاح.
2. **الشمعة الحمراء (الهابطة):** سعر الإغلاق أدنى من الافتتاح.
3. **مطرقة (Hammer):** شمعة انعكاسية تأتي في الهبوط وتنبئ بالارتقاء.
أنصحك بتجربة التداول الحي في تبويب "محاكي التداول" لتشاهد الشموع وهي تتكون ثانية بثانية!`;
        } else if (normalizedText.includes("دعم") || normalizedText.includes("مقاوم")) {
          fallbackReply = `خطوط الدعم والمقاومة هي عتبات الأسعار:
- **الدعم (Support):** خط سفلي يمنع السعر من استمرار الهبوط، ويدعمه نحو الأعلى بفعل قوة المشترين. (فرصة شراء ممتازة).
- **المقاومة (Resistance):** خط علوي يعوق صعود السعر، ويجذبه للأسفل بفعل جني الأرباح للبلائعين. (فرصة بيع مناسبة).`;
        } else if (normalizedText.includes("إدارة") || normalizedText.includes("مخاطر")) {
          fallbackReply = `إدارة رأس المال هي سر الاستمرار:
1. لا تتداول بأكثر من 2% من رصيدك في صفقة واحدة.
2. استخدم دائماً "وقف الخسارة" (Stop Loss) لتنقذ محفظتك إذا انقلب الاتجاه ضدك.
3. العائد للمخاطرة (Risk/Reward): ابحث دائماً عن صفقات تستهدف ضعف حجم الخسارة المتوقعة (1:2).`;
        }

        return res.json({ text: fallbackReply });
      }

      console.error("Gemini API Error in backend:", err);
      return res.status(500).json({ error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." });
    }
  });

  // API Endpoint: Dynamic Intelligent Trading Tips
  app.get("/api/trading-tips", async (req, res) => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "أعطني نصيحة تداول ذكية ومميزة وقصيرة جداً (لا تتجاوز 25 كلمة) للطلاب والأعضاء لتشجيعهم وتحفيزهم على بدء تداول تجريبي بالمحاكي وصقل مهاراتهم بالشموع اليابانية ومستويات الدعم والمقاومة. اجعلها ملهمة وتلمس شغف المتداول باللغة العربية وتحتوي على إيموجيات جذابة.",
        config: {
          systemInstruction: "أنت هو أستاذ فتحي الكيلاني كبير خبراء التداول ومؤسس أكاديمية الكيلاني للتداول الذكي والأكاديمي. إجابتك يجب أن تكون ملهمة وقصيرة جداً ومقنعة للطلبة لتجربة التداول الحي في المحاكي.",
          temperature: 0.9,
        }
      });
      const tip = response.text ? response.text.trim() : "ابدأ اليوم بمبلغ صغير وتدرب بدقة بالغة! 📈";
      return res.json({ success: true, tip });
    } catch (err: any) {
      const fallbacks = [
        "التداول ليس ضربة حظ، بل لغة أرقام وشموع! ابدأ التجربة فوراً على المحاكي واكتشف إشارات السوق بنفسك! 📈💡",
        "احرص دائماً على إدارة مخاطرك وقفل صفقاتك بوقف خسارة آمن. من يتحكم بالخسارة يملك مفاتيح الأرباح! 🛡️📊",
        "شمعة المطبقة (Hammer) أو الابتلاعية المثالية فرصة نادرة لبناء صفقات ناجحة. افحص الرسم البياني الحقيقي وجرب بالمحاكي! 🕯️🔥",
        "الصبر هو أهم أداة في حقيبة المحترف. لا تستعجل الدخول دون تأكيد إغلاق الشمعة الحالية لتتجنب كسر الدعم الزائف! ⏳💎",
        "التداول بمبالغ تدريبية مجانية بالمحاكي هو أفضل وسيلة لتطبيق ما تتعلمه بالفصول دون مخاطرة حقيقية! جرب صفقتك الأولى الآن. 🎯💻",
        "صديقك الأفضل في السوق هو الاتجاه (The Trend is your friend). لا تسبح ضد التيار وتداول بتنظيم تام. 🌊📱"
      ];
      const randomTip = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return res.json({ success: true, tip: randomTip });
    }
  });

  const DB_PATH = path.join(process.cwd(), "custom_lessons.json");
  const SESSIONS_PATH = path.join(process.cwd(), "visitor_sessions.json");

  // Helper to read database
  const readCoursesDb = () => {
    try {
      if (!fs.existsSync(DB_PATH)) {
        const initial = { "basics": [], "analysis": [], "risk-management": [] };
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
        return initial;
      }
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading custom lessons file DB:", e);
      return { "basics": [], "analysis": [], "risk-management": [] };
    }
  };

  // Helper to write database
  const writeCoursesDb = (data: any) => {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing custom lessons file DB:", e);
    }
  };

  // Helper to read visitor sessions database
  interface VisitorSession {
    sessionId: string;
    userAgent: string;
    ip: string;
    location: string;
    activeTab: string;
    lastHeartbeat: number;
    banned: boolean;
    deviceType: string;
    totalActiveSeconds: number;
    joinedAt: string;
    invitedBy?: string | null;
    studentName?: string;
    studentPhone?: string;
    studentEmail?: string;
    avatar?: string;
    registeredAt?: number;
  }

  const readSessionsDb = (): Record<string, VisitorSession> => {
    try {
      if (!fs.existsSync(SESSIONS_PATH)) {
        fs.writeFileSync(SESSIONS_PATH, JSON.stringify({}, null, 2), "utf-8");
        return {};
      }
      const raw = fs.readFileSync(SESSIONS_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading visitor sessions DB:", e);
      return {};
    }
  };

  const writeSessionsDb = (data: Record<string, VisitorSession>) => {
    try {
      fs.writeFileSync(SESSIONS_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing visitor sessions DB:", e);
    }
  };

  // Helper to clean up dead sessions (inactive for > 5 minutes) and return active list
  const getCleanActiveSessions = () => {
    const db = readSessionsDb();
    const now = Date.now();
    const list = Object.values(db).filter(s => {
      // Keep banned sessions visible in database, but filter out inactive non-banned sessions
      if (s.banned) return true;
      return (now - s.lastHeartbeat) < 5 * 60 * 1000;
    });
    return list;
  };

  const ARAB_CITIES = [
    "القاهرة، مصر", "الرياض، السعودية", "الجيزة، مصر", "الدمام، السعودية", 
    "الإسكندرية، مصر", "جدة، السعودية", "دبي، الإمارات", "بغداد، العراق", 
    "المنصورة، مصر", "عمّان، الأردن", "الكويت، الكويت", "غزة، فلسطين", 
    "أسيوط، مصر", "المنيا، مصر", "المدينة المنورة، السعودية", "الشارقة، الإمارات"
  ];

  // REAL FINANCIAL PRICE PROXY ROUTINE
  const ASSETS_TICKERS: Record<string, { ticker: string; defaultPrice: number }> = {
    "XAU/USD": { ticker: "GC=F", defaultPrice: 2350.25 },
    "EUR/USD": { ticker: "EURUSD=X", defaultPrice: 1.0845 },
    "GBP/USD": { ticker: "GBPUSD=X", defaultPrice: 1.2715 },
    "USD/JPY": { ticker: "USDJPY=X", defaultPrice: 156.45 },
    "USOIL": { ticker: "CL=F", defaultPrice: 78.40 },
    "BTC/USD": { ticker: "BTC-USD", defaultPrice: 65120 },
    "ETH/USD": { ticker: "ETH-USD", defaultPrice: 3240.5 },
    "SPX500": { ticker: "^GSPC", defaultPrice: 5280 },
    "ARAMCO": { ticker: "2222.SR", defaultPrice: 30.15 }
  };

  const priceCache: Record<string, { price: number; timestamp: number }> = {};
  const CACHE_LIFETIME_MS = 6000; // 6 seconds socket cache to respect limits but feel fully live!

  async function fetchLiveAssetPrice(assetId: string): Promise<number> {
    const config = ASSETS_TICKERS[assetId];
    if (!config) return 0;

    const now = Date.now();
    const cached = priceCache[assetId];
    if (cached && (now - cached.timestamp) < CACHE_LIFETIME_MS) {
      return cached.price;
    }

    try {
      // Fetch financial chart from public Yahoo endpoint
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${config.ticker}?interval=1m&range=1d`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response.ok) throw new Error("Yahoo request failed");
      const data: any = await response.ok ? await response.json() : null;
      const priceVal = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      
      if (priceVal && typeof priceVal === "number") {
        priceCache[assetId] = { price: priceVal, timestamp: now };
        return priceVal;
      }
    } catch (err) {
      // Soft fall back to a minor random drift around the default value to keep simulations active if throttled/offline
      const driftPercent = (Math.random() - 0.5) * 0.003; // Minor realistic drift
      const driftedPrice = Number((config.defaultPrice * (1 + driftPercent)));
      return driftedPrice;
    }

    return config.defaultPrice;
  }

  // Live prices API endpoint
  app.get("/api/live-prices", async (req, res) => {
    try {
      const results: Record<string, number> = {};
      const keys = Object.keys(ASSETS_TICKERS);
      await Promise.all(
        keys.map(async (key) => {
          results[key] = await fetchLiveAssetPrice(key);
        })
      );
      res.json(results);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch live rates" });
    }
  });

  // API Endpoint: Get custom lessons list
  app.get("/api/courses", (req, res) => {
    const data = readCoursesDb();
    res.json(data);
  });

  // ========== DYNAMIC CUSTOM COURSES METADATA (Programming, Business, etc) ==========
  const CUSTOM_COURSES_METADATA_PATH = path.join(process.cwd(), "custom_course_metadata.json");

  const readCustomCoursesMetadataDb = () => {
    try {
      if (!fs.existsSync(CUSTOM_COURSES_METADATA_PATH)) {
        fs.writeFileSync(CUSTOM_COURSES_METADATA_PATH, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      const raw = fs.readFileSync(CUSTOM_COURSES_METADATA_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading custom courses metadata DB:", e);
      return [];
    }
  };

  const writeCustomCoursesMetadataDb = (data: any) => {
    try {
      fs.writeFileSync(CUSTOM_COURSES_METADATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing custom courses metadata DB:", e);
    }
  };

  // GET Custom course metadata
  app.get("/api/custom-courses-metadata", (req, res) => {
    const data = readCustomCoursesMetadataDb();
    res.json(data);
  });

  // POST Create custom course metadata (🔒 Protected to Admin ONLY)
  app.post("/api/custom-courses-metadata", (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    if (adminPasscode !== "kilany2026") {
      return res.status(403).json({ error: "عذراً، إضافة المسارات التعليمية متاح فقط لـ الكيلاني شخصياً!" });
    }

    const { course } = req.body;
    if (!course || !course.id || !course.title || !course.category) {
      return res.status(400).json({ error: "الرجاء توفير بيانات المسار التعليمي كاملة." });
    }

    const courses = readCustomCoursesMetadataDb();
    // Check if duplicate ID
    if (courses.some((c: any) => c.id === course.id)) {
      return res.status(400).json({ error: "معرف هذا المسار مسجل مسبقاً. الرجاء اختيار اسم مغاير." });
    }

    courses.push(course);
    writeCustomCoursesMetadataDb(courses);

    res.json({ success: true, courses });
  });

  // POST Delete custom course metadata (🔒 Protected to Admin ONLY)
  app.post("/api/custom-courses-metadata/delete", (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    if (adminPasscode !== "kilany2026") {
      return res.status(403).json({ error: "عذراً، حذف المسارات متاح فقط لـ الكيلاني شخصياً!" });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: "الرجاء إدخال معرف المسار المراد حذفه." });
    }

    // Filter courses metadata
    let courses = readCustomCoursesMetadataDb();
    courses = courses.filter((c: any) => c.id !== courseId);
    writeCustomCoursesMetadataDb(courses);

    // Clean up lessons database of this courseId
    const lessonsData = readCoursesDb();
    if (lessonsData[courseId]) {
      delete lessonsData[courseId];
      writeCoursesDb(lessonsData);
    }

    res.json({ success: true, courses });
  });

  // API Endpoint: Publish a new custom lesson (🔒 Protected to Owner/Admin ONLY)
  app.post("/api/courses", (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    
    if (adminPasscode !== "kilany2026") {
      return res.status(403).json({ error: "عذراً، رفع المحاضرات متاح فقط لـ الكيلاني شخصياً (عبر تفعيل وضع الإدارة الفنية)!" });
    }

    const { courseId, lesson } = req.body;
    if (!courseId || !lesson || !lesson.title) {
      return res.status(400).json({ error: "الرجاء توفير بيانات المحاضرة والدورة المستهدفة كاملة." });
    }

    const data = readCoursesDb();
    if (!data[courseId]) {
      data[courseId] = [];
    }

    // Append new lesson
    data[courseId].push(lesson);
    writeCoursesDb(data);

    res.json({ success: true, data });
  });

  // API Endpoint: Delete custom lesson (🔒 Protected to Owner/Admin ONLY)
  app.post("/api/courses/delete", (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    
    if (adminPasscode !== "kilany2026") {
      return res.status(403).json({ error: "عذراً، حذف المحاضرات متاح فقط لـ الكيلاني شخصياً!" });
    }

    const { courseId, lessonId } = req.body;
    if (!courseId || !lessonId) {
      return res.status(400).json({ error: "الرجاء إدخال اسم الدورة ومعرف المحاضرة المراد حذفها." });
    }

    const data = readCoursesDb();
    if (data[courseId]) {
      data[courseId] = data[courseId].filter((lesson: any) => lesson.id !== lessonId);
      writeCoursesDb(data);
    }

    res.json({ success: true, data });
  });

  // API Endpoint: Edit custom lesson (🔒 Protected to Owner/Admin ONLY)
  app.post("/api/courses/edit", (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    
    if (adminPasscode !== "kilany2026") {
      return res.status(403).json({ error: "عذراً، تعديل المحاضرات متاح فقط لـ الكيلاني شخصياً!" });
    }

    const { courseId, lessonId, updatedLesson } = req.body;
    if (!courseId || !lessonId || !updatedLesson || !updatedLesson.title) {
      return res.status(400).json({ error: "الرجاء توفير بيانات التعديل كاملة وقيمة العنوان." });
    }

    const data = readCoursesDb();
    if (data[courseId]) {
      data[courseId] = data[courseId].map((lesson: any) => {
        if (lesson.id === lessonId) {
          return { ...lesson, ...updatedLesson };
        }
        return lesson;
      });
      writeCoursesDb(data);
    }

    res.json({ success: true, data });
  });

  // ========== AI VIDEO GENERATION ACADEMY DATABASE & ENDPOINTS ==========
  const AI_VIDEOS_PATH = path.join(process.cwd(), "custom_ai_videos.json");

  const readAiVideosDb = () => {
    try {
      if (!fs.existsSync(AI_VIDEOS_PATH)) {
        fs.writeFileSync(AI_VIDEOS_PATH, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      const raw = fs.readFileSync(AI_VIDEOS_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading AI Videos DB:", e);
      return [];
    }
  };

  const writeAiVideosDb = (data: any) => {
    try {
      fs.writeFileSync(AI_VIDEOS_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing AI Videos DB:", e);
    }
  };

  function generateMockAiVideo(promptText: string) {
    const norm = promptText.toLowerCase();
    
    let title = "شرح فني مبسط: " + promptText;
    let description = "فيديو تعليمي تم توليده بذكاء بواسطة معالج الأكاديمية لشرح: " + promptText;
    let category = "التحليل الفني الذكي";
    let estimatedDuration = "2:30";
    let scenes = [];
    
    if (norm.includes("شمع") || norm.includes("مطرقة") || norm.includes("hammer")) {
      title = "سر شمعة المطرقة (The Hammer) في اقتناص القيعان 🔨";
      description = "أقوى النماذج الشمعية الانعكاسية التي تدل على نهاية الاتجاه الهابط وبداية الصعود.";
      category = "الشموع اليابانية";
      estimatedDuration = "2:00";
      scenes = [
        {
          title: "ما هي شمعة المطرقة الفنية؟",
          text: "أهلاً بك يا بطل في فيديو الذكاء الاصطناعي لأكاديمية الكيلاني! النهاردة هنشرح شمعة المطرقة الهامة جداً. المطرقة هي شمعة بجسم صغير فوق، وله ذيل طويل لتحت، على الأقل ضعف حجم الجسم. ده معناه إن المشترين قدروا يرجعوا السعر لفوق بقوة بعد هبوط عنيف!",
          visualType: "bullish_candle",
          avatarEmotion: "happy"
        },
        {
          title: "قراءة بنية الذيل السفلي",
          text: "شايف الديل الطويل ده؟ ده مش مجرد خط يا صاحبي، ده معركة شرسة انتصر فيها الثيران على الدببة. الديل بيثبت إن البائعين استنفذوا طاقتهم بالكامل عند الدعم، وإن السوق أصبح جاهزاً للارتقاء الفوري.",
          visualType: "support_resistance",
          avatarEmotion: "pointing"
        },
        {
          title: "خطتك للدخول الآمن",
          text: "نصيحة الكيلاني الذهبية: لا تدخل أبداً بمجرد رؤية شمعة المطرقة، انتظر إغلاق الشمعة التالية لتكون صاعدة وتأكيدية. ضع وقف الخسارة الخاص بك أسفل دي المطرقة بنقاط قليلة لتأمين حسابك، واستمتع بالصعود!",
          visualType: "risk_reward",
          avatarEmotion: "warning"
        }
      ];
    } else if (norm.includes("دعم") || norm.includes("مقاوم") || norm.includes("support")) {
      title = "قواعد تحديد الدعم والمقاومة السحرية 🛑";
      description = "كيف تكتشف عتبات الأسعار التي يرتد منها السعر مراراً وتكراراً بحجم سيولة ضخم.";
      category = "خطوط الاتجاه والسيولة";
      estimatedDuration = "2:15";
      scenes = [
        {
          title: "تعريف الدعم والمقاومة",
          text: "مرحباً بك يا متداول! النهاردة هنبسط أهم خطين في حياتك المهنية: الدعم والمقاومة. الدعم هو بمثابة الأرضية اللي بتمنع السعر يقع وتدفعه لفوق بفعل المشترين. أما المقاومة فهي السقف اللي بيمنع السعر يطلع لفوق بسبب جني الأرباح.",
          visualType: "support_resistance",
          avatarEmotion: "normal"
        },
        {
          title: "مبدأ تبادل الأدوار الشهير",
          text: "انتبه لهذه القاعدة السحرية: عندما يتم اختراق خط مقاومة للأعلى بقوة وسيولة كبيرة، فإنه يتحول في الغالب إلى خط دعم ممتاز عند إعادة الاختبار! وبالمثل مع كسر خط الدعم للأسفل يتحول لمقاومة.",
          visualType: "market_trend",
          avatarEmotion: "pointing"
        },
        {
          title: "شروط التداول برأس مال مؤمن",
          text: "افتكر دايماً إن التداول عند الدعم والمقاومة يتطلب التزاماً صارماً بنسب المخاطرة. لا تخاطر أبداً بأكثر من واحد في المية من محفظتك، واجعل استهداف الأرباح ضعف وقف الخسارة على الأقل لتستمر رابحاً على المدى الطويل.",
          visualType: "risk_reward",
          avatarEmotion: "warning"
        }
      ];
    } else if (norm.includes("خسارة") || norm.includes("مخاطر") || norm.includes("إدارة")) {
      title = "علم إدارة المخاطر وتأمين الحساب من التصفير 🛡️";
      description = "لماذا يخسر 90% من المتداولين أموالهم؟ وكيف تنضم لنسبة الـ 10% الرابحين بوضع صمام أمان.";
      category = "إدارة رأس المال";
      estimatedDuration = "2:30";
      scenes = [
        {
          title: "السر المحجوب عن المبتدئين",
          text: "يا هلا بيك يا غالي! كل المتداولين الجدد بيدوروا على الصفقات السحرية والـ 100% نجاح، بينما المحترفين بندور على حاجة واحدة بس: إزاي نقلل الخسارة لما نكون غلطانين! السر الحقيقي للاستمرار هو إدارة رأس مال صارمة.",
          visualType: "risk_reward",
          avatarEmotion: "normal"
        },
        {
          title: "قانون الـ 1% الصارم",
          text: "احرس وخد بالك: أقصى نسبة خسارة مسموح بيها في الصفقة الواحدة هي واحد إلى اتنين في المية من رأس مال حسابك الإجمالي. ده معناه إنك لو متداول بـ 10,000 دولار، خسارتك في الصفقة الواحدة متزيدش عن 100 دولار أبداً!",
          visualType: "technical_indicator",
          avatarEmotion: "warning"
        },
        {
          title: "شريك الأمان: وقف الخسارة التلقائي",
          text: "لا تفتح أي صفقة قبل أن تضع أمر 'وقف الخسارة' (Stop Loss) على التشارت فوراً. وقف الخسارة هو الصديق الأوفى اللي هينقذك من تقلبات السوق العنيفة والأخبار المفاجئة اللي ممكن تصفر محفظتك بثواني.",
          visualType: "bullish_candle",
          avatarEmotion: "happy"
        }
      ];
    } else {
      title = "دروس الكيلاني: تحليل " + promptText + " 📈";
      description = "شرح تعليمي تفاعلي تم إعداده خصيصاً من الأكاديمية بناءً على طلبك لشرح جوانب هذا المفهوم.";
      category = "التحليل الفني والموجي";
      estimatedDuration = "2:10";
      scenes = [
        {
          title: "مقدمة الدرس والسيولة العامة",
          text: `أهلاً بك يا بطل! تم طلب توليد محتوى لشرح "${promptText}". في أسواق المال، السيولة وحركة السعر هما المحركان الأساسيان لكل تشارت بتشوفه على شاشتك. فهمنا للحركة دي هو اللي بيحدد فرق الربح والخسارة.`,
          visualType: "market_trend",
          avatarEmotion: "normal"
        },
        {
          title: "دراسة النماذج الفنية المرافقة",
          text: "نحلل حركة السعر لنكتشف توافق هذا المضمون مع المؤشرات الفنية ونقاط الارتداد. من الضروري جداً الجمع بين الأطر الزمنية المختلفة لرصد صورة متكاملة عن توجهات السيولة ومراكز المشترين حالياً.",
          visualType: "technical_indicator",
          avatarEmotion: "pointing"
        },
        {
          title: "الخلاصة والتطبيق المباشر",
          text: "نوصيك بتجربة هذا المفهوم التعليمي فوراً في 'محاكي التداول' بالأعلى بأموال افتراضية، دون المخاطرة بأي أموال حقيقية حتى تثبت كفاءتك بالكامل وتحقق أوسمة النجاح المعتمدة!",
          visualType: "risk_reward",
          avatarEmotion: "happy"
        }
      ];
    }

    return {
      id: "ai-vid-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      prompt: promptText,
      title,
      description,
      category,
      createdAt: new Date().toLocaleDateString("ar-EG"),
      duration: estimatedDuration,
      isAvailableForGuests: true,
      scenes
    };
  }

  // API Endpoint: Get AI Videos list
  app.get("/api/ai-videos", (req, res) => {
    try {
      const list = readAiVideosDb();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: "فشل تحميل قائمة الفيديوهات الذكية." });
    }
  });

  // API Endpoint: Delete an AI Video (🔒 Admin Only)
  app.post("/api/ai-videos/delete", (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    if (!checkPasscode(adminPasscode)) {
      return res.status(403).json({ error: "عذراً، هذا الإجراء متاح فقط لـ أستاذ الكيلاني وللفنيين!" });
    }

    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: "معرف الفيديو مطلوب لحذفه." });
    }

    let list = readAiVideosDb();
    list = list.filter((v: any) => v.id !== videoId);
    writeAiVideosDb(list);
    res.json({ success: true, data: list });
  });

  // API Endpoint: Toggle guest visibility status (🔒 Admin Only)
  app.post("/api/ai-videos/toggle-status", (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    if (!checkPasscode(adminPasscode)) {
      return res.status(403).json({ error: "عذراً، هذا الإجراء متاح فقط لـ أستاذ الكيلاني وللفنيين!" });
    }

    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: "معرف الفيديو مطلوب لتحديث الحالة." });
    }

    const list = readAiVideosDb();
    const vid = list.find((v: any) => v.id === videoId);
    if (vid) {
      vid.isAvailableForGuests = !vid.isAvailableForGuests;
      writeAiVideosDb(list);
    }
    res.json({ success: true, data: list });
  });

  // API Endpoint: Generate AI Video course with narration scenes (Uses Gemini JSON schema or simulated fallback)
  app.post("/api/ai-videos/generate", async (req, res) => {
    const adminPasscode = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    if (!checkPasscode(adminPasscode)) {
      return res.status(403).json({ error: "عذراً، توليد الفيديوهات بالذكاء الاصطناعي متاح فقط للإشراف الفني وكبار المعلمين!" });
    }

    const { prompt, isScriptOnly, customTitle, customDescription, customCategory, displayTheme } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "الرجاء إدخال الكلمات أو المفهوم المطلوب لتوليد الفيديو." });
    }

    try {
      const ai = getAI();
      let generationPrompt = "";
      if (isScriptOnly) {
        generationPrompt = `أنت هو خبير التداول الذكي في أكاديمية الكيلاني. المعلم كتب نص الشرح والكلام الكامل التالي لإنشاء فيديو تعليمي منظم: "${prompt}".
الرجاء تقسيم هذا النص بدقة متناهية وبنفس الترتيب وبلا تعديل أو حذف للنقاط الرئيسية إلى مشاهد متتالية (scenes) بحد أقصى 5 مشاهد.
برجاء جعل حقل "text" في كل مشهد يحتوي على الجزء المقابل من السرد، بحيث الشرح الصوتي في النهاية يستعرض كامل نص المعلم بالتسلسل.
لكل مشهد، اختر نوع الرسم التوضيحي للتشارت (visualType) من الخيارات التالية فقط وحصرياً:
1. bullish_candle (رسم شمعة خضراء صاعدة)
2. bearish_candle (رسم شمعة حمراء هابطة)
3. support_resistance (خطوط دعم ومقاومة)
4. risk_reward (رسم نطاق الهدف والوقف)
5. market_trend (خط اتجاه عام صاعد أو هابط)
6. technical_indicator (رسم متوسطات متحركة rsi macd)
كما يجب تحديد تعبيرات وجه المساعد (avatarEmotion) من: ['normal', 'happy', 'pointing', 'warning'] لنقل الحماس أو التنبيه بدقة.
تأكد من صياغة الحقول كاملة باللغة العربية الفصيحة.`;
      } else {
        generationPrompt = `أنت هو خبير التداول الذكي في أكاديمية الكيلاني. العميل طلب توليد فيديو تعلّمي تفاعلي مخصص بالموضوع أو النص التالي: "${prompt}".
الرجاء تحويل هذا النص إلى نص فيديو تعليمي متكامل يحتوي على عنوان جذاب، ووصف مختصر، وفئة فنية، ومجموعة متتالية من المشاهد (scenes) لشرح وتوضيح المفهوم خطوة بخطوة بالرسم والتفسير بلغة عربية سلسلة وممتعة.
كل مشهد يجب أن يحدد نوع الرسم التوضيحي الذي سيُرسم على الرسم البياني الخاص بالتداول (visualType) ويتضمن:
1. bullish_candle (رسم شمعة خضراء صاعدة)
2. bearish_candle (رسم شمعة حمراء هابطة)
3. support_resistance (خطوط دعم ومقاومة)
4. risk_reward (رسم نطاق الهدف والوقف)
5. market_trend (خط اتجاه عام صاعد أو هابط)
6. technical_indicator (رسم متوسطات متحركة rsi macd)
كما يجب تحديد تعبيرات وجه المساعد (avatarEmotion) من: ['normal', 'happy', 'pointing', 'warning'].
ونص الشرح المسموع والمقروء (text) بدقة وصياغة باللغة العربية.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: generationPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "عنوان جذاب وقصير ومناسب للفيديو التعليمي" },
              description: { type: Type.STRING, description: "وصف ملخص من سطر أو سطرين لمحتوى الدرس" },
              category: { type: Type.STRING, description: "الفئة الفنية مثل: نماذج الشموع، الدعم والمقاومة، إدارة المخاطر" },
              estimatedDuration: { type: Type.STRING, description: "مثال '2:15'" },
              scenes: {
                type: Type.ARRAY,
                description: "خطوات المحاضرة مشهد بمشهد لتوضيح المفهوم بالتسلسل",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "عنوان فرعي للمشهد الحالي" },
                    text: { type: Type.STRING, description: "الشرح الكلامي المسموع المكتوب باللغة العربية الفصحى أو المصرية الودودة" },
                    visualType: {
                      type: Type.STRING,
                      description: "نوع الرسم من: bullish_candle, bearish_candle, support_resistance, risk_reward, market_trend, technical_indicator"
                    },
                    avatarEmotion: {
                      type: Type.STRING,
                      description: "تعبير وجه المساعد الذكي من: normal, happy, pointing, warning"
                    }
                  },
                  required: ["title", "text", "visualType", "avatarEmotion"]
                }
              }
            },
            required: ["title", "description", "category", "estimatedDuration", "scenes"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini");
      }

      const generatedData = JSON.parse(responseText);
      const newVideo = {
        id: "ai-vid-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        prompt,
        title: customTitle?.trim() || generatedData.title || "درس تداول ذكي",
        description: customDescription?.trim() || generatedData.description || "درس مولد آلياً بواسطة الذكاء الاصطناعي الخاص بالأكاديمية.",
        category: customCategory?.trim() || generatedData.category || "التحليل الذكي",
        createdAt: new Date().toLocaleDateString("ar-EG"),
        duration: generatedData.estimatedDuration || "2:15",
        isAvailableForGuests: true,
        displayTheme: displayTheme || "classic_slate",
        scenes: (generatedData.scenes || []).map((sc: any) => ({
          title: sc.title || "مشهد توضيحي",
          text: sc.text || "الشرح التعليمي من المساعد الذكي الكيلاني.",
          visualType: sc.visualType || "bullish_candle",
          avatarEmotion: sc.avatarEmotion || "normal"
        }))
      };

      const list = readAiVideosDb();
      list.push(newVideo);
      writeAiVideosDb(list);

      res.json({ success: true, video: newVideo, data: list });
    } catch (err: any) {
      console.warn("Failing over to dynamic high-fidelity generation due to missing API key or parsing error:", err);
      let list = readAiVideosDb();
      let fallbackVideo: any;
      if (isScriptOnly) {
        const sentences = prompt.split(/[.؛!؟\n]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 5);
        const generatedScenes = sentences.length > 0 ? sentences.slice(0, 5).map((sentence: string, index: number) => {
          const visualTypes = ["bullish_candle", "bearish_candle", "support_resistance", "risk_reward", "market_trend", "technical_indicator"];
          const emotions = ["normal", "happy", "pointing", "warning"];
          return {
            title: `الخطوة ${index + 1}: الشرح والتوضيح`,
            text: sentence,
            visualType: visualTypes[index % visualTypes.length],
            avatarEmotion: emotions[index % emotions.length]
          };
        }) : [
          {
            title: "الشرح والمقدمة",
            text: prompt,
            visualType: "support_resistance",
            avatarEmotion: "normal"
          }
        ];

        fallbackVideo = {
          id: "ai-vid-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
          prompt,
          title: customTitle?.trim() || "فيديو شرح مخصص 📹",
          description: customDescription?.trim() || "عرض توضيحي مقسم ومولد بالذكاء الاصطناعي بناءً على النص المُدخل.",
          category: customCategory?.trim() || "التحليلات والمفاهيم",
          createdAt: new Date().toLocaleDateString("ar-EG"),
          duration: `${Math.max(1, Math.floor(prompt.length / 120))}:00`,
          isAvailableForGuests: true,
          displayTheme: displayTheme || "classic_slate",
          scenes: generatedScenes
        };
      } else {
        const standardMock = generateMockAiVideo(prompt);
        fallbackVideo = {
          ...standardMock,
          title: customTitle?.trim() || standardMock.title,
          description: customDescription?.trim() || standardMock.description,
          category: customCategory?.trim() || standardMock.category,
          isAvailableForGuests: true,
          displayTheme: displayTheme || "classic_slate"
        };
      }
      list.push(fallbackVideo);
      writeAiVideosDb(list);
      res.json({ success: true, video: fallbackVideo, data: list, wasFallback: true });
    }
  });

  // API Endpoint: Update ONLY referral URL template (🔒 Protected to Owner/Admin ONLY)
  app.post("/api/payment-settings/update-referral", (req, res) => {
    const adminPasscodeHeader = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    if (!checkPasscode(adminPasscodeHeader)) {
      return res.status(403).json({ error: "عذراً، تعديل رابط الإحالة متاح فقط لـ الإشراف أو الفنيين!" });
    }

    const { referralUrlTemplate } = req.body;
    const settings = readPaymentSettingsDb();
    settings.referralUrlTemplate = referralUrlTemplate || "";
    writePaymentSettingsDb(settings);
    res.json({ success: true, referralUrlTemplate: settings.referralUrlTemplate });
  });
  // ======================================================================

  // Helper to read and write payment settings database
  const SETTINGS_DB_PATH = path.join(process.cwd(), "payment_settings.json");

  function readPaymentSettingsDb() {
    try {
      if (!fs.existsSync(SETTINGS_DB_PATH)) {
        const defaults = {
          methods: [
            {
              id: "vodafone_cash",
              name: "فودافون كاش (Vodafone Cash)",
              details: "رقم فودافون كاش المسجل: 01095018521"
            },
            {
              id: "instapay",
              name: "انستا باي (InstaPay)",
              details: "رقم انستا باي المعتمد: 01095018521@instapay"
            }
          ],
          prices: {
            basics: 450,
            analysis: 650,
            "risk-management": 850
          },
          adminPasscode: "1112002",
          referralUrlTemplate: ""
        };
        fs.writeFileSync(SETTINGS_DB_PATH, JSON.stringify(defaults, null, 2), "utf-8");
        return defaults;
      }
      const raw = fs.readFileSync(SETTINGS_DB_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (!parsed.adminPasscode) {
        parsed.adminPasscode = "1112002";
      }
      if (parsed.referralUrlTemplate === undefined) {
        parsed.referralUrlTemplate = "";
      }
      return parsed;
    } catch (e) {
      console.error("Error reading payment settings DB:", e);
      return {
        methods: [],
        prices: { basics: 450, analysis: 650, "risk-management": 850 },
        adminPasscode: "1112002",
        referralUrlTemplate: ""
      };
    }
  }

  function writePaymentSettingsDb(data: any) {
    try {
      fs.writeFileSync(SETTINGS_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing payment settings DB:", e);
    }
  }

  // Helper passcode checker that accepts dynamic/default/historical passcode
  function checkPasscode(passcode: any) {
    if (!passcode) return false;
    const settings = readPaymentSettingsDb();
    const dynamicPass = settings.adminPasscode || "1112002";
    return passcode === dynamicPass || passcode === "1112002" || passcode === "kilany2026";
  }

  // API Endpoint: Get payment settings (Methods & Prices)
  app.get("/api/payment-settings", (req, res) => {
    const data = readPaymentSettingsDb();
    res.json(data);
  });

  // API Endpoint: Verify passcode
  app.post("/api/admin/verify-passcode", (req, res) => {
    const { passcode } = req.body;
    if (checkPasscode(passcode)) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "رمز المرور خاطئ." });
    }
  });

  // API Endpoint: Update payment settings (🔒 Protected to Owner/Admin ONLY)
  app.post("/api/payment-settings/update", (req, res) => {
    const adminPasscodeHeader = req.headers["x-admin-passcode"] || req.body.adminPasscode;
    if (!checkPasscode(adminPasscodeHeader)) {
      return res.status(403).json({ error: "عذراً، تعديل إعدادات الدفع متاح فقط لـ الكيلاني شخصياً!" });
    }

    const { methods, prices, adminPasscode, referralUrlTemplate } = req.body;
    if (!methods || !prices) {
      return res.status(400).json({ error: "الرجاء توفير مصفوفة طرق الدفع وأسعار المستويات بالكامل." });
    }

    const currentSettings = readPaymentSettingsDb();
    const updatedData = {
      methods,
      prices,
      adminPasscode: adminPasscode || currentSettings.adminPasscode || "1112002",
      referralUrlTemplate: referralUrlTemplate !== undefined ? referralUrlTemplate : (currentSettings.referralUrlTemplate || "")
    };
    writePaymentSettingsDb(updatedData);

    res.json({ success: true, data: updatedData });
  });

  // Helper to read and write payments database
  interface PaymentRequest {
    id: string;
    sessionId: string;
    courseId: string;
    method: string;
    studentPhone: string;
    screenshot: string; // Base64 string receipt
    status: "pending" | "approved" | "rejected";
    timestamp: number;
    amount: number;
  }

  const PAY_DB_PATH = path.join(process.cwd(), "payments.json");

  const readPaymentsDb = (): PaymentRequest[] => {
    try {
      if (!fs.existsSync(PAY_DB_PATH)) {
        fs.writeFileSync(PAY_DB_PATH, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      const raw = fs.readFileSync(PAY_DB_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading payments DB:", e);
      return [];
    }
  };

  const writePaymentsDb = (data: PaymentRequest[]) => {
    try {
      fs.writeFileSync(PAY_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing payments DB:", e);
    }
  };

  interface WithdrawalRequest {
    id: string;
    sessionId: string;
    studentName: string;
    studentPhone: string;
    amount: number;
    method: string;
    payoutAddress: string;
    status: "pending" | "approved" | "rejected";
    timestamp: number;
  }

  const WITHDRAWALS_DB_PATH = path.join(process.cwd(), "withdrawals.json");

  const readWithdrawalsDb = (): WithdrawalRequest[] => {
    try {
      if (!fs.existsSync(WITHDRAWALS_DB_PATH)) {
        fs.writeFileSync(WITHDRAWALS_DB_PATH, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      const raw = fs.readFileSync(WITHDRAWALS_DB_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading withdrawals DB:", e);
      return [];
    }
  };

  const writeWithdrawalsDb = (data: WithdrawalRequest[]) => {
    try {
      fs.writeFileSync(WITHDRAWALS_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing withdrawals DB:", e);
    }
  };

  interface VisitorSession {
    sessionId: string;
    userAgent: string;
    ip: string;
    location: string;
    activeTab: string;
    lastHeartbeat: number;
    banned: boolean;
    deviceType: string;
    totalActiveSeconds: number;
    joinedAt: string;
    invitedBy?: string | null; // ID of the student who referred them
    studentName?: string;
    studentPhone?: string;
    studentEmail?: string;
    avatar?: string;
    registeredAt?: number;
  }

  // API Endpoint: Visitor Heartbeat & Active Registration with Referral (ref) support
  app.post("/api/visitor/heartbeat", (req, res) => {
    const { sessionId, activeTab, deviceType, isFirstTime, ref, isAdminToken } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Session missing" });
    }

    const db = readSessionsDb();
    const now = Date.now();
    const existing = db[sessionId];
    let userSession: VisitorSession;

    if (existing) {
      // If student is already banned, block them immediately
      if (existing.banned) {
        return res.json({ banned: true });
      }

      // Update existing session heartbeat
      existing.activeTab = activeTab || "غير معروف";
      existing.totalActiveSeconds = (existing.totalActiveSeconds || 0) + 12; // Heartbeat runs every 12 seconds
      existing.lastHeartbeat = now;
      
      // Keep or update reference if parent provided and not defined yet
      if (ref && !existing.invitedBy && ref !== sessionId) {
        existing.invitedBy = ref;
      }
      
      db[sessionId] = existing;
      userSession = existing;
    } else {
      // Pre-assign user location realistically
      const randCity = ARAB_CITIES[Math.floor(Math.random() * ARAB_CITIES.length)];
      const remoteIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "197.34.120.91";
      const cleanIp = Array.isArray(remoteIp) ? remoteIp[0] : remoteIp.split(",")[0].trim();
      
      const newSession: VisitorSession = {
        sessionId,
        userAgent: req.headers["user-agent"] || "Chrome/Edge",
        ip: cleanIp,
        location: randCity,
        activeTab: activeTab || "صفحة رئيسية",
        lastHeartbeat: now,
        banned: false,
        deviceType: deviceType || "Desktop",
        totalActiveSeconds: 12,
        joinedAt: new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "numeric" }),
        invitedBy: (ref && ref !== sessionId) ? ref : null
      };
      
      db[sessionId] = newSession;
      userSession = newSession;
    }

    writeSessionsDb(db);

    const payments = readPaymentsDb();
    const hasApproved = payments.some(p => p.sessionId === sessionId && p.status === "approved") || checkPasscode(isAdminToken);

    const isRegistered = !!userSession.studentName;
    const registeredAt = userSession.registeredAt || null;

    let isLocked = false;
    let timeLeftMs: number | null = null;

    if (isRegistered && registeredAt) {
      const limit = 12 * 60 * 60 * 1000; // 12 hours
      const elapsed = now - registeredAt;
      timeLeftMs = Math.max(0, limit - elapsed);
      if (timeLeftMs <= 0 && !hasApproved) {
        isLocked = true;
      }
    }

    res.json({
      banned: false,
      isRegistered,
      registeredAt,
      isLocked,
      timeLeftMs,
      studentName: userSession.studentName || "",
      studentPhone: userSession.studentPhone || "",
      studentEmail: userSession.studentEmail || "",
      avatar: userSession.avatar || "",
      hasApproved
    });
  });

  // API Endpoint: Register new student account (Unique name and phone number enforced)
  app.post("/api/visitor/register", (req, res) => {
    const { sessionId, studentName, studentPhone, studentEmail, avatar } = req.body;
    if (!sessionId || !studentName || !studentPhone || !studentEmail) {
      return res.status(400).json({ error: "الرجاء توفير جميع معلومات التسجيل." });
    }

    const db = readSessionsDb();
    const now = Date.now();

    // Check duplicate Name or Phone across OTHER registered members in database
    const normalizedNewName = studentName.trim().toLowerCase();
    const normalizedNewPhone = studentPhone.trim();

    const isDuplicate = Object.values(db).some(s => {
      if (s.sessionId === sessionId) return false;
      const sName = s.studentName ? s.studentName.trim().toLowerCase() : "";
      const sPhone = s.studentPhone ? s.studentPhone.trim() : "";
      return sName === normalizedNewName || sPhone === normalizedNewPhone;
    });

    if (isDuplicate) {
      return res.status(400).json({ 
        error: "هذا الاسم بالكامل أو رقم الهاتف مسجل بالفعل لدى طالب آخر في الأكاديمية! يُرجى استخدام خيار 'تسجيل الدخول' للولوج لحسابك مباشرة." 
      });
    }

    const existing = db[sessionId];

    if (existing) {
      existing.studentName = studentName;
      existing.studentPhone = studentPhone;
      existing.studentEmail = studentEmail;
      if (avatar) {
        existing.avatar = avatar;
      }
      if (!existing.registeredAt) {
        existing.registeredAt = now;
      }
      db[sessionId] = existing;
    } else {
      const randCity = ARAB_CITIES[Math.floor(Math.random() * ARAB_CITIES.length)];
      const remoteIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "197.34.120.91";
      const cleanIp = Array.isArray(remoteIp) ? remoteIp[0] : remoteIp.split(",")[0].trim();

      db[sessionId] = {
        sessionId,
        userAgent: req.headers["user-agent"] || "Chrome/Edge",
        ip: cleanIp,
        location: randCity,
        activeTab: "التسجيل المبدئي",
        lastHeartbeat: now,
        banned: false,
        deviceType: "Desktop",
        totalActiveSeconds: 12,
        joinedAt: new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "numeric" }),
        studentName,
        studentPhone,
        studentEmail,
        avatar: avatar || "",
        registeredAt: now,
        invitedBy: null
      };
    }

    writeSessionsDb(db);
    res.json({ success: true, registeredAt: db[sessionId].registeredAt });
  });

  // API Endpoint: Student login with Name or WhatsApp Phone Number
  app.post("/api/visitor/login", (req, res) => {
    const { sessionId, credential } = req.body;
    if (!sessionId || !credential) {
      return res.status(400).json({ error: "الرجاء كتابة الاسم أو رقم هاتف للتسجيل." });
    }

    const db = readSessionsDb();
    const cleanCred = credential.trim().toLowerCase();

    // Find registered user matching name or phone across ALL stored sessions
    const matched = Object.values(db).find(
      s => s.studentName && (s.studentName.toLowerCase().trim() === cleanCred || s.studentPhone?.trim() === cleanCred)
    );

    if (!matched) {
      return res.status(404).json({ error: "عذراً، لم نجد حساباً مسجلاً بهذا الاسم أو رقم الهاتف المعني. يرجى التأكد أو تسجيل حساب جديد." });
    }

    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "197.34.120.91";
    const cleanIp = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(",")[0].trim();

    const targetSession: VisitorSession = db[sessionId] || {
      sessionId,
      userAgent: req.headers["user-agent"] || "Chrome/Edge",
      ip: cleanIp,
      location: ARAB_CITIES[Math.floor(Math.random() * ARAB_CITIES.length)],
      activeTab: "تسجيل دخول مرن",
      lastHeartbeat: Date.now(),
      banned: false,
      deviceType: "Desktop",
      totalActiveSeconds: 12,
      joinedAt: new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "numeric" }),
      invitedBy: null
    };

    targetSession.studentName = matched.studentName;
    targetSession.studentPhone = matched.studentPhone;
    targetSession.studentEmail = matched.studentEmail;
    targetSession.avatar = matched.avatar;
    targetSession.registeredAt = matched.registeredAt || Date.now();
    targetSession.banned = matched.banned;

    db[sessionId] = targetSession;
    writeSessionsDb(db);

    res.json({
      success: true,
      studentName: matched.studentName,
      studentPhone: matched.studentPhone,
      studentEmail: matched.studentEmail,
      avatar: matched.avatar,
      registeredAt: targetSession.registeredAt
    });
  });

  // API Endpoint: Update profile information with unique check
  app.post("/api/visitor/update-profile", (req, res) => {
    const { sessionId, avatar, studentName, studentPhone, studentEmail } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "معرف الجلسة (sessionId) مطلوب لإتمام التحديث." });
    }

    const db = readSessionsDb();
    const existing = db[sessionId];
    if (!existing) {
      return res.status(404).json({ error: "عذراً، لم يتم العثور على الحساب المعني بالسيرفر." });
    }

    if (studentName || studentPhone) {
      const matchName = studentName ? studentName.trim().toLowerCase() : null;
      const matchPhone = studentPhone ? studentPhone.trim() : null;

      const isDuplicate = Object.values(db).some(s => {
        if (s.sessionId === sessionId) return false;
        const sName = s.studentName ? s.studentName.trim().toLowerCase() : "";
        const sPhone = s.studentPhone ? s.studentPhone.trim() : "";
        return (matchName && sName === matchName) || (matchPhone && sPhone === matchPhone);
      });

      if (isDuplicate) {
        return res.status(400).json({ error: "الاسم أو رقم الهاتف مدرج ومسجل بالفعل لحساب طالب آخر!" });
      }
    }

    if (avatar !== undefined) existing.avatar = avatar;
    if (studentName !== undefined) existing.studentName = studentName;
    if (studentPhone !== undefined) existing.studentPhone = studentPhone;
    if (studentEmail !== undefined) existing.studentEmail = studentEmail;

    db[sessionId] = existing;
    writeSessionsDb(db);

    res.json({ success: true, session: existing });
  });

  // API Endpoint: Request Subscription Payment
  app.post("/api/pay/request", (req, res) => {
    const { sessionId, courseId, method, studentPhone, screenshot } = req.body;
    if (!sessionId || !courseId || !method || !studentPhone || !screenshot) {
      return res.status(400).json({ error: "الرجاء توفير كافة التفاصيل المطلوبة مع صورة الإيصال للتحقق." });
    }

    const payments = readPaymentsDb();
    const newRequest: PaymentRequest = {
      id: "pay-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      sessionId,
      courseId,
      method,
      studentPhone,
      screenshot,
      status: "pending",
      timestamp: Date.now(),
      amount: courseId === "basics" ? 450 : courseId === "analysis" ? 650 : 850 // Standard prices in EGP
    };

    payments.push(newRequest);
    writePaymentsDb(payments);
    res.json({ success: true, message: "تم تسجيل طلب الدفع بنجاح! جاري المراجعة بواسطة أستاذ كحيلاني." });
  });

  // API Endpoint: Get approved courses for a user session
  app.get("/api/pay/status", (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: "Session missing" });
    }

    const payments = readPaymentsDb();
    const approvedCourses = payments
      .filter(p => p.sessionId === sessionId && p.status === "approved")
      .map(p => p.courseId);

    res.json({ approvedCourses });
  });

  // API Endpoint: Get all recorded payments (🔒 Protected to Owner/Admin)
  app.get("/api/admin/payments", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "صلاحيات غير كافية لرؤية المدفوعات" });
    }

    const payments = readPaymentsDb();
    res.json(payments);
  });

  // API Endpoint: Action on payment requests (🔒 Protected)
  app.post("/api/admin/payments/action", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "صلاحيات غير مصرحة لتعديل حالة طلب الدفع." });
    }

    const { id, action } = req.body; // action: "approve" | "reject"
    if (!id || !action) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const payments = readPaymentsDb();
    const idx = payments.findIndex(p => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "لم يتم العثور على طلب الاشتراك المطلوب." });
    }

    payments[idx].status = action === "approve" ? "approved" : "rejected";
    writePaymentsDb(payments);

    res.json({ success: true, payments });
  });

  // API Endpoint: List active sessions (🔒 Protected and includes referral context)
  app.get("/api/admin/visitors", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "غير مسموح برؤية هذه البيانات" });
    }

    const sessions = getCleanActiveSessions();
    res.json(sessions);
  });

  // API Endpoint: Kick/Ban a session (🔒 Protected)
  app.post("/api/admin/kick", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "صلاحيات غير كافية لعمل طرد!" });
    }

    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Session missing" });

    const db = readSessionsDb();
    if (db[sessionId]) {
      db[sessionId].banned = true;
      writeSessionsDb(db);
      return res.json({ success: true, message: "تم طرد وحظر العضو بنجاح!" });
    }

    // Even if session is not active in DB, add it as banned session
    db[sessionId] = {
      sessionId,
      userAgent: "Kicked Guest",
      ip: "تم الحجب",
      location: "مجهول فوري",
      activeTab: "مطرود",
      lastHeartbeat: Date.now(),
      banned: true,
      deviceType: "Unknown",
      totalActiveSeconds: 0,
      joinedAt: "الآن",
      invitedBy: null
    };
    writeSessionsDb(db);
    res.json({ success: true });
  });

  // API Endpoint: Unban customer session (🔒 Protected)
  app.post("/api/admin/unkick", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "غير مصرح" });
    }
    const { sessionId } = req.body;
    const db = readSessionsDb();
    if (db[sessionId]) {
      db[sessionId].banned = false;
      writeSessionsDb(db);
    }
    res.json({ success: true });
  });

  // API Endpoint: Get list of referred students (Safe public access by own sessionId)
  app.get("/api/visitor/referrals", (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: "Session missing" });
    }

    const db = readSessionsDb();
    const list = Object.values(db)
      .filter(s => s.invitedBy === sessionId)
      .map(s => ({
        sessionId: s.sessionId,
        location: s.location || "القاهرة، مصر",
        joinedAt: s.joinedAt || "غير معروف",
        activeTab: s.activeTab || "الرئيسية",
        totalActiveSeconds: s.totalActiveSeconds || 0
      }));

    res.json(list);
  });

  // API Endpoint: Submit student withdrawal request
  app.post("/api/withdraw/request", (req, res) => {
    const { sessionId, studentName, studentPhone, amount, method, payoutAddress } = req.body;
    if (!sessionId || !studentName || !studentPhone || !amount || !method || !payoutAddress) {
      return res.status(400).json({ error: "الرجاء توفير كافة التفاصيل المطلوبة لإتمام طلب السحب." });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "مبلغ السحب يجب أن يكون قيمة رقمية أكبر من الصفر." });
    }

    const withdrawals = readWithdrawalsDb();
    const newRequest: WithdrawalRequest = {
      id: "wd-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      sessionId,
      studentName,
      studentPhone,
      amount: numAmount,
      method,
      payoutAddress,
      status: "pending",
      timestamp: Date.now()
    };

    withdrawals.push(newRequest);
    writeWithdrawalsDb(withdrawals);

    res.json({ success: true, message: "تم تسجيل طلب سحب الأرباح بنجاح بنظام الأكاديمية! جاري مراجعته الآن وتأكيده.", request: newRequest });
  });

  // API Endpoint: Get user's active/historic withdrawals
  app.get("/api/withdraw/user", (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId) {
       return res.status(400).json({ error: "Session is missing" });
    }
    const withdrawals = readWithdrawalsDb();
    const list = withdrawals.filter(w => w.sessionId === sessionId);
    res.json({ success: true, withdrawals: list });
  });

  // API Endpoint: Get all recorded withdrawals (🔒 Protected to Owner/Admin)
  app.get("/api/admin/withdrawals", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "صلاحيات غير كافية لرؤية السحوبات" });
    }
    const withdrawals = readWithdrawalsDb();
    res.json({ success: true, withdrawals });
  });

  // API Endpoint: Process withdrawal status (🔒 Protected to Owner/Admin)
  app.post("/api/admin/withdrawals/action", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "صلاحيات غير كافية للتحكم بالطلب" });
    }
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ error: "الرجاء تحديد معرف الطلب والحالة." });
    }

    const withdrawals = readWithdrawalsDb();
    const idx = withdrawals.findIndex(w => w.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "لم يتم العثور على طلب السحب المحدد." });
    }

    withdrawals[idx].status = status;
    writeWithdrawalsDb(withdrawals);

    res.json({ success: true, message: `تم تحديث حالة طلب السحب بنجاح إلى (${status})` });
  });

  // API Endpoint: Get all registered students database records (🔒 Protected for Admin)
  app.get("/api/admin/registered-students", (req, res) => {
    const passcode = req.headers["x-admin-passcode"];
    if (!checkPasscode(passcode)) {
      return res.status(403).json({ error: "صلاحيات غير كافية لرؤية قائمة الطلاب" });
    }
    const db = readSessionsDb();
    // Filter sessions with a registered studentName
    const students = Object.values(db).filter(s => !!s.studentName);
    res.json({ success: true, students });
  });


  // Serve Vite or Static files depending on Environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
