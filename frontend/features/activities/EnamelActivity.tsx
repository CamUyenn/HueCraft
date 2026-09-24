'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnamelActivityProps {
  onComplete: () => void;
}

const COLORS = [
  { id: "lam", label: "Lam / Blue", hex: "#1E4ADB", name: { vi: "Lam cung đình", en: "Royal Blue" } },
  { id: "do", label: "Đỏ / Red", hex: "#C8180A", name: { vi: "Đỏ son", en: "Vermilion Red" } },
  { id: "vang", label: "Vàng / Gold", hex: "#D4A800", name: { vi: "Vàng hoàng kim", en: "Imperial Gold" } },
  { id: "xanh", label: "Xanh / Green", hex: "#1A7A30", name: { vi: "Xanh ngọc", en: "Jade Green" } },
  { id: "trang", label: "Trắng / White", hex: "#F0EDE0", name: { vi: "Trắng ngà", en: "Ivory White" } },
  { id: "tim", label: "Tím / Purple", hex: "#6A1A8B", name: { vi: "Tím hoàng", en: "Royal Purple" } },
];

// 12 sections of the vase design
const SECTIONS = [
  { id: 0, label: "Viền đỉnh", desc: "Top border" },
  { id: 1, label: "Cổ bình", desc: "Neck" },
  { id: 2, label: "Hoa sen trái", desc: "Left lotus" },
  { id: 3, label: "Hoa sen phải", desc: "Right lotus" },
  { id: 4, label: "Thân bình trái", desc: "Left body" },
  { id: 5, label: "Thân bình giữa", desc: "Center body" },
  { id: 6, label: "Thân bình phải", desc: "Right body" },
  { id: 7, label: "Vẩy rồng trái", desc: "Left dragon scale" },
  { id: 8, label: "Vẩy rồng phải", desc: "Right dragon scale" },
  { id: 9, label: "Đế bình", desc: "Base" },
  { id: 10, label: "Hoa văn trái", desc: "Left motif" },
  { id: 11, label: "Hoa văn phải", desc: "Right motif" },
];

export default function EnamelActivity({ onComplete }: EnamelActivityProps) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0].id);
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleSection = (id: number) => {
    if (completed) return;
    const color = COLORS.find((c) => c.id === selectedColor)!;
    setFilled((prev) => ({ ...prev, [id]: color.hex }));
  };

  const filledCount = Object.keys(filled).length;
  const allFilled = filledCount >= SECTIONS.length;

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  const getSectionFill = (id: number) => filled[id] ?? "#2A1A50";

  // Simplified vase SVG sections
  return (
    <div className="space-y-6">
      {/* Color palette */}
      <div>
        <p className="text-sm font-medium mb-3" style={{ color: "var(--muted-foreground)" }}>
          Chọn màu men / Select enamel color:
        </p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedColor(c.id)}
              title={c.name.vi}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium"
              style={{
                borderColor: selectedColor === c.id ? c.hex : "var(--border)",
                background: selectedColor === c.id ? `${c.hex}18` : "var(--background)",
                color: "var(--foreground)",
              }}
            >
              <span className="w-5 h-5 rounded-full border border-black/20 flex-shrink-0" style={{ background: c.hex }} />
              {c.name.vi}
            </button>
          ))}
        </div>
      </div>

      {/* Vase canvas */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 flex justify-center">
          <div className="relative" style={{ width: "240px" }}>
            <svg viewBox="0 0 240 340" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
              {/* Background */}
              <rect width="240" height="340" fill="#1A1230" rx="8" />

              {/* Vase outline */}
              <path d="M90 20 L150 20 L165 50 L170 100 Q175 160 160 200 Q175 250 172 300 L68 300 Q65 250 80 200 Q65 160 70 100 L75 50 Z"
                fill={getSectionFill(5)} stroke="#8B7A3A" strokeWidth="2" cursor="pointer"
                onClick={() => handleSection(5)} />

              {/* Top border */}
              <rect x="82" y="14" width="76" height="12" rx="4" fill={getSectionFill(0)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(0)} />

              {/* Neck */}
              <path d="M92 26 L148 26 L162 48 L78 48 Z" fill={getSectionFill(1)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(1)} />

              {/* Left body panel */}
              <path d="M72 100 L92 100 L88 200 L72 190 Z" fill={getSectionFill(4)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(4)} />

              {/* Right body panel */}
              <path d="M148 100 L168 100 L168 190 L152 200 Z" fill={getSectionFill(6)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(6)} />

              {/* Left lotus */}
              <ellipse cx="95" cy="130" rx="16" ry="22" fill={getSectionFill(2)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(2)} />
              <ellipse cx="95" cy="122" rx="10" ry="12" fill={getSectionFill(2)} stroke="#8B7A3A" strokeWidth="1"
                cursor="pointer" onClick={() => handleSection(2)} />

              {/* Right lotus */}
              <ellipse cx="145" cy="130" rx="16" ry="22" fill={getSectionFill(3)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(3)} />
              <ellipse cx="145" cy="122" rx="10" ry="12" fill={getSectionFill(3)} stroke="#8B7A3A" strokeWidth="1"
                cursor="pointer" onClick={() => handleSection(3)} />

              {/* Left dragon scale */}
              <path d="M76 170 Q84 165 92 172 Q84 178 76 170 Z" fill={getSectionFill(7)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(7)} />
              <path d="M78 185 Q86 180 94 187 Q86 193 78 185 Z" fill={getSectionFill(7)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(7)} />

              {/* Right dragon scale */}
              <path d="M148 170 Q156 165 164 172 Q156 178 148 170 Z" fill={getSectionFill(8)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(8)} />
              <path d="M146 185 Q154 180 162 187 Q154 193 146 185 Z" fill={getSectionFill(8)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(8)} />

              {/* Base */}
              <path d="M70 298 L170 298 L176 316 L64 316 Z" fill={getSectionFill(9)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(9)} />

              {/* Left motif */}
              <path d="M82 245 Q90 235 98 245 Q90 255 82 245 Z" fill={getSectionFill(10)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(10)} />

              {/* Right motif */}
              <path d="M142 245 Q150 235 158 245 Q150 255 142 245 Z" fill={getSectionFill(11)} stroke="#8B7A3A" strokeWidth="1.5"
                cursor="pointer" onClick={() => handleSection(11)} />

              {/* Center decorative circle */}
              <circle cx="120" cy="175" r="18" fill={getSectionFill(5)} stroke="#D4A800" strokeWidth="2" style={{ pointerEvents: "none" }} />
              <text x="120" y="180" textAnchor="middle" fill="#D4A800" fontSize="14" fontFamily="serif" style={{ pointerEvents: "none" }}>龍</text>

              {/* Gloss overlay */}
              <path d="M88 50 Q84 120 86 180" stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" strokeLinecap="round" style={{ pointerEvents: "none" }} />
            </svg>
          </div>
        </div>

        {/* Section list */}
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold mb-2">Các ô hoa văn / Pattern cells:</p>
          <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSection(s.id)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs border transition-all text-left"
                style={{
                  background: filled[s.id] ? `${filled[s.id]}20` : "var(--muted)",
                  borderColor: filled[s.id] ?? "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <span className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                  style={{ background: filled[s.id] ?? "#2A1A50" }} />
                <span className="truncate">{s.label}</span>
                {filled[s.id] && <CheckCircle2 className="w-3 h-3 text-green-600 ml-auto flex-shrink-0" />}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
              <span>Tiến độ tô men / Progress</span>
              <span>{filledCount}/{SECTIONS.length}</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
              <motion.div animate={{ width: `${(filledCount / SECTIONS.length) * 100}%` }}
                className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #1E4ADB, #D4A800)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tip */}
      <p className="text-xs italic text-center" style={{ color: "var(--muted-foreground)" }}>
        💡 Click vào từng ô hoa văn để tô màu men / Click each section to apply enamel color
      </p>

      {allFilled && !completed && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Button onClick={handleComplete} className="w-full py-6 text-white font-semibold rounded-xl gap-2"
            style={{ background: "linear-gradient(135deg, #1E4ADB, #D4A800)" }}>
            <Palette className="w-5 h-5" />
            Nung lò hoàn thiện! / Fire the kiln! →
          </Button>
        </motion.div>
      )}

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          <p className="font-medium text-blue-900">Chiếc bình pháp lam của bạn đã hoàn thành! / Your phap lam vase is complete!</p>
        </div>
      )}
    </div>
  );
}
