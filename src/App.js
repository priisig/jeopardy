import React, { useState } from 'react';
import questionsData from './questions.json';
import Board from './components/Board';
import QuestionOverlay from './components/QuestionOverlay';
import { useCompletedQuestions } from './hooks/useCompletedQuestions';
import './App.css';

function App() {
  const { categories } = questionsData;
  const { completedQuestions, markCompleted, resetGame } = useCompletedQuestions();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleSelectQuestion(question) {
    setSelectedQuestion(question);
  }

  function handleCloseOverlay() {
    setSelectedQuestion(null);
  }

  function handleResetRequest() {
    setShowResetConfirm(true);
  }

  function handleConfirmReset() {
    resetGame();
    setShowResetConfirm(false);
  }

  function handleCancelReset() {
    setShowResetConfirm(false);
  }

  const totalQuestions = categories.reduce((sum, c) => sum + c.questions.length, 0);
  const completedCount = completedQuestions.size;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title-block">
          <h1 className="app-title">Herr der Ringe</h1>
          <h2 className="app-subtitle">Jeopardy</h2>
        </div>
        <div className="app-meta">
          <span className="app-score">
            {completedCount} / {totalQuestions} Fragen beantwortet
          </span>
          <button className="reset-btn" onClick={handleResetRequest}>
            Spiel zurücksetzen
          </button>
        </div>
      </header>

      <main className="app-main">
        <Board
          categories={categories}
          completedQuestions={completedQuestions}
          onSelectQuestion={handleSelectQuestion}
        />
      </main>

      {selectedQuestion && (
        <QuestionOverlay
          question={selectedQuestion}
          isCompleted={completedQuestions.has(selectedQuestion.id)}
          onClose={handleCloseOverlay}
          onMarkCompleted={markCompleted}
        />
      )}

      {showResetConfirm && (
        <div className="confirm-backdrop" onClick={handleCancelReset}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Spiel zurücksetzen?</h3>
            <p className="confirm-text">
              Alle beantworteten Fragen werden zurückgesetzt. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="confirm-actions">
              <button className="confirm-btn btn-confirm-yes" onClick={handleConfirmReset}>
                Ja, zurücksetzen
              </button>
              <button className="confirm-btn btn-confirm-no" onClick={handleCancelReset}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
