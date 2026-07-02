import React, { useState } from 'react';
import './TeamSetup.css';

function TeamSetup({ teams, onAddTeam, onRemoveTeam, onClose }) {
  const [inputValue, setInputValue] = useState('');

  function handleAdd() {
    const name = inputValue.trim();
    if (!name) return;
    onAddTeam(name);
    setInputValue('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className="team-setup-backdrop" onClick={onClose}>
      <div className="team-setup-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="team-setup-title">⚔ Teams verwalten</h3>

        <div className="team-setup-input-row">
          <input
            className="team-setup-input"
            type="text"
            placeholder="Team-Name eingeben…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={30}
            autoFocus
          />
          <button
            className="team-setup-add-btn"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
          >
            Hinzufügen
          </button>
        </div>

        {teams.length === 0 ? (
          <p className="team-setup-empty">Noch keine Teams – füge mindestens eines hinzu.</p>
        ) : (
          <ul className="team-setup-list">
            {teams.map((team) => (
              <li key={team.id} className="team-setup-item">
                <span className="team-setup-item-name">{team.name}</span>
                <span className="team-setup-item-score">{team.score} Pkt.</span>
                <button
                  className="team-setup-remove-btn"
                  onClick={() => onRemoveTeam(team.id)}
                  aria-label={`${team.name} entfernen`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="team-setup-footer">
          <button className="team-setup-close-btn" onClick={onClose}>
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamSetup;

