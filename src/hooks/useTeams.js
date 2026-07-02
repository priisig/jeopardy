import { useState, useCallback } from 'react';

const STORAGE_KEY = 'jeopardy_teams';

function loadTeams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(teams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

export function useTeams() {
  const [teams, setTeams] = useState(loadTeams);

  const addTeam = useCallback((name) => {
    setTeams((prev) => {
      const next = [...prev, { id: Date.now().toString(), name: name.trim(), score: 0 }];
      persist(next);
      return next;
    });
  }, []);

  const removeTeam = useCallback((id) => {
    setTeams((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const addPoints = useCallback((teamId, points) => {
    setTeams((prev) => {
      const next = prev.map((t) => t.id === teamId ? { ...t, score: t.score + points } : t);
      persist(next);
      return next;
    });
  }, []);

  // Reset scores to 0 but keep team names
  const resetScores = useCallback(() => {
    setTeams((prev) => {
      const next = prev.map((t) => ({ ...t, score: 0 }));
      persist(next);
      return next;
    });
  }, []);

  return { teams, addTeam, removeTeam, addPoints, resetScores };
}

