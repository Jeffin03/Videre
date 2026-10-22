export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface InteractiveChallenge {
  id: string;
  type: 'decode' | 'tamper' | 'inspect' | 'idor' | 'injection' | 'triage';
  prompt: string;
  targetHint?: string;
  initialData?: any;
  solution?: string | ((input: any) => boolean);
  successMessage: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  trackId: string;
  number: string;
  title: string;
  tagline: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  mentalModelConcept: string;
  discoveryPrompt: string;
  discoveryComponent: string; // Identifier for interactive discovery widget
  noticeThisMoments: string[];
  explanationMarkdown: string;
  devTakeaway: string;
  securityTakeaway: string;
  challenge: InteractiveChallenge;
  simulatedTarget?: {
    appName: string;
    targetUrl: string;
    description: string;
    htmlSource: string;
    storageItems: { key: string; value: string; type: 'localStorage' | 'cookie' }[];
    networkRequests: {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      status: number;
      headers: Record<string, string>;
      body?: any;
      response: any;
    }[];
  };
}

export interface Track {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  philosophyBadge: string;
  iconName: string;
  colorAccent: string; // Tailwind color e.g. 'emerald', 'cyan', 'amber', 'purple'
  lessons: Lesson[];
}

/**
 * A LearningPath groups one or more Tracks into a role-focused journey
 * (e.g. Foundations, GRC, SOC, Bug Bounty). Paths drive the navbar
 * switcher and the grouped curriculum sidebar.
 */
export interface LearningPath {
  id: string;
  number: number;
  title: string;
  shortName: string;
  tagline: string;
  colorAccent: string; // Tailwind color used for dots/badges
  iconName: string; // lucide icon key, resolved in src/utils/pathUi.ts
  trackIds: string[];
}

export interface UserProgress {
  completedLessons: string[];
  completedChallenges: string[];
  noticingScore: number;
  triageReportsSubmitted: number;
  bookmarkedLessons: string[];
  userNotes: Record<string, string>;
  joinedAt: string;
  level: string;
}

export interface TriageReport {
  id: string;
  title: string;
  vulnerabilityType: string;
  targetAsset: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  stepsToReproduce: string;
  businessImpact: string;
  remediation: string;
  timestamp: string;
  score?: number;
  feedback?: string[];
}
