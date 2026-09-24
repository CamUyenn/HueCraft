'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface IncenseActivityProps {
  onComplete: () => void;
}

interface Ingredient {
  name: string;
  nameEn: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  optimal: number;
}

export default function IncenseActivity({ onComplete }: IncenseActivityProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "Bột trầm hương", nameEn: "Agarwood powder", icon: "🌿", value: 0, min: 0, max: 100, optimal: 40 },
    { name: "Bột quế", nameEn: "Cinnamon powder", icon: "🍂", value: 0, min: 0, max: 100, optimal: 30 },
    { name: "Bột xạ hương", nameEn: "Musk powder", icon: "✨", value: 0, min: 0, max: 100, optimal: 20 },
    { name: "Bột keo tự nhiên", nameEn: "Natural glue powder", icon: "🌾", value: 0, min: 0, max: 100, optimal: 10 }
  ]);
  const [isMixing, setIsMixing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<'perfect' | 'good' | 'poor' | null>(null);

  const handleIngredientChange = (index: number, value: number[]) => {
    const updated = [...ingredients];
    updated[index].value = value[0];
    setIngredients(updated);
    setResult(null);
  };

  const calculateQuality = () => {
    let totalDifference = 0;
    ingredients.forEach(ingredient => {
      const difference = Math.abs(ingredient.value - ingredient.optimal);
      totalDifference += difference;
    });

    const averageDifference = totalDifference / ingredients.length;

    if (averageDifference <= 10) return 'perfect';
    if (averageDifference <= 25) return 'good';
    return 'poor';
  };

  const handleMix = async () => {
    setIsMixing(true);
    
    setTimeout(() => {
      const quality = calculateQuality();
      setResult(quality);
      setIsMixing(false);
      
      if (quality === 'perfect' || quality === 'good') {
        setIsCompleted(true);
        onComplete();
      }
    }, 2000);
  };

  const handleReset = () => {
    setIngredients(ingredients.map(ing => ({ ...ing, value: 0 })));
    setResult(null);
    setIsCompleted(false);
  };

  const totalValue = ingredients.reduce((sum, ing) => sum + ing.value, 0);
  const canMix = totalValue > 50;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Trộn nguyên liệu / Mix Ingredients
        </h4>
        <p className="text-gray-600 mb-4">
          Điều chỉnh lượng các nguyên liệu để tạo ra hương thơm hoàn hảo!
          <br />
          Adjust the amount of ingredients to create the perfect fragrance!
        </p>

        <div className="space-y-6">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ingredient.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{ingredient.name}</p>
                    <p className="text-sm text-gray-500">{ingredient.nameEn}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-amber-600">{ingredient.value}%</span>
              </div>
              <Slider
                value={[ingredient.value]}
                onValueChange={(value) => handleIngredientChange(index, value)}
                max={ingredient.max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{ingredient.min}%</span>
                <span className="text-green-600">✓ {ingredient.optimal}%</span>
                <span>{ingredient.max}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Tổng lượng:</strong> {totalValue}% (Tối thiểu 50% để trộn)
          </p>
        </div>
      </div>

      {/* Mixing Animation */}
      {isMixing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-lg text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Sparkles className="w-16 h-16 text-purple-600" />
          </motion.div>
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Đang trộn nguyên liệu... / Mixing ingredients...
          </p>
        </motion.div>
      )}

      {/* Result */}
      {result && !isMixing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg ${
            result === 'perfect'
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500'
              : result === 'good'
              ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-500'
              : 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-500'
          }`}
        >
          <div className="text-center">
            <div className="text-6xl mb-3">
              {result === 'perfect' ? '🌟' : result === 'good' ? '👍' : '🤔'}
            </div>
            <h4 className="text-2xl font-bold mb-2">
              {result === 'perfect' && 'Hoàn hảo! / Perfect!'}
              {result === 'good' && 'Tốt! / Good!'}
              {result === 'poor' && 'Thử lại! / Try Again!'}
            </h4>
            <p className="text-gray-700">
              {result === 'perfect' && 'Bạn đã tạo ra hương thơm tuyệt vời! / You created an excellent fragrance!'}
              {result === 'good' && 'Hương thơm khá tốt! / The fragrance is quite good!'}
              {result === 'poor' && 'Hãy điều chỉnh lại tỷ lệ các nguyên liệu! / Adjust the ingredient ratios!'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
          disabled={totalValue === 0 || isMixing}
        >
          Làm lại / Reset
        </Button>
        <Button
          onClick={handleMix}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          disabled={!canMix || isMixing || isCompleted}
        >
          {isCompleted ? '✓ Đã hoàn thành / Completed' : 'Trộn hương / Mix Incense'}
        </Button>
      </div>
    </div>
  );
}
