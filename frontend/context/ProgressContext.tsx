'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VillageProgress {
  [villageId: string]: {
    completed: boolean;
    quizScore?: number;
    activityCompleted: boolean;
  };
}

interface UnlockedRewards {
  [rewardId: string]: boolean;
}

interface ProgressContextType {
  villageProgress: VillageProgress;
  unlockedRewards: UnlockedRewards;
  completeActivity: (villageId: string) => void;
  completeQuiz: (villageId: string, score: number) => void;
  unlockReward: (rewardId: string) => void;
  isVillageCompleted: (villageId: string) => boolean;
  getCompletedVillagesCount: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [villageProgress, setVillageProgress] = useState<VillageProgress>({});
  const [unlockedRewards, setUnlockedRewards] = useState<UnlockedRewards>({});

  const completeActivity = (villageId: string) => {
    setVillageProgress(prev => ({
      ...prev,
      [villageId]: {
        ...prev[villageId],
        activityCompleted: true,
        completed: prev[villageId]?.quizScore ? prev[villageId].quizScore! >= 3 : false
      }
    }));
  };

  const completeQuiz = (villageId: string, score: number) => {
    setVillageProgress(prev => ({
      ...prev,
      [villageId]: {
        ...prev[villageId],
        quizScore: score,
        activityCompleted: prev[villageId]?.activityCompleted || false,
        completed: score >= 3 && (prev[villageId]?.activityCompleted || false)
      }
    }));
  };

  const unlockReward = (rewardId: string) => {
    setUnlockedRewards(prev => ({
      ...prev,
      [rewardId]: true
    }));
  };

  const isVillageCompleted = (villageId: string) => {
    return villageProgress[villageId]?.completed || false;
  };

  const getCompletedVillagesCount = () => {
    return Object.values(villageProgress).filter(p => p.completed).length;
  };

  return (
    <ProgressContext.Provider
      value={{
        villageProgress,
        unlockedRewards,
        completeActivity,
        completeQuiz,
        unlockReward,
        isVillageCompleted,
        getCompletedVillagesCount
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
