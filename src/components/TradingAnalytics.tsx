/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { TrendingUp, TrendingDown, Award, PieChart as PieIcon, BarChart2, DollarSign, Activity } from "lucide-react";
import { Position } from "../types";

interface TradingAnalyticsProps {
  history: Position[];
}

export function TradingAnalytics({ history }: TradingAnalyticsProps) {
  // If no trades are available, provide a beautiful mock simulation for learning & demoing
  const displayHistory = useMemo(() => {
    if (history && history.length > 0) {
      return history;
    }
    // High-quality simulated default history so the user sees a marvelous interactive dashboard instantly!
    return [
      { id: "1", type: "buy" as const, entryPrice: 2310, amount: 1000, leverage: 10, pnl: 280, time: "09:12:15" },
      { id: "2", type: "sell" as const, entryPrice: 1.0820, amount: 1000, leverage: 20, pnl: -150, time: "09:35:40" },
      { id: "3", type: "buy" as const, entryPrice: 64200, amount: 2000, leverage: 5, pnl: 450, time: "10:02:11" },
      { id: "4", type: "sell" as const, entryPrice: 79.15, amount: 1500, leverage: 10, pnl: 180, time: "10:45:19" },
      { id: "5", type: "buy" as const, entryPrice: 2335, amount: 1000, leverage: 10, pnl: -320, time: "11:15:02" },
      { id: "6", type: "buy" as const, entryPrice: 3210, amount: 1200, leverage: 10, pnl: 340, time: "11:58:30" },
      { id: "7", type: "sell" as const, entryPrice: 156.10, amount: 1000, leverage: 30, pnl: 620, time: "12:30:15" },
    ];
  }, [history]);

  // Compute calculated statistics
  const stats = useMemo(() => {
    let totalTrades = displayHistory.length;
    let winningTrades = displayHistory.filter(t => t.pnl >= 0).length;
    let losingTrades = totalTrades - winningTrades;
    let winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;
    
    let totalProfits = displayHistory.filter(t => t.pnl >= 0).reduce((sum, t) => sum + t.pnl, 0);
    let totalLosses = Math.abs(displayHistory.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
    
    let netPnL = totalProfits - totalLosses;
    let profitFactor = totalLosses > 0 ? Number((totalProfits / totalLosses).toFixed(2)) : totalProfits > 0 ? 9.9 : 0;
    let averageTrade = totalTrades > 0 ? Math.round(netPnL / totalTrades) : 0;
    
    // Cumulative profit line data
    let currentSum = 0;
    const cumulativeChartData = displayHistory.map((trade, idx) => {
      currentSum += trade.pnl;
      return {
        tradeNumber: `صفقة ${idx + 1}`,
        profit: currentSum,
        tradePnL: trade.pnl
      };
    });

    // Asset and Win ratio data
    const pieData = [
      { name: "صفقات ناجحة 🟢", value: winningTrades, color: "#10b981" },
      { name: "صفقات خاسرة 🔴", value: losingTrades, color: "#ef4444" }
    ];

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalProfits,
      totalLosses,
      netPnL,
      profitFactor,
      averageTrade,
      cumulativeChartData,
      pieData
    };
  }, [displayHistory]);

  return (
    <div className="space-y-6 text-right" dir="rtl" id="trading-analytics-dashboard">
      
      {/* Interactive Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-900/50 shadow-lg">
        <div>
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            تحليلات الأداء والمخاطر الذكية
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1.5 font-sans">
            التقرير الإحصائي المتكامل لمحفظتك
          </h3>
          <p className="text-xs text-indigo-250 mt-1 leading-relaxed">
            يقوم هذا المكون بتحليل صفقاتك السابقة لحساب نسبة الفوز وعوامل الأداء لمساعدتك على تقويم استراتيجيتك.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-2xl">
            <Activity className="text-amber-400" size={20} />
          </div>
          <div>
            <span className="text-[10px] text-indigo-200 block">صافي الأرباح المحققة</span>
            <span className={`text-lg font-mono font-black ${stats.netPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {stats.netPnL >= 0 ? "+" : ""}{stats.netPnL} $
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 4 Core KPIs metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-bold block">معدل الفوز (Win Rate)</span>
            <span className="text-xl font-mono font-black text-indigo-700">{stats.winRate}%</span>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
            <Award size={18} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-bold block">إجمالي عدد العمليات</span>
            <span className="text-xl font-mono font-black text-slate-800">{stats.totalTrades} صفقات</span>
          </div>
          <div className="bg-slate-50 text-slate-500 p-2.5 rounded-xl">
            <BarChart2 size={18} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-bold block">مؤشر الربحية (Profit Factor)</span>
            <span className="text-xl font-mono font-black text-emerald-600">{stats.profitFactor}x</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-bold block">متوسط الربح لكل صفقة</span>
            <span className={`text-xl font-mono font-black ${stats.averageTrade >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {stats.averageTrade >= 0 ? "+" : ""}{stats.averageTrade} $
            </span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
            <DollarSign size={18} />
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart 1: Recharts Area Chart for Cumulative Profit */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl lg:col-span-2 shadow-xs text-right">
          <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5 justify-end">
            <span>منحنى الأرباح التراكمي للتمثيل العملي (Cumulative Profit)</span>
            <TrendingUp size={14} className="text-indigo-650" />
          </h4>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.cumulativeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tradeNumber" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ direction: "rtl", textAlign: "right", borderRadius: "12px", fontSize: "11px", border: "1px solid #cbd5e1" }}
                  formatter={(value) => [`${value} $`, "الربح المتراكم"]}
                />
                <Area type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Recharts Pie Chart for Winning vs Losing */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs text-right">
          <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5 justify-end">
            <span>توزيع صفقاتك (Win / Loss Ratio)</span>
            <PieIcon size={14} className="text-indigo-650" />
          </h4>

          <div className="w-full h-[160px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ direction: "rtl", textAlign: "right", fontSize: "10px", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centered percentage */}
            <div className="absolute text-center">
              <span className="text-[10px] text-slate-400 block font-sans">الفوز</span>
              <span className="text-lg font-black text-indigo-700 font-mono">{stats.winRate}%</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 text-[10px] font-sans font-semibold mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{stats.winningTrades} صفقات رابحة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{stats.losingTrades} صفقات خاسرة</span>
            </div>
          </div>
        </div>

      </div>

      {/* Distribution analysis bar chart */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5 justify-end">
          <span>نتائج الصفقات الفردية (Individual Trade Outcomes)</span>
          <BarChart2 size={14} className="text-indigo-650" />
        </h4>

        <div className="w-full h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.cumulativeChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
              <XAxis dataKey="tradeNumber" stroke="#94a3b8" fontSize={9} />
              <YAxis stroke="#94a3b8" fontSize={9} />
              <Tooltip 
                contentStyle={{ direction: "rtl", textAlign: "right", borderRadius: "10px", fontSize: "11px" }}
                formatter={(value) => [`${value} $`, "ناتج الصفقة"]}
              />
              <Bar dataKey="tradePnL" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {stats.cumulativeChartData.map((entry, index) => {
                  const color = entry.tradePnL >= 0 ? "#10b981" : "#ef4444";
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
