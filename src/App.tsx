/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { ALL_TRACKS } from './data/paths';
import { Navbar } from './components/Navbar';
import { CurriculumSidebar } from './components/Tracks/CurriculumSidebar';
import { LessonViewer } from './components/Tracks/LessonViewer';
import { SimulatedDevTools } from './components/DevTools/SimulatedDevTools';
import { ToolkitModal } from './components/Toolkit/ToolkitModal';
import { WikiModal } from './components/Wiki/WikiModal';
import { ReportsModal } from './components/Reports/ReportsModal';
import { AskVidere } from './components/AI/AskVidere';
import { Code, RotateCcw, FileText } from 'lucide-react';

function AppContent() {
  const {
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
    resetAllProgress,
    markChallengeComplete
  } = useProgress();

  const [isWikiOpen, setIsWikiOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isAskOpen, setIsAskOpen] = useState(false);

  // Find active track and lesson
  const currentTrack = ALL_TRACKS.find(t => t.id === activeTrackId) || ALL_TRACKS[0];
  const currentLesson = currentTrack.lessons.find(l => l.id === activeLessonId) || currentTrack.lessons[0];

  const handleDevToolsStorageChange = (key: string, value: string) => {
    // If user edited account_tier to superadmin, reward challenge!
    if (key === 'account_tier' && value === 'superadmin') {
      markChallengeComplete('chal-1-3', 100);
    }
  };

  const handleDevToolsDomTamper = (attr: string, val: string) => {
    if (attr === 'value' && val === '1.00') {
      markChallengeComplete('chal-1-4', 100);
    }
  };

  // Keyboard shortcuts: F12 toggles the simulated DevTools panel (as the
  // floating pill advertises), Escape closes the topmost overlay.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        setIsDevToolsOpen(!isDevToolsOpen);
        return;
      }
      if (e.key === 'Escape') {
        if (isAskOpen) setIsAskOpen(false);
        else if (isToolkitOpen) setIsToolkitOpen(false);
        else if (isReportsOpen) setIsReportsOpen(false);
        else if (isWikiOpen) setIsWikiOpen(false);
        else if (isDevToolsOpen) setIsDevToolsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAskOpen, isToolkitOpen, isReportsOpen, isWikiOpen, isDevToolsOpen, setIsDevToolsOpen, setIsToolkitOpen]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-600 selection:text-slate-100 relative">
      {/* Top Navigation */}
      <Navbar
        onOpenWiki={() => setIsWikiOpen(true)}
        onOpenToolkit={() => setIsToolkitOpen(true)}
        onOpenReports={() => setIsReportsOpen(true)}
        onOpenAsk={() => setIsAskOpen(true)}
      />

      {/* Ask Videre — Groq-backed lesson mentor */}
      <AskVidere
        isOpen={isAskOpen}
        onClose={() => setIsAskOpen(false)}
        lesson={currentLesson}
        track={currentTrack}
      />

      {/* Main Learning Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Curriculum Sidebar */}
        <CurriculumSidebar onOpenWiki={() => setIsWikiOpen(true)} />

        {/* Lesson View Area */}
        <div className="flex-1 min-w-0">
          {/* key forces a fresh component per lesson so notes/challenge
              inputs never leak from one lesson into the next */}
          <LessonViewer
            key={currentLesson.id}
            lesson={currentLesson}
            track={currentTrack}
            onNavigateLesson={(lessonId) => setActiveLessonId(lessonId)}
          />
        </div>
      </main>

      {/* Floating Quick Action Bar (DevTools Callout) */}
      {!isDevToolsOpen && (
        <div className="fixed bottom-5 right-5 z-20 flex items-center space-x-2">
          <button
            onClick={() => setIsDevToolsOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 rounded-full shadow-2xl backdrop-blur-md font-mono text-xs font-bold transition group"
          >
            <Code className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Simulate DevTools (F12)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          </button>
        </div>
      )}

      {/* Embedded Simulated DevTools Panel */}
      <SimulatedDevTools
        lesson={currentLesson}
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
        onStorageChange={handleDevToolsStorageChange}
        onDomTamper={handleDevToolsDomTamper}
      />

      {/* Toolkit & Discovery Sandbox Modal */}
      <ToolkitModal
        isOpen={isToolkitOpen}
        onClose={() => setIsToolkitOpen(false)}
        defaultTab={activeToolkitTab}
      />

      {/* Vision & Pedagogy Wiki Modal */}
      <WikiModal
        isOpen={isWikiOpen}
        onClose={() => setIsWikiOpen(false)}
      />

      {/* Filed Triage Reports Modal */}
      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-slate-400">Videre</span>
          <span>•</span>
          <span>Security Intuition &amp; Mental Model Curriculum</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsWikiOpen(true)}
            className="hover:text-slate-300 transition"
          >
            Philosophy &amp; Onboarding
          </button>
          <span>•</span>
          <button
            onClick={() => setIsToolkitOpen(true)}
            className="hover:text-slate-300 transition"
          >
            Sandbox Toolkit
          </button>
          <span>•</span>
          <button
            onClick={() => setIsReportsOpen(true)}
            className="hover:text-slate-300 transition flex items-center space-x-1"
          >
            <FileText className="w-3 h-3" />
            <span>My Reports</span>
          </button>
          <span>•</span>
          <button
            onClick={resetAllProgress}
            className="hover:text-rose-400 transition flex items-center space-x-1"
            title="Reset XP and completed checklist"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Progress</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
