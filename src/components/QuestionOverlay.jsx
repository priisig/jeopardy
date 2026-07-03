import React, { useState } from 'react';
import './QuestionOverlay.css';
import YouTubeAudioPlayer from './YouTubeAudioPlayer';

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// step: 'question' | 'teamPicker'
function QuestionOverlay({ question, teams, onClose, onMarkCompleted, isCompleted }) {
  const [answerVisible,  setAnswerVisible]  = useState(false);
  const [videoRevealed,  setVideoRevealed]  = useState(false);
  const [step, setStep] = useState('question');

  const hasAnswer  = question.answer != null && question.answer !== '';
  const videoId    = extractYouTubeId(question.youtubeUrl);
  const hasYouTube = videoId != null;
  const hasTeams   = teams && teams.length > 0;

  function handleDoneClick() {
    if (hasTeams) {
      setStep('teamPicker');
    } else {
      onMarkCompleted(question.id, null);
    }
  }

  function handleTeamPick(teamId) {
    onMarkCompleted(question.id, teamId);
  }

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>

        {step === 'teamPicker' ? (
          /* ── Team picker ── */
          <>
            <div className="overlay-points">{question.points} Punkte</div>
            <div className="team-picker-title">Welches Team bekommt die Punkte?</div>
            <div className="team-picker-grid">
              {teams.map((team) => (
                <button
                  key={team.id}
                  className="team-picker-btn"
                  onClick={() => handleTeamPick(team.id)}
                >
                  {team.name}
                </button>
              ))}
            </div>
            <button className="overlay-btn btn-no-points" onClick={() => handleTeamPick(null)}>
              Kein Punkt vergeben
            </button>
            <button className="overlay-btn btn-close" onClick={() => setStep('question')}>
              ← Zurück
            </button>
          </>
        ) : (
          /* ── Question view ── */
          <>
            <div className="overlay-points">{question.points} Punkte</div>

            <div className="overlay-question">{question.question}</div>

            {hasYouTube && (
              <div className="youtube-player-section">
                <YouTubeAudioPlayer
                  videoId={videoId}
                  startTime={question.startTime}
                  endTime={question.endTime}
                  videoRevealed={videoRevealed}
                />
                {(question.startTime != null || question.endTime != null) && !videoRevealed && (
                  <div className="youtube-timecode">
                    {question.startTime != null && <span>⏱ Start: {question.startTime}s</span>}
                    {question.endTime   != null && <span> – Ende: {question.endTime}s</span>}
                  </div>
                )}
                {!videoRevealed && (
                  <button
                    className="overlay-btn btn-reveal-video"
                    onClick={() => setVideoRevealed(true)}
                  >
                    🎬 Video enthüllen
                  </button>
                )}
              </div>
            )}

            {hasAnswer ? (
              !answerVisible ? (
                <button className="overlay-btn btn-reveal" onClick={() => setAnswerVisible(true)}>
                  Antwort anzeigen
                </button>
              ) : (
                <div className="overlay-answer">
                  <div className="overlay-answer-label">Antwort:</div>
                  <div className="overlay-answer-text">{question.answer}</div>
                </div>
              )
            ) : (
              <div className="overlay-moderator-hint">
                🧙 Frag den Moderator nach den Details!
                {question.moderator && (
                  <span className="overlay-moderator-name"> ({question.moderator})</span>
                )}
              </div>
            )}

            <div className="overlay-actions">
              {!isCompleted && (
                <button className="overlay-btn btn-done" onClick={handleDoneClick}>
                  ✔ Frage beantwortet
                </button>
              )}
              <button className="overlay-btn btn-close" onClick={onClose}>
                Schließen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default QuestionOverlay;
