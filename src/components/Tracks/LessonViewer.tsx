import React, { useState } from 'react';
import { Lesson, Track } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { getPathForTrack, getPathTracks } from '../../data/paths';
import { renderExplanationMarkdown } from '../../utils/markdown';
import {
  CheckCircle2,
  Clock,
  Award,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Code,
  ShieldAlert,
  Lightbulb,
  Sparkles,
  Edit,
  Save,
  Compass
} from 'lucide-react';

// Import interactive discovery widgets
import { Base64DecodeDemo } from '../InteractiveWidgets/Base64DecodeDemo';
import { StorageTamperDemo } from '../InteractiveWidgets/StorageTamperDemo';
import { FormBypassDemo } from '../InteractiveWidgets/FormBypassDemo';
import { IdorExplorerDemo } from '../InteractiveWidgets/IdorExplorerDemo';
import { XssMirrorDemo } from '../InteractiveWidgets/XssMirrorDemo';
import { SqlAstVisualizerDemo } from '../InteractiveWidgets/SqlAstVisualizerDemo';
import { SanitizationBypassDemo } from '../InteractiveWidgets/SanitizationBypassDemo';
import { TargetReconSandbox } from '../InteractiveWidgets/TargetReconSandbox';
import { CvssCalculatorDemo } from '../InteractiveWidgets/CvssCalculatorDemo';
import { ReportStudioDemo } from '../InteractiveWidgets/ReportStudioDemo';
import { AlertTriageDemo } from '../InteractiveWidgets/AlertTriageDemo';
import { LogHuntDemo } from '../InteractiveWidgets/LogHuntDemo';
import { ScopeCheckDemo } from '../InteractiveWidgets/ScopeCheckDemo';
import { RaceConditionLab } from '../InteractiveWidgets/RaceConditionLab';
import { RiskRegisterDemo } from '../InteractiveWidgets/RiskRegisterDemo';
import { ControlGapAuditDemo } from '../InteractiveWidgets/ControlGapAuditDemo';

interface LessonViewerProps {
  lesson: Lesson;
  track: Track;
  onNavigateLesson: (lessonId: string) => void;
}


export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  track,
  onNavigateLesson
}) => {
  const {
    progress,
    markLessonComplete,
    markChallengeComplete,
    toggleBookmark,
    saveUserNote,
    setIsDevToolsOpen
  } = useProgress();

  const [challengeInput, setChallengeInput] = useState('');
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState(progress.userNotes[lesson.id] || '');
  const [showNotes, setShowNotes] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const isCompleted = progress.completedLessons.includes(lesson.id);
  const isChallengeDone = progress.completedChallenges.includes(lesson.challenge.id);
  const isBookmarked = progress.bookmarkedLessons.includes(lesson.id);

  // Lesson index in current track
  const currentIndex = track.lessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? track.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < track.lessons.length - 1 ? track.lessons[currentIndex + 1] : null;
  const trackPath = getPathForTrack(track.id);

  // Cross-track navigation: when a track ends, continue into the next
  // track of the same learning path (and step back to the previous one).
  const pathTracks = trackPath ? getPathTracks(trackPath) : [];
  const trackPos = pathTracks.findIndex(t => t.id === track.id);
  const prevTrack = trackPos > 0 ? pathTracks[trackPos - 1] : null;
  const nextTrack = trackPos >= 0 && trackPos < pathTracks.length - 1 ? pathTracks[trackPos + 1] : null;
  const crossPrev = !prevLesson && prevTrack ? prevTrack.lessons[prevTrack.lessons.length - 1] : null;
  const crossNext = !nextLesson && nextTrack ? nextTrack.lessons[0] : null;
  const continueTarget = nextLesson || crossNext;

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChallengeError(null);

    const sol = lesson.challenge.solution;
    let passed = false;

    if (typeof sol === 'function') {
      passed = sol(challengeInput);
    } else if (typeof sol === 'string') {
      passed = challengeInput.trim().toLowerCase() === sol.toLowerCase();
    }

    if (passed) {
      markChallengeComplete(lesson.challenge.id, 100);
      markLessonComplete(lesson.id);
    } else {
      setChallengeError(`Not quite right! Check the hint or explore in the interactive widget / DevTools.`);
    }
  };

  const handleSaveNote = () => {
    saveUserNote(lesson.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const renderDiscoveryWidget = () => {
    switch (lesson.discoveryComponent) {
      case 'Base64DecodeDemo':
        return <Base64DecodeDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'StorageTamperDemo':
        return <StorageTamperDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'FormBypassDemo':
        return <FormBypassDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'IdorExplorerDemo':
        return <IdorExplorerDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'XssMirrorDemo':
        return <XssMirrorDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'SqlAstVisualizerDemo':
        return <SqlAstVisualizerDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'SanitizationBypassDemo':
        return <SanitizationBypassDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'TargetReconSandbox':
        return <TargetReconSandbox onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'CvssCalculatorDemo':
        return <CvssCalculatorDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'ReportStudioDemo':
        return <ReportStudioDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'AlertTriageDemo':
        return <AlertTriageDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'LogHuntDemo':
        return <LogHuntDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'ScopeCheckDemo':
        return <ScopeCheckDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'RaceConditionLab':
        return <RaceConditionLab onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'RiskRegisterDemo':
        return <RiskRegisterDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      case 'ControlGapAuditDemo':
        return <ControlGapAuditDemo onComplete={() => markChallengeComplete(lesson.challenge.id, 100)} />;
      default:
        return null;
    }
  };

  return (
    <article className="space-y-6 max-w-4xl mx-auto pb-24 font-sans">
      {/* Lesson Navigation Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-cyan-400 font-bold uppercase">
            {trackPath ? `${trackPath.shortName} › ` : ''}Track {track.number}: {track.title}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Module {lesson.number}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleBookmark(lesson.id)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition ${
              isBookmarked
                ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition ${
              showNotes || noteText
                ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Notes {noteText ? '•' : ''}</span>
          </button>

          {isCompleted && (
            <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>

      {/* Header card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            Lesson {lesson.number}
          </span>
          <span className="text-xs font-sans px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{lesson.estimatedMinutes} mins</span>
          </span>
          <span className="text-xs font-sans px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700 font-semibold">
            {lesson.difficulty}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
          {lesson.title}
        </h1>

        <p className="text-base text-slate-300 leading-relaxed font-normal">
          {lesson.tagline}
        </p>

        {/* Mental Model Pill Callout */}
        <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 flex items-start space-x-3">
          <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block mb-0.5">
              The Mental Model You're Building
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lesson.mentalModelConcept}
            </p>
          </div>
        </div>
      </div>

      {/* Scratchpad Notes Drawer if open */}
      {showNotes && (
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2 animate-in fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-1">
              <Edit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Personal Notes &amp; Observations for this Module</span>
            </span>
            <button
              onClick={handleSaveNote}
              className="flex items-center space-x-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition"
            >
              <Save className="w-3 h-3" />
              <span>{noteSaved ? 'Saved!' : 'Save Note'}</span>
            </button>
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Jot down things you noticed, edge cases, questions for society meetings..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>
      )}

      {/* Section 1: The Discovery Moment */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide font-mono">
              Phase 1: The Discovery Moment
            </h3>
          </div>
          <button
            onClick={() => setIsDevToolsOpen(true)}
            className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-mono"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Open DevTools Inspector</span>
          </button>
        </div>

        <p className="text-sm text-slate-300">
          {lesson.discoveryPrompt}
        </p>

        {/* Embedded Interactive Discovery Widget */}
        {renderDiscoveryWidget()}
      </section>

      {/* Section 2: Notice This Moments */}
      <section className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Notice This: Habit Building Checklist</span>
        </div>
        <p className="text-xs text-slate-400">
          Recognition is more valuable than exploit technique. Train your eyes to spot these patterns:
        </p>

        <div className="space-y-2">
          {lesson.noticeThisMoments.map((moment, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300 leading-relaxed"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                {idx + 1}
              </div>
              <span>{moment}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: The Deep Mental Model & Explanation */}
      <section className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide font-mono">
            Phase 2: Explanation &amp; Systems Architecture
          </h3>
        </div>

        <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed space-y-4">
          <div
            dangerouslySetInnerHTML={{
              __html: renderExplanationMarkdown(lesson.explanationMarkdown)
            }}
          />
        </div>
      </section>

      {/* Section 4: Dual Takeaways (Dev vs Security Researcher) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase font-mono">
            <Code className="w-4 h-4" />
            <span>Developer Takeaway (How to Fix It)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lesson.devTakeaway}
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase font-mono">
            <ShieldAlert className="w-4 h-4" />
            <span>Security Takeaway (What to Question)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lesson.securityTakeaway}
          </p>
        </div>
      </section>

      {/* Section 5: Interactive Verification Challenge */}
      <section className={`p-6 rounded-2xl border transition-all ${
        isChallengeDone
          ? 'bg-emerald-950/20 border-emerald-500/50'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${isChallengeDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">
                Phase 3: Hands-On Intuition Check
              </h4>
              <p className="text-xs text-slate-400">
                Verify your mental model to earn +100 XP and complete this module.
              </p>
            </div>
          </div>

          {isChallengeDone ? (
            <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>PASSED (+100 XP)</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
              100 XP
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {lesson.challenge.prompt}
        </p>

        {isChallengeDone ? (
          <div className="space-y-3">
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-200 text-xs">
              <p className="font-bold flex items-center space-x-1.5 mb-1 text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{lesson.challenge.successMessage}</span>
              </p>
              <p className="text-slate-300 mt-1">{lesson.challenge.explanation}</p>
            </div>

            <div className="flex justify-end">
              {continueTarget && (
                <button
                  onClick={() => onNavigateLesson(continueTarget.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition shadow-lg shadow-emerald-950/40"
                >
                  <span>Continue to {continueTarget.number}: {continueTarget.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleChallengeSubmit} className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={challengeInput}
                onChange={(e) => setChallengeInput(e.target.value)}
                placeholder="Enter discovered value, bypass token, or flag..."
                className="flex-1 min-w-[180px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition"
              >
                Verify Solution
              </button>
            </div>

            {lesson.challenge.targetHint && (
              <p className="text-[11px] text-slate-500 italic">
                Hint: {lesson.challenge.targetHint}
              </p>
            )}

            {challengeError && (
              <p className="text-xs text-rose-400 bg-rose-950/30 p-2 rounded border border-rose-900/60">
                {challengeError}
              </p>
            )}
          </form>
        )}
      </section>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
        {prevLesson ? (
          <button
            onClick={() => onNavigateLesson(prevLesson.id)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev: {prevLesson.number} {prevLesson.title}</span>
          </button>
        ) : crossPrev ? (
          <button
            onClick={() => onNavigateLesson(crossPrev.id)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {crossPrev.number} {crossPrev.title}</span>
          </button>
        ) : (
          <div></div>
        )}

        {nextLesson ? (
          <button
            onClick={() => onNavigateLesson(nextLesson.id)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition"
          >
            <span>Next: {nextLesson.number} {nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : crossNext ? (
          <button
            onClick={() => onNavigateLesson(crossNext.id)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition"
          >
            <span>Next Track: {crossNext.number} {crossNext.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => markLessonComplete(lesson.id)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Path Finished</span>
          </button>
        )}
      </div>
    </article>
  );
};
