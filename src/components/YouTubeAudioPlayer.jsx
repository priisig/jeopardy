import React, { useState, useEffect, useRef } from 'react';

// Module-level API loader — handles multiple simultaneous callers safely
const apiCallbacks = [];
let scriptInserted = false;

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    apiCallbacks.push(resolve);
    if (!scriptInserted) {
      scriptInserted = true;
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        apiCallbacks.splice(0).forEach((cb) => cb(window.YT));
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });
}

function YouTubeAudioPlayer({ videoId, startTime, endTime }) {
  const playerRef    = useRef(null);
  const containerRef = useRef(null);
  const [isReady,   setIsReady]   = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let player;
    let destroyed = false;

    loadYouTubeAPI().then((YT) => {
      if (destroyed || !containerRef.current) return;

      player = new YT.Player(containerRef.current, {
        width:   '1',
        height:  '1',
        videoId,
        playerVars: {
          autoplay:       0,
          controls:       0,
          disablekb:      1,
          fs:             0,
          rel:            0,
          start:          startTime ?? 0,
          ...(endTime != null ? { end: endTime } : {}),
        },
        events: {
          onReady() {
            if (!destroyed) {
              playerRef.current = player;
              setIsReady(true);
            }
          },
          onStateChange(event) {
            if (destroyed) return;
            const S = YT.PlayerState;
            if (event.data === S.PLAYING) setIsPlaying(true);
            if (event.data === S.PAUSED || event.data === S.ENDED || event.data === S.STOPPED) {
              setIsPlaying(false);
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      try { player?.destroy(); } catch (_) {}
      playerRef.current = null;
    };
  }, [videoId, startTime, endTime]);

  function handlePlay() {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(startTime ?? 0, true);
    p.playVideo();
  }

  function handleStop() {
    playerRef.current?.stopVideo();
  }

  return (
    <div className="youtube-audio-player">
      {/* 1×1 invisible player — purely for audio */}
      <div
        ref={containerRef}
        style={{ width: 1, height: 1, position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />

      {!isReady ? (
        <div className="youtube-loading">⏳ Lade Audio…</div>
      ) : !isPlaying ? (
        <button className="overlay-btn btn-play-audio" onClick={handlePlay}>
          🔊 Geräusch abspielen
        </button>
      ) : (
        <div className="youtube-playing-ui">
          <div className="youtube-playing-indicator">
            <span className="sound-bar" /><span className="sound-bar" /><span className="sound-bar" />
          </div>
          <button className="overlay-btn btn-stop-audio" onClick={handleStop}>
            ⏹ Stoppen
          </button>
        </div>
      )}
    </div>
  );
}

export default YouTubeAudioPlayer;

