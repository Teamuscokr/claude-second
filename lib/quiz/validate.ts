import type { Question, Quiz } from "./types";

export const MAX_QUESTIONS = 100;
const OPTION_COUNT = 4;
// 오류가 너무 많으면 화면이 길어지므로 앞쪽 몇 개만 보여준다.
const MAX_ERRORS = 10;

export type ParseResult =
  | { ok: true; quiz: Quiz }
  | { ok: false; errors: string[] };

function isFilledText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function checkQuestion(raw: unknown, no: number): string[] {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return [`${no}번 문제의 형식이 올바르지 않아요.`];
  }
  const item = raw as Record<string, unknown>;
  const errors: string[] = [];

  if (!isFilledText(item.question)) {
    errors.push(`${no}번 문제에 문제 내용(question)이 없어요.`);
  }

  const { options } = item;
  if (!Array.isArray(options)) {
    errors.push(`${no}번 문제에 보기 목록(options)이 없어요.`);
  } else if (options.length !== OPTION_COUNT) {
    errors.push(
      `${no}번 문제의 보기가 ${options.length}개예요. 보기는 4개여야 해요.`,
    );
  } else {
    options.forEach((option, i) => {
      if (!isFilledText(option)) {
        errors.push(`${no}번 문제의 ${i + 1}번 보기가 비어 있어요.`);
      }
    });
  }

  const answer = item.correctAnswer;
  if (answer === undefined) {
    errors.push(`${no}번 문제에 정답 번호(correctAnswer)가 없어요.`);
  } else if (
    typeof answer !== "number" ||
    !Number.isInteger(answer) ||
    answer < 1 ||
    answer > OPTION_COUNT
  ) {
    errors.push(
      `${no}번 문제의 정답 번호(correctAnswer)는 따옴표 없이 1, 2, 3, 4 중 하나로 적어야 해요.`,
    );
  }

  if (!isFilledText(item.explanation)) {
    errors.push(`${no}번 문제에 해설(explanation)이 없어요.`);
  }

  return errors;
}

// 문제지 파일의 글자 내용을 검사해 제목과 문제 목록으로 바꾼다.
// 하나라도 잘못되면 파일 전체를 받지 않고 오류 목록을 돌려준다. 정의되지 않은 항목은 무시한다.
export function parseQuizFile(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text.replace(/^﻿/, ""));
  } catch {
    return {
      ok: false,
      errors: [
        "파일 내용을 읽을 수 없어요. 쉼표, 따옴표, 괄호가 빠지지 않았는지 확인해 주세요.",
      ],
    };
  }

  const root =
    typeof data === "object" && data !== null && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};
  const { title, questions } = root;

  if (!isFilledText(title)) {
    return { ok: false, errors: ["파일에 문제지 제목(title)이 없어요."] };
  }
  if (!Array.isArray(questions)) {
    return {
      ok: false,
      errors: ["파일에 문제 목록(questions)이 없어요."],
    };
  }
  if (questions.length === 0) {
    return { ok: false, errors: ["문제 목록(questions)이 비어 있어요."] };
  }
  if (questions.length > MAX_QUESTIONS) {
    return {
      ok: false,
      errors: [
        `문제가 ${questions.length}개예요. 한 파일에는 ${MAX_QUESTIONS}개까지 넣을 수 있어요.`,
      ],
    };
  }

  const errors = questions.flatMap((q, i) => checkQuestion(q, i + 1));
  if (errors.length > 0) {
    const shown = errors.slice(0, MAX_ERRORS);
    if (errors.length > MAX_ERRORS) {
      shown.push(`이 밖에도 고쳐야 할 곳이 ${errors.length - MAX_ERRORS}개 더 있어요.`);
    }
    return { ok: false, errors: shown };
  }

  const quiz: Quiz = {
    title,
    questions: questions.map((raw) => {
      const q = raw as Question;
      return {
        question: q.question,
        options: [...q.options] as Question["options"],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      };
    }),
  };
  return { ok: true, quiz };
}
