import React from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  VIDERE_PATHS,
  getPathTracks,
  getPathLessons,
  getPathCompletedCount,
  getPathForTrack
} from '../data/paths';
import { pathDotClass } from '../utils/pathUi';
import {
  Shield,
  Eye,
  Code,
  Wrench,
  BookOpen,
  FileText,
  Award,
  Sparkles,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenWiki: () => void;
  onOpenToolkit: () => void;
  onOpenReports: () => void;
  onOpenAsk: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWiki, onOpenToolkit, onOpenReports, onOpenAsk }) => {
  const {
    progress,
    reports,
    activeTrackId,
    setActiveTrackId,
    activeLessonId,
    setActiveLessonId,
    isDevToolsOpen,
    setIsDevToolsOpen,
    resetAllProgress
  } = useProgress();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const activePath = getPathForTrack(activeTrackId) || VIDERE_PATHS[0];

  const selectPath = (pathId: string) => {
    const path = VIDERE_PATHS.find(p => p.id === pathId);
    if (!path) return;
    const tracks = getPathTracks(path);
    if (tracks.length) {
      setActiveTrackId(tracks[0].id);
      setActiveLessonId(tracks[0].lessons[0].id);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <div
            onClick={() => {
              setActiveTrackId('track-1');
              setActiveLessonId('lesson-1-1');
            }}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Eye className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-widest text-slate-100 font-mono">
                  VIDERE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                The Security Intuition Engine
              </p>
            </div>
          </div>

          {/* Learning Path Switcher (Desktop) — sidebar covers < xl */}
          <div className="hidden xl:flex items-center space-x-1 pl-4 border-l border-slate-800">
            {VIDERE_PATHS.map(path => {
              const isActive = path.id === activePath.id;
              const total = getPathLessons(path).length;
              const done = getPathCompletedCount(path, progress.completedLessons);
              const allDone = done === total;

              return (
                <button
                  key={path.id}
                  onClick={() => selectPath(path.id)}
                  title={`${path.title} — ${done}/${total} modules complete`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border border-slate-700 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    allDone ? 'bg-emerald-400' : isActive ? pathDotClass(path.colorAccent) : 'bg-slate-600'
                  }`}></span>
                  <span>{path.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Intuition Score */}
        <div className="hidden md:flex items-center space-x-2.5">
          {/* DevTools Toggle Button */}
          <button
            onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
              isDevToolsOpen
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950/40 font-bold'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
            }`}
            title="Toggle Simulated DevTools inspector"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>DevTools</span>
            {isDevToolsOpen && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
          </button>

          {/* Toolkit Lab */}
          <button
            onClick={onOpenToolkit}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-sans transition"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Intuition Lab</span>
          </button>

          {/* Vision & Wiki */}
          <button
            onClick={onOpenWiki}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-sans transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vision &amp; Wiki</span>
          </button>

          {/* Filed Reports */}
          <button
            onClick={onOpenReports}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-sans transition"
            title="Your submitted triage reports"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">Reports</span>
            {reports.length > 0 && (
              <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-px rounded">
                {reports.length}
              </span>
            )}
          </button>

          {/* Ask Videre (AI) */}
          <button
            onClick={onOpenAsk}
            className="hidden lg:flex p-1.5 bg-slate-900 hover:bg-purple-950/60 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-800 rounded-lg transition"
            title="Ask Videre — AI mentor for this lesson (Groq)"
            aria-label="Ask Videre AI mentor"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </button>

          {/* User Score Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-sans">
                {progress.level}
              </div>
              <div className="text-xs font-bold font-mono text-emerald-400 flex items-center justify-end space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{progress.noticingScore} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setIsDevToolsOpen(!isDevToolsOpen)}
            className={`p-2 rounded-lg border text-xs font-mono ${
              isDevToolsOpen ? 'bg-cyan-950 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-3 font-sans text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Select Path</span>
            {VIDERE_PATHS.map(path => {
              const isActive = path.id === activePath.id;
              const done = getPathCompletedCount(path, progress.completedLessons);
              const total = getPathLessons(path).length;

              return (
                <button
                  key={path.id}
                  onClick={() => {
                    selectPath(path.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                    isActive ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${pathDotClass(path.colorAccent)}`}></span>
                    <span>{path.shortName}</span>
                  </span>
                  <span className="font-mono text-[10px] opacity-70">{done}/{total}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
              Tracks — {activePath.shortName}
            </span>
            {getPathTracks(activePath).map(track => (
              <button
                key={track.id}
                onClick={() => {
                  setActiveTrackId(track.id);
                  setActiveLessonId(track.lessons[0].id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  track.id === activeTrackId ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                <span>Track {track.number}: {track.title}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenToolkit();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-900 rounded-lg text-slate-200"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Open Intuition Lab / Toolkit</span>
            </button>
            <button
              onClick={() => {
                onOpenWiki();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-900 rounded-lg text-slate-200"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Vision &amp; Architecture Wiki</span>
            </button>
            <button
              onClick={() => {
                onOpenReports();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-900 rounded-lg text-slate-200"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>My Triage Reports ({reports.length})</span>
            </button>
            <button
              onClick={() => {
                onOpenAsk();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-900 rounded-lg text-slate-200"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Ask Videre (AI)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
