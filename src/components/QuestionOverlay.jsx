import React, { useState } from 'react';
import './QuestionOverlay.css';

function QuestionOverlay({ question, onClose, onMarkCompleted, isCompleted }) {
  const [answerVisible, setAnswerVisible] = useState(false);
  const hasAnswer = question.answer != null && question.answer !== '';

  function handleMarkCompleted() {
    onMarkCompleted(question.id);
    onClose();
  }

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-points">{question.points} Punkte</div>

        <div className="overlay-question">{question.question}</div>

        {hasAnswer ? (
          !answerVisible ? (
            <button
              className="overlay-btn btn-reveal"
              onClick={() => setAnswerVisible(true)}
            >
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
            <button
              className="overlay-btn btn-done"
              onClick={handleMarkCompleted}
            >
              ✔ Frage beantwortet
            </button>
          )}
          <button className="overlay-btn btn-close" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionOverlay;

