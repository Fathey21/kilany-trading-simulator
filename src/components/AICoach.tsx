/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  BrainCircuit, 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  Pin, 
  Trash2, 
  Copy, 
  Plus, 
  BookMarked,
  Check
} from "lucide-react";
import { ChatMessage } from "../types";

interface NotebookNote {
  id: string;
  text: string;
  date: string;
}

export function AICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "مرحباً بك خبير التداول القادم! 📈 أنا 'الكيلاني'، مستشارك التعليمي الذكي المدعوم بالذكاء الاصطناعي من أكاديمية الكيلاني.\n\nيمكنك أن تسألني عن أي شيء لم تفهمه في المحاضرات، مثل كيفية قراءة الشموع اليابانية، طرق استخراج الدعم والمقاومة، أو كيف تبني خطة لإدارة المخاطر لحماية محفظتك من الخسائر الماليّة. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "notebook">("chat");
  
  // Notebook states
  const [notebookNotes, setNotebookNotes] = useState<NotebookNote[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load Pinned Notes on Mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("kilany_notebook");
      if (savedNotes) {
        setNotebookNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.error("Error loading notebook notes:", e);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, activeTab]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    setInputText("");
    const userMessage: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Proxy call to server backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) {
        throw new Error("سيرفر الذكاء الاصطناعي معطل مؤقتاً.");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.text,
          timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "ناسف جداً! حدث عطل بالشبكة أثناء الاتصال بالمستشار الذكي. برجاء المحاولة بعد قليل، وتثبيت مفتاح GEMINI_API_KEY في الإعدادات لتفعيل الخدمة بشكل غير محدود.",
          timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pin a response message to user's notebook
  const handlePinNote = (text: string) => {
    // Check if duplicate alert
    const isDuplicate = notebookNotes.some((n) => n.text === text);
    if (isDuplicate) {
      alert("هذه النصيحة مثبتة بالفعل في دفتر ملاحظاتك.");
      return;
    }

    const newNote: NotebookNote = {
      id: "note-" + Date.now(),
      text,
      date: new Date().toLocaleDateString("ar-EG", { month: "short", day: "numeric" })
    };

    const updated = [...notebookNotes, newNote];
    setNotebookNotes(updated);
    localStorage.setItem("kilany_notebook", JSON.stringify(updated));
    alert("📌 تم تثبيت النصيحة بنجاح في دفتر الملاحظات! يمكنك تصفح وتعديل ملاحظاتك من تبويب 'الدفتر' بالأعلى.");
  };

  // Add custom manual note
  const handleAddManualNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNote.trim()) return;

    const newNote: NotebookNote = {
      id: "note-" + Date.now(),
      text: customNote.trim(),
      date: new Date().toLocaleDateString("ar-EG", { month: "short", day: "numeric" }) + " (ملاحظة يدوية)"
    };

    const updated = [...notebookNotes, newNote];
    setNotebookNotes(updated);
    localStorage.setItem("kilany_notebook", JSON.stringify(updated));
    setCustomNote("");
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    const updated = notebookNotes.filter((n) => n.id !== id);
    setNotebookNotes(updated);
    localStorage.setItem("kilany_notebook", JSON.stringify(updated));
  };

  // Copy to Clipboard with temporary UI success check
  const handleCopyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Safe and clean regex markdown parser to native HTML tags (bold, lists, code, linebreaks)
  const renderMessageText = (text: string) => {
    let formatted = text;
    // Escape HTML tags to prevent XSS
    formatted = formatted
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Line breaks
    formatted = formatted.replace(/\n/g, "<br />");
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Bullet list items
    formatted = formatted.replace(/^\s*-\s+(.*?)(?:<br\s*\/?>|$)/gm, "<li class='mr-4 list-disc text-indigo-650 font-semibold'>$1</li>");
    // Number list items
    formatted = formatted.replace(/^\s*(\d+)\.\s+(.*?)(?:<br\s*\/?>|$)/gm, "<li class='mr-4 list-decimal text-indigo-650 font-semibold'>$2</li>");

    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const sampleQuestions = [
    "كيف أبدأ التداول بأقل رأس مال ممكن؟",
    "اشرح لي شمعة المطرقة بالبلدي بالتفصيل؟",
    "كيف أحدد مناطق الدعم والمقاومة القوية؟",
    "ما هي استراتيجية تجنب الخسائر الكبيرة؟"
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[520px] text-right" id="ai-trading-coach">
      {/* Advisor Header */}
      <div className="flex items-center justify-between border-b border-slate-150 pb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">استشاري التداول الذكي</span>
        </div>
        <div className="flex items-center gap-2.5 text-right">
          <div>
            <h4 className="text-sm font-bold text-slate-800">كوتش الكيلاني الذكي</h4>
            <span className="text-[10px] text-indigo-1000 font-extrabold font-sans">تطوير الذات والتوجيه الفني ● متصل</span>
          </div>
          <div className="bg-gradient-to-tr from-indigo-600 to-indigo-800 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-600/10">
            <BrainCircuit size={18} />
          </div>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex border-b border-slate-100 mb-4 py-1.5 justify-between items-center text-xs gap-4">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 text-center py-2 font-bold font-sans transition-all border-b-2 duration-200 cursor-pointer ${
            activeTab === "chat"
              ? "border-indigo-600 text-indigo-600 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          محادثة الكوتش الكيلاني 💬
        </button>
        <button
          onClick={() => setActiveTab("notebook")}
          className={`flex-1 text-center py-2 font-bold font-sans transition-all border-b-2 flex items-center justify-center gap-1.5 duration-200 cursor-pointer ${
            activeTab === "notebook"
              ? "border-indigo-600 text-indigo-600 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          {notebookNotes.length > 0 && (
            <span className="bg-indigo-600 text-white rounded-full px-2 py-0.5 text-[10px] font-extrabold font-sans">
              {notebookNotes.length}
            </span>
          )}
          دفتر ملاحظاتي 📝
        </button>
      </div>

      {/* CHAT TAB VIEW */}
      {activeTab === "chat" && (
        <>
          {/* Chat History Pane */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 text-xs scrollbar-thin">
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user";
              return (
                <div key={index} className={`flex ${isUser ? "justify-start" : "justify-end"} items-start gap-2 text-right`}>
                  
                  {/* User bubble vs Model bubble */}
                  {isUser ? (
                    <div className="flex gap-2.5 max-w-[85%] order-first">
                      <div className="bg-indigo-600 text-white font-medium p-3.5 rounded-3xl rounded-tl-sm text-xs shadow-md shadow-indigo-600/10">
                        <p className="leading-relaxed font-sans">{msg.text}</p>
                        <span className="text-[9px] text-white/75 block mt-1.5 font-mono text-left">{msg.timestamp}</span>
                      </div>
                      <div className="bg-slate-100 p-1.5 rounded-full shrink-0 border border-slate-205">
                        <User size={13} className="text-slate-600" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2.5 max-w-[85%]">
                      <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-3xl rounded-tr-sm text-xs text-slate-850 flex flex-col items-stretch">
                        <div className="leading-relaxed font-sans">{renderMessageText(msg.text)}</div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handlePinNote(msg.text)}
                            className="text-indigo-650 hover:text-indigo-800 transition-all flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                            title="تثبيت النصيحة في دفتر الملاحظات للرجوع إليها لاحقاً"
                          >
                            <Pin size={11} className="rotate-45" />
                            تثبيت بالدفتر 📌
                          </button>
                          <span className="text-[9px] text-slate-400 font-mono text-left">{msg.timestamp}</span>
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-1.5 rounded-full shrink-0 border border-indigo-100-muted">
                        <Bot size={13} className="text-indigo-600" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Bubble */}
            {isLoading && (
              <div className="flex justify-end items-start gap-2.5 animate-pulse">
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-3xl rounded-tr-sm text-xs text-slate-500 flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin text-indigo-600" />
                  <span>جاري صياغة النصيحة الذكية...</span>
                </div>
                <div className="bg-indigo-50 p-1.5 rounded-full border border-indigo-100">
                  <Bot size={13} className="text-indigo-600" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Suggested Fast Questions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-[10px] text-slate-500 mb-2 text-right flex items-center justify-end gap-1 font-bold font-sans">
                <HelpCircle size={12} className="text-indigo-600" />
                اسأل الكوتش مباشرة بنقرة سريعة:
              </p>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-400 text-slate-700 px-2.5 py-1.5 rounded-xl transition-all font-sans font-semibold cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Field form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 bg-slate-50 p-2 border border-slate-200 rounded-2xl"
          >
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-100 text-white disabled:text-slate-400 p-3 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-600/10 disabled:shadow-none cursor-pointer"
              id="send-chat-btn"
            >
              <Send size={15} className="-rotate-90 stroke-[2.5]" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اطرح استفسارك بالتداول بالتفصيل..."
              className="flex-1 bg-transparent border-0 ring-0 focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 text-xs text-right px-2 font-sans"
              id="chat-input-field"
            />
          </form>
        </>
      )}

      {/* NOTEBOOK TAB VIEW */}
      {activeTab === "notebook" && (
        <div className="flex-1 flex flex-col overflow-hidden text-right">
          
          {/* Form to add custom text notes */}
          <form onSubmit={handleAddManualNote} className="mb-4 bg-indigo-50/50 border border-indigo-100/50 p-3 rounded-2xl">
            <label className="block text-[10px] font-bold text-indigo-750 mb-1.5">📝 حفظ ملحوظة أو استراتيجية يدوية جديدة:</label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!customNote.trim()}
                className="bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-200 text-white disabled:text-slate-400 px-3 py-2 rounded-xl transition-all font-bold text-xs flex items-center justify-center cursor-pointer font-sans"
              >
                <Plus size={16} />
              </button>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="مثال: وقف الخسارة هو مفتاح حماية المحفظة في سوق الكريبتو..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 font-sans"
              />
            </div>
          </form>

          {/* Notes Container list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin pb-2">
            {notebookNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <BookMarked size={32} className="text-slate-300 animate-pulse" />
                <p className="text-xs text-slate-500 font-bold font-sans">دفتر ملاحظات التداول فارغ حالياً.</p>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                  يمكنك تصفح محادثات الكوتش الكيلاني وتثبيت النصائح الهامة عبر أيقونة "تثبيت بالدفتر 📌" للرجوع إليها ومراجعتها كدروس شخصية في أي وقت!
                </p>
              </div>
            ) : (
              notebookNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="bg-slate-50 border border-slate-150 p-4 rounded-2xl relative group hover:border-slate-300 transition-all duration-200 text-xs"
                >
                  <div className="text-slate-800 font-sans leading-relaxed mb-3 pr-2">
                    {renderMessageText(note.text)}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100-muted text-[10px]">
                    <span className="text-slate-400 font-mono">{note.date}</span>
                    
                    <div className="flex items-center gap-2">
                      {/* Copy action */}
                      <button
                        onClick={() => handleCopyToClipboard(note.id, note.text)}
                        className={`p-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
                          copiedId === note.id
                            ? "bg-emerald-50 text-emerald-650 border-emerald-250 animate-bounce"
                            : "bg-white hover:bg-slate-100 text-slate-500 border-slate-150"
                        }`}
                        title="نسخ محتوى هذه الملحوظة الكلاسيكية"
                      >
                        {copiedId === note.id ? (
                          <>
                            <Check size={11} className="stroke-[3]" />
                            <span className="text-[8px] font-bold">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span className="text-[8px] font-bold">نسخ</span>
                          </>
                        )}
                      </button>

                      {/* Trash action */}
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="bg-white hover:bg-red-50 text-slate-500 hover:text-rose-600 border border-slate-150 hover:border-rose-150 p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        title="حذف من الدفتر"
                      >
                        <Trash2 size={11} />
                        <span className="text-[8px] font-bold">حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      )}
    </div>
  );
}
