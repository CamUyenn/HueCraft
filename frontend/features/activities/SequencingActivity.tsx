'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { GripVertical, CheckCircle2, XCircle } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface SequencingActivityProps {
  steps: string[];
  onComplete: () => void;
}

interface DraggableStepProps {
  step: string;
  index: number;
  moveStep: (fromIndex: number, toIndex: number) => void;
}

const DraggableStep = ({ step, index, moveStep }: DraggableStepProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'step',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'step',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveStep(item.index, index);
        item.index = index;
      }
    }
  });

  return (
    <div ref={(node) => { drag(drop(node)); }} className={isDragging ? 'opacity-50' : ''}>
      <motion.div
        layout
        className="bg-white p-4 rounded-lg border-2 border-amber-200 hover:border-amber-400 cursor-move shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-800">{step}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function SequencingContent({ steps, onComplete }: SequencingActivityProps) {
  const [currentSteps, setCurrentSteps] = useState(() => [...steps].reverse());
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const moveStep = (fromIndex: number, toIndex: number) => {
    const updated = [...currentSteps];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCurrentSteps(updated);
    setIsChecked(false);
  };

  const checkOrder = () => {
    const isCorrect = currentSteps.every((step, index) => step === steps[index]);
    setIsChecked(true);
    if (isCorrect) {
      setIsCompleted(true);
      onComplete();
    }
  };

  const isCorrect = currentSteps.every((step, index) => step === steps[index]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-gray-700">
          <strong>Hướng dẫn:</strong> Kéo và thả các bước để sắp xếp theo đúng thứ tự quy trình.
          <br />
          <strong>Instructions:</strong> Drag and drop the steps to arrange them in the correct order.
        </p>
      </div>

      <div className="space-y-3">
        {currentSteps.map((step, index) => (
          <DraggableStep
            key={`${step}-${index}`}
            step={step}
            index={index}
            moveStep={moveStep}
          />
        ))}
      </div>

      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 ${
            isCorrect
              ? 'bg-green-50 border-2 border-green-500'
              : 'bg-red-50 border-2 border-red-500'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <p className="text-green-800 font-semibold">
                Chính xác! Bạn đã sắp xếp đúng thứ tự! / Correct! You got the right order!
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-800 font-semibold">
                Chưa đúng, hãy thử lại! / Not quite, try again!
              </p>
            </>
          )}
        </motion.div>
      )}

      <Button
        onClick={checkOrder}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        size="lg"
        disabled={isCompleted}
      >
        {isCompleted ? '✓ Đã hoàn thành / Completed' : 'Kiểm tra / Check Order'}
      </Button>
    </div>
  );
}

export default function SequencingActivity(props: SequencingActivityProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <SequencingContent {...props} />
    </DndProvider>
  );
}
