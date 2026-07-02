import React from 'react';
import './Board.css';

function Board({ categories, completedQuestions, onSelectQuestion }) {
  // Derive all unique point values in ascending order from first category
  const pointTiers = categories[0]?.questions
    .map((q) => q.points)
    .sort((a, b) => a - b) ?? [];

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${categories.length}, 1fr)`,
        gridTemplateRows: `auto repeat(${pointTiers.length}, 1fr)`,
      }}
    >
      {/* Category headers */}
      {categories.map((category) => (
        <div key={category.id} className="board-header">
          {category.name}
        </div>
      ))}

      {/* Question tiles row by row (point tier → category) */}
      {pointTiers.map((points) =>
        categories.map((category) => {
          const question = category.questions.find((q) => q.points === points);
          if (!question) return <div key={`${category.id}-${points}`} className="board-tile empty" />;

          const isCompleted = completedQuestions.has(question.id);

          return (
            <button
              key={question.id}
              className={`board-tile ${isCompleted ? 'completed' : 'active'}`}
              onClick={() => !isCompleted && onSelectQuestion(question)}
              disabled={isCompleted}
              aria-label={`${category.name} für ${points} Punkte${isCompleted ? ' – bereits beantwortet' : ''}`}
            >
              {isCompleted ? (
                <span className="tile-completed-icon">✔</span>
              ) : (
                <span className="tile-points">{points}</span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}

export default Board;

