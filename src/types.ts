/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube embedding URL or mock direct link
  content: string; // Rich article summary
  duration: string; // e.g. "12:30"
  quiz?: QuizQuestion[];
  isLocked?: boolean;
  isPaid?: boolean;
  attachmentType?: "video" | "pdf" | "ppt";
  attachmentUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  lessons: Lesson[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Position {
  id: string;
  type: "buy" | "sell";
  entryPrice: number;
  amount: number;
  leverage: number;
  pnl: number;
  time: string;
  stopLossLimitPrice?: number;
  stopLossPercent?: number;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
