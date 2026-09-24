'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeavingActivityProps {
  onComplete: () => void;
}

const THREAD_COLORS = [
  { id: "do", label: "Đỏ reng / Red", hex: "#C8180A" },
  { id: "xanh", label: "Chàm / Indigo", hex: "#1A2A7A" },
  { id: "vang", label: "Nghệ / Yellow", hex: "#D4A800" },
  { id: "trang", label: "Trắng / White", hex: "#F0EDE0" },
  { id: "den", label: "Đen / Black", hex: "#1A1212" },
  { id: "cam", label: "Cam / Orange", hex: "#D46A10" },
];

// 6x6 grid target pattern (traditional Pa Ko Zeng diamond pattern)
const TARGET_PATTERN: string[][] = [
  ["den", "vang", "do",   "do",   "vang", "den"],
  ["vang", "den", "xanh", "xanh", "den",  "vang"],
  ["do",   "xanh","vang", "vang", "xanh", "do"],
  ["do",   "xanh","vang", "vang", "xanh", "do"],
  ["vang", "den", "xanh", "xanh", "den",  "vang"],
  ["den",  "vang","do",   "do",   "vang", "den"],
];

const GRID_SIZE = 6;

export default function WeavingActivity({ onComplete }: WeavingActivityProps) {
  const [selectedColor, setSelectedColor] = useState(THREAD_COLORS[0].id);
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(""))
  );
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleCell = (row: number, col: number) => {
    if (completed) return;
    const newGrid = grid.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? selectedColor : c))
    );
    setGrid(newGrid);

    // Check if pattern matches
    const allCorrect = newGrid.every((row, ri) =>
      row.every((cell, ci) => cell === TARGET_PATTERN[ri][ci])
    );
    if (allCorrect) {
      setCompleted(true);
      onComplete();
    }
  };

  const filledCount = grid.flat().filter((c) => c !== "").length;
  const correctCount = grid.flat().filter((c, i) => {
    const ri = Math.floor(i / GRID_SIZE);
    const ci = i % GRID_SIZE;
    return c === TARGET_PATTERN[ri][ci];
  }).length;
  const totalCells = GRID_SIZE * GRID_SIZE;

  const getHintColor = (row: number, col: number) => {
    if (!showHint) return null;
    return TARGET_PATTERN[row][col];
  };

  return (
    <div className="space-y-5">
      {/* Color palette */}
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
          Chọn màu sợi / Select thread color:
        </p>
        <div className="flex flex-wrap gap-2">
          {THREAD_COLORS.map((c) => (
            <button key={c.id} onClick={() => setSelectedColor(c.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 text-xs font-medium transition-all"
              style={{
                borderColor: selectedColor === c.id ? c.hex : "var(--border)",
                background: selectedColor === c.id ? `${c.hex}18` : "var(--background)",
                color: "var(--foreground)",
              }}>
              <span className="w-4 h-4 rounded-sm border border-black/20 flex-shrink-0" style={{ background: c.hex }} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Your weaving */}
        <div className="flex-1">
          <p className="text-sm font-semibold mb-2 text-center">Tấm dệt của bạn / Your weaving:</p>
          <div className="flex justify-center">
            <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: "#8B6020" }}>
              {grid.map((row, ri) => (
                <div key={ri} className="flex">
                  {row.map((cell, ci) => {
                    const correctColor = TARGET_PATTERN[ri][ci];
                    const hintCol = getHintColor(ri, ci);
                    const isCorrect = cell === correctColor && cell !== "";
                    const isWrong = cell !== "" && cell !== correctColor;
                    const color = THREAD_COLORS.find((c) => c.id === cell);
                    return (
                      <motion.button
                        key={ci}
                        onClick={() => handleCell(ri, ci)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative transition-all"
                        style={{
                          width: "40px",
                          height: "40px",
                          background: color ? color.hex : hintCol ? `${THREAD_COLORS.find(c => c.id === hintCol)?.hex}30` : "#E8D4B0",
                          borderRight: ci < GRID_SIZE - 1 ? "1px solid rgba(0,0,0,0.15)" : "none",
                          borderBottom: ri < GRID_SIZE - 1 ? "1px solid rgba(0,0,0,0.15)" : "none",
                        }}
                      >
                        {/* Weave texture lines */}
                        {cell && (
                          <>
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 6px)",
                            }} />
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 6px)",
                            }} />
                          </>
                        )}
                        {isCorrect && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white opacity-60" />
                          </div>
                        )}
                        {isWrong && (
                          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-md" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Target pattern reference */}
        <div className="flex-1">
          <p className="text-sm font-semibold mb-2 text-center">Mẫu hoa văn / Pattern guide:</p>
          <div className="flex justify-center">
            <div className="border-2 rounded-lg overflow-hidden opacity-80" style={{ borderColor: "#8B6020" }}>
              {TARGET_PATTERN.map((row, ri) => (
                <div key={ri} className="flex">
                  {row.map((cell, ci) => {
                    const color = THREAD_COLORS.find((c) => c.id === cell);
                    return (
                      <div key={ci} style={{
                        width: "40px",
                        height: "40px",
                        background: color?.hex ?? "#E8D4B0",
                        borderRight: ci < GRID_SIZE - 1 ? "1px solid rgba(0,0,0,0.15)" : "none",
                        borderBottom: ri < GRID_SIZE - 1 ? "1px solid rgba(0,0,0,0.15)" : "none",
                        position: "relative",
                      }}>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 6px)",
                        }} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: "var(--muted-foreground)" }}>
            Hoa văn kim cương Pa Kô / Pa Ko diamond pattern
          </p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
          <span>Đúng / Correct: {correctCount}/{totalCells}</span>
          <span>Đã dệt / Filled: {filledCount}/{totalCells}</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
          <motion.div animate={{ width: `${(correctCount / totalCells) * 100}%` }}
            className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #C8180A, #D4A800)" }} />
        </div>
      </div>

      {/* Hint toggle */}
      <div className="flex gap-3">
        <button onClick={() => setShowHint((h) => !h)}
          className="text-xs px-3 py-1.5 rounded-lg border transition-all"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", background: showHint ? "var(--muted)" : "transparent" }}>
          {showHint ? "🙈 Ẩn gợi ý" : "💡 Hiện gợi ý / Show hint"}
        </button>
        <button onClick={() => setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill("")))}
          className="text-xs px-3 py-1.5 rounded-lg border transition-all"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          🔄 Làm lại / Reset
        </button>
      </div>

      <p className="text-xs italic text-center" style={{ color: "var(--muted-foreground)" }}>
        💡 Click vào ô để dệt sợi màu / Click cells to weave thread color
      </p>

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <CheckCircle2 className="w-6 h-6 text-red-700" />
          <p className="font-medium text-red-900">🎊 Tấm vải Zèng của bạn đã hoàn thành! / Your Zeng cloth is complete!</p>
        </div>
      )}
    </div>
  );
}
