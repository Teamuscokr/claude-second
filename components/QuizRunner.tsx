"use client";

import { useEffect, useState } from "react";
import ConfirmStep from "@/components/ConfirmStep";
import QuestionStep from "@/components/QuestionStep";
import ResultStep from "@/components/ResultStep";
import { gradeQuiz } from "@/lib/quiz/score";
import type { Answers, Quiz, QuizResult } from "@/lib/quiz/types";

// 문항 확인 → 풀이 → 결과. 모든 처리는 브라우저 안에서만 하고,
// 새로고침하면 문항 확인 화면으로 돌아간다.
type Stage =
  | { step: "confirm" }
  | { step: "solve"; answers: Answers; index: number }
  | { step: "result"; result: QuizResult };

function startSolving(quiz: Quiz): Stage {
  return { step: "solve", answers: quiz.questions.map(() => null), index: 0 };
}

export default function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [stage, setStage] = useState<Stage>({ step: "confirm" });

  // 화면이 바뀌면 맨 위부터 보이게 한다.
  const scrollKey = stage.step === "solve" ? `solve-${stage.index}` : stage.step;
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [scrollKey]);

  if (stage.step === "confirm") {
    return (
      <ConfirmStep
        title={quiz.title}
        questionCount={quiz.questions.length}
        onStart={() => setStage(startSolving(quiz))}
      />
    );
  }

  if (stage.step === "solve") {
    return (
      <QuestionStep
        key={stage.index}
        question={quiz.questions[stage.index]}
        index={stage.index}
        total={quiz.questions.length}
        chosen={stage.answers[stage.index]}
        onChoose={(option) => {
          const answers = [...stage.answers];
          answers[stage.index] = option;
          setStage({ ...stage, answers });
        }}
        onPrev={() => setStage({ ...stage, index: stage.index - 1 })}
        onNext={() => setStage({ ...stage, index: stage.index + 1 })}
        onSubmit={() =>
          setStage({ step: "result", result: gradeQuiz(quiz, stage.answers) })
        }
      />
    );
  }

  return (
    <ResultStep
      result={stage.result}
      onRetry={() => setStage(startSolving(quiz))}
    />
  );
}
