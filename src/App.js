import React, { useState } from 'react';
import questionsData from './questions.json';
import Board from './components/Board';
import QuestionOverlay from './components/QuestionOverlay';
import Leaderboard from './components/Leaderboard';
import TeamSetup from './components/TeamSetup';
import { useCompletedQuestions } from './hooks/useCompletedQuestions';
import { useTeams } from './hooks/useTeams';
import './App.css';

function App() {
  const { categories } = questionsData;
  const { completedQuestions, markCompleted, resetGame } = useCompletedQuestions();
  const { teams, addTeam, removeTeam, addPoints, resetScores } = useTeams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTeamSetup, setShowTeamSetup] = useState(false);

  function handleSelectQuestion(question) {
    setSelectedQuestion(question);
  }

  function handleCloseOverlay() {
    setSelectedQuestion(null);
  }

  // Called from QuestionOverlay after team is chosen (teamId may be null = no points)
  function handleMarkCompleted(questionId, teamId) {
    markCompleted(questionId);
    if (teamId != null) {
      addPoints(teamId, selectedQuestion.points);
    }
    setSelectedQuestion(null);
  }

  function handleResetRequest() {
    setShowResetConfirm(true);
  }

  function handleConfirmReset() {
    resetGame();
    resetScores();
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
          <button className="teams-btn" onClick={() => setShowTeamSetup(true)}>
            ⚔ Teams
          </button>
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
        <Leaderboard teams={teams} />
      </main>

      {selectedQuestion && (
        <QuestionOverlay
          question={selectedQuestion}
          teams={teams}
          isCompleted={completedQuestions.has(selectedQuestion.id)}
          onClose={handleCloseOverlay}
          onMarkCompleted={handleMarkCompleted}
        />
      )}

      {showTeamSetup && (
        <TeamSetup
          teams={teams}
          onAddTeam={addTeam}
          onRemoveTeam={removeTeam}
          onClose={() => setShowTeamSetup(false)}
        />
      )}

      {showResetConfirm && (
        <div className="confirm-backdrop" onClick={handleCancelReset}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Spiel zurücksetzen?</h3>
            <p className="confirm-text">
              Alle beantworteten Fragen und Punktestände werden zurückgesetzt. Diese Aktion kann nicht rückgängig gemacht werden.
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
