'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PotteryActivityProps {
  onComplete: () => void;
}

const STEPS = [
  {
    id: 0,
    vi: "Đặt đất sét lên bàn xoay",
    en: "Place clay on the wheel",
    emoji: "🟤",
    action: { vi: "Đặt đất", en: "Place Clay" },
    shape: "lump",
  },
  {
    id: 1,
    vi: "Nhào và căn tâm khối đất",
    en: "Knead and center the clay",
    emoji: "🤲",
    action: { vi: "Nhào đất", en: "Knead" },
    shape: "centered",
  },
  {
    id: 2,
    vi: "Mở lòng bình — tạo khoang rỗng",
    en: "Open the clay — create the hollow",
    emoji: "👐",
    action: { vi: "Mở lòng", en: "Open" },
    shape: "opened",
  },
  {
    id: 3,
    vi: "Kéo thành bình lên cao, định hình",
    en: "Pull up the walls, shape the body",
    emoji: "⬆️",
    action: { vi: "Kéo thành", en: "Pull Up" },
    shape: "pulled",
  },
  {
    id: 4,
    vi: "Tạo cổ và miệng bình cân đối",
    en: "Shape the neck and rim evenly",
    emoji: "🏺",
    action: { vi: "Tạo cổ bình", en: "Shape Neck" },
    shape: "necked",
  },
  {
    id: 5,
    vi: "Cắt đáy và lấy bình ra khỏi bàn xoay",
    en: "Cut the base and remove from wheel",
    emoji: "✂️",
    action: { vi: "Cắt đáy", en: "Cut Base" },
    shape: "finished",
  },
];

// SVG clay shapes at each stage
const ClayShape = ({ stage }: { stage: number }) => {
  const shapes = {
    lump: (
      <g>
        {/* Spinning wheel */}
        <ellipse cx="120" cy="220" rx="90" ry="14" fill="#5A3A1A" />
        <ellipse cx="120" cy="215" rx="86" ry="10" fill="#7A5A2A" />
        {/* Clay lump */}
        <ellipse cx="120" cy="195" rx="45" ry="28" fill="#8B5E3C" />
        <ellipse cx="120" cy="185" rx="40" ry="22" fill="#A0703A" />
      </g>
    ),
    centered: (
      <g>
        <ellipse cx="120" cy="220" rx="90" ry="14" fill="#5A3A1A" />
        <ellipse cx="120" cy="215" rx="86" ry="10" fill="#7A5A2A" />
        {/* Centered cone */}
        <path d="M80 205 Q120 155 160 205 Q140 215 120 218 Q100 215 80 205 Z" fill="#8B5E3C" />
        <path d="M85 200 Q120 155 155 200 Q138 210 120 212 Q102 210 85 200 Z" fill="#A0703A" />
        {/* Hands */}
        <ellipse cx="75" cy="195" rx="14" ry="8" fill="#E8C09A" transform="rotate(-20 75 195)" />
        <ellipse cx="165" cy="195" rx="14" ry="8" fill="#E8C09A" transform="rotate(20 165 195)" />
      </g>
    ),
    opened: (
      <g>
        <ellipse cx="120" cy="220" rx="90" ry="14" fill="#5A3A1A" />
        <ellipse cx="120" cy="215" rx="86" ry="10" fill="#7A5A2A" />
        {/* Opened cylinder */}
        <path d="M85 210 L85 170 Q120 155 155 170 L155 210 Q138 216 120 218 Q102 216 85 210 Z" fill="#8B5E3C" />
        {/* Inner hollow */}
        <ellipse cx="120" cy="172" rx="24" ry="16" fill="#6A4A2A" />
        <path d="M96 172 L96 210 Q120 216 144 210 L144 172 Z" fill="#7A5A32" />
        {/* Hands inside */}
        <ellipse cx="120" cy="170" rx="18" ry="10" fill="#E8C09A" />
      </g>
    ),
    pulled: (
      <g>
        <ellipse cx="120" cy="220" rx="90" ry="14" fill="#5A3A1A" />
        <ellipse cx="120" cy="215" rx="86" ry="10" fill="#7A5A2A" />
        {/* Tall vase shape */}
        <path d="M95 215 L88 140 Q95 120 120 118 Q145 120 152 140 L145 215 Q132 220 120 220 Q108 220 95 215 Z" fill="#8B5E3C" />
        <path d="M98 214 L92 142 Q98 124 120 122 Q142 124 148 142 L142 214 Q132 218 120 218 Q108 218 98 214 Z" fill="#A0703A" />
        {/* Hands on sides */}
        <ellipse cx="82" cy="165" rx="12" ry="7" fill="#E8C09A" transform="rotate(-10 82 165)" />
        <ellipse cx="158" cy="165" rx="12" ry="7" fill="#E8C09A" transform="rotate(10 158 165)" />
      </g>
    ),
    necked: (
      <g>
        <ellipse cx="120" cy="220" rx="90" ry="14" fill="#5A3A1A" />
        <ellipse cx="120" cy="215" rx="86" ry="10" fill="#7A5A2A" />
        {/* Vase with neck */}
        <path d="M92 214 L86 155 Q88 130 105 118 Q120 112 135 118 Q152 130 154 155 L148 214 Q135 220 120 220 Q105 220 92 214 Z" fill="#8B5E3C" />
        <path d="M95 213 L90 156 Q92 132 107 120 Q120 115 133 120 Q148 132 150 156 L145 213 Q133 218 120 218 Q107 218 95 213 Z" fill="#A0703A" />
        {/* Neck narrows */}
        <path d="M105 120 Q120 110 135 120 L132 100 Q120 94 108 100 Z" fill="#A0703A" />
        {/* Rim */}
        <ellipse cx="120" cy="98" rx="18" ry="6" fill="#B07840" />
      </g>
    ),
    finished: (
      <g>
        {/* Finished pot off wheel */}
        <rect x="50" y="290" width="140" height="10" rx="4" fill="#4A3010" />
        {/* Beautiful vase */}
        <path d="M88 280 L82 205 Q84 178 105 165 Q120 158 135 165 Q156 178 158 205 L152 280 Q138 285 120 285 Q102 285 88 280 Z" fill="#8B5E3C" />
        <path d="M91 278 L86 207 Q88 180 107 168 Q120 162 133 168 Q152 180 154 207 L149 278 Q136 283 120 283 Q104 283 91 278 Z" fill="#A0703A" />
        {/* Neck */}
        <path d="M107 168 Q120 162 133 168 L130 148 Q120 143 110 148 Z" fill="#A0703A" />
        <ellipse cx="120" cy="146" rx="16" ry="5" fill="#B07840" />
        {/* Decorative line */}
        <path d="M94 220 Q120 216 146 220" stroke="#6A4020" strokeWidth="2" fill="none" />
        <path d="M92 235 Q120 230 148 235" stroke="#6A4020" strokeWidth="2" fill="none" />
        {/* Gloss */}
        <path d="M100 180 Q96 230 98 270" stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Star sparkle */}
        <text x="148" y="175" fontSize="20">✨</text>
      </g>
    ),
  };
  const stage_names = ["lump", "centered", "opened", "pulled", "necked", "finished"] as const;
  return shapes[stage_names[stage] ?? "lump"] ?? shapes.lump;
};

export default function PotteryActivity({ onComplete }: PotteryActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleStep = () => {
    if (animating || completed) return;
    setAnimating(true);
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        setCompleted(true);
        onComplete();
      }
      setAnimating(false);
    }, 500);
  };

  const step = STEPS[currentStep];
  const progress = ((currentStep) / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Pottery wheel canvas */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: "260px" }}>
          <svg viewBox="0 0 240 310" xmlns="http://www.w3.org/2000/svg" className="w-full">
            {/* Background - workshop floor */}
            <rect width="240" height="310" fill="#F2E0C8" rx="12" />
            {/* Workshop elements */}
            <rect x="0" y="240" width="240" height="70" rx="8" fill="#D4B890" />
            {/* Wheel base */}
            <ellipse cx="120" cy="255" rx="100" ry="18" fill="#3A2010" />
            <ellipse cx="120" cy="248" rx="96" ry="14" fill="#4A2A14" />
            {/* Spinning motion lines */}
            {currentStep > 0 && [0, 60, 120, 180, 240, 300].map((a, i) => {
              const r = (a * Math.PI) / 180;
              return (
                <line key={i} x1={120 + Math.cos(r) * 70} y1={248 + Math.sin(r) * 10}
                  x2={120 + Math.cos(r) * 85} y2={248 + Math.sin(r) * 12}
                  stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              );
            })}
            {/* Clay shape morphing */}
            <motion.g
              key={currentStep}
              initial={{ opacity: 0.6, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ClayShape stage={currentStep} />
            </motion.g>
          </svg>
        </div>
      </div>

      {/* Step info */}
      <div className="rounded-xl p-4 text-center border" style={{ background: "#A0703A15", borderColor: "#A0703A40" }}>
        <div className="text-3xl mb-2">{step.emoji}</div>
        <p className="font-semibold text-base">{step.vi}</p>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{step.en}</p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="transition-all duration-300"
            style={{
              width: i === currentStep ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i < currentStep ? "#22c55e" : i === currentStep ? "#A0703A" : "var(--muted)",
            }} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
        <motion.div animate={{ width: `${progress}%` }}
          className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #8B5E3C, #C8903A)" }} />
      </div>

      {/* Action button */}
      {!completed && (
        <Button
          onClick={handleStep}
          disabled={animating}
          className="w-full py-6 text-white font-semibold rounded-xl gap-2"
          style={{ background: "linear-gradient(135deg, #6B3A1A, #A0703A)" }}
        >
          <span className="text-xl">{step.emoji}</span>
          {step.action.vi} / {step.action.en}
          {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-auto" />}
        </Button>
      )}

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-300">
          <CheckCircle2 className="w-6 h-6 text-amber-700" />
          <p className="font-medium text-amber-900">🏺 Chiếc bình gốm của bạn đã hoàn thành! / Your pottery vessel is complete!</p>
        </div>
      )}
    </div>
  );
}
