import { useState, useCallback } from 'react';

const STORAGE_KEY = 'jeopardy_completed_questions';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveToStorage(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function useCompletedQuestions() {
  const [completedQuestions, setCompletedQuestions] = useState(() => loadFromStorage());

  const markCompleted = useCallback((questionId) => {
    setCompletedQuestions((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      saveToStorage(next);
      return next;
    });
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCompletedQuestions(new Set());
  }, []);

  return { completedQuestions, markCompleted, resetGame };
}

