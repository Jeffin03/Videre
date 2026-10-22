import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, TriageReport } from '../types';

interface ProgressContextType {
  progress: UserProgress;
  markLessonComplete: (lessonId: string) => void;
  markChallengeComplete: (challengeId: string, points?: number) => void;
  toggleBookmark: (lessonId: string) => void;
  saveUserNote: (lessonId: string, note: string) => void;
  addTriageReport: (report: Omit<TriageReport, 'id' | 'timestamp'>) => TriageReport;
  reports: TriageReport[];
  resetAllProgress: () => void;
  activeTrackId: string;
  setActiveTrackId: (id: string) => void;
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  isDevToolsOpen: boolean;
  setIsDevToolsOpen: (open: boolean) => void;
  isToolkitOpen: boolean;
  setIsToolkitOpen: (open: boolean) => void;
  activeToolkitTab: string;
  setActiveToolkitTab: (tab: string) => void;
  triggerCelebration: () => void;
}

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  completedChallenges: [],
  noticingScore: 120, // Starting baseline intuition points
  triageReportsSubmitted: 0,
  bookmarkedLessons: [],
  userNotes: {},
  joinedAt: new Date().toISOString(),
  level: 'Observer (Lvl 1)'
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('videre_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved progress', e);
    }
    return DEFAULT_PROGRESS;
  });

  const [reports, setReports] = useState<TriageReport[]>(() => {
    try {
      const saved = localStorage.getItem('videre_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved reports', e);
    }
    return [];
  });

  const [activeTrackId, setActiveTrackId] = useState<string>('track-1');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1-1');
  const [isDevToolsOpen, setIsDevToolsOpen] = useState<boolean>(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState<boolean>(false);
  const [activeToolkitTab, setActiveToolkitTab] = useState<string>('decoder');

  useEffect(() => {
    try {
      localStorage.setItem('videre_progress', JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save progress', e);
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem('videre_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('Could not save reports', e);
    }
  }, [reports]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#a855f7']
      });
    } catch (e) {
      // safe fallback
    }
  };

  const calculateLevel = (score: number): string => {
    if (score > 1200) return 'Systems Thinker (Lvl 5)';
    if (score > 800) return 'Threat Analyst (Lvl 4)';
    if (score > 500) return 'Bug Hunter (Lvl 3)';
    if (score > 250) return 'Security Scout (Lvl 2)';
    return 'Observer (Lvl 1)';
  };

  const markLessonComplete = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newScore = prev.noticingScore + 50;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        noticingScore: newScore,
        level: calculateLevel(newScore)
      };
    });
    triggerCelebration();
  };

  const markChallengeComplete = (challengeId: string, points = 100) => {
    setProgress(prev => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      const newScore = prev.noticingScore + points;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        noticingScore: newScore,
        level: calculateLevel(newScore)
      };
    });
    triggerCelebration();
  };

  const toggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarkedLessons.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessons: exists
          ? prev.bookmarkedLessons.filter(id => id !== lessonId)
          : [...prev.bookmarkedLessons, lessonId]
      };
    });
  };

  const saveUserNote = (lessonId: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      userNotes: {
        ...prev.userNotes,
        [lessonId]: note
      }
    }));
  };

  const addTriageReport = (reportData: Omit<TriageReport, 'id' | 'timestamp'>) => {
    const newReport: TriageReport = {
      ...reportData,
      id: 'rep_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      score: 95,
      feedback: [
        'Clear, unambiguous title format',
        'Steps to reproduce allow immediate re-testing in under 3 minutes',
        'Business impact ties directly to regulatory and financial risk'
      ]
    };

    setReports(prev => [newReport, ...prev]);
    setProgress(prev => {
      const newScore = prev.noticingScore + 150;
      return {
        ...prev,
        triageReportsSubmitted: prev.triageReportsSubmitted + 1,
        noticingScore: newScore,
        level: calculateLevel(newScore)
      };
    });
    triggerCelebration();
    return newReport;
  };

  const resetAllProgress = () => {
    if (window.confirm('Reset all lesson progress, notes, and intuition points?')) {
      setProgress(DEFAULT_PROGRESS);
      setReports([]);
      localStorage.removeItem('videre_progress');
      localStorage.removeItem('videre_reports');
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markLessonComplete,
        markChallengeComplete,
        toggleBookmark,
        saveUserNote,
        addTriageReport,
        reports,
        resetAllProgress,
        activeTrackId,
        setActiveTrackId,
        activeLessonId,
        setActiveLessonId,
        isDevToolsOpen,
        setIsDevToolsOpen,
        isToolkitOpen,
        setIsToolkitOpen,
        activeToolkitTab,
        setActiveToolkitTab,
        triggerCelebration
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
