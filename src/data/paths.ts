import { Lesson, LearningPath, Track } from '../types';
import { VIDERE_TRACKS } from './tracks';
import { GRC_TRACKS } from './trackGrc';
import { SOC_TRACKS } from './trackSoc';
import { BUGBOUNTY_TRACKS } from './trackBugBounty';

/** Every track in the app, in display order. */
export const ALL_TRACKS: Track[] = [
  ...VIDERE_TRACKS,
  ...GRC_TRACKS,
  ...SOC_TRACKS,
  ...BUGBOUNTY_TRACKS
];

/**
 * Role-focused learning paths. Foundations keeps the original four tracks;
 * the other three are dedicated career paths (GRC, SOC, Bug Bounty).
 */
export const VIDERE_PATHS: LearningPath[] = [
  {
    id: 'path-foundations',
    number: 1,
    title: 'Security Foundations',
    shortName: 'Foundations',
    tagline: 'How the web works, where trust breaks, and how attackers think — the core intuition every path builds on.',
    colorAccent: 'cyan',
    iconName: 'Compass',
    trackIds: ['track-1', 'track-2', 'track-3', 'track-4']
  },
  {
    id: 'path-grc',
    number: 2,
    title: 'GRC Professional',
    shortName: 'GRC',
    tagline: 'Governance, risk, and compliance — translate security into frameworks, registers, audits, and business decisions.',
    colorAccent: 'amber',
    iconName: 'Scale',
    trackIds: ['track-5']
  },
  {
    id: 'path-soc',
    number: 3,
    title: 'SOC Analyst',
    shortName: 'SOC',
    tagline: 'Security operations — telemetry, triage, detection engineering, and incident response under time pressure.',
    colorAccent: 'emerald',
    iconName: 'Radar',
    trackIds: ['track-6']
  },
  {
    id: 'path-bugbounty',
    number: 4,
    title: 'Bug Bounty Mastery',
    shortName: 'Bug Bounty',
    tagline: 'The professional hunter — scoping, advanced exploitation, chaining, and the human side of disclosure.',
    colorAccent: 'purple',
    iconName: 'Bug',
    trackIds: ['track-7']
  }
];

export const getTrackById = (trackId: string): Track | undefined =>
  ALL_TRACKS.find(t => t.id === trackId);

export const getPathForTrack = (trackId: string): LearningPath | undefined =>
  VIDERE_PATHS.find(p => p.trackIds.includes(trackId));

export const getPathTracks = (path: LearningPath): Track[] =>
  path.trackIds
    .map(id => ALL_TRACKS.find(t => t.id === id))
    .filter((t): t is Track => Boolean(t));

export const getPathLessons = (path: LearningPath): Lesson[] =>
  getPathTracks(path).flatMap(t => t.lessons);

/** Lessons belonging to a path that appear in the given completed list. */
export const getPathCompletedCount = (path: LearningPath, completedLessonIds: string[]): number =>
  getPathLessons(path).filter(l => completedLessonIds.includes(l.id)).length;
