import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkle, 
  Clock, 
  Tv, 
  ArrowLeft,
  ChevronLast,
  RotateCcw,
  BookOpen,
  Send,
  Loader2
} from "lucide-react";

interface Scene {
  title: string;
  text: string;
  visualType: 'bullish_candle' | 'bearish_candle' | 'support_resistance' | 'risk_reward' | 'market_trend' | 'technical_indicator';
  avatarEmotion: 'normal' | 'happy' | 'pointing' | 'warning';
}

interface AIVideo {
  id: string;
  prompt: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  duration: string;
  isAvailableForGuests: boolean;
  displayTheme?: 'classic_slate' | 'neon_glow' | 'green_matrix' | 'warm_minimal';
  scenes: Scene[];
}

export default function AIVideoAcademy() {
  const [videos, setVideos] = useState<AIVideo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [activeVideo, setActiveVideo] = useState<AIVideo | null>(null);

  // Custom AI Video generation form states
  const [isScriptOnly, setIsScriptOnly] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customCategory, setCustomCategory] = useState("التحليل الفني الذكي");
  const [displayTheme, setDisplayTheme] = useState<'classic_slate' | 'neon_glow' | 'green_matrix' | 'warm_minimal'>('classic_slate');
  
  // Video Player state
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playerProgress, setPlayerProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<any>(null);

  // Load videos and check admin status on mount
  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error("Error loading AI videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();

    const checkAdmin = async () => {
      const token = localStorage.getItem("kilany_admin_token");
      if (!token) {
        setIsAdmin(false);
        return;
      }
      if (token === "kilany2026" || token === "1112002") {
        setIsAdmin(true);
        return;
      }
      try {
        const res = await fetch("/api/admin/verify-passcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: token })
        });
        setIsAdmin(res.ok);
      } catch (err) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
    window.addEventListener("admin-token-changed", checkAdmin);
    return () => {
      window.removeEventListener("admin-token-changed", checkAdmin);
      stopSpeech();
    };
  }, []);

  // Stop current active voice synthesis quote
  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // Speak the subtitles of the scene
  const speakScene = (text: string) => {
    stopSpeech();
    if (isMuted || !window.speechSynthesis) return;

    // Remove emojis for speech clean synthesis
    const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ar-EG";
    // Adjust pitch and rate for an authoritative tutor voice
    utterance.pitch = 0.95;
    utterance.rate = 0.88;

    utterance.onend = () => {
      // Auto advance scene at scene completion if playing
      if (isPlaying && activeVideo && currentSceneIndex < activeVideo.scenes.length - 1) {
        setTimeout(() => {
          handleNextScene();
        }, 1500);
      } else if (isPlaying && activeVideo && currentSceneIndex === activeVideo.scenes.length - 1) {
        setIsPlaying(false);
      }
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger generator endpoints
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setGenerating(true);
    try {
      const adminPasscode = localStorage.getItem("kilany_admin_token") || "";
      const res = await fetch("/api/ai-videos/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": adminPasscode
        },
        body: JSON.stringify({ 
          prompt: promptText,
          isScriptOnly,
          customTitle,
          customDescription,
          customCategory,
          displayTheme
        })
      });

      if (res.ok) {
        const resJson = await res.json();
        setVideos(resJson.data);
        setPromptText("");
        setCustomTitle("");
        setCustomDescription("");
        setCustomCategory("التحليل الفني الذكي");
        setDisplayTheme("classic_slate");
        
        // Auto-select generated video
        if (resJson.video) {
          handleSelectVideo(resJson.video);
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || "فشل توليد الفيديو.");
      }
    } catch (err) {
      alert("حدث خطأ أثناء محاولة الاتصال بالخادم.");
    } finally {
      setGenerating(false);
    }
  };

  // Toggle Visibility
  const handleToggleStatus = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const adminPasscode = localStorage.getItem("kilany_admin_token") || "";
      const res = await fetch("/api/ai-videos/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, adminPasscode })
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Video
  const handleDeleteVideo = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("هل أنت متأكد من حذف هذا الفيديو الذكي والسيناريو الخاص به نهائياً؟")) return;

    try {
      const adminPasscode = localStorage.getItem("kilany_admin_token") || "";
      const res = await fetch("/api/ai-videos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, adminPasscode })
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data.data);
        if (activeVideo?.id === videoId) {
          setActiveVideo(null);
          stopSpeech();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectVideo = (video: AIVideo) => {
    stopSpeech();
    setActiveVideo(video);
    setCurrentSceneIndex(0);
    setIsPlaying(false);
    setPlayerProgress(0);
  };

  // Player controls
  const togglePlay = () => {
    if (!activeVideo) return;
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);

    if (nextPlayState) {
      // Speak current scene immediately
      speakScene(activeVideo.scenes[currentSceneIndex].text);
    } else {
      stopSpeech();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopSpeech();
    } else if (isPlaying && activeVideo) {
      speakScene(activeVideo.scenes[currentSceneIndex].text);
    }
  };

  const handleNextScene = () => {
    if (!activeVideo) return;
    if (currentSceneIndex < activeVideo.scenes.length - 1) {
      const nextIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIndex);
      setPlayerProgress(0);
      if (isPlaying) {
        speakScene(activeVideo.scenes[nextIndex].text);
      }
    }
  };

  const handlePrevScene = () => {
    if (!activeVideo) return;
    if (currentSceneIndex > 0) {
      const prevIndex = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIndex);
      setPlayerProgress(0);
      if (isPlaying) {
        speakScene(activeVideo.scenes[prevIndex].text);
      }
    }
  };

  // Scene select
  const handleSceneSelect = (index: number) => {
    setCurrentSceneIndex(index);
    setPlayerProgress(0);
    if (isPlaying && activeVideo) {
      speakScene(activeVideo.scenes[index].text);
    }
  };

  // Track progress simulating playback
  useEffect(() => {
    if (isPlaying && activeVideo) {
      progressIntervalRef.current = setInterval(() => {
        setPlayerProgress(prev => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 1.2; // Slow progress representation
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying, currentSceneIndex, activeVideo]);

  // Dynamic canvas drawer depending on visualType!
  useEffect(() => {
    if (!canvasRef.current || !activeVideo) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const currentScene = activeVideo.scenes[currentSceneIndex];
    const visual = currentScene?.visualType || "bullish_candle";

    const draw = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      // Extract colors dynamically based on displayTheme of the video
      const theme = activeVideo?.displayTheme || "classic_slate";
      let bgColor = "#0f172a";       // slate-900
      let gridColor = "#1e293b";     // slate-800
      let watermarkColor = "#334155";
      let textColor = "#ffffff";
      let textMutedColor = "#94a3b8";
      let primaryTrendColor = "#38bdf8"; // sky-blue

      if (theme === "neon_glow") {
        bgColor = "#020617";
        gridColor = "rgba(99, 102, 241, 0.15)";
        watermarkColor = "rgba(236, 72, 153, 0.4)";
        textColor = "#f8fafc";
        textMutedColor = "#ec4899";
        primaryTrendColor = "#f43f5e";
      } else if (theme === "green_matrix") {
        bgColor = "#000000";
        gridColor = "#042f1a";
        watermarkColor = "#10b981";
        textColor = "#10b981";
        textMutedColor = "#059669";
        primaryTrendColor = "#34d399";
      } else if (theme === "warm_minimal") {
        bgColor = "#fdfbf7";
        gridColor = "#f1eade";
        watermarkColor = "#b45309";
        textColor = "#1e293b";
        textMutedColor = "#78350f";
        primaryTrendColor = "#4f46e5";
      }

      // Clear with correct background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let i = 20; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 20; j < height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Title header watermarked
      ctx.fillStyle = watermarkColor;
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      ctx.fillText("EL-KILANY AI ENGINE 🤖", 15, 20);

      ctx.fillStyle = textMutedColor;
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`VISUAL_MODE: ${visual.toUpperCase()} / THEME: ${theme.toUpperCase()}`, width - 15, 20);

      // Render chart structures based on visualType!
      switch (visual) {
        case "bullish_candle": {
          // Drawing bullish candle matching text
          const centerX = width / 2;
          const centerY = height / 2;

          // Upper and lower wick
          ctx.strokeStyle = "#10b981"; // Emerald-500
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 80);
          ctx.lineTo(centerX, centerY + 80);
          ctx.stroke();

          // Green Body growing with animation!
          const maxBodyH = 80;
          const animatedBodyH = Math.min(maxBodyH, (tick % 120) * (maxBodyH / 60));
          ctx.fillStyle = "#10b981";
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 2;
          ctx.beginPath();
          // Labels
          ctx.fillStyle = textColor;
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("شمعة صاعدة قوية (ثيران 🐂)", centerX, centerY - 95);
          ctx.fillStyle = "#10b981";
          ctx.fillText("سعر الإغلاق 📈", centerX + 75, centerY + 40 - animatedBodyH);
          ctx.fillStyle = "#ef4444";
          ctx.fillText("سعر الافتتاح", centerX + 65, centerY + 40);
          break;
        }

        case "bearish_candle": {
          const centerX = width / 2;
          const centerY = height / 2;

          // Upper and lower wick
          ctx.strokeStyle = "#ef4444"; // Rose-500
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 90);
          ctx.lineTo(centerX, centerY + 70);
          ctx.stroke();

          // Red Body growing matching tick
          const maxBodyH = 90;
          const animatedBodyH = Math.min(maxBodyH, (tick % 120) * (maxBodyH / 60));
          ctx.fillStyle = "#ef4444";
          ctx.strokeStyle = "#f87171";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(centerX - 24, centerY - 45, 48, animatedBodyH, 4);
          ctx.fill();
          ctx.stroke();

          // Labels
          ctx.fillStyle = textColor;
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("شمعة هابطة بيعية (دببة 🐻)", centerX, centerY - 105);
          ctx.fillStyle = "#ef4444";
          ctx.fillText("سعر الإغلاق 📈", centerX + 75, centerY - 45 + animatedBodyH);
          ctx.fillStyle = "#10b981";
          ctx.fillText("سعر الافتتاح", centerX + 65, centerY - 45);
          break;
        }

        case "support_resistance": {
          ctx.font = "11px sans-serif";
          ctx.textAlign = "left";

          // Resistance Level (Top)
          ctx.strokeStyle = "#ef4444"; // Red Resistance
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(10, 80);
          ctx.lineTo(width - 10, 80);
          ctx.stroke();
          ctx.fillStyle = "#f87171";
          ctx.fillText("منطقة مقاومة قوية (بيع / عرض) 🛑", 15, 73);

          // Support Level (Bottom)
          ctx.strokeStyle = "#10b981"; // Green Support
          ctx.beginPath();
          ctx.moveTo(10, height - 90);
          ctx.lineTo(width - 10, height - 90);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = "#34d399";
          ctx.fillText("منطقة دعم شرائية (طلب) 🛒", 15, height - 98);

          // Simulated oscillating line
          ctx.strokeStyle = primaryTrendColor; // Dynamic Price color
          ctx.lineWidth = 3;
          ctx.beginPath();
          let prevY = height - 90;
          ctx.moveTo(15, prevY);
          for (let col = 1; col <= 5; col++) {
            const tempX = 15 + col * 75;
            const tempY = col % 2 === 1 ? 80 : height - 90;
            ctx.lineTo(tempX, tempY);
          }
          ctx.stroke();

          ctx.fillStyle = "#6366f1";
          ctx.beginPath();
          ctx.arc(width - 40, height - 90, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = textColor;
          ctx.fillText("نقطة الارتداد الصاعد", width - 150, height - 70);
          break;
        }

        case "risk_reward": {
          const centerX = width / 2;
          const centerY = height / 2;

          // Target (Take Profit Box) - Green
          ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.fillRect(50, 60, width - 100, centerY - 60);
          ctx.strokeRect(50, 60, width - 100, centerY - 60);

          // Stop Loss Box - Red
          ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
          ctx.strokeStyle = "#ef4444";
          ctx.fillRect(50, centerY, width - 100, 80);
          ctx.strokeRect(50, centerY, width - 100, 80);

          // Entry Price Line - Blue
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(35, centerY);
          ctx.lineTo(width - 35, centerY);
          ctx.stroke();

          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 11px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("سعر الدخول 🎯", 45, centerY - 6);

          ctx.fillStyle = "#34d399";
          ctx.fillText("الهدف الفني (جني الأرباح) 💰", 60, 100);
          ctx.fillStyle = "#f87171";
          ctx.fillText("وقف الخسارة (صمام الأمان) 🛡️", 60, centerY + 45);
          break;
        }

        case "market_trend": {
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 1;

          // Drawing uptrend or downtrend waves
          ctx.strokeStyle = "#f59e0b"; // Golden trendline
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(40, height - 60);
          ctx.lineTo(width - 40, 80);
          ctx.stroke();

          ctx.fillStyle = "#f59e0b";
          ctx.font = "bold 11px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("خط اتجاه صاعد رئيسي (TREND IS YOUR FRIEND) 📈", 40, 60);

          // Prices bouncing on the trendline
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(40, height - 60);
          ctx.lineTo(120, height - 120);
          ctx.lineTo(135, height - 90); // Bounce 1
          ctx.lineTo(210, height - 160);
          ctx.lineTo(225, height - 120); // Bounce 2
          ctx.lineTo(310, height - 210);
          ctx.stroke();

          ctx.fillStyle = "#10b981";
          ctx.beginPath();
          ctx.arc(135, height - 90, 6, 0, Math.PI * 2);
          ctx.arc(225, height - 120, 6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "technical_indicator": {
          ctx.font = "11px sans-serif";
          ctx.textAlign = "left";

          // Draw main chart wave
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = 20; x < width - 20; x += 5) {
            const y = 130 + Math.sin(x / 30) * 40 + Math.cos(x / 14) * 10;
            if (x === 20) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // SMA Moving average overlaying - Smooth indicator line
          ctx.strokeStyle = "#a855f7"; // Purple MA
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let x = 20; x < width - 20; x += 5) {
            const y = 130 + Math.sin(x / 31) * 35; // Smoother wave
            if (x === 20) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.fillStyle = "#d8b4fe";
          ctx.fillText("المتوسط المتحرك الذكي SMA 💜", 30, 65);

          // RSI oscillator at the bottom part
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(20, height - 60, width - 40, 50);
          ctx.strokeStyle = "#334155";
          ctx.strokeRect(20, height - 60, width - 40, 50);

          // RSI values line
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 22; x < width - 22; x += 6) {
            const y = height - 35 + Math.sin(x / 10) * 18 + Math.cos(x / 5) * 4;
            if (x === 22) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.fillStyle = "#94a3b8";
          ctx.font = "9px sans-serif";
          ctx.fillText("مؤشر القوة النسبية RSI (قنوات تشبع)", 32, height - 48);
          break;
        }

        default:
          break;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, activeVideo, currentSceneIndex]);

  // Filter videos
  const filteredVideos = videos.filter(v => {
    const term = searchQuery.toLowerCase();
    const isPublic = v.isAvailableForGuests || isAdmin;
    return isPublic && (
      v.title.toLowerCase().includes(term) ||
      v.description.toLowerCase().includes(term) ||
      v.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/85 shadow-sm p-4 sm:p-8 space-y-8 select-none text-right" dir="rtl">
      
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkle size={10} className="text-indigo-600 font-bold" />
            تقنية التوليد التفاعلي الحصري
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans tracking-tight mt-1 flex items-center gap-2">
            معهد الكيلاني للفيديوهات والتعليم الفوري بالذكاء الاصطناعي 🤖📹
          </h2>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            ميزة كبار المعلمين لابتكار محاضرات فيديو تداول مخصصة بالكامل. يكتب المعلم النص والمفهوم، والذكاء الاصطناعي يقوم بصناعة هيكل المحاضرة وتوليد المشاهد التوضيحية المتحركة مع صوت الشرح في ثوانٍ معدودة!
          </p>
        </div>

        {/* Small admin badge indicator */}
        <div className="shrink-0">
          {isAdmin ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span>أهلاً أستاذ الكيلاني (المشرف الفني نشط) 🛡️</span>
            </div>
          ) : (
            <div className="bg-slate-50 text-slate-500 px-4.5 py-2.5 rounded-2xl text-xs font-medium">
              🧑‍🎓 وضع الولوج كعضو / زائر
            </div>
          )}
        </div>
      </div>

      {/* ADMIN LEVEL: VIDEO CREATOR STUDIO */}
      {isAdmin && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          
          {/* Decorative backdrop */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-500 font-sans tracking-tight flex items-center gap-1.5 justify-start">
                <span>ستوديو المعلم الكيلاني لتوليد الدروس التفاعلية بالذكاء الاصطناعي 🎭</span>
                <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded-full font-bold">مطور للغاية</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                تحكم بالكامل بأسلوب عرض الفيديو التفاعلي، مادة الشرح، والقنوات والمظاهر الرسومية المخصصة للأعضاء والزوار.
              </p>
            </div>
            
            {/* Generation mode toggle tab */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setIsScriptOnly(false)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${!isScriptOnly ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
              >
                💡 فكرة عامة
              </button>
              <button
                type="button"
                onClick={() => setIsScriptOnly(true)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${isScriptOnly ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
              >
                🎙️ إلقاء نص كامل (Script)
              </button>
            </div>
          </div>

          <form onSubmit={handleGenerateVideo} className="space-y-5">
            {/* Main Text Prompt/Script Field */}
            <div className="space-y-1.5 text-right">
              <label className="block text-xs font-black text-slate-300">
                {isScriptOnly ? "🎙️ نص الشرح الصوتي الكامل (سيتم تقسيمه إلى مشاهد وإلقائه بالكامل صوتياً بالذكاء الاصطناعي):" : "💡 وصف المفهوم أو موضوع الفيديو الفني بالتفصيل (سيقوم الذكاء الاصطناعي بتحليله وكتابة السيناريو):"}
              </label>
              <textarea
                required
                rows={3}
                disabled={generating}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={isScriptOnly ? "اكتب هنا النص الكامل الذي تريد تقديمه للناس وصوت الذكاء سيتحدث به بالترتيب وبلا تحريف، والتشارت سيرسم بشكل متطابق للتعبيرات!" : "اكتب فكرة الدرس الفني مثل: 'شرح كيف نكشف عن انتهاء الاتجاه الصاعد باستخدام متوسطات الحركة والدعم والمقاومة للبيع والشراء'"}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl p-4 text-xs outline-none text-white font-bold transition-all placeholder:text-slate-600 resize-none leading-relaxed"
              />
            </div>

            {/* Customizations Accordion/Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Title overriding */}
              <div className="space-y-1 text-right">
                <label className="block text-[11px] font-black text-slate-400">العنوان التعريفي (اختياري)</label>
                <input
                  type="text"
                  disabled={generating}
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="مثال: استراتيجية الكرار 🏹"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none text-white font-bold transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Description overriding */}
              <div className="space-y-1 text-right">
                <label className="block text-[11px] font-black text-slate-400">وصف موجز للمادة العلمية</label>
                <input
                  type="text"
                  disabled={generating}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="شرح عملي لاقتناص تغير الاتجاه..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none text-white font-bold transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1 text-right">
                <label className="block text-[11px] font-black text-slate-400">تخصيص الفئة الفنية</label>
                <select
                  disabled={generating}
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none text-white font-extrabold transition-all cursor-pointer"
                >
                  <option value="التحليل المالي والبياني">📈 التحليل المالي والبياني</option>
                  <option value="نماذج الشموع اليابانية">🕯️ نماذج الشموع اليابانية</option>
                  <option value="إدارة الأصول والمخاطر">🛡️ إدارة الأصول والمخاطر</option>
                  <option value="تطوير المهارات والتداول كـ بيزنس">💼 التداول كـ بيزنس</option>
                  <option value="البرمجة واستخدام الروبوتات">🤖 البرمجة والذكاء الاصطناعي</option>
                </select>
              </div>

              {/* Display Theme selector */}
              <div className="space-y-1 text-right">
                <label className="block text-[11px] font-black text-slate-400 font-sans">مظهر عرض الشارت للزوار 🎨</label>
                <select
                  disabled={generating}
                  value={displayTheme}
                  onChange={(e) => setDisplayTheme(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none text-amber-400 font-extrabold transition-all cursor-pointer"
                >
                  <option value="classic_slate">🌌 لوحة الشارت الكلاسيكي الأنيق</option>
                  <option value="neon_glow">⚡ لوحة النيون التفاعلي الساطع</option>
                  <option value="green_matrix">🟢 لوحة الماتريكس الخضراء المستوية</option>
                  <option value="warm_minimal">📜 لوحة الرسم الدافئ الهادئ (أبيض كريمي)</option>
                </select>
              </div>

            </div>

            {/* Launch CTA Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={generating || !promptText.trim()}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl transition-all font-sans text-xs flex items-center justify-center gap-2 disabled:opacity-50 select-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/10"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري هندسة مشاهد الرسوم وصوت الإلقاء بالذكاء الاصطناعي...</span>
                  </>
                ) : (
                  <>
                    <Sparkle className="w-13 h-13 animate-pulse text-slate-950 font-bold" />
                    <span>صناعة وعرض الفيديو الفني المخصص الآن ⚡</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading status box */}
          {generating && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center mt-2 flex flex-col items-center justify-center space-y-2">
              <span className="inline-block text-amber-400 font-black text-xs sm:text-sm animate-pulse">
                ⏳ جاري الاتصال بخوادم الذكاء الاصطناعي وتحليل الكلمات...
              </span>
              <p className="text-[10px] text-slate-500 max-w-lg leading-relaxed">
                يقوم معالج الخوادم بتخطيط هيكل الدرس، وتقسيم المحتوى إلى لقطات ومقاطع مرئية متحركة على التشارت، بالإضافة إلى كتابة الشرح الصوتي المنسق. يرجى الانتظار بضع ثوانٍ وسيكون الدرس المخصص متاحاً للتشغيل والعرض لزوار الأكاديمية تلقائياً!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE MOUNTED VIDEO PLAYER MODULE */}
      {activeVideo ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm relative">
          
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => {
                stopSpeech();
                setActiveVideo(null);
                setIsPlaying(false);
              }}
              className="bg-white/90 hover:bg-white text-slate-700 shadow-md p-2 rounded-xl transition-all inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>العودة للمكتبة 📁</span>
            </button>
          </div>

          {/* Left / Main visualization stage (8 columns on large screens) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Visual stage viewport */}
            <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-700 bg-slate-950 aspect-video flex flex-col items-stretch">
              
              {/* Dynamic canvas */}
              <canvas 
                ref={canvasRef} 
                width={640} 
                height={360} 
                className="w-full h-full object-cover shrink-0"
              />

              {/* Subtitles Overlay bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-5 pt-10 text-center">
                <p className="text-sm font-black text-amber-400 tracking-wide mb-1 transition-all">
                  {activeVideo.scenes[currentSceneIndex]?.title}
                </p>
                <div className="bg-slate-950/90 border border-slate-800 py-3 px-5 rounded-2xl max-w-3xl mx-auto shadow-md">
                  <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed tracking-wide shadow-sm" dir="rtl">
                    {activeVideo.scenes[currentSceneIndex]?.text}
                  </p>
                </div>
              </div>

              {/* Talking El-Kilany AI Avatar watermark overlay (Right side bottom) */}
              <div className="absolute top-16 right-4 bg-slate-910/85 border border-slate-800/80 p-2.5 rounded-2xl flex items-center gap-2.5 shadow-2xl backdrop-blur-md max-w-xs transition-opacity duration-300">
                
                {/* Simulated speech visual wave & animation icon depending on avatarEmotion */}
                <div className="relative w-12 h-12 bg-indigo-950 rounded-xl flex items-center justify-center border border-indigo-700 overflow-hidden shrink-0">
                  <div className="text-xl">
                    {activeVideo.scenes[currentSceneIndex]?.avatarEmotion === "happy" ? "😊" :
                     activeVideo.scenes[currentSceneIndex]?.avatarEmotion === "warning" ? "⚠️" :
                     activeVideo.scenes[currentSceneIndex]?.avatarEmotion === "pointing" ? "👉" : "🧑‍💼"}
                  </div>
                  {isPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 flex items-end justify-center gap-0.5 px-0.5">
                      <div className="w-1.5 h-full bg-amber-400 rounded-t animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-1.5 h-full bg-amber-400 rounded-t animate-bounce" style={{ animationDelay: "0.4s" }} />
                      <div className="w-1.5 h-full bg-amber-400 rounded-t animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-black block">الكوتش الفني الذكي</span>
                  <span className="text-[11px] font-black text-white block">مُساعد الكيلاني الافتراضي 🤖</span>
                  <span className="text-[9px] text-slate-500 font-bold block leading-none mt-0.5">
                    حالة الشرح: {isPlaying ? "يتحدث الآن... 🔊" : "متوقف مؤقتاً"}
                  </span>
                </div>
              </div>

            </div>

            {/* Video Controls and timeline sliders */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Play Pause buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={togglePlay}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-full transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                  title={isPlaying ? "إيقاف مؤقت" : "تشغيل الشرح الصوتي والمرئي"}
                >
                  {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="translate-x-[-1px]" />}
                </button>

                <button
                  onClick={handlePrevScene}
                  disabled={currentSceneIndex === 0}
                  className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-full transition-all disabled:opacity-40 cursor-pointer"
                  title="المشهد السابق"
                >
                  <ChevronRight size={16} />
                </button>

                <div className="text-xs font-mono font-bold text-slate-400 px-2 min-w-16 text-center">
                  المشهد {currentSceneIndex + 1} / {activeVideo.scenes.length}
                </div>

                <button
                  onClick={handleNextScene}
                  disabled={currentSceneIndex === activeVideo.scenes.length - 1}
                  className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-full transition-all disabled:opacity-40 cursor-pointer"
                  title="المشهد القادم"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* Progress Bar representation */}
              <div className="flex-1 w-full mx-2">
                <div className="relative w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 h-full bg-indigo-500 rounded-full transition-all duration-100"
                    style={{ width: `${playerProgress}%` }}
                  />
                </div>
              </div>

              {/* Volume text speaking toggle status */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={toggleMute}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  title={isMuted ? "تفعيل صوت المعلم" : "كتم صوت المعلم"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span className="text-[10px] font-bold shadow-sm font-sans">
                    {isMuted ? "الصوت مغلق" : "صوت المعلم نشط"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    stopSpeech();
                    setCurrentSceneIndex(0);
                    setPlayerProgress(0);
                    setIsPlaying(false);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white p-2.5 rounded-xl transition-all text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer"
                  title="إعادة بدء الفيديو"
                >
                  <RotateCcw size={13} />
                  <span>إعادة</span>
                </button>
              </div>

            </div>

            {/* Speaking instructions */}
            <div className="bg-slate-100 text-slate-600 rounded-xl p-3.5 text-center text-[11px] font-bold font-sans">
              ℹ️ نصيحة التفاعل: يتم قراءة الشروح تلقائياً بصوت عربي فصيح. تأكد من الغاء كتم الصوت وزيادة حجم مكبر الصوت الخاص بجهازك للاستماع لنصائح أستاذ الكيلاني!
            </div>

          </div>

          {/* Right / Script list panel for active video course (4 columns) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <span className="bg-indigo-50 text-indigo-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase">فهرس مشاهد وهيكل الدرس</span>
              
              <div className="space-y-1">
                <h4 className="text-md font-black text-slate-900 leading-tight">{activeVideo.title}</h4>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">{activeVideo.description}</p>
              </div>

              {/* Scrollable scene timeline */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {activeVideo.scenes.map((scene, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSceneSelect(idx)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                      idx === currentSceneIndex
                        ? "bg-indigo-50 border-indigo-400 text-indigo-950 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      idx === currentSceneIndex ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="text-right">
                      <span className="text-[11px] font-bold block">{scene.title}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        الرسم المرفق: {scene.visualType.replace("_", " ")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono">
                <span>فئة فنية: {activeVideo.category}</span>
                <span>مدة الشرح التقريبي: {activeVideo.duration}</span>
              </div>

              <button
                onClick={() => {
                  stopSpeech();
                  setActiveVideo(null);
                  setIsPlaying(false);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl transition-all text-xs"
              >
                إغلاق المشغل والعودة للقائمة الرئيسية
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* VIDEOS LIBRARY DIRECTORY GRID */
        <div className="space-y-6">
          
          {/* Search bar and count status */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-500 font-sans block">تحتوي المكتبة حالياً على:</span>
              <span className="text-sm font-black text-slate-900 font-sans leading-none">{videos.length} فيديو درس ذكي مولد</span>
            </div>

            <div className="w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو موضوع الدرس..."
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs outline-none text-right placeholder:text-slate-400 transition-colors"
              />
            </div>
          </div>

          {/* Videos listing Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs text-slate-400 font-bold mt-2">جاري استيراد دروس الذكاء الاصطناعي...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 space-y-3">
              <div className="text-4xl">📹🎬</div>
              <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
                {searchQuery ? "لم نجد نتائج مطابقة لبحثك في المكتبة." : "لا توجد فيديوهات تعلّم ذكية مولدة حالياً في الأكاديمية."}
              </p>
              {isAdmin && (
                <p className="text-[10px] text-amber-600 font-sans leading-relaxed">
                  اكتب موضوعاً جديداً في ستوديو الإدارة بالأعلى واضغط توليد لبناء أول فيديو تفاعلي لأعضائك الآن!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className="bg-white border hover:border-indigo-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  {/* Mock dynamic banner depending on category */}
                  <div className="h-32 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-4 relative text-right flex flex-col justify-between">
                    
                    {/* Badge */}
                    <div className="flex justify-between items-center">
                      <span className="bg-indigo-600/60 backdrop-blur-sm border border-indigo-400/30 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        {video.category}
                      </span>
                      
                      {/* Trash of admin */}
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleToggleStatus(video.id, e)}
                            className={`p-1.5 rounded-lg transition-all border ${
                              video.isAvailableForGuests
                                ? "bg-emerald-500/20 border-emerald-500/20 text-emerald-400"
                                : "bg-slate-700/50 border-slate-600 text-slate-400"
                            }`}
                            title={video.isAvailableForGuests ? "متاح للأعضاء والمشاهدين" : "مخفي ومحجوب عن الأعضاء"}
                          >
                            {video.isAvailableForGuests ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                          
                          <button
                            onClick={(e) => handleDeleteVideo(video.id, e)}
                            className="bg-rose-500/20 border border-rose-500/20 text-rose-400 p-1.5 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                            title="حذف الفيديو نهائياً"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Animated graphic mockup */}
                    <div className="text-right space-y-1">
                      <h4 className="text-white font-sans text-xs font-black leading-tight drop-shadow-sm group-hover:text-amber-400 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-indigo-200 font-bold font-mono">
                        تاريخ التوليد: {video.createdAt}
                      </p>
                    </div>

                    {/* Micro absolute play button inside banner */}
                    <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all border border-white/20">
                      <Play size={12} fill="currentColor" className="translate-x-[-0.5px]" />
                    </div>

                  </div>

                  {/* Body description */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed font-sans min-h-10 text-right">
                      {video.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{video.duration} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={11} />
                        <span>{video.scenes ? video.scenes.length : 0} مشاهد تفاعلية</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
