'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Plus, Minus, Sparkles } from "lucide-react";

interface CraftingActivityProps {
  onComplete: () => void;
}

export default function CraftingActivity({ onComplete }: CraftingActivityProps) {
  const [layers, setLayers] = useState<number>(0);
  const [poems, setPoems] = useState<string[]>([]);
  const [selectedPoem, setSelectedPoem] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);

  const availablePoems = [
    "Trăng thanh gió mát đêm hè",
    "Sông Hương nước chảy nghiêng nghiêng",
    "Mưa sa trên nóc nhà tranh",
    "Hoa rơi cánh bướm bay bay",
    "Nước non gấm vóc tươi màu"
  ];

  const handleAddLayer = () => {
    if (layers < 16) {
      setLayers(layers + 1);
    }
  };

  const handleRemoveLayer = () => {
    if (layers > 0) {
      setLayers(layers - 1);
    }
  };

  const handleAddPoem = () => {
    if (selectedPoem && !poems.includes(selectedPoem)) {
      setPoems([...poems, selectedPoem]);
      setSelectedPoem("");
    }
  };

  const handleComplete = () => {
    if (layers >= 12 && poems.length >= 2) {
      setIsCompleted(true);
      onComplete();
    }
  };

  const canComplete = layers >= 12 && poems.length >= 2;

  return (
    <div className="space-y-6">
      {/* Hat Preview */}
      <div className="bg-gradient-to-b from-blue-100 to-green-100 p-8 rounded-lg">
        <div className="flex justify-center">
          <div className="relative">
            {/* Conical hat visualization */}
            <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
              {/* Hat layers */}
              {Array.from({ length: layers }).map((_, i) => {
                const opacity = 0.3 + (i / layers) * 0.7;
                const width = 250 - (i * 10);
                const y = 50 + (i * 5);
                return (
                  <motion.ellipse
                    key={i}
                    cx="150"
                    cy={y}
                    rx={width / 2}
                    ry="20"
                    fill="#D4A373"
                    opacity={opacity}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  />
                );
              })}
              
              {/* Hat cone shape */}
              {layers > 0 && (
                <>
                  <motion.path
                    d="M 150 20 L 25 150 L 275 150 Z"
                    fill="#E5C29F"
                    opacity="0.8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                  />
                  <motion.ellipse
                    cx="150"
                    cy="150"
                    rx="125"
                    ry="30"
                    fill="#D4A373"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                </>
              )}

              {/* Poems indicator */}
              {poems.length > 0 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {poems.map((_, i) => (
                    <text
                      key={i}
                      x="150"
                      y={80 + i * 20}
                      textAnchor="middle"
                      fill="#8B4513"
                      fontSize="10"
                      fontStyle="italic"
                    >
                      ~~~
                    </text>
                  ))}
                </motion.g>
              )}
            </svg>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Nón lá của bạn / Your Conical Hat
          </p>
          <div className="flex justify-center gap-6 mt-2">
            <span className="text-sm text-gray-600">
              🍃 Lớp lá: {layers}/16
            </span>
            <span className="text-sm text-gray-600">
              📜 Câu thơ: {poems.length}/3
            </span>
          </div>
        </div>
      </div>

      {/* Layer Control */}
      <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
        <h4 className="text-lg font-semibold mb-4">1. Thêm lớp lá cọ / Add Palm Leaf Layers</h4>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRemoveLayer}
            variant="outline"
            size="icon"
            disabled={layers === 0}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(layers / 16) * 100}%` }}
              />
            </div>
            <p className="text-center mt-1 text-sm text-gray-600">
              {layers}/16 lớp (Tối thiểu 12)
            </p>
          </div>
          <Button
            onClick={handleAddLayer}
            variant="outline"
            size="icon"
            disabled={layers === 16}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Poem Selection */}
      <div className="bg-white p-6 rounded-lg border-2 border-amber-200">
        <h4 className="text-lg font-semibold mb-4">2. Thêm câu thơ / Add Poems</h4>
        <div className="space-y-3">
          <select
            value={selectedPoem}
            onChange={(e) => setSelectedPoem(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
          >
            <option value="">Chọn câu thơ / Select a poem...</option>
            {availablePoems.map((poem) => (
              <option key={poem} value={poem} disabled={poems.includes(poem)}>
                {poem} {poems.includes(poem) ? '(Đã chọn)' : ''}
              </option>
            ))}
          </select>
          <Button
            onClick={handleAddPoem}
            variant="outline"
            className="w-full"
            disabled={!selectedPoem || poems.includes(selectedPoem)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm câu thơ / Add Poem
          </Button>

          {poems.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-gray-700">Các câu thơ đã chọn:</p>
              {poems.map((poem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2"
                >
                  <span className="text-amber-700">📜</span>
                  <span className="italic text-gray-700">{poem}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Yêu cầu hoàn thành:</strong>
          <br />
          • Tối thiểu 12 lớp lá cọ {layers >= 12 ? '✅' : '❌'}
          <br />
          • Tối thiểu 2 câu thơ {poems.length >= 2 ? '✅' : '❌'}
        </p>
      </div>

      {/* Complete button */}
      <Button
        onClick={handleComplete}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2"
        size="lg"
        disabled={!canComplete || isCompleted}
      >
        {isCompleted ? (
          <>
            <Sparkles className="w-5 h-5" />
            ✓ Đã hoàn thành / Completed
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Hoàn thành nón lá / Complete Hat
          </>
        )}
      </Button>
    </div>
  );
}
