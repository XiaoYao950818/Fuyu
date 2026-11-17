import { useEffect, useState } from "react";
import { Music2, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useTranslation } from "../../i18n";
import type { MediaState } from "../../features/media/api";
import { playbackPosition } from "../../features/media/lyrics/lrc";
import type { LyricLine } from "../../features/media/lyrics/lrc";
import { MusicProgress } from "../../features/media/MusicProgress";
import { lyricWindow } from "../../features/music-island/musicIsland";
import "./MusicIslandPanel.css";

const TICK_MS = 500;

export function MusicIslandPanel({
  mediaState,
  lines,
  offsetMs,
  notFound,
  isTrackChanging,
  commandError,
  phase,
  onExitAnimationEnd,
  onClose,
  onPlayPause,
  onNext,
  onPrevious,
}: {
  mediaState: MediaState;
  lines: LyricLine[] | null;
  offsetMs: number;
  notFound: boolean;
  isTrackChanging: boolean;
  commandError: string | null;
  phase: "open" | "leaving";
  onExitAnimationEnd: () => void;
  onClose: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const t = useTranslation();
  const isPlaying = mediaState.playbackStatus === "playing";
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (!isPlaying) return;
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying, mediaState.updatedAt]);

  const source = mediaState.sessions.find((session) => session.id === mediaState.activeSessionId)?.label ?? null;
  const meta = [mediaState.artist ?? t.music.unknownArtist, source].filter(Boolean).join(" · ");
  const position = playbackPosition(mediaState, now) - offsetMs;
  const lyric = lyricWindow(lines ?? [], position);
  const prevDisabled = mediaState.available && !mediaState.canPrevious;
  const nextDisabled = mediaState.available && !mediaState.canNext;

  return (
    <section
      className={phase === "leaving" ? "music-island music-island--leaving" : "music-island"}
      aria-label={t.musicIsland.title}
      onAnimationEnd={(event) => {
        if (phase === "leaving" && event.animationName === "musicIslandPopOut") onExitAnimationEnd();
      }}
    >
      <div className="music-island__cover" data-tauri-drag-region aria-hidden="true">
        {mediaState.thumbnail ? <img src={mediaState.thumbnail} alt="" draggable={false} /> : <Music2 size={22} strokeWidth={1.7} />}
      </div>
      <div className="music-island__body" data-tauri-drag-region>
        <div className="music-island__meta">
          <span className="music-island__track">{mediaState.title ?? t.music.noMedia}</span>
          {meta && <span className="music-island__artist">{meta}</span>}
        </div>
        <div className="music-island__lyrics" aria-label={t.music.lyricsLabel}>
          {lines === null && !notFound ? (
            <span className="music-island__lyric music-island__lyric--dim">{t.musicIsland.loadingLyrics}</span>
          ) : lyric.current ? (
            <>
              <span className="music-island__lyric music-island__lyric--current">{lyric.current.text}</span>
              {lyric.next && <span className="music-island__lyric music-island__lyric--dim">{lyric.next.text}</span>}
            </>
          ) : (
            <span className="music-island__lyric music-island__lyric--dim">{t.musicIsland.noLyrics}</span>
          )}
        </div>
        {mediaState.durationMs > 0 && <MusicProgress mediaState={mediaState} />}
        {commandError && (
          <p className="music-island__error" role="alert">
            {t.music.controlFailed}
          </p>
        )}
      </div>
      <div className="music-island__controls">
        <button className="music-island__button" type="button" aria-label={t.music.previousTrack} disabled={prevDisabled} onClick={onPrevious}>
          <SkipBack size={16} strokeWidth={2.2} />
        </button>
        <button
          className="music-island__button music-island__button--primary"
          type="button"
          aria-label={isPlaying ? t.music.pause : t.music.play}
          aria-busy={isTrackChanging}
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause size={16} strokeWidth={2.5} /> : <Play size={16} strokeWidth={2.5} />}
        </button>
        <button className="music-island__button" type="button" aria-label={t.music.nextTrack} disabled={nextDisabled} onClick={onNext}>
          <SkipForward size={16} strokeWidth={2.2} />
        </button>
        <button className="music-island__button music-island__button--close" type="button" aria-label={t.musicIsland.close} onClick={onClose}>
          <X size={14} strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}
