'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Palette, RefreshCw } from "lucide-react";

interface PaintingActivityProps {
  onComplete: () => void;
}

export default function PaintingActivity({ onComplete }: PaintingActivityProps) {
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [paintedAreas, setPaintedAreas] = useState<{ [key: number]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const colors = [
    { name: "Đỏ", color: "#FF6B6B" },
    { name: "Vàng", color: "#FFD93D" },
    { name: "Xanh lá", color: "#6BCF7F" },
    { name: "Xanh dương", color: "#4D96FF" },
    { name: "Tím", color: "#A78BFA" },
    { name: "Cam", color: "#FF9F43" },
    { name: "Nâu", color: "#8B4513" },
    { name: "Hồng", color: "#FFB6C1" }
  ];

  // Define painting areas (simplified painting template)
  const paintingAreas = [
    { id: 1, x: 10, y: 10, width: 30, height: 30, label: "Mặt trời" },
    { id: 2, x: 50, y: 15, width: 40, height: 25, label: "Mây" },
    { id: 3, x: 15, y: 50, width: 25, height: 35, label: "Cây" },
    { id: 4, x: 45, y: 55, width: 30, height: 30, label: "Nhà" },
    { id: 5, x: 10, y: 90, width: 80, height: 10, label: "Đất" },
    { id: 6, x: 75, y: 60, width: 15, height: 25, label: "Hoa" }
  ];

  const handlePaint = (areaId: number) => {
    setPaintedAreas(prev => ({
      ...prev,
      [areaId]: selectedColor
    }));
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const handleReset = () => {
    setPaintedAreas({});
    setIsCompleted(false);
  };

  const paintedCount = Object.keys(paintedAreas).length;
  const progress = (paintedCount / paintingAreas.length) * 100;

  return (
    <div className="space-y-6">
      {/* Color Palette */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-purple-600" />
          <h4 className="text-xl font-semibold text-gray-800">Bảng màu / Color Palette</h4>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {colors.map((c) => (
            <button
              key={c.color}
              onClick={() => setSelectedColor(c.color)}
              className={`w-full aspect-square rounded-lg transition-all ${
                selectedColor === c.color
                  ? 'ring-4 ring-offset-2 ring-purple-500 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c.color }}
              title={c.name}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Màu đã chọn: <span className="font-semibold" style={{ color: selectedColor }}>{selectedColor}</span>
        </p>
      </div>

      {/* Canvas */}
      <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
        <div className="aspect-video relative bg-gradient-to-b from-blue-100 to-green-100 rounded-lg overflow-hidden border-4 border-amber-400">
          {paintingAreas.map((area) => (
            <motion.button
              key={area.id}
              onClick={() => handlePaint(area.id)}
              className="absolute border-2 border-dashed border-gray-400 hover:border-amber-600 transition-all cursor-pointer group"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
                backgroundColor: paintedAreas[area.id] || 'transparent'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700 group-hover:text-amber-900 opacity-50 group-hover:opacity-100">
                {!paintedAreas[area.id] && area.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tiến độ: {paintedCount}/{paintingAreas.length}</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 gap-2"
          disabled={paintedCount === 0}
        >
          <RefreshCw className="w-5 h-5" />
          Làm lại / Reset
        </Button>
        <Button
          onClick={handleComplete}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          disabled={isCompleted || paintedCount < 3}
        >
          {isCompleted ? '✓ Đã hoàn thành' : 'Hoàn thành / Complete'}
        </Button>
      </div>
    </div>
  );
}
