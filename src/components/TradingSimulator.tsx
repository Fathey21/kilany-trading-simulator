/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, Layers, Shield, Play, Pause, Landmark, Activity, Lightbulb, Bot, BrainCircuit, Sparkles, AlertTriangle, Gauge } from "lucide-react";
import { Candle, Position } from "../types";
import { TradingAnalytics } from "./TradingAnalytics";

interface AssetConfig {
  id: string;
  name: string;
  category: "crypto" | "forex" | "metal" | "energy" | "indices" | "stocks";
  symbol: string;
  defaultPrice: number;
  volatility: number;
  decimals: number;
}

const ASSETS: AssetConfig[] = [
  { id: "XAU/USD", name: "الذهب مقابل الدولار (XAU/USD)", category: "metal", symbol: "XAU/USD", defaultPrice: 2350.25, volatility: 4.5, decimals: 2 },
  { id: "EUR/USD", name: "اليورو مقابل الدولار (EUR/USD) - Forex", category: "forex", symbol: "EUR/USD", defaultPrice: 1.0845, volatility: 0.0016, decimals: 4 },
  { id: "GBP/USD", name: "الجنيه الإسترليني (GBP/USD) - Forex", category: "forex", symbol: "GBP/USD", defaultPrice: 1.2715, volatility: 0.0018, decimals: 4 },
  { id: "USD/JPY", name: "الدولار مقابل الين (USD/JPY) - Forex", category: "forex", symbol: "USD/JPY", defaultPrice: 156.45, volatility: 0.28, decimals: 2 },
  { id: "USOIL", name: "النفط الخام الأمريكي (Crude Oil)", category: "energy", symbol: "OIL/USD", defaultPrice: 78.40, volatility: 0.22, decimals: 2 },
  { id: "BTC/USD", name: "البيتكوين (BTC/USD) - Crypto", category: "crypto", symbol: "BTC/USD", defaultPrice: 65120, volatility: 220, decimals: 0 },
  { id: "ETH/USD", name: "الإيثريوم (ETH/USD) - Crypto", category: "crypto", symbol: "ETH/USD", defaultPrice: 3240.5, volatility: 14.5, decimals: 1 },
  { id: "SPX500", name: "مؤشر S&P 500 الأمريكي - Stock Index", category: "indices", symbol: "SPX500", defaultPrice: 5280, volatility: 11.2, decimals: 1 },
  { id: "ARAMCO", name: "سهم أرامكو السعودية - Stocks", category: "stocks", symbol: "2222.SR", defaultPrice: 30.15, volatility: 0.12, decimals: 2 }
];

interface TradingSimulatorProps {
  studentName?: string;
  studentPhone?: string;
}

export interface ExtendedPosition extends Position {
  assetId: string;
  closePrice?: number;
  closeTime?: string;
  exitReason?: "manual" | "stop-loss" | "liquidation";
  
  // Technical conditions at entry
  trendAtEntry?: string;
  volatilityAtEntry?: string;
  patternAtEntry?: string;
  rsiAtEntry?: number;
  
  // Stored state for chart binding
  candlesSnapshot?: Candle[];
}

interface StrategyItem {
  badge: string;
  title: string;
  desc: string;
  proTip: string;
  iconBg: string;
  iconText: string;
}

const STRATEGIES_MAP: Record<"bullish" | "bearish" | "sideways", StrategyItem[]> = {
  bullish: [
    {
      badge: "الاستراتيجية الأولى",
      title: "شراء الاختراقات القوية (Breakout Trading) ⚡",
      desc: "انتظر حتى يتجاوز السعر بحجم تداول كبير (Volume) مستوى المقاومة الأفقي الأخير أو القمة السابقة. بمجرد الإغلاق بشمعة كاملة فوقها، افتح صفقة شراء (Long).",
      proTip: "ضع وقف الخسارة (Stop Loss) مباشرة أسفل منطقة الاختراق المخترقة حديثاً لضمان أفضل حماية.",
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-600 border-emerald-500/20"
    },
    {
      badge: "الاستراتيجية الثانية",
      title: "الشراء عند الارتداد التصحيحي (Pullback Buying) 🎯",
      desc: "لا تلحق بالسعر المرتفع؛ انتظر بصبر حدوث حركة تراجعية مؤقتة (Dip) تلامس خط الاتجاه الصاعد المائل أو المتوسط الحسابي (EMA 50)، ومن ثم قم بالشراء فور بدء الارتداد للأعلى.",
      proTip: "هذه هي المفضلة لدى كبار البنوك وصناع السوق لتقليل حجم الانزلاق وحيازة السعر بأرخص سعر ممكن.",
      iconBg: "bg-amber-500/10",
      iconText: "text-amber-600 border-amber-500/20"
    },
    {
      badge: "الاستراتيجية الثالثة",
      title: "تتبع الاتجاه برفع مستمر للوقف (Trend Following) 🏹",
      desc: "إذا كانت لديك صفقة شراء رابحة بالفعل، لا تتعجل بجني الأرباح الكلية. الزم الاتجاه وقم برفع وحماية أمر وقف الخسارة تدريجياً (Trailing Stop) خلف القيعان الصاعدة الجديدة.",
      proTip: "اترك أرباحك تتراكم وتتدفق إلى أقصى حد وتدخل المعركة بنفس مطمئنة طالما التريند الصاعد صامد.",
      iconBg: "bg-indigo-500/10",
      iconText: "text-indigo-600 border-indigo-500/20"
    }
  ],
  bearish: [
    {
      badge: "الاستراتيجية الأولى",
      title: "البيع من المقاومة عند الارتداد (Shorting the Bounce) 📉",
      desc: "في الأسواق الهابطة، يرتد السعر مؤقتاً لأعلى لإحباط البائعين المتسرعين. انتظر حتى ملامسة السعر لخط الاتجاه الهابط أو مستويات مقاومة سابقة وافتح صفقة بيع (Short) مع ظهور شموع انعكاسية.",
      proTip: "تجنب معاندة التريند الهابط بالشراء، تذكر دوماً: التداول مع الاتجاه الهابط يوفر هامشاً آمناً وعوائد سريعة.",
      iconBg: "bg-rose-500/10",
      iconText: "text-rose-650 border-rose-500/20"
    },
    {
      badge: "الاستراتيجية الثانية",
      title: "بيع كسر الدعم المباشر (Breakdown Shorting) 🚨",
      desc: "ابحث عن مستوى القاع الأخير المشكل كمنطقة دعم قوية؛ عند إغلاق شمعة فنية واضحة أسفل هذا الدعم، فهذا يشير إلى استسلام الثيران واندلاع ذعر بيعي، ما يؤهل لفتح صفقة بيع (Short) ناجحة.",
      proTip: "احذر دائماً الكسر الكاذب (Bull Trap)، واحرص على استخدام رافعة مالية معتدلة تتماشى مع حدة الهبوط القادم.",
      iconBg: "bg-amber-500/10",
      iconText: "text-amber-600 border-amber-500/20"
    },
    {
      badge: "الاستراتيجية الثالثة",
      title: "استراتيجية الفجوات السعرية والزخم الجاري (Gap & Momentum) 💨",
      desc: "عند الهبوط السريع والمدعوم بأحجم تداول هائلة، قم بتأكيد البيع ومتابعة الاتجاه حتى يقترب السعر من مناطق التشبع البيعي الفائق على مؤشر RSI (تحت 30).",
      proTip: "بمجرد ملامسة RSI لخط 25 أو أقل بنطاق مستقر، ابدأ بالتصفية الفورية لمراكز البيع لتجنب الارتدادات العبثية السريعة.",
      iconBg: "bg-indigo-555/10",
      iconText: "text-indigo-605 border-indigo-500/20"
    }
  ],
  sideways: [
    {
      badge: "الاستراتيجية الأولى",
      title: "تداول المتذبذب اللحظي المباشر (Range Trading) ⚖️",
      desc: "ارسم خطوط مستويات القمم (مقاومة) والقيعان (دعم) المحددة للنطاق بدقة. اشترِ (Long) فور ملامسة السعر للحد السفلي، وقم بفتح صفقة بيع (Short) أو جني أرباح عند ملامسة الحد العلوي.",
      proTip: "هذه الإستراتيجية ممتازة للأسواق قليلة البيانات والأخبار، لكن يجب الحذر سريعاً وتدبير الخسارة في حال حدوث اهتزاز أو كسر.",
      iconBg: "bg-indigo-500/10",
      iconText: "text-indigo-600 border-indigo-500/20"
    },
    {
      badge: "الاستراتيجية الثانية",
      title: "مؤشر RSI للتناغم والتشبع العكسي (RSI Oscillators) 📊",
      desc: "في السوق العرضي، تكون إشارات RSI قاطعة وتتجاوز فعاليتها مقارنة بالتريند الصاعد أو الهابط. قم بالشراء فور ارتداد RSI للأعلى من تحت مستويات 30، وقم وجني الأرباح فور ملامسته الـ 70.",
      proTip: "تجاهل المتوسطات المتحركة (EMA) تماماً في الفترات العرضية، حيث تولد المتوسطات إشارات تقاطع كاذبة لا طائل منها.",
      iconBg: "bg-amber-500/10",
      iconText: "text-amber-600 border-amber-500/20"
    },
    {
      badge: "الاستراتيجية الثالثة",
      title: "الانتظار والمحافظة التامة على الوقود (Cash is King) 🛡️",
      desc: "الكثير من كبار تجار الفوركس والأسواق المالية يفضلون تجميد الحسابات والبقاء خارج حلبة الأسواق العرضية ريثما يتشكل اتجاه صعودي أو هبوطي واضح بمجموع شموع متتالية.",
      proTip: "حماية رأس مالك بعدم التداول في أوقات الهمود والتذبذب المزعج هو بحد ذاته انتصار واستراتيجية احترافية بالغة الذكاء.",
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-600 border-emerald-500/20"
    }
  ]
};

export function TradingSimulator({ studentName = "", studentPhone = "" }: TradingSimulatorProps) {
  const [walletBalance, setWalletBalance] = useState<number>(10000);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [positions, setPositions] = useState<ExtendedPosition[]>([]);
  const [tradeHistory, setTradeHistory] = useState<ExtendedPosition[]>([]);
  const [selectedHistoricalTrade, setSelectedHistoricalTrade] = useState<ExtendedPosition | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulatorView, setSimulatorView] = useState<"terminal" | "analytics">("terminal");
  const [chartTheme, setChartTheme] = useState<"traditional" | "modern">("traditional");
  const [strategyMode, setStrategyMode] = useState<"auto" | "manual">("auto");
  const [manualTrend, setManualTrend] = useState<"bullish" | "bearish" | "sideways">("bullish");
  
  // AI Active Position Analysis states
  const [analyzingPosition, setAnalyzingPosition] = useState<ExtendedPosition | null>(null);
  const [isAnalyzingActivePosition, setIsAnalyzingActivePosition] = useState<boolean>(false);
  const [activePositionAnalysisText, setActivePositionAnalysisText] = useState<string | null>(null);
  const [activePositionRiskScore, setActivePositionRiskScore] = useState<number>(0);
  const [activePositionRating, setActivePositionRating] = useState<string>("");
  const [activePositionRRRatio, setActivePositionRRRatio] = useState<string>("");
  const [activePositionAdvice, setActivePositionAdvice] = useState<string>("");
  
  // Withdrawal/Payout States and Utilities
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(170.60);
  const [withdrawMethod, setWithdrawMethod] = useState<string>("Vodafone Cash");
  const [binanceNetwork, setBinanceNetwork] = useState<string>("TRC20 (Tron)");
  const [withdrawAddress, setWithdrawAddress] = useState<string>(studentPhone || "");
  const [withdrawError, setWithdrawError] = useState<string>("");
  const [withdrawSuccess, setWithdrawSuccess] = useState<string>("");
  const [submittingWithdraw, setSubmittingWithdraw] = useState<boolean>(false);
  const [userWithdrawals, setUserWithdrawals] = useState<any[]>([]);

  const fetchUserWithdrawals = async () => {
    try {
      const deviceId = localStorage.getItem("kilany_device_id");
      if (!deviceId) return;
      const res = await fetch(`/api/withdraw/user?sessionId=${deviceId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.withdrawals) {
          setUserWithdrawals(data.withdrawals);
        }
      }
    } catch (e) {
      console.error("Failed to fetch user withdrawals:", e);
    }
  };

  useEffect(() => {
    if (showWithdrawModal) {
      fetchUserWithdrawals();
    }
  }, [showWithdrawModal]);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAddress.trim()) {
      setWithdrawError(
        withdrawMethod === "USDT"
          ? "الرجاء إدخال عنوان محفظة USDT الخاص بك من تطبيق بايننس."
          : "الرجاء إدخال رقم هاتف كاش أو عنوان IPA لاستلام الأرباح."
      );
      return;
    }
    if (withdrawAmount <= 0) {
      setWithdrawError("الرجاء إدخال قيمة صحيحة أكبر من الصفر.");
      return;
    }

    setSubmittingWithdraw(true);
    setWithdrawError("");
    setWithdrawSuccess("");

    try {
      const deviceId = localStorage.getItem("kilany_device_id");
      const res = await fetch("/api/withdraw/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: deviceId,
          studentName: studentName || "طالب الأكاديمية",
          studentPhone: studentPhone || withdrawAddress,
          amount: withdrawAmount,
          method: withdrawMethod === "USDT" ? `USDT (${binanceNetwork})` : withdrawMethod,
          payoutAddress: withdrawAddress
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWithdrawSuccess(data.message || "تم تسجيل طلب سحب الأرباح بنجاح بنظام الأكاديمية!");
        fetchUserWithdrawals();
      } else {
        const data = await res.json();
        setWithdrawError(data.error || "عذراً، فشل تسجيل الطلب.");
      }
    } catch (err) {
      console.error(err);
      setWithdrawError("مشكلة في الاتصال بالخادم الرئيسي.");
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  // Form States
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [leverage, setLeverage] = useState<number>(10);
  const [selectedAsset, setSelectedAsset] = useState<string>("XAU/USD");
  const [activeConfigTab, setActiveConfigTab] = useState<"amount" | "leverage">("amount");
  const [stopLossEnabled, setStopLossEnabled] = useState<boolean>(true); // Enabled by default as safety feature
  const [stopLossPercent, setStopLossPercent] = useState<number>(3); // Default 3% stop loss

  // Dynamic Daily Trading Tips State
  const [dailyTip, setDailyTip] = useState<string>("جاري تحميل نصيحة التداول الذكية اليومية...");
  const [loadingTip, setLoadingTip] = useState<boolean>(true);

  const fetchDailyTip = async () => {
    setLoadingTip(true);
    try {
      const response = await fetch("/api/trading-tips");
      const data = await response.json();
      if (data.success && data.tip) {
        setDailyTip(data.tip);
      } else {
        setDailyTip("التداول الفني هو لغة الأرقام وليس الحظ، تذكر وضع وقف الخسارة دوماً! 🛡️");
      }
    } catch (e) {
      setDailyTip("التداول الفني هو لغة الأرقام وليس الحظ، تذكر وضع وقف الخسارة دوماً! 🛡️");
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    fetchDailyTip();
  }, []);

  const latestPriceRef = useRef<number>(2350.25);

  // Sync real-time financial market baseline price from backend server proxy
  useEffect(() => {
    let isMounted = true;
    const updateRealMarketPrice = async () => {
      try {
        const response = await fetch("/api/live-prices");
        if (!response.ok) return;
        const prices = await response.json();
        const livePrice = prices[selectedAsset];
        if (livePrice && isMounted) {
          latestPriceRef.current = livePrice;
        }
      } catch (err) {
        console.warn("Failed to contact live financial rates proxy, using realistic drift", err);
      }
    };

    updateRealMarketPrice();
    const interval = setInterval(updateRealMarketPrice, 8000); // Poll every 8s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedAsset]);

  // Generate initial candles aligned to selected asset real-time price
  useEffect(() => {
    const currentAsset = ASSETS.find((a) => a.id === selectedAsset) || ASSETS[0];
    
    const initializeChartWithRealQuotes = async () => {
      let baselinePrice = currentAsset.defaultPrice;
      try {
        const response = await fetch("/api/live-prices");
        if (response.ok) {
          const prices = await response.json();
          if (prices[selectedAsset]) {
            baselinePrice = prices[selectedAsset];
          }
        }
      } catch (err) {
        // Fallback default
      }

      let price = baselinePrice;
      const initialCandles: Candle[] = [];
      const now = new Date();

      for (let i = 25; i >= 0; i--) {
        const timeStr = new Date(now.getTime() - i * 60 * 1000).toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        // Volatility-based fluctuation
        const change = (Math.random() - 0.495) * currentAsset.volatility * 1.5;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * (currentAsset.volatility * 0.7);
        const low = Math.min(open, close) - Math.random() * (currentAsset.volatility * 0.7);
        
        initialCandles.push({
          time: timeStr,
          open: Number(open.toFixed(currentAsset.decimals)),
          high: Number(high.toFixed(currentAsset.decimals)),
          low: Number(low.toFixed(currentAsset.decimals)),
          close: Number(close.toFixed(currentAsset.decimals))
        });
        price = close;
      }
      latestPriceRef.current = Number(price.toFixed(currentAsset.decimals));
      setCandles(initialCandles);
    };

    initializeChartWithRealQuotes();
  }, [selectedAsset]);

  // Live Chart & Positions Updater Interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCandles((prevCandles) => {
        if (prevCandles.length === 0) return prevCandles;
        const lastCandle = prevCandles[prevCandles.length - 1];
        
        const currentAsset = ASSETS.find((a) => a.id === selectedAsset) || ASSETS[0];
        
        // Random price fluctuation (price tick)
        const volatility = currentAsset.volatility;
        const tick = (Math.random() - 0.5) * volatility * 0.45;
        const currentClose = Number(Math.max(0.0001, lastCandle.close + tick).toFixed(currentAsset.decimals));
        latestPriceRef.current = currentClose;

        // Update current candle
        const updatedLast = {
          ...lastCandle,
          close: currentClose,
          high: Number(Math.max(lastCandle.high, currentClose).toFixed(currentAsset.decimals)),
          low: Number(Math.min(lastCandle.low, currentClose).toFixed(currentAsset.decimals))
        };

        const stepsRef = (window as any).chartSteps || 0;
        if (stepsRef >= 4) {
          (window as any).chartSteps = 0;
          // Generate new candle
          const nowStr = new Date().toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
          const drift = currentAsset.volatility * 0.18;
          const open = currentClose;
          const close = Number((open + (Math.random() - 0.485) * drift).toFixed(currentAsset.decimals));
          const high = Number((Math.max(open, close) + Math.random() * (volatility / 2.5)).toFixed(currentAsset.decimals));
          const low = Number((Math.min(open, close) - Math.random() * (volatility / 2.5)).toFixed(currentAsset.decimals));

          return [
            ...prevCandles.slice(1), // keep sliding window
            updatedLast,
            {
              time: nowStr,
              open,
              high,
              low,
              close
            }
          ];
        } else {
          (window as any).chartSteps = stepsRef + 1;
          return [...prevCandles.slice(0, -1), updatedLast];
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedAsset]);

  // Live Positions PNL calculation
  useEffect(() => {
    const currentPrice = latestPriceRef.current;
    
    setPositions((prevPositions) => {
      let walletRefundSum = 0;
      const active: ExtendedPosition[] = [];
      const triggeredPositions: ExtendedPosition[] = [];

      prevPositions.forEach((pos) => {
        const currentAssetLocal = ASSETS.find((a) => a.id === selectedAsset) || ASSETS[0];
        // Calculate PnL percentage based on long/short
        let pnlPercentage = 0;
        if (pos.type === "buy") {
          pnlPercentage = (currentPrice - pos.entryPrice) / pos.entryPrice;
        } else {
          pnlPercentage = (pos.entryPrice - currentPrice) / pos.entryPrice;
        }

        // Apply leverage
        const pnl = Math.round(pnlPercentage * pos.amount * pos.leverage);
        
        const updatedPos = {
          ...pos,
          pnl
        };

        // Determine if Stop Loss limit price is breached
        let isSlTriggered = false;
        if (pos.stopLossLimitPrice !== undefined) {
          if (pos.type === "buy" && currentPrice <= pos.stopLossLimitPrice) {
            isSlTriggered = true;
          } else if (pos.type === "sell" && currentPrice >= pos.stopLossLimitPrice) {
            isSlTriggered = true;
          }
        }

        // Liquidation check
        const isLiquidated = pnl <= -pos.amount;

        if (isLiquidated) {
          // Liquidated! Loss of total margin. No refund.
          const liqPrice = Number((pos.type === "buy" ? pos.entryPrice * (1 - 1 / pos.leverage) : pos.entryPrice * (1 + 1 / pos.leverage)).toFixed(currentAssetLocal.decimals));
          const liquidatedPos: ExtendedPosition = { 
            ...updatedPos, 
            pnl: -pos.amount, 
            time: "تمت التصفية ❌",
            closePrice: liqPrice,
            closeTime: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            exitReason: "liquidation",
            candlesSnapshot: [...candles]
          };
          triggeredPositions.push(liquidatedPos);
        } else if (isSlTriggered) {
          // Stop Loss triggered! Refund remaining margin (Margin + PnL)
          const slPnl = pnl;
          const slPrice = pos.stopLossLimitPrice || currentPrice;
          const slPos: ExtendedPosition = { 
            ...updatedPos, 
            pnl: slPnl, 
            time: "وقف خسارة تلقائي 🛡️",
            closePrice: slPrice,
            closeTime: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            exitReason: "stop-loss",
            candlesSnapshot: [...candles]
          };
          triggeredPositions.push(slPos);
          walletRefundSum += (pos.amount + slPnl);
        } else {
          active.push(updatedPos);
        }
      });

      if (triggeredPositions.length > 0) {
        setTradeHistory((hist) => [...triggeredPositions, ...hist]);
      }
      if (walletRefundSum > 0) {
        setWalletBalance((bal) => Math.max(0, Math.round(bal + walletRefundSum)));
      }

      return active;
    });

  }, [candles]);

  const getTechnicalConditionsAtEntry = (candlesWindow: Candle[], assetLocal: AssetConfig) => {
    let trendAtEntry = "عرضي متذبذب ⚖️";
    if (candlesWindow.length >= 5) {
      const recent = candlesWindow.slice(-5);
      const positiveChanges = recent.filter((c, idx) => idx > 0 && c.close >= recent[idx - 1].close).length;
      if (positiveChanges >= 4) trendAtEntry = "ترند صاعد قوي 📈";
      else if (positiveChanges <= 1) trendAtEntry = "ترند هابط حاد 📉";
      else if (positiveChanges >= 3) trendAtEntry = "صعود تصحيحي مؤقت ↗️";
      else trendAtEntry = "هبوط تصحيحي مؤقت ↘️";
    }

    let volatilityAtEntry = "معتدل مستقر 🍃";
    if (candlesWindow.length >= 5) {
      const recent = candlesWindow.slice(-5);
      const ranges = recent.map(c => (c.high - c.low) / c.low);
      const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;
      if (avgRange > (assetLocal.volatility * 0.05)) volatilityAtEntry = "تذبذب مرتفع وصاخب ⚡";
      else if (avgRange < (assetLocal.volatility * 0.01)) volatilityAtEntry = "تذبذب منخفض ضيق 🔒";
    }

    let patternAtEntry = "شمعة اعتيادية";
    if (candlesWindow.length >= 2) {
      const last = candlesWindow[candlesWindow.length - 1];
      const prev = candlesWindow[candlesWindow.length - 2];
      const bodySize = Math.abs(last.close - last.open);
      const totalSize = (last.high - last.low) || 0.0001;
      const lowerWick = Math.min(last.open, last.close) - last.low;
      const upperWick = last.high - Math.max(last.open, last.close);
      const isGreen = last.close >= last.open;
      
      if (lowerWick > bodySize * 2 && upperWick < bodySize) {
        patternAtEntry = "شمعة المطرقة الصاعدة (Hammer) 🔨";
      } else if (upperWick > bodySize * 2 && lowerWick < bodySize) {
        patternAtEntry = "شمعة الشهاب الهابط (Shooting Star) ☄️";
      } else if (isGreen && prev.close < prev.open && last.close > prev.open && last.open < prev.close) {
        patternAtEntry = "نموذج ابتلاع شرائي قوي (Bullish Engulfing) 🟢";
      } else if (!isGreen && prev.close > prev.open && last.close < prev.open && last.open > prev.close) {
        patternAtEntry = "نموذج ابتلاع بيعي قوي (Bearish Engulfing) 🔴";
      } else if (bodySize < totalSize * 0.1) {
        patternAtEntry = "شمعة دوجي للحيرة والتردد (Doji) ⚖️";
      } else if (isGreen) {
        patternAtEntry = "شمعة ماروبوزو شرائية صاعدة 📈";
      } else {
        patternAtEntry = "شمعة ماروبوزو بيعية هابطة 📉";
      }
    }

    let rsiAtEntry = 50;
    if (candlesWindow.length >= 14) {
      let gains = 0;
      let losses = 0;
      for (let i = candlesWindow.length - 14; i < candlesWindow.length; i++) {
        const diff = candlesWindow[i].close - candlesWindow[i].open;
        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const rs = gains / (losses || 1);
      rsiAtEntry = Math.round(100 - (100 / (1 + rs)));
      if (isNaN(rsiAtEntry)) rsiAtEntry = 50;
    } else {
      rsiAtEntry = Math.round(42 + Math.random() * 20);
    }

    return {
      trendAtEntry,
      volatilityAtEntry,
      patternAtEntry,
      rsiAtEntry
    };
  };

  const handleOpenPosition = (type: "buy" | "sell") => {
    if (walletBalance < tradeAmount) {
      alert("الرصيد غير كافٍ لفتح هذه الصفقة!");
      return;
    }

    const price = latestPriceRef.current;
    const nowStr = new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const currentAssetLocal = ASSETS.find((a) => a.id === selectedAsset) || ASSETS[0];

    // Calculate Stop Loss if enabled
    let stopLossLimitPrice: number | undefined = undefined;
    if (stopLossEnabled) {
      if (type === "buy") {
        stopLossLimitPrice = Number((price * (1 - stopLossPercent / 100)).toFixed(currentAssetLocal.decimals));
      } else {
        stopLossLimitPrice = Number((price * (1 + stopLossPercent / 100)).toFixed(currentAssetLocal.decimals));
      }
    }

    const techConditions = getTechnicalConditionsAtEntry(candles, currentAssetLocal);

    const newPosition: ExtendedPosition = {
      id: Math.random().toString(36).substring(5),
      type,
      entryPrice: price,
      amount: tradeAmount,
      leverage,
      pnl: 0,
      time: nowStr,
      assetId: selectedAsset,
      ...techConditions,
      ...(stopLossEnabled ? { stopLossLimitPrice, stopLossPercent } : {})
    };

    setPositions((prev) => [newPosition, ...prev]);
    // Subtract the margin amount from actual wallet (locked in trade)
    setWalletBalance((bal) => bal - tradeAmount);
  };

  const handleClosePosition = (posId: string) => {
    const pos = positions.find((p) => p.id === posId);
    if (!pos) return;

    if (analyzingPosition?.id === posId) {
      setAnalyzingPosition(null);
    }

    // Refund margin + PnL
    const payout = pos.amount + pos.pnl;
    setWalletBalance((bal) => Math.max(0, Math.round(bal + payout)));

    const extendedClosed: ExtendedPosition = {
      ...pos,
      time: "مغلقة الآن",
      closePrice: latestPriceRef.current,
      closeTime: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      exitReason: "manual",
      candlesSnapshot: [...candles]
    };

    // Save history
    setTradeHistory((hist) => [extendedClosed, ...hist]);
    // Remove position
    setPositions((prev) => prev.filter((p) => p.id !== posId));
  };

  const handleAnalyzeActivePosition = async (pos: ExtendedPosition) => {
    setAnalyzingPosition(pos);
    setIsAnalyzingActivePosition(true);
    setActivePositionAnalysisText(null);

    // 1. Calculate instant local metrics
    let baseRisk = 35;
    // Leverage influence
    if (pos.leverage > 10 && pos.leverage <= 30) {
      baseRisk += 15;
    } else if (pos.leverage > 30) {
      baseRisk += 35;
    }
    // Stop Loss influence
    if (!pos.stopLossLimitPrice) {
      baseRisk += 25; // Massive risk to trade without stop loss!
    }
    // RSI influence
    const rsi = pos.rsiAtEntry || 50;
    if (pos.type === "buy" && rsi > 70) {
      baseRisk += 15; // Buying in overbought territory
    } else if (pos.type === "sell" && rsi < 30) {
      baseRisk += 15; // Selling in oversold territory
    }
    // Trend alignment check
    const isTrendDown = pos.trendAtEntry?.includes("هابط");
    const isTrendUp = pos.trendAtEntry?.includes("صاعد");
    if ((pos.type === "buy" && isTrendDown) || (pos.type === "sell" && isTrendUp)) {
      baseRisk += 15; // Counter trend
    }
    const finalRisk = Math.min(99, Math.max(12, baseRisk));
    setActivePositionRiskScore(finalRisk);

    let rating = "تداول آمن ومدروس فنيًا 🟢";
    if (finalRisk >= 35 && finalRisk < 65) {
      rating = "مخاطرة مقبولة ومعتدلة 🟡";
    } else if (finalRisk >= 65) {
      rating = "صفقة عالية المخاطرة وتستدعي الحذر 🔴";
    }
    setActivePositionRating(rating);

    let rr = "1:2.0 (معياري)";
    if (!pos.stopLossLimitPrice) {
      rr = "غير محدد (مخاطرة لانهائية لعدم وجود وقف خسارة!) ⚠️";
    } else {
      rr = `1:${(3.5 - (finalRisk / 50)).toFixed(1)}`;
    }
    setActivePositionRRRatio(rr);

    // Advice logic generator
    let advice = "";
    if (!pos.stopLossLimitPrice) {
      advice = "⚠️ هام جدًا: صفتك النشطة تفتقر لأمر وقف الخسارة التلقائي (Stop Loss). يُنصح فورًا بإعادة تقييم الصفقة وتفعيل أمر الوقف لتجنب تصفية الهامش في حال حدوث انعكاس مفاجئ بالسوق.";
    } else if (finalRisk >= 65) {
      advice = `⚠️ تنبيه فني: هذه الصفقة تحمل مخاطرة عالية (${finalRisk}%) بسبب الرافعة المالية العالية (${pos.leverage}x). يُفضل جني الأرباح سريعاً عند تحقيق أي انعكاس إيجابي لصالحك وعدم الطمع.`;
    } else {
      advice = `🟢 دعم فني: إعدادات الصفقة سليمة ومستوى المخاطرة مدروس. احتفظ بالصفقة مع مراقبة تفاعل السعر عند مناطق المقاومة والدعم التاريخية للرمز.`;
    }
    setActivePositionAdvice(advice);

    // 2. Fetch from Gemini intelligent tutor api
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              sender: "user",
              text: `أهلاً بك أستاذ فتحي الكيلاني. أريدك أن تحلل صفتي التجارية المفتوحة حالياً في المحاكي وتقدم لي تقييماً فنيّاً ذكيّاً:
الأصول المالية: ${pos.assetId}
نوع المركز: ${pos.type === "buy" ? "شراء (Long)" : "بيع (Short)"}
سعر الدخول: ${pos.entryPrice} دولار
السعر الحالي بالسوق: ${latestPriceRef.current} دولار
الرافعة المالية المستخدمة: ${pos.leverage}x
الهامش المستثمر: ${pos.amount} دولار
الربح/الخسارة الجاري: ${pos.pnl} دولار

تفاصيل السوق الفنية المسجلة لحظة الدخول:
- اتجاه السوق (Trend): ${pos.trendAtEntry || "عرضي ومتذبذب"}
- نموذج الشموع اليابانية: ${pos.patternAtEntry || "شمعة اعتيادية"}
- مؤشر القوة النسبية (RSI): ${pos.rsiAtEntry || "50"}
- التذبذب العام وقت الدخول: ${pos.volatilityAtEntry || "معتدل"}
- أمر وقف الخسارة تلقائي (Stop Loss): ${pos.stopLossLimitPrice ? `مفعل عند ${pos.stopLossLimitPrice} دولار` : "غير مفعل ⚠️"}

الرجاء تقديم تحليل فني مخصص واحترافي لتقييم المخاطرة والربح لهذه الصفقة، وتقديم نصيحة تعليمية بأسلوبك كأستاذ تداول ذكي للتلميذ لتجنب الخسارة أو اقتناص الفرصة.`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setActivePositionAnalysisText(data.text);
        } else {
          throw new Error("Empty text");
        }
      } else {
        throw new Error("Non-200 response header");
      }
    } catch (err) {
      console.warn("Using fallback local premium advice because of remote server offline constraint:", err);
      // Wait slightly to show fluid interactive loader
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const customFallback = `أهلاً بك يا بني في أكاديمية فتحي الكيلاني للتداول الذكي! 📈

لقد قمت بتحليل مركزك المفتوح على أصل **${pos.assetId}** (${pos.type === "buy" ? "شراء" : "بيع"}) وسأعطيك خلاصة التحليل الفني للمخاطر وتوقع الربح بناءً على ظروف السوق وبنية الحركة الفنية الحالية:

1. **الرافعة المالية وإدارة المخاطر:** رافعتك هي **${pos.leverage}x** بهامش استثماري يبلغ **${pos.amount} دولار**. ${pos.leverage > 20 ? "هذه رافعة مالية عالية جداً تزيد من سرعة اقترابك من نقطة التصفية! يجب الحذر الشديد." : "هذه رافعة معتدلة ومقبولة لإدارة محفظة متوازنة."}
2. **أمان المركز (وقف الخسارة):** ${pos.stopLossLimitPrice ? `أحييك بشدة على تفعيل أمر وقف الخسارة تلقائياً عند مستوى **${pos.stopLossLimitPrice} دولار**! هذا هو صمام الأمان الحقيقي لثروتك ويعكس التزامك الفني بدراستنا في الأكاديمية.` : "🚨 خطر داهم! لم تقم بتفعيل أمر وقف الخسارة التلقائي في هذا المركز. بدون وقف خسارة، أنت معرض لفقدان كامل الهامش المستثمر في غمضة عين مع أي تقلب مفاجئ للاتجاه."}
3. **قرار الدخول مقابل الاتجاه والشموع:** لحظة دخولك، كان المؤشر **RSI عند مستوى ${pos.rsiAtEntry}** مع نموذج شموع هو **[${pos.patternAtEntry || "شمعة اعتيادية"}]**. ${pos.type === "buy" && (pos.rsiAtEntry || 50) > 70 ? "لقد دخلت شراء والمؤشر في منطقة تشبع شرائي زائد، وهذا يزيد احتمالات التصحيح السلبي للسعر للأسفل." : pos.type === "sell" && (pos.rsiAtEntry || 50) < 30 ? "صفقتك بيع والمؤشر في تشبع بيعي مفرط، وهو ما يدعم ارتداداً صاعداً يعاكس مركزك الفني." : "اختيارك لمركز التداول يتوافق بشكل ممتاز مع القراءة الفنية للمؤشرات ونرشح توازن القوى نحو تحقيق أهدافك."}

**نصيحة المعلم فتحي الكيلاني:** ${pos.pnl >= 0 ? `صفقتك رابحة حالياً بـ (${pos.pnl} دولار). لا تترك الطمع يسلب منك أرباحك، قم بتأمين أرباحك عبر نقل وقف الخسارة لنقطة الدخول أو إغلاق جزء من الصفقة الآن بلحظات التذبذب المناسبة!` : `الصفقة تعاني حالياً من انعكاس بسيط. التزم بصبر المتداولين المحترفين ولا تقلق ما دامت مستويات الدعم والمقاومة التاريخية تحمي وقفك، وإلا ابدأ فوراً بإعادة التقييم لتنفيذ الخروج اليدوي المبكر بأقل الأضرار.`}`;
      setActivePositionAnalysisText(customFallback);
    } finally {
      setIsAnalyzingActivePosition(false);
    }
  };

  const handleResetSimulator = (assetId?: string) => {
    setWalletBalance(10000);
    setPositions([]);
    setTradeHistory([]);
    const targetId = assetId || selectedAsset;
    const currentAsset = ASSETS.find((a) => a.id === targetId) || ASSETS[0];
    latestPriceRef.current = currentAsset.defaultPrice;
  };

  // Compute stats
  const currentAsset = ASSETS.find((a) => a.id === selectedAsset) || ASSETS[0];
  const currentPrice = candles[candles.length - 1]?.close || latestPriceRef.current;
  const isUp = candles.length > 1 ? candles[candles.length - 1].close >= candles[candles.length - 2].close : true;

  // Compute active trend type for strategy recommendations (bullish, bearish, sideways)
  const getComputedTrendForStrategies = (): "bullish" | "bearish" | "sideways" => {
    if (strategyMode === "manual") {
      return manualTrend;
    }
    
    const activeCandles = selectedHistoricalTrade && selectedHistoricalTrade.candlesSnapshot
      ? selectedHistoricalTrade.candlesSnapshot
      : candles;

    if (activeCandles.length >= 5) {
      const recent = activeCandles.slice(-5);
      const positiveChanges = recent.filter((c, idx) => idx > 0 && c.close >= recent[idx - 1].close).length;
      if (positiveChanges >= 4) return "bullish";      // ترند صاعد قوي 📈
      if (positiveChanges <= 1) return "bearish";      // ترند هابط حاد 📉
    }
    return "sideways";                                 // حركة عرضية متذبذبة ⚖️
  };

  const activeTrendType = getComputedTrendForStrategies();

  // Render SVG Candles
  const renderChart = () => {
    const activeCandles = selectedHistoricalTrade && selectedHistoricalTrade.candlesSnapshot
      ? selectedHistoricalTrade.candlesSnapshot
      : candles;

    const activeAsset = selectedHistoricalTrade
      ? (ASSETS.find((a) => a.id === selectedHistoricalTrade.assetId) || currentAsset)
      : currentAsset;

    if (activeCandles.length === 0) return null;

    // Find min and max close, open, high, low to fit correctly in viewbox
    const highs = activeCandles.map((c) => c.high);
    const lows = activeCandles.map((c) => c.low);
    const maxVal = Math.max(...highs);
    const minVal = Math.min(...lows);
    const range = maxVal - minVal || 10;
    const padding = range * 0.12;

    const chartHeight = 260;
    const chartWidth = 650;
    const padMin = minVal - padding;
    const padMax = maxVal + padding;
    const padRange = padMax - padMin;

    const scaleY = (val: number) => {
      // SVG origin 0 is at the top
      return chartHeight - ((val - padMin) / padRange) * chartHeight;
    };

    return (
      <svg className="w-full h-[260px] bg-slate-950/70 border border-slate-900 rounded-2xl p-2 select-none" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((ratio, index) => {
          const val = padMin + padRange * ratio;
          return (
            <g key={index}>
              <line x1="0" y1={scaleY(val)} x2={chartWidth} y2={scaleY(val)} stroke="#1e293b" strokeDasharray="4 4" />
              <text x={chartWidth - 5} y={scaleY(val) - 4} fill="#64748b" className="text-[10px]" textAnchor="end">
                {val.toLocaleString("en-US", { maximumFractionDigits: activeAsset.decimals, minimumFractionDigits: activeAsset.decimals })} $
              </text>
            </g>
          );
        })}

        {/* Candles */}
        {activeCandles.map((candle, index) => {
          const width = 16;
          const spacing = (chartWidth - 40) / activeCandles.length;
          const x = 10 + index * spacing;
          
          const openY = scaleY(candle.open);
          const closeY = scaleY(candle.close);
          const highY = scaleY(candle.high);
          const lowY = scaleY(candle.low);
          
          const isCandleGreen = candle.close >= candle.open;
          const candleColor = chartTheme === "traditional"
            ? (isCandleGreen ? "#10b981" : "#ef4444")
            : (isCandleGreen ? "#0ea5e9" : "#ffffff");
          
          const top = Math.min(openY, closeY);
          const bottom = Math.max(openY, closeY);
          const bodyHeight = Math.max(1.5, bottom - top);

          return (
            <g key={index} className="group cursor-pointer">
              {/* Tooltip on hover */}
              <title>{`في: ${candle.time}\nافتتاح: ${candle.open}\nأعلى: ${candle.high}\nأدنى: ${candle.low}\nإغلاق: ${candle.close}`}</title>
              
              {/* Wick */}
              <line x1={x + width / 2} y1={highY} x2={x + width / 2} y2={lowY} stroke={candleColor} strokeWidth="1.5" />
              
              {/* Real body */}
              <rect
                x={x}
                y={top}
                width={width}
                height={bodyHeight}
                fill={candleColor}
                rx="1"
                className={isCandleGreen ? "candle-shadow-up" : "candle-shadow-down"}
              />
            </g>
          );
        })}

        {/* If viewing a historical archived trade, overlay entry and exit lines */}
        {selectedHistoricalTrade && (
          <>
            {/* Entry Price Line */}
            <g>
              <line 
                x1="0" 
                y1={scaleY(selectedHistoricalTrade.entryPrice)} 
                x2={chartWidth} 
                y2={scaleY(selectedHistoricalTrade.entryPrice)} 
                stroke="#10b981" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />
              <rect 
                x="10" 
                y={Math.max(5, Math.min(chartHeight - 23, scaleY(selectedHistoricalTrade.entryPrice) - 9))} 
                width="145" 
                height="18" 
                fill="#10b981" 
                rx="4" 
              />
              <text 
                x="15" 
                y={Math.max(17, Math.min(chartHeight - 11, scaleY(selectedHistoricalTrade.entryPrice) + 3))} 
                fill="#fff" 
                className="text-[9px] font-sans font-black font-mono"
                textAnchor="start"
              >
                📥 دخول: ${selectedHistoricalTrade.entryPrice.toLocaleString("en-US", { maximumFractionDigits: activeAsset.decimals, minimumFractionDigits: activeAsset.decimals })}
              </text>
            </g>

            {/* Exit/Close Price Line */}
            {selectedHistoricalTrade.closePrice !== undefined && (
              <g>
                <line 
                  x1="0" 
                  y1={scaleY(selectedHistoricalTrade.closePrice)} 
                  x2={chartWidth} 
                  y2={scaleY(selectedHistoricalTrade.closePrice)} 
                  stroke="#ef4444" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                <rect 
                  x="165" 
                  y={Math.max(5, Math.min(chartHeight - 23, scaleY(selectedHistoricalTrade.closePrice) - 9))} 
                  width="145" 
                  height="18" 
                  fill="#ef4444" 
                  rx="4" 
                />
                <text 
                  x="170" 
                  y={Math.max(17, Math.min(chartHeight - 11, scaleY(selectedHistoricalTrade.closePrice) + 3))} 
                  fill="#fff" 
                  className="text-[9px] font-sans font-black font-mono"
                  textAnchor="start"
                >
                  📤 إغلاق: ${selectedHistoricalTrade.closePrice.toLocaleString("en-US", { maximumFractionDigits: activeAsset.decimals, minimumFractionDigits: activeAsset.decimals })}
                </text>
              </g>
            )}
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-right" id="trading-simulator-widget">
      {/* Top Banner Asset & Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-2xl text-indigo-600 border border-indigo-100">
            <Landmark size={22} />
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-xs font-semibold">محاكي الأسواق الحية لجميع التخصصات 📈</span>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <select
                value={selectedAsset}
                onChange={(e) => {
                  const assetId = e.target.value;
                  setSelectedAsset(assetId);
                  handleResetSimulator(assetId);
                }}
                className="bg-slate-50 border border-slate-250 text-slate-850 text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
              >
                {ASSETS.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-850 font-mono flex items-center gap-1.5">
                {currentPrice.toLocaleString("en-US", { maximumFractionDigits: currentAsset.decimals, minimumFractionDigits: currentAsset.decimals })}
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-sans ${isUp ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-650 border border-red-100"}`}>
                  {isUp ? "↑ صعود" : "↓ هبوط"}
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* Demo Account Balance */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-xs">
          <div className="text-right">
            <span className="text-slate-450 text-[11px] font-bold block">الرصيد التدريبي (رأس مال وهمي)</span>
            <span className="text-lg font-mono font-black text-indigo-700">${walletBalance.toLocaleString()}</span>
          </div>
          <button
            onClick={() => handleResetSimulator()}
            title="إعادة شحن الحساب لـ 10,000$"
            className="p-2 hover:bg-white active:scale-90 text-slate-400 hover:text-indigo-650 border border-transparent hover:border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Simulator Mode Switcher */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setSimulatorView("terminal")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            simulatorView === "terminal" ? "border-indigo-600 text-indigo-750 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-850"
          }`}
        >
          <Landmark size={14} />
          شاشة التداول المباشر والرسوم البيانية Live 📈
        </button>
        <button
          onClick={() => setSimulatorView("analytics")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            simulatorView === "analytics" ? "border-indigo-600 text-indigo-750 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-850"
          }`}
        >
          <Activity size={14} />
          لوحة الإحصائيات وتقارير الأداء الفني 📊
        </button>
      </div>

      {simulatorView === "terminal" ? (
        <>
          {/* Dynamic Daily Trading Tip Sub-Section */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 text-amber-750 p-2.5 rounded-xl shrink-0">
                <Lightbulb size={20} className="animate-pulse" />
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-amber-500 text-white font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-1 font-sans">
                  💡 نصيحة التداول اليومية الذكية (الكيلاني AI)
                </span>
                <p className={`text-xs sm:text-sm text-slate-800 font-sans font-extrabold leading-relaxed ${loadingTip ? "opacity-60" : ""}`}>
                  {dailyTip}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={fetchDailyTip}
              disabled={loadingTip}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 hover:border-indigo-200 rounded-xl px-3.5 py-2 text-[10.5px] font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-center bg-indigo-50/50 hover:text-indigo-700"
            >
              <RefreshCw size={12} className={loadingTip ? "animate-spin" : ""} />
              نصيحة جديدة بالذكاء الاصطناعي 🚀
            </button>
          </div>

          {/* Simulator Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Control Column (Place Order) */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
              <div>
                <h4 className="text-slate-850 font-black text-xs mb-4 border-b border-slate-250 pb-2 flex items-center justify-between">
                  <span>تخصيص الصفقة التعليمية</span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-350 text-[9px] px-2.5 py-0.5 rounded-full font-sans font-bold">تداول برافعة مالية</span>
                </h4>

                {/* Interchangeable Cards Option Toggles */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {/* Card 1: Trade Amount */}
                  <button
                    type="button"
                    onClick={() => setActiveConfigTab("amount")}
                    className={`p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 shadow-xs ${
                      activeConfigTab === "amount"
                        ? "bg-indigo-700 border-indigo-700 text-white shadow-md shadow-indigo-700/15 scale-[1.02]"
                        : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[9.5px] font-black tracking-wider ${activeConfigTab === "amount" ? "text-indigo-100" : "text-indigo-700"}`}>
                        حجم الصفقة
                      </span>
                      <DollarSign size={14} className={activeConfigTab === "amount" ? "text-indigo-100" : "text-indigo-700"} />
                    </div>
                    <div>
                      <span className="text-md sm:text-lg font-mono font-black block leading-none mt-1">
                        ${tradeAmount.toLocaleString()}
                      </span>
                      {activeConfigTab === "amount" && (
                        <span className="absolute bottom-1 left-2 text-[8px] font-bold text-indigo-200">محدد ●</span>
                      )}
                    </div>
                  </button>

                  {/* Card 2: Leverage */}
                  <button
                    type="button"
                    onClick={() => setActiveConfigTab("leverage")}
                    className={`p-3 rounded-2xl border text-right transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 shadow-xs ${
                      activeConfigTab === "leverage"
                        ? "bg-indigo-700 border-indigo-700 text-white shadow-md shadow-indigo-700/15 scale-[1.02]"
                        : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[9.5px] font-black tracking-wider ${activeConfigTab === "leverage" ? "text-indigo-100" : "text-indigo-700"}`}>
                        الرافعة المالية
                      </span>
                      <Shield size={14} className={activeConfigTab === "leverage" ? "text-indigo-100" : "text-indigo-700"} />
                    </div>
                    <div>
                      <span className="text-md sm:text-lg font-mono font-black block leading-none mt-1">
                        {leverage}x
                      </span>
                      {activeConfigTab === "leverage" && (
                        <span className="absolute bottom-1 left-2 text-[8px] font-bold text-indigo-200">محدد ●</span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Sub-card Settings Body based on active toggle */}
                {activeConfigTab === "amount" ? (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold">الهامش المستخدم بالصفقة</span>
                      <h5 className="text-xs font-black text-slate-850">تحديد حجم الهامش بالدولار</h5>
                    </div>

                    {/* Quick values list */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[100, 500, 1000, 2000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTradeAmount(amt)}
                          className={`py-2 px-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer font-black ${
                            tradeAmount === amt
                              ? "bg-indigo-700 text-white border-indigo-700 shadow-xs"
                              : "bg-slate-50 text-slate-800 border-slate-350 hover:bg-slate-100 hover:border-slate-400"
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    {/* Quick percentage helper based on current walletBalance */}
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-4 gap-1.5">
                      {[0.10, 0.25, 0.50, 1.00].map((pct) => {
                        const amt = Math.round(walletBalance * pct);
                        return (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setTradeAmount(amt > 0 ? amt : 100)}
                            className="py-1 px-0.5 text-[9.5px] font-sans font-extrabold bg-slate-50 hover:bg-slate-100 text-slate-800 hover:text-indigo-800 border border-slate-300 hover:border-slate-400 rounded-lg transition-all"
                          >
                            {pct * 100}% الرصيد
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[9.5px] text-slate-500 font-bold leading-relaxed pr-1">
                      💡 القيمة المختارة: ستقوم الحاسبة بحجز مبلغ الضمان هذا من رصيدك الحقيقي وباقي قيمة الصفقة تمول بالرافعة المحددة.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-300 px-2 py-1 rounded-md font-mono">{leverage}x</span>
                      <h5 className="text-xs font-black text-slate-850">مضاعف القوة الشرائية والرافعة</h5>
                    </div>

                    {/* Quick leverage presets with superior contrast */}
                    <div className="grid grid-cols-5 gap-1.2">
                      {[1, 5, 10, 20, 50].map((lev) => (
                        <button
                          key={lev}
                          type="button"
                          onClick={() => setLeverage(lev)}
                          className={`py-1.5 px-0.5 text-[11px] font-mono rounded-lg border transition-all cursor-pointer font-black ${
                            leverage === lev
                              ? "bg-indigo-700 text-white border-indigo-700 shadow-xs"
                              : "bg-slate-50 text-slate-850 border-slate-350 hover:bg-slate-100 hover:border-slate-400"
                          }`}
                        >
                          {lev}x
                        </button>
                      ))}
                    </div>

                    {/* Leverage slider */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={leverage}
                        onChange={(e) => setLeverage(Number(e.target.value))}
                        className="w-full accent-indigo-700 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none border border-slate-300"
                      />
                      <div className="flex justify-between items-center text-[9.5px] text-slate-600 font-black font-mono">
                        <span>خطر منخفض (1x)</span>
                        <span>أقصى مخاطرة (50x)</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl">
                      <p className="text-[9.5px] text-amber-950 font-bold leading-relaxed leading-3.5">
                        ⚠️ تنبيه الرافعة المالية: تضاعف حجم الربح أو الخسارة بمقدار {leverage} ضعفاً! الرافعة المرتفعة تسرّع تصفية الصفقة وإلغاء الرصيد سريعاً في حال سار السعر عكس اتجاه توقعك.
                      </p>
                    </div>
                  </div>
                )}

                {/* Stop Loss (وقف الخسارة) Control Section */}
                <div className="bg-slate-100/85 border border-slate-200/90 p-3.5 rounded-2xl space-y-3 mt-4 text-right">
                  <div className="flex items-center justify-between">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={stopLossEnabled}
                        onChange={(e) => setStopLossEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                    </label>
                    <span className="text-xs font-black text-slate-850 flex items-center gap-1.5 font-sans">
                      <Shield size={13} className="text-rose-600" />
                      <span>إدارة المخاطر: وقف الخسارة تلقائي</span>
                    </span>
                  </div>

                  {stopLossEnabled && (
                    <div className="space-y-2.5 animate-fade-in bg-white p-2.5 rounded-xl border border-slate-200 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">بنسبة مئوية من السعر</span>
                        <span className="text-xs font-bold text-slate-700 font-serif">
                          نسبة الوقف: <span className="font-mono text-rose-600 font-black">{stopLossPercent}%</span>
                        </span>
                      </div>

                      {/* Presets */}
                      <div className="grid grid-cols-5 gap-1">
                        {[1, 2, 3, 5, 8].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setStopLossPercent(pct)}
                            className={`py-1 text-[10.5px] font-mono rounded-lg border transition-all cursor-pointer font-black ${
                              stopLossPercent === pct
                                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                : "bg-slate-50 text-slate-800 border-slate-350 hover:bg-slate-100 hover:border-slate-400"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>

                      {/* Percentage slider */}
                      <div className="space-y-1">
                        <input
                          type="range"
                          min="0.5"
                          max="15"
                          step="0.5"
                          value={stopLossPercent}
                          onChange={(e) => setStopLossPercent(Number(e.target.value))}
                          className="w-full accent-rose-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none border border-slate-350"
                        />
                        <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono font-bold">
                          <span>0.5% (حذر)</span>
                          <span>15% (واسع)</span>
                        </div>
                      </div>

                      <p className="text-[9px] text-slate-500 font-bold leading-relaxed pr-1 leading-3.5">
                        سيتم إغلاق الصفقة فوراً وتلقائياً عندما يتحرك السعر بـ <span className="text-rose-600">{stopLossPercent}%</span> عكس توقعك للحماية من تصفية كامل الضمان المالي.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buy / Sell Buttons */}
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => handleOpenPosition("buy")}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-black py-3 px-4 rounded-xl flex items-center justify-between transition-all shadow-md shadow-emerald-700/10 cursor-pointer"
                >
                  <ArrowUpRight size={18} />
                  <div className="text-center flex-1">
                    <span className="block text-[10px] text-emerald-100 font-bold">توقع صعود السعر</span>
                    <span className="text-xs font-sans font-black">فتح صفقة شراء (Long)</span>
                  </div>
                  <div className="w-4" />
                </button>

                <button
                  onClick={() => handleOpenPosition("sell")}
                  className="w-full bg-rose-700 hover:bg-rose-600 active:scale-95 text-white font-black py-3 px-4 rounded-xl flex items-center justify-between transition-all shadow-md shadow-rose-700/10 cursor-pointer"
                >
                  <ArrowDownRight size={18} />
                  <div className="text-center flex-1">
                    <span className="block text-[10px] text-rose-100 font-bold">توقع هبوط السعر</span>
                    <span className="text-xs font-sans font-black">فتح صفقة بيع (Short)</span>
                  </div>
                  <div className="w-4" />
                </button>
              </div>
            </div>

            {/* Center Ticker Chart Column */}
            <div className="lg:col-span-2 space-y-4">
              {selectedHistoricalTrade && (
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in text-right shadow-md" dir="rtl">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500 text-slate-950 p-2 rounded-xl shrink-0">
                      <Activity size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap justify-end sm:justify-start">
                        <span className="text-xs font-black text-amber-400">🔍 وضع مراجعة لقطة الصفقة المؤرشفة</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${selectedHistoricalTrade.type === "buy" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-350"}`}>
                          {selectedHistoricalTrade.type === "buy" ? "شراء (Long)" : "بيع (Short)"}
                        </span>
                        <span className="text-[10px] text-indigo-200">على {selectedHistoricalTrade.assetId}</span>
                      </div>
                      <p className="text-[11px] text-indigo-150 mt-1 font-sans">
                        تصفح الرسم البياني المجمد ومستويات الدخول/الإغلاق والظروف الفنية للصفقة.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedHistoricalTrade(null)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-md shrink-0 w-full sm:w-auto text-center"
                  >
                    إلغاء والعودة للبث الحي 📡
                  </button>
                </div>
              )}

              <div className="relative">
                {renderChart()}
                {/* Play/Pause controls & Theme Switcher */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-slate-900/80 hover:bg-slate-800 p-1.5 rounded-lg text-white cursor-pointer border border-slate-700/50 flex items-center justify-center transition-all"
                    title={isPlaying ? "إيقاف مؤقت لحركة السعر" : "تشغيل حركة الأسعار في الوقت الحقيقي"}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>

                  <div className="bg-slate-900/85 backdrop-blur-xs border border-slate-750 p-0.5 rounded-lg flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => setChartTheme("traditional")}
                      className={`px-2 py-1 text-[9px] font-extrabold rounded transition-all cursor-pointer flex items-center gap-1 ${
                        chartTheme === "traditional"
                          ? "bg-slate-800 text-emerald-400 font-extrabold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="w-1 to-1.5 h-1 to-1.5 rounded-full bg-emerald-500"></span>
                      <span>تقليدي (🟢/🔴)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartTheme("modern")}
                      className={`px-2 py-1 text-[9px] font-extrabold rounded transition-all cursor-pointer flex items-center gap-1 ${
                        chartTheme === "modern"
                          ? "bg-slate-800 text-sky-450 font-extrabold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="w-1 to-1.5 h-1 to-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                      <span>حديث (🔵/⚪)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Top 3 Proposed Technical Strategies Card */}
              <div className="bg-gradient-to-br from-indigo-50/60 via-white to-slate-50/70 border border-indigo-150/80 p-5 rounded-2xl text-right space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-indigo-100 pb-3" dir="rtl">
                  <div>
                    <h4 className="text-slate-850 font-black text-sm flex items-center gap-1.5 font-sans">
                      <Sparkles size={16} className="text-indigo-600 animate-pulse" />
                      <span>دليل أفضل 3 استراتيجيات تداول مقترحة 🧠</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      توصيات فنية متطورة تعتمد على سلوك السعر الحالي وحالة التريند العام لدعم قراراتك الاستثمارية.
                    </p>
                  </div>
                  
                  {/* Mode Selector Option: Auto / Manual */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStrategyMode("auto")}
                      className={`px-3 py-1.5 text-[10px] rounded-lg transition-all font-bold cursor-pointer flex items-center gap-1 ${
                        strategyMode === "auto"
                          ? "bg-white text-indigo-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <RefreshCw size={10} className={strategyMode === "auto" && isPlaying ? "animate-spin" : ""} />
                      <span>رصد تلقائي بالشارت 📡</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStrategyMode("manual")}
                      className={`px-3 py-1.5 text-[10px] rounded-lg transition-all font-bold cursor-pointer ${
                        strategyMode === "manual"
                          ? "bg-white text-indigo-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span>اختيار يدوي للتعلم 🎓</span>
                    </button>
                  </div>
                </div>

                {/* Sub-header showing active trend state and description */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-100/40 p-3 rounded-xl border border-slate-200/50" dir="rtl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-bold">حالة حركة السوق الحالية:</span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 border-r-3 ${
                      activeTrendType === "bullish"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                        : activeTrendType === "bearish"
                          ? "bg-rose-50 text-rose-705 border-rose-500"
                          : "bg-indigo-50 text-indigo-700 border-indigo-500"
                    }`}>
                      {activeTrendType === "bullish" && "📈 اتجاه صاعد قوي (Bullish Trend)"}
                      {activeTrendType === "bearish" && "📉 اتجاه هابط حاد (Bearish Trend)"}
                      {activeTrendType === "sideways" && "⚖️ حركة عرضية متذبذبة (Sideways Range)"}
                    </span>
                  </div>

                  {/* If strategyMode === "manual", show manual selection buttons to study with */}
                  {strategyMode === "manual" ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setManualTrend("bullish")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg border font-black transition-all cursor-pointer ${
                          manualTrend === "bullish"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        صاعد 📈
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualTrend("sideways")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg border font-black transition-all cursor-pointer ${
                          manualTrend === "sideways"
                            ? "bg-indigo-650 text-white border-indigo-650"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        عرضي ⚖️
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualTrend("bearish")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg border font-black transition-all cursor-pointer ${
                          manualTrend === "bearish"
                            ? "bg-rose-600 text-white border-rose-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        هابط 📉
                      </button>
                    </div>
                  ) : (
                    <span className="text-[9.5px] text-slate-400 font-bold font-sans">
                      {isPlaying ? "📡 يتم تقييم الاتجاه من حركة الشموع الحية مباشرة" : "⏸️ محاكي السوق متوقف مؤقتاً"}
                    </span>
                  )}
                </div>

                {/* Grid layout containing 3 Strategy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5" dir="rtl">
                  {(STRATEGIES_MAP[activeTrendType] || STRATEGIES_MAP.sideways).map((strat, idx) => (
                    <div 
                      key={idx}
                      className="bg-white border border-slate-200 rounded-2xl p-3.5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Strategy designation badge */}
                        <div className="flex items-center justify-between">
                          <span className={`${strat.iconBg} ${strat.iconText.split(" ")[0]} text-[9px] font-black px-2 py-0.5 rounded-lg border border-indigo-100/10`}>
                            {strat.badge}
                          </span>
                          <span className="text-[9.5px] text-slate-450 font-bold font-mono">#{idx+1}</span>
                        </div>
                        
                        {/* Strategy Title */}
                        <h5 className="text-[11.5px] font-extrabold text-slate-800 font-sans leading-tight">
                          {strat.title}
                        </h5>
                        
                        {/* Strategy Description */}
                        <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans font-normal text-justify">
                          {strat.desc}
                        </p>
                      </div>

                      {/* Micro-learning callout box */}
                      <div className="mt-3 pt-2 w-full border-t border-slate-100 bg-slate-50/50 p-2 rounded-xl">
                        <span className="text-[8.5px] text-indigo-750 font-black block mb-0.5">💡 إرشاد فني مخصص:</span>
                        <p className="text-[9.5px] text-slate-550 leading-normal font-sans">
                          {strat.proTip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedHistoricalTrade && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-right space-y-4 animate-fade-in">
                  <h4 className="text-slate-850 font-black text-xs border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">المعرّف الكودي: #{selectedHistoricalTrade.id}</span>
                    <span className="flex items-center gap-1.5 font-sans font-extrabold text-slate-800">
                      <Lightbulb size={14} className="text-amber-500" />
                      <span>التحليل الفني للظروف وقت لحظة الدخول 🛡️</span>
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Trend Card */}
                    <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-xs">
                      <span className="text-slate-400 text-[9px] block font-bold mb-1">اتجاه السوق (Trend)</span>
                      <span className="text-xs font-black text-slate-800 font-sans block truncate">
                        {selectedHistoricalTrade.trendAtEntry || "غير متوفر"}
                      </span>
                    </div>

                    {/* Volatility Card */}
                    <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-xs">
                      <span className="text-slate-400 text-[9px] block font-bold mb-1">حمى التذبذب (Volatility)</span>
                      <span className="text-xs font-black text-slate-800 font-sans block truncate">
                        {selectedHistoricalTrade.volatilityAtEntry || "غير متوفر"}
                      </span>
                    </div>

                    {/* Candlestick Pattern Card */}
                    <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-xs">
                      <span className="text-slate-400 text-[9px] block font-bold mb-1">نموذج الشموع الداعم</span>
                      <span className="text-xs font-black text-indigo-700 font-sans block truncate">
                        {selectedHistoricalTrade.patternAtEntry || "نموذج اعتيادي"}
                      </span>
                    </div>

                    {/* RSI Card */}
                    <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-xs">
                      <span className="text-slate-400 text-[9px] block font-bold mb-1">مؤشر القوة النسبية RSI</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black text-slate-800 font-mono">
                          {selectedHistoricalTrade.rsiAtEntry || 50}
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full ${
                              (selectedHistoricalTrade.rsiAtEntry || 50) > 70 
                                ? "bg-rose-500" 
                                : (selectedHistoricalTrade.rsiAtEntry || 50) < 30 
                                  ? "bg-emerald-500" 
                                  : "bg-indigo-500"
                            }`}
                            style={{ width: `${selectedHistoricalTrade.rsiAtEntry || 50}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[8px] text-slate-450 block mt-1">
                        {(selectedHistoricalTrade.rsiAtEntry || 50) > 70 
                          ? "تشبع شرائي مفرط ⚠️" 
                          : (selectedHistoricalTrade.rsiAtEntry || 50) < 30 
                            ? "تشبع بيعي (فرصة شراء) 🟢" 
                            : "منطقة توازن واستقرار ⚖️"}
                      </span>
                    </div>
                  </div>

                  {/* Profit or loss evaluation audit */}
                  <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <p className="text-[11px] text-slate-650 font-sans leading-relaxed">
                      💡 <span className="font-bold text-slate-800">مراجعة المعلم:</span> لقد دخلت صفقة <span className="font-bold">{selectedHistoricalTrade.type === "buy" ? "شراء" : "بيع"}</span> برافعة {selectedHistoricalTrade.leverage}x وهامش ${selectedHistoricalTrade.amount}. 
                      ولحظة الدخول كانت الشموع تدعم <span className="font-black text-indigo-700">({selectedHistoricalTrade.patternAtEntry || "التوازن"})</span> مع ترند <span className="font-bold text-slate-800">{selectedHistoricalTrade.trendAtEntry}</span>. 
                      {selectedHistoricalTrade.pnl >= 0 
                        ? " كان قرارك الفني ممتازاً ومجرى الاتجاه تحالف مع قرار الدخول مما أسفر عن ربح رائع!" 
                        : " سار السعر على عكس نموذج الدخول، تذكر دائماً أهمية وقف الخسارة التلقائي لتجنب تبعات الانعكاس الفني."}
                    </p>
                    <div className="text-left font-mono shrink-0">
                      <span className="text-slate-400 text-[10px] block">النتيجة النهائية</span>
                      <span className={`text-md font-black ${selectedHistoricalTrade.pnl >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                        {selectedHistoricalTrade.pnl >= 0 ? "+" : ""}{selectedHistoricalTrade.pnl} $
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Open Positions List */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-right">
                <h4 className="text-slate-850 font-bold text-xs mb-3 flex items-center justify-between">
                  <span className="text-slate-400 font-normal">({positions.length} مفتوحة)</span>
                  <span className="flex items-center gap-1 font-sans font-extrabold text-slate-700">
                    <Layers size={14} className="text-indigo-600" /> صفقاتك النشطة حالياً
                  </span>
                </h4>

                {/* AI Active Position Analysis Panel */}
                {analyzingPosition && (
                  <div className="mb-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-4 text-white text-right space-y-4 animate-fade-in shadow-xl" dir="rtl">
                    <div className="flex items-center justify-between border-b border-indigo-900 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                          تحليل مباشر 📡 {analyzingPosition.assetId}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-extrabold text-xs text-amber-400 flex items-center gap-1 font-sans">
                            <span>تقرير المخاطر والأرباح الذكي للـصفقة</span>
                            <BrainCircuit size={14} className="text-amber-400 animate-pulse" />
                          </h5>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAnalyzingPosition(null)}
                        className="bg-red-500/15 hover:bg-red-500/30 text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer font-bold font-sans"
                      >
                        إخفاء التحليل الفني ✖
                      </button>
                    </div>

                    {/* Quick Analysis metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Risk Score Meter */}
                      <div className="bg-slate-900/40 border border-indigo-950/30 p-3 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <Gauge size={12} className="text-rose-400" />
                          <span className="text-indigo-200 text-[9px] font-extrabold">مؤشر الخطورة</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-black font-mono ${activePositionRiskScore >= 65 ? "text-red-400" : activePositionRiskScore >= 35 ? "text-amber-400" : "text-emerald-400"}`}>
                            {activePositionRiskScore}%
                          </span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${activePositionRiskScore >= 65 ? "bg-red-500" : activePositionRiskScore >= 35 ? "bg-amber-400" : "bg-emerald-400"}`}
                              style={{ width: `${activePositionRiskScore}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[8.5px] text-indigo-300 mt-1 block">
                          {activePositionRiskScore >= 65 ? "مخاطرة عالية للغاية" : activePositionRiskScore >= 35 ? "مخاطرة معتدلة ومتاحة" : "تداول نموذجي آمن"}
                        </span>
                      </div>

                      {/* Entry Quality */}
                      <div className="bg-slate-900/40 border border-indigo-950/30 p-3 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <Sparkles size={12} className="text-amber-400" />
                          <span className="text-indigo-200 text-[9px] font-extrabold">التقييم الفني للدخول</span>
                        </div>
                        <span className="text-[10px] font-black text-white mt-1.5 block">
                          {activePositionRating}
                        </span>
                        <span className="text-[8.5px] text-indigo-200 block mt-1">
                          بناءً على الشموع والمؤشرات
                        </span>
                      </div>

                      {/* RR Ratio suggested */}
                      <div className="bg-slate-900/40 border border-indigo-950/30 p-3 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <TrendingUp size={12} className="text-emerald-400" />
                          <span className="text-indigo-200 text-[9px] font-extrabold">العائد/المخاطرة المتوقع</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 mt-1.5 block font-mono">
                          {activePositionRRRatio}
                        </span>
                        <span className="text-[8.5px] text-indigo-200 block mt-1">
                          Calculated Target Ratio
                        </span>
                      </div>

                      {/* Leverage Alarm */}
                      <div className="bg-slate-900/40 border border-indigo-950/30 p-3 rounded-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1">
                          <AlertTriangle size={12} className="text-amber-500" />
                          <span className="text-indigo-200 text-[9px] font-extrabold">حجم الرافعة والضمان</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-400 mt-1.5 block">
                          {analyzingPosition.leverage}x (${analyzingPosition.amount})
                        </span>
                        <span className="text-[8.5px] text-indigo-200 block mt-1">
                          تأثير مضاعف عالي التذبذب
                        </span>
                      </div>
                    </div>

                    {/* AI Coach Detailed Text Response */}
                    <div className="bg-indigo-950/80 border border-indigo-500/20 p-3.5 rounded-xl text-xs space-y-2 leading-relaxed">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-indigo-200 text-[9px] font-mono">المساعد الذكي (الكيلاني AI)</span>
                        <Bot size={13} className="text-indigo-400 animate-pulse" />
                      </div>

                      {isAnalyzingActivePosition ? (
                        <div className="py-4 flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="text-indigo-400 animate-spin" size={20} />
                          <p className="text-[10px] text-indigo-200 font-bold font-sans animate-pulse">
                            يقوم كوتش الكيلاني الآن بالتحقق من هيكلية الحركة الفنية وظروف اتجاه الرمز...
                          </p>
                        </div>
                      ) : activePositionAnalysisText ? (
                        <p className="text-[11px] text-slate-100 font-sans whitespace-pre-wrap leading-relaxed text-right" dir="rtl">
                          {activePositionAnalysisText}
                        </p>
                      ) : (
                        <p className="text-[10.5px] text-red-300 font-sans text-center">
                          فشل تحديث التقرير الفني. حاول مجددًا بالضغط على زر التحليل الفني.
                        </p>
                      )}
                    </div>

                    {/* Quick Advice Badge */}
                    <div className="bg-indigo-900/30 border border-indigo-800/40 px-3 py-2 rounded-xl text-[10.5px] text-amber-200 font-sans text-right">
                      {activePositionAdvice}
                    </div>
                  </div>
                )}

                {positions.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium">
                    ليس لديك صفقات نشطة الآن. استخدم الأزرار لفتح صفقات شراء أو بيع تجريبية بناءً على تحليلك للـشارت!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto w-full">
                    {positions.map((pos) => {
                      const isProfit = pos.pnl >= 0;
                      return (
                        <div key={pos.id} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs font-sans shadow-xs flex-col sm:flex-row gap-3">
                          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                            <button
                              type="button"
                              onClick={() => handleClosePosition(pos.id)}
                              className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-800 border border-slate-200 font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[10px]"
                            >
                              إغلاق الصفقة
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAnalyzeActivePosition(pos)}
                              className={`font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[10px] border flex items-center gap-1 ${
                                analyzingPosition?.id === pos.id
                                  ? "bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-sm"
                                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-150"
                              }`}
                            >
                              <Bot size={11} className={isAnalyzingActivePosition && analyzingPosition?.id === pos.id ? "animate-spin" : ""} />
                              <span>{analyzingPosition?.id === pos.id ? "جاري تقييم الصفقة..." : "تقييم بالذكاء الاصطناعي 🤖"}</span>
                            </button>
                          </div>

                          {/* Return Balance details */}
                          <div className="text-left font-mono shrink-0 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-start border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                            <span className="text-slate-400 text-[9px] block sm:hidden">الربح الخسارة الجاري</span>
                            <span className={`font-bold ${isProfit ? "text-emerald-600" : "text-red-500"}`}>
                              {isProfit ? "+" : ""}
                              {pos.pnl} $ ({Math.round((pos.pnl / pos.amount) * 100)}%)
                            </span>
                            <span className="text-slate-400 text-[9px] hidden sm:block">الربح الخسارة الجاري</span>
                          </div>

                          {/* Setup attributes */}
                          <div className="hidden sm:block text-right shrink-0">
                            <span className="text-slate-650 font-semibold block">الرافعة: {pos.leverage}x</span>
                            <span className="text-slate-400 text-[10px] block">المبلغ المستثمر: ${pos.amount}</span>
                          </div>

                          {/* Entry details */}
                          <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                            <div className="flex items-center justify-end gap-1 font-bold">
                              <span className="text-slate-400 font-mono">@{pos.entryPrice.toLocaleString("en-US", { maximumFractionDigits: currentAsset.decimals, minimumFractionDigits: currentAsset.decimals })}</span>
                              {pos.type === "buy" ? (
                                <span className="text-emerald-600 font-bold font-sans">شراء (Long)</span>
                              ) : (
                                <span className="text-red-650 font-bold font-sans">بيع (Short)</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2 text-slate-400 text-[9px] mt-0.5">
                              <span>الدخول: {pos.time}</span>
                              {pos.stopLossLimitPrice !== undefined && (
                                <span className="text-rose-650 font-extrabold bg-rose-50 border border-rose-150 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-sans">
                                  <span>الوقف 🛡️: {pos.stopLossLimitPrice.toLocaleString("en-US", { maximumFractionDigits: currentAsset.decimals, minimumFractionDigits: currentAsset.decimals })} ({pos.stopLossPercent}%)</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Trade History Accordion footer */}
          {tradeHistory.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 text-right space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">الدراسة والتحليل الفني لصفقاتك السابقة</span>
                <span className="text-xs text-slate-700 font-extrabold font-sans flex items-center gap-1">
                  <span>سجل الصفقات المنتهية مؤخراً (انقر لمراجعة ظروف الدخول والشارت):</span>
                  <Activity size={12} className="text-rose-500 animate-pulse" />
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tradeHistory.slice(0, 9).map((hist, i) => {
                  const isProfit = hist.pnl >= 0;
                  const isSelected = selectedHistoricalTrade?.id === hist.id;
                  const histAsset = ASSETS.find(a => a.id === hist.assetId) || ASSETS[0];
                  return (
                    <button
                      key={hist.id || i}
                      type="button"
                      onClick={() => {
                        setSelectedHistoricalTrade(hist);
                        // Auto scroll view up to the chart container so the student sees the changes
                        const chartEl = document.getElementById("trading-simulator-widget");
                        if (chartEl) {
                          chartEl.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className={`text-right w-full bg-white border p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-1.5 cursor-pointer text-xs font-sans group ${
                        isSelected 
                          ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-650/15 shadow-sm" 
                          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isProfit ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-650 border border-rose-150"}`}>
                          {isProfit ? "ربح +" : "خسارة "}{hist.pnl}$ ({hist.amount ? Math.round((hist.pnl / hist.amount) * 100) : 0}%)
                        </span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-[10px] text-slate-500 font-mono">({hist.assetId})</span>
                          <span className={hist.type === "buy" ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>
                            {hist.type === "buy" ? "شراء (Long)" : "بيع (Short)"}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-1 border-t border-dashed border-slate-250 pt-2 flex items-center justify-between w-full">
                        <span className="text-[9.5px] text-slate-400 font-mono">الإغلاق: {hist.closeTime || "مؤرشفة"}</span>
                        <span>شمعة: {hist.patternAtEntry || "اعتيادية"}</span>
                      </div>

                      <div className="flex items-center justify-between text-[9.5px] text-slate-400 w-full mt-0.5">
                        <span className="text-[8.5px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md border border-slate-250 block truncate max-w-[120px]">
                          ترند: {hist.trendAtEntry || "عرضي ⚖️"}
                        </span>
                        <span className="text-indigo-600 font-bold group-hover:underline flex items-center gap-0.5">
                          <span>انقر للمزامنة مع الشارت 📉</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 🔗 Real Broker Integration & Elkilany Copy-Trading Dashboard */}
          <div className="mt-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-amber-500/20 p-6 rounded-3xl text-white text-right shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
                  <Landmark size={22} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-md sm:text-lg font-black leading-tight font-sans text-amber-400">بوابة ربط حساب التداول الحقيقي ونسخ صفقات المعلم (أستاذ الكيلاني) 📈</h4>
                  <p className="text-xs text-indigo-200 mt-1">تداول بأسعار حقيقية واربط حسابك الفعلي مع كبرى شركات الوساطة (Exness, XM, MultiBank) لنسخ تداول السيرفر التلقائي!</p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/10 border border-amber-550/30 text-amber-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
                Real-Account Sync Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
              
              {/* Credentials Form Column */}
              <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-4">
                <h5 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900 flex justify-between">
                  <span className="text-amber-500">منصات MT4/MT5 الرسمية</span>
                  <span>تهيئة إعدادات حسابك المباشر الحقيقي</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">اسم شركة الوساطة / خادم الربط:</label>
                    <input
                      type="text"
                      placeholder="Exness-Technologies-Real10"
                      className="w-full bg-slate-900 border border-indigo-950 rounded-xl px-3 py-2 text-center text-indigo-200 font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">رقم الحساب الحقيقي (MetaTrader #):</label>
                    <input
                      type="number"
                      placeholder="84920401"
                      className="w-full bg-slate-900 border border-indigo-950 rounded-xl px-3 py-2 text-center text-indigo-200 font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">كلمة المرور الرئيسية للحساب (آمنة بالكامل):</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      className="w-full bg-slate-900 border border-indigo-950 rounded-xl px-3 py-2 text-center text-indigo-200 font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">نسبة التحكم في توزيع الأرباح (Profit Share Preference):</label>
                    <select
                      className="w-full bg-slate-900 border border-indigo-950 rounded-xl px-3 py-2 text-indigo-200 font-sans outline-none focus:border-amber-500 text-right pr-2"
                    >
                      <option value="10">نسبة أستاذ الكيلاني 10% مقابل نسخ التحليل</option>
                      <option value="15">نسبة أستاذ الكيلاني 15% مقابل نسخ التحليل والتحفيز</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => {
                      alert("🟢 تم الاتصال والربط بنجاح مع سيرفر الوسيط المالي المباشر!\n\nحالة النسخ نشطة حالياً. أي صفقة تداول يتم فتحها للأستاذ الكيلاني، سيقوم النظام تلقائياً بنسخ حجم اللوت المكافئ لحسابك الحقيقي لتقاسم الأرباح بنجاح!");
                    }}
                    className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs py-2.5 px-6 rounded-xl cursor-pointer transition-all shadow-md shadow-amber-500/20"
                  >
                    تأكيد اتصال الحساب الفعلي وبدء النسخ التلقائي
                  </button>
                </div>
              </div>

              {/* Earnings & Profits summary cards for mr elkilany */}
              <div className="bg-slate-950/40 border border-amber-500/10 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-amber-400 mb-1 flex items-center justify-end gap-1.5 font-sans">
                    <span>محفظة الشريك وأرباح المعاملات</span>
                    <Shield size={14} />
                  </h5>
                  <p className="text-[10px] text-indigo-200/80 font-sans leading-relaxed">
                    هنا تظهر حصتك المكتسبة تلقائياً من صفقات النسخ وعمولات التسويق بالعمولة للأعضاء المسجلين تحت شجرتك الإلكترونية.
                  </p>
                </div>

                <div className="py-2 space-y-2 mt-2">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-indigo-900/50 flex items-center justify-between font-mono">
                    <span className="text-amber-400 font-black text-sm">+$45.60</span>
                    <span className="text-[10px] text-slate-300 font-sans">أرباح نسخ صفقات الأعضاء اليوم</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-indigo-900/50 flex items-center justify-between font-mono">
                    <span className="text-emerald-400 font-black text-sm">+$125.00</span>
                    <span className="text-[10px] text-slate-300 font-sans">عمولات دورات المحاضرات المدفوعة</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-400 hover:text-amber-300 font-bold py-2 rounded-xl text-[10px] cursor-pointer transition-colors"
                >
                  سحب الرصيد على Vodafone Cash / InstaPay
                </button>
              </div>

            </div>
          </div>
        </>
      ) : (
        <TradingAnalytics history={tradeHistory} />
      )}

      {/* Styled Educational Withdrawal Portal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999] text-right" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Landmark size={20} className="text-amber-500" />
                <h3 className="font-sans font-black text-amber-500 text-lg">بوابة سحب وتصفية الأرباح الآمنة 💸</h3>
              </div>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawError("");
                  setWithdrawSuccess("");
                }}
                className="text-slate-400 hover:text-white text-sm bg-slate-900 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold border border-slate-800 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-500">📌 كيف تعمل تصفية الأرباح؟</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  جميع العمولات والجهود التعليمية وأرباح صفقات الشركاء يتم تجميعها بالدولار الأمريكي. عند طلب الصرف يتم تحسين المبالغ وتحويلها تلقائياً إلى الرابط المعتمد بقيمة تعادل الجنيه المصري طبقاً لأسعار الصرف اليومية عبر فودافون كاش أو انستا باي فوراً.
                </p>
              </div>

              {withdrawSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs space-y-2">
                  <span className="font-bold block">✓ مبشر ممتاز! {withdrawSuccess}</span>
                  <p className="text-[10px] text-slate-300">سيتم مراجعة طلبك بواسطة الإدارة الفنية خلال بضع دقائق لتحويل المبالغ فوراً.</p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  {withdrawError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-bold">
                      {withdrawError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 block">المبلغ المراد سحبه ($):</label>
                      <input
                        type="number"
                        required
                        min="5"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 text-amber-500 focus:border-amber-500 outline-none rounded-xl px-4 py-3 text-xs font-black font-sans text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 block">طريقة الاستلام:</label>
                      <select
                        value={withdrawMethod}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWithdrawMethod(val);
                          if (val === "USDT") {
                            setWithdrawAddress("");
                          } else {
                            setWithdrawAddress(studentPhone || "");
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none rounded-xl px-4 py-3 text-xs font-bold cursor-pointer font-sans"
                      >
                        <option value="Vodafone Cash">Vodafone Cash (فودافون كاش)</option>
                        <option value="InstaPay">InstaPay (انستا باي)</option>
                        <option value="USDT">USDT (Binance / عملات رقمية بايننس)</option>
                      </select>
                    </div>
                  </div>

                  {/* Binance Crypto Networks */}
                  {withdrawMethod === "USDT" && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 block">اختر شبكة محفظة السحب في بايننس (Binance Network):</label>
                      <select
                        value={binanceNetwork}
                        onChange={(e) => setBinanceNetwork(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-amber-400 focus:border-amber-500 outline-none rounded-xl px-4 py-3 text-xs font-bold cursor-pointer font-sans"
                      >
                        <option value="Tron (TRC20)">USDT - Tron (TRC20) - الأكثر استخداماً وصرفاً 🔥</option>
                        <option value="BNB Smart Chain (BEP20)">USDT - BNB Smart Chain (BEP20) ⚡</option>
                        <option value="Ethereum (ERC20)">USDT - Ethereum (ERC20)</option>
                        <option value="Solana (SOL)">USDT - Solana (SOL)</option>
                        <option value="Polygon (MATIC)">USDT - Polygon (MATIC)</option>
                        <option value="Arbitrum One (ARB)">USDT - Arbitrum One (ARB)</option>
                        <option value="Optimism (OP)">USDT - Optimism (OP)</option>
                        <option value="Avalanche (AVAX-C)">USDT - Avalanche C-Chain (AVAX-C)</option>
                        <option value="Near Protocol (NEAR)">USDT - Near Protocol (NEAR)</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 block">
                      {withdrawMethod === "Vodafone Cash" 
                        ? "رقم محفظة فودافون كاش للمستلم:" 
                        : withdrawMethod === "InstaPay"
                          ? "عنوان الدفع IPA على انستا باي (مثال name@instapay):"
                          : `عنوان محفظة المستلم على شبكة ${binanceNetwork}:`}
                    </label>
                    <input
                      type="text"
                      required
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder={
                        withdrawMethod === "Vodafone Cash" 
                          ? "مثال: 01095018521" 
                          : withdrawMethod === "InstaPay"
                            ? "مثال: student@instapay"
                            : "أدخل عنوان المحفظة بدقة (مثال: TDb4f1...)"
                      }
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold focus:border-amber-500 outline-none rounded-xl px-4 py-3 text-xs text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingWithdraw}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3.5 rounded-xl text-xs hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submittingWithdraw ? "جاري تشغيل المعاملة وحفظ الطلب..." : "تسجيل وإرسال طلب الصرف الفوري 🚀"}
                  </button>
                </form>
              )}

              {/* Historic Table */}
              <div className="space-y-2 pt-4 border-t border-slate-850">
                <span className="text-xs font-bold text-slate-300 block">📋 سجل ومتابعة طلبات السحب الخاصة بك:</span>
                
                {userWithdrawals.length === 0 ? (
                  <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl text-center text-[10px] text-slate-500">
                    لا توجد طلبات سحب سابقة مسجلة لجهازك حتى الآن.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {userWithdrawals.map((wd) => (
                      <div key={wd.id} className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">{new Date(wd.timestamp).toLocaleDateString("ar-EG")}</span>
                          <span className="text-[11px] font-bold text-slate-300">{wd.payoutAddress} ({wd.method})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 font-extrabold">${wd.amount}</span>
                          {wd.status === "pending" && (
                            <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-2 py-1 rounded border border-yellow-500/20">قيد المراجعة ⏳</span>
                          )}
                          {wd.status === "approved" && (
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/20">تم الدفع بنجاح ✓</span>
                          )}
                          {wd.status === "rejected" && (
                            <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-1 rounded border border-rose-500/20">طلب مرفوض ✕</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
              <span className="text-[9px] text-slate-500 font-sans block">نظام الكيلاني الرقمي الآمن - مدعوم بالخوادم المباشرة لفرع الأكاديمية</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
