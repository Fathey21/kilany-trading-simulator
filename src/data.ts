/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course } from "./types";

export const PRELOADED_COURSES: Course[] = [
  {
    id: "basics",
    title: "المستوى الأول: أساسيات أسواق المال",
    category: "أساسيات التداول",
    description: "انطلاقتك الأولى لفهم عالم التداول والأسواق المالية المختلفة وكيفية تحقيق الأرباح منها بذكاء.",
    difficulty: "beginner",
    estimatedTime: "0 دقيقة",
    lessons: []
  },
  {
    id: "analysis",
    title: "المستوى الثاني: التحليل الفني وقراءة الشموع اليابانية",
    category: "التحليل الفني",
    description: "تعلم لغة تشارت الأسعار وكيف تقرأ الرسومات البيانية وتحدد نقاط الدخول والخروج بدقة متناهية.",
    difficulty: "intermediate",
    estimatedTime: "0 دقيقة",
    lessons: []
  },
  {
    id: "risk-management",
    title: "المستوى الثالث: المؤشرات وإدارة المخاطر وعلم النفس",
    category: "إدارة المخاطر والسلوك",
    description: "السر الحقيقي لاستمرار 10% فقط من متداولي العالم ناجحين: كيف تحسب صفقاتك وتتغلب على طمعك.",
    difficulty: "advanced",
    estimatedTime: "0 دقيقة",
    lessons: []
  }
];
