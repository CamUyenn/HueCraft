'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useProgress } from "@/context/ProgressContext";
import { villages, quizzes, rewards } from "@/data/villages";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Gift, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function Quiz() {
  const params = useParams<{ villageId?: string }>() ?? {};
  const villageId = Array.isArray(params.villageId) ? params.villageId[0] : params.villageId ?? "";
  const router = useRouter();
  const { language } = useLanguage();
  const { completeQuiz, unlockReward } = useProgress();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const village = villages.find((v) => v.id === villageId);
  const quiz = quizzes.find((q) => q.villageId === villageId);

  useEffect(() => {
    if (!village || !quiz) router.push("/home");
  }, [village, quiz, router]);

  if (!village || !quiz) return null;

  const lang = language === "sign" ? "vi" : (language as "vi" | "en");

  const t = {
    vi: { back: "Quay lại", title: "Bài kiểm tra kiến thức", q: "Câu hỏi", of: "trong", next: "Câu tiếp theo", submit: "Nộp bài", score: "Điểm số", pass: "Xuất sắc! Bạn đã đạt!", fail: "Chưa đạt! Thử lại nào", passDesc: "Bạn đã hoàn thành làng nghề và nhận được phần thưởng đặc biệt!", failDesc: "Cần ít nhất 3/5 điểm để nhận phần thưởng. Hãy xem lại nội dung và thử lại!", rewards: "Nhận phần thưởng", retry: "Làm lại", home: "Về trang chủ" },
    en: { back: "Back", title: "Knowledge Quiz", q: "Question", of: "of", next: "Next Question", submit: "Submit", score: "Your Score", pass: "Excellent! You passed!", fail: "Not quite — try again!", passDesc: "You have completed the village journey and earned a special reward!", failDesc: "You need at least 3/5 to earn rewards. Review the content and try again!", rewards: "Claim Rewards", retry: "Try Again", home: "Back to Home" },
    sign: { back: "⬅️", title: "📝 Bài kiểm tra", q: "❓", of: "/", next: "➡️ Tiếp", submit: "✅ Nộp", score: "🎯 Điểm", pass: "🎉 Xuất sắc!", fail: "🔄 Thử lại!", passDesc: "✅ Đã hoàn thành! Nhận phần thưởng!", failDesc: "⚠️ Cần 3/5 điểm. Xem lại và thử lại!", rewards: "🎁 Phần thưởng", retry: "🔄 Thử lại", home: "🏠 Trang chủ" },
  };
  const copy = t[language];

  const handleSelect = (idx: number) => {
    const upd = [...answers];
    upd[current] = idx;
    setAnswers(upd);
  };

  const handleNext = () => { if (current < quiz.questions.length - 1) setCurrent(current + 1); };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.correctAnswer) correct++; });
    setScore(correct);
    setShowResult(true);
    completeQuiz(villageId!, correct);
    if (correct >= 3) {
      const available = rewards.slice(0, 3);
      unlockReward(available[Math.floor(Math.random() * available.length)].id);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRetry = () => { setCurrent(0); setAnswers([]); setShowResult(false); setScore(0); };

  const progress = ((current + 1) / quiz.questions.length) * 100;
  const q = quiz.questions[current];

  /* ── Result Screen ──────────────────────────────────────── */
  if (showResult) {
    const passed = score >= 3;
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: "var(--background)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-2"
          style={{
            background: "var(--card)",
            borderColor: passed ? "#22c55e" : "#f97316",
          }}
        >
          {/* Header band */}
          <div
            className="py-10 px-8 text-center"
            style={{ background: passed ? "linear-gradient(135deg, #14532d, #22c55e)" : "linear-gradient(135deg, #7c2d12, #f97316)" }}
          >
            <motion.div
              initial={passed ? { rotate: -180, scale: 0 } : { scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="flex justify-center mb-4"
            >
              {passed ? <Trophy className="w-20 h-20 text-yellow-300" /> : <XCircle className="w-20 h-20 text-white/80" />}
            </motion.div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {passed ? copy.pass : copy.fail}
            </h2>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-6">
            <div className="text-center">
              <p className="text-7xl font-black mb-1" style={{ color: passed ? "#22c55e" : "#f97316", fontFamily: "'Playfair Display', serif" }}>
                {score}/5
              </p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{copy.score}</p>
            </div>

            <p className="text-center text-base leading-relaxed" style={{ fontFamily: "'Lora', serif", color: "var(--foreground)" }}>
              {passed ? copy.passDesc : copy.failDesc}
            </p>

            {/* Answer grid */}
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, i) => {
                const correct = answers[i] === q.correctAnswer;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="h-12 rounded-xl flex items-center justify-center"
                    style={{ background: correct ? "#22c55e22" : "#ef444422", border: `2px solid ${correct ? "#22c55e" : "#ef4444"}` }}
                  >
                    {correct ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
                  </motion.div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {passed ? (
                <>
                  <Button variant="outline" onClick={() => router.push("/home")} className="py-5">{copy.home}</Button>
                  <Button
                    onClick={() => router.push("/rewards")}
                    className="py-5 text-white gap-2"
                    style={{ background: "linear-gradient(135deg, #8B1A00, #C07A25)" }}
                  >
                    <Gift className="w-4 h-4" />
                    {copy.rewards}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => router.push(`/village/${villageId}`)} className="py-5">{copy.back}</Button>
                  <Button
                    onClick={handleRetry}
                    className="py-5 text-white"
                    style={{ background: "linear-gradient(135deg, #7c2d12, #f97316)" }}
                  >
                    {copy.retry}
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Quiz Screen ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: "var(--background)", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #1A0800 0%, #5A1A00 60%, #8B3010 100%)" }} className="py-6 px-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 mb-4 gap-2"
            onClick={() => router.push(`/village/${villageId}`)}>
            <ArrowLeft className="w-5 h-5" />
            {copy.back}
          </Button>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {copy.title}
          </h1>
          <p className="text-amber-300/70 text-sm">{village.name[lang]}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
            <span>{copy.q} {current + 1} {copy.of} {quiz.questions.length}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #8B1A00, #C07A25)" }}
            />
          </div>
          {/* Step dots */}
          <div className="flex gap-2 mt-3 justify-center">
            {quiz.questions.map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-200"
                style={{
                  background: i < current ? "#22c55e" : i === current ? "#C07A25" : "var(--muted)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Question card */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-lg font-semibold leading-snug" style={{ fontFamily: "'Lora', serif" }}>
              {q.question[lang]}
            </p>
          </div>
          <div className="p-4 space-y-3">
            {q.options[lang].map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3"
                  style={{
                    background: selected ? "#8B1A0012" : "var(--background)",
                    borderColor: selected ? "#8B1A00" : "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: selected ? "#8B1A00" : "var(--border)",
                      background: selected ? "#8B1A00" : "transparent",
                    }}
                  >
                    {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-base">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="px-4 pb-4">
            {current < quiz.questions.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={answers[current] === undefined}
                className="w-full py-6 text-white gap-2 rounded-xl font-semibold"
                style={{ background: "linear-gradient(135deg, #8B1A00, #C07A25)" }}
              >
                {copy.next}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={answers[current] === undefined}
                className="w-full py-6 text-white gap-2 rounded-xl font-semibold"
                style={{ background: "linear-gradient(135deg, #14532d, #22c55e)" }}
              >
                <CheckCircle2 className="w-5 h-5" />
                {copy.submit}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
