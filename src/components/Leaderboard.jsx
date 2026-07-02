import React from 'react';
import './Leaderboard.css';

const MEDALS = ['🥇', '🥈', '🥉'];

function Leaderboard({ teams }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  return (
    <aside className="leaderboard">
      <div className="leaderboard-title">Rangliste</div>

      {sorted.length === 0 ? (
        <div className="leaderboard-empty">Noch keine Teams</div>
      ) : (
        <ol className="leaderboard-list">
          {sorted.map((team, index) => (
            <li key={team.id} className={`leaderboard-entry rank-${index + 1}`}>
              <span className="leaderboard-medal">
                {MEDALS[index] ?? `${index + 1}.`}
              </span>
              <span className="leaderboard-name">{team.name}</span>
              <span className="leaderboard-score">{team.score}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

export default Leaderboard;

