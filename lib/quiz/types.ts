// 문제 파일 한 문항. correctAnswer는 1~4이며 options의 순서(1부터)를 가리킨다.
export type Question = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
};

export type Quiz = {
  title: string;
  questions: Question[];
};

// 문항 순서대로 이용자가 고른 보기 번호(1~4). 아직 고르지 않았으면 null.
export type Answers = (number | null)[];

export type QuestionResult = {
  question: Question;
  chosen: number;
  isCorrect: boolean;
};

export type QuizResult = {
  total: number;
  correctCount: number;
  score: number;
  items: QuestionResult[];
};
