"use client";

import { useEffect, useState } from "react";
import UploadStep from "@/components/UploadStep";
import ConfirmStep from "@/components/ConfirmStep";
import QuestionStep from "@/components/QuestionStep";
import ResultStep from "@/components/ResultStep";
import { gradeQuiz } from "@/lib/quiz/score";
import type { Answers, Quiz, QuizResult } from "@/lib/quiz/types";

// 업로드 → 문항 확인 → 풀이 → 결과. 모든 처리는 브라우저 안에서만 하고,
// 새로고침하면 처음 화면으로 돌아간다.
type Stage =
  | { step: "upload" }
  | { step: "confirm"; quiz: Quiz; fileName: string }
  | { step: "solve"; quiz: Quiz; answers: Answers; index: number }
  | { step: "result"; quiz: Quiz; result: QuizResult };

function startSolving(quiz: Quiz): Stage {
  return {
    step: "solve",
    quiz,
    answers: quiz.questions.map(() => null),
    index: 0,
  };
}

export default function Home() {
  const [stage, setStage] = useState<Stage>({ step: "upload" });

  // 화면이 바뀌면 맨 위부터 보이게 한다.
  const scrollKey = stage.step === "solve" ? `solve-${stage.index}` : stage.step;
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [scrollKey]);

  const reset = () => setStage({ step: "upload" });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
      {stage.step === "upload" && (
        <UploadStep
          onLoaded={(quiz, fileName) =>
            setStage({ step: "confirm", quiz, fileName })
          }
        />
      )}

      {stage.step === "confirm" && (
        <ConfirmStep
          fileName={stage.fileName}
          questionCount={stage.quiz.questions.length}
          onStart={() => setStage(startSolving(stage.quiz))}
          onReset={reset}
        />
      )}

      {stage.step === "solve" && (
        <QuestionStep
          key={stage.index}
          question={stage.quiz.questions[stage.index]}
          index={stage.index}
          total={stage.quiz.questions.length}
          chosen={stage.answers[stage.index]}
          onChoose={(option) => {
            const answers = [...stage.answers];
            answers[stage.index] = option;
            setStage({ ...stage, answers });
          }}
          onPrev={() => setStage({ ...stage, index: stage.index - 1 })}
          onNext={() => setStage({ ...stage, index: stage.index + 1 })}
          onSubmit={() =>
            setStage({
              step: "result",
              quiz: stage.quiz,
              result: gradeQuiz(stage.quiz, stage.answers),
            })
          }
        />
      )}

      {stage.step === "result" && (
        <ResultStep
          result={stage.result}
          onRetry={() => setStage(startSolving(stage.quiz))}
          onReset={reset}
        />
      )}
    </main>
  );
}
