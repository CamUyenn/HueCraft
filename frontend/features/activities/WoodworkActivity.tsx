'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface WoodworkActivityProps {
  onComplete: () => void;
}

// 6 carved pattern pieces to assemble
const PIECES = [
  { id: 0, emoji: "🐉", label: { vi: "Con rồng / Dragon", en: "Dragon" }, slot: 0, color: "#8B3A00" },
  { id: 1, emoji: "🌺", label: { vi: "Hoa sen / Lotus", en: "Lotus" }, slot: 1, color: "#6A1A00" },
  { id: 2, emoji: "🦅", label: { vi: "Phượng hoàng / Phoenix", en: "Phoenix" }, slot: 2, color: "#7A2800" },
  { id: 3, emoji: "🌿", label: { vi: "Hoa văn mây / Cloud motif", en: "Cloud Motif" }, slot: 3, color: "#5A4A20" },
  { id: 4, emoji: "⭐", label: { vi: "Sao bát giác / Octagon star", en: "Octagon Star" }, slot: 4, color: "#6B3A00" },
  { id: 5, emoji: "🦋", label: { vi: "Bướm cát tường / Butterfly", en: "Butterfly" }, slot: 5, color: "#7A3A10" },
];

export default function WoodworkActivity({ onComplete }: WoodworkActivityProps) {
  const [slotFilled, setSlotFilled] = useState<Record<number, number>>({});
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const placedPieceIds = new Set(Object.values(slotFilled));

  const handleSlotClick = (slotIndex: number) => {
    if (completed) return;
    if (selectedPiece === null) return;
    if (slotFilled[slotIndex] !== undefined) return; // already filled

    const piece = PIECES.find((p) => p.id === selectedPiece)!;
    if (piece.slot === slotIndex) {
      // Correct placement
      const newFilled = { ...slotFilled, [slotIndex]: selectedPiece };
      setSlotFilled(newFilled);
      setSelectedPiece(null);

      if (Object.keys(newFilled).length === PIECES.length) {
        setCompleted(true);
        onComplete();
      }
    } else {
      // Wrong slot — shake animation via state
      setSelectedPiece(null);
    }
  };

  const handlePieceClick = (pieceId: number) => {
    if (completed) return;
    if (placedPieceIds.has(pieceId)) return;
    setSelectedPiece(selectedPiece === pieceId ? null : pieceId);
  };

  const placedCount = Object.keys(slotFilled).length;
  const progress = (placedCount / PIECES.length) * 100;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
        1️⃣ Chọn một mảnh họa tiết → 2️⃣ Click vào ô tương ứng trên tấm hoành phi<br />
        <span className="text-xs">Select a piece → Click the matching slot on the panel</span>
      </p>

      {/* Wooden panel frame (slots) */}
      <div className="rounded-2xl p-4 border-4" style={{ background: "linear-gradient(135deg, #3A2010, #5A3018)", borderColor: "#8B6020" }}>
        <div className="text-center mb-3">
          <p className="text-amber-300 text-sm font-bold tracking-widest">HUẾ HERITAGE • KIM LONG</p>
        </div>

        {/* Decorative border top */}
        <div className="flex justify-center gap-1 mb-4">
          {["🌿", "⭐", "🌿", "⭐", "🌿"].map((e, i) => (
            <span key={i} className="text-amber-600 text-xs">{e}</span>
          ))}
        </div>

        {/* Slots grid 3x2 */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {PIECES.map((piece) => {
            const filledPieceId = slotFilled[piece.slot];
            const filledPiece = PIECES.find((p) => p.id === filledPieceId);
            return (
              <motion.button
                key={piece.slot}
                onClick={() => handleSlotClick(piece.slot)}
                whileHover={filledPiece ? {} : { scale: 1.05 }}
                className="relative rounded-lg flex flex-col items-center justify-center py-4 px-2 border-2 transition-all"
                style={{
                  background: filledPiece ? `${filledPiece.color}30` : "rgba(0,0,0,0.3)",
                  borderColor: filledPiece ? "#D4A800" : selectedPiece !== null ? "rgba(212,168,0,0.5)" : "rgba(139,96,32,0.5)",
                  minHeight: "80px",
                  cursor: filledPiece ? "default" : "pointer",
                }}
              >
                {filledPiece ? (
                  <>
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-2xl"
                    >
                      {filledPiece.emoji}
                    </motion.span>
                    <span className="text-amber-300 text-xs mt-1 text-center leading-tight">{filledPiece.label.vi.split("/")[0].trim()}</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded border border-amber-800/40 flex items-center justify-center mb-1">
                      <span className="text-amber-800/40 text-xs">?</span>
                    </div>
                    <span className="text-amber-800/40 text-xs text-center leading-tight">{piece.label.vi.split("/")[0].trim()}</span>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Decorative border bottom */}
        <div className="flex justify-center gap-1 mt-4">
          {["🌿", "⭐", "🌿", "⭐", "🌿"].map((e, i) => (
            <span key={i} className="text-amber-600 text-xs">{e}</span>
          ))}
        </div>
      </div>

      {/* Piece palette */}
      <div>
        <p className="text-sm font-semibold mb-3">Các mảnh chạm khắc / Carved pieces:</p>
        <div className="grid grid-cols-3 gap-2">
          {PIECES.map((piece) => {
            const isPlaced = placedPieceIds.has(piece.id);
            const isSelected = selectedPiece === piece.id;
            return (
              <motion.button
                key={piece.id}
                onClick={() => handlePieceClick(piece.id)}
                whileHover={isPlaced ? {} : { scale: 1.05 }}
                whileTap={isPlaced ? {} : { scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all"
                style={{
                  background: isPlaced ? "var(--muted)" : isSelected ? `${piece.color}20` : "var(--card)",
                  borderColor: isPlaced ? "var(--border)" : isSelected ? piece.color : "var(--border)",
                  opacity: isPlaced ? 0.4 : 1,
                  cursor: isPlaced ? "not-allowed" : "pointer",
                }}
              >
                <span className="text-2xl">{isPlaced ? "✅" : piece.emoji}</span>
                <span className="text-xs text-center leading-tight" style={{ color: "var(--foreground)" }}>
                  {piece.label.vi}
                </span>
                {isSelected && (
                  <span className="text-xs text-amber-600 font-semibold">← Đã chọn</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
          <span>Đã ghép / Placed: {placedCount}/{PIECES.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
          <motion.div animate={{ width: `${progress}%` }}
            className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #5A3018, #D4A800)" }} />
        </div>
      </div>

      {selectedPiece !== null && (
        <p className="text-sm text-center text-amber-700 font-medium animate-pulse">
          👆 Nhấp vào ô tương ứng trên tấm hoành phi / Click the matching slot on the panel
        </p>
      )}

      {completed && (
        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-amber-500" style={{ background: "#D4A80018" }}>
          <CheckCircle2 className="w-6 h-6 text-amber-700" />
          <p className="font-medium" style={{ color: "#5A3018" }}>
            🏆 Tấm hoành phi chạm khắc của bạn đã hoàn chỉnh! / Your carved wooden panel is complete!
          </p>
        </div>
      )}
    </div>
  );
}
