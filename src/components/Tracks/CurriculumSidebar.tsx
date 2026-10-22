import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  ALL_TRACKS,
  VIDERE_PATHS,
  getPathTracks,
  getPathLessons,
  getPathCompletedCount,
  getPathForTrack
} from '../../data/paths';
import { pathDotClass } from '../../utils/pathUi';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen, Layers } from 'lucide-react';

interface CurriculumSidebarProps {
  onOpenWiki: () => void;
}

const TOTAL_MODULES = ALL_TRACKS.reduce((n, t) => n + t.lessons.length, 0);

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({ onOpenWiki }) => {
  const {
    progress,
    activeTrackId,
    setActiveTrackId,
    activeLessonId,
    setActiveLessonId
  } = useProgress();

  const [isBrowseOpen, setIsBrowseOpen] = React.useState(false);

  const currentPathId = getPathForTrack(activeTrackId)?.id;

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 font-sans select-none">
      {/* Platform Title Banner */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase font-mono mb-1">
          <Layers className="w-4 h-4" />
          <span>Security Mindset Curriculum</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Four role-focused paths built on the same principle: the habit of noticing before tools and active exploitation.
        </p>

        {/* Global Progress Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400">Total Completion</span>
            <span className="font-mono text-emerald-400 font-bold">
              {progress.completedLessons.length} / {TOTAL_MODULES} Modules
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((progress.completedLessons.length / TOTAL_MODULES) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mobile: collapse the 7-track curriculum behind a toggle so the
          lesson itself isn't buried under ~2000px of navigation on phones */}
      <button
        onClick={() => setIsBrowseOpen(o => !o)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl transition"
        aria-expanded={isBrowseOpen}
      >
        <span className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Browse Curriculum</span>
          <span className="text-[10px] font-mono text-slate-500 font-normal">
            {progress.completedLessons.length}/{TOTAL_MODULES}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isBrowseOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Track List — grouped by learning path (always visible on lg+) */}
      <div className={`${isBrowseOpen ? 'block' : 'hidden'} lg:block space-y-5`}>
        {VIDERE_PATHS.map(path => {
          const tracks = getPathTracks(path);
          const pathTotal = getPathLessons(path).length;
          const pathDone = getPathCompletedCount(path, progress.completedLessons);
          const isCurrentPath = currentPathId === path.id;

          return (
            <div key={path.id} className="space-y-3">
              {/* Path header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${pathDotClass(path.colorAccent)}`}></span>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold truncate ${
                      isCurrentPath ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {path.shortName} Path
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {pathDone}/{pathTotal}
                </span>
              </div>

              {/* Tracks in this path */}
              <div className="space-y-3">
                {tracks.map(track => {
                  const isSelectedTrack = track.id === activeTrackId;
                  const completedCount = track.lessons.filter(l =>
                    progress.completedLessons.includes(l.id)
                  ).length;
                  const isAllDone = completedCount === track.lessons.length;

                  return (
                    <div
                      key={track.id}
                      className={`rounded-2xl border transition-all ${
                        isSelectedTrack
                          ? 'bg-slate-900/90 border-slate-700 shadow-md'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700/60'
                      }`}
                    >
                      {/* Track Header */}
                      <button
                        onClick={() => {
                          setActiveTrackId(track.id);
                          if (!isSelectedTrack) {
                            setActiveLessonId(track.lessons[0].id);
                          }
                        }}
                        className="w-full p-3.5 text-left flex items-start justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                              isSelectedTrack
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              Track {track.number}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              {completedCount}/{track.lessons.length} done
                            </span>
                          </div>

                          <h4 className={`text-sm font-bold tracking-tight ${
                            isSelectedTrack ? 'text-slate-100' : 'text-slate-300'
                          }`}>
                            {track.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {track.shortDescription}
                          </p>
                        </div>

                        <div className="pt-1">
                          {isAllDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isSelectedTrack ? (
                            <ChevronDown className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      </button>

                      {/* Lessons Sub-list */}
                      {isSelectedTrack && (
                        <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 space-y-1">
                          {track.lessons.map(lesson => {
                            const isCurrentLesson = lesson.id === activeLessonId;
                            const isDone = progress.completedLessons.includes(lesson.id);

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  setActiveLessonId(lesson.id);
                                  setIsBrowseOpen(false);
                                }}
                                className={`w-full p-2 rounded-xl text-left text-xs transition flex items-center justify-between group ${
                                  isCurrentLesson
                                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold'
                                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 truncate">
                                  {isDone ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className={`w-3.5 h-3.5 shrink-0 ${isCurrentLesson ? 'text-cyan-400' : 'text-slate-600'}`} />
                                  )}
                                  <span className="truncate">
                                    <span className="font-mono text-[10.5px] opacity-70 mr-1.5">{lesson.number}</span>
                                    {lesson.title}
                                  </span>
                                </div>

                                <span className="text-[10px] opacity-60 font-mono shrink-0 ml-1">
                                  {lesson.estimatedMinutes}m
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Wiki & Pedagogy Card */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
          <BookOpen className="w-4 h-4" />
          <span>The Videre Vision</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Why we reject slide lectures and tool memorization in favor of the habit of noticing.
        </p>
        <button
          onClick={onOpenWiki}
          className="w-full mt-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
        >
          Read the Platform Manifesto
        </button>
      </div>
    </aside>
  );
};
