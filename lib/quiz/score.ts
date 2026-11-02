import type { Answers, Quiz, QuizResult } from "./types";

// 정답 수 ÷ 전체 문항 수 × 100을 소수 첫째 자리까지 반올림한다.
// 소수 오차를 피하려고 정수끼리 먼저 계산한다.
export function calculateScore(correctCount: number, total: number): number {
  return Math.round((correctCount * 1000) / total) / 10;
}

// 모든 문항에 답한 뒤에만 호출한다.
export function gradeQuiz(quiz: Quiz, answers: Answers): QuizResult {
  const items = quiz.questions.map((question, i) => {
    const chosen = answers[i];
    if (chosen == null) {
      throw new Error(`${i + 1}번 문항에 답하지 않았습니다.`);
    }
    return { question, chosen, isCorrect: chosen === question.correctAnswer };
  });
  const correctCount = items.filter((item) => item.isCorrect).length;
  return {
    total: items.length,
    correctCount,
    score: calculateScore(correctCount, items.length),
    items,
  };
}
