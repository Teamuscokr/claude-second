import Link from "next/link";
import type { QuizResult } from "@/lib/quiz/types";

type Props = {
  result: QuizResult;
  onRetry: () => void;
};

function optionLabel(options: readonly string[], number: number) {
  return `${number}번. ${options[number - 1]}`;
}

export default function ResultStep({ result, onRetry }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 rounded-2xl bg-accent-soft p-6 text-center">
        <p className="text-sm font-semibold text-muted">내 점수</p>
        <p className="text-5xl font-bold text-accent">{result.score}점</p>
        <p className="mt-1 text-muted">
          {result.total}문제 중 {result.correctCount}문제를 맞혔어요
        </p>
      </div>

      <ol className="flex flex-col gap-4">
        {result.items.map(({ question, chosen, isCorrect }, i) => (
          <li
            key={i}
            className={`rounded-xl border-2 p-4 ${isCorrect ? "border-good" : "border-bad"}`}
          >
            <p
              className={`text-sm font-bold ${isCorrect ? "text-good" : "text-bad"}`}
            >
              {i + 1}번 · {isCorrect ? "⭕ 맞았어요" : "❌ 틀렸어요"}
            </p>
            <p className="mt-2 whitespace-pre-wrap font-semibold leading-relaxed">
              {question.question}
            </p>
            <dl className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
              <div>
                <dt className="inline font-semibold">내가 고른 답: </dt>
                <dd className={`inline ${isCorrect ? "" : "text-bad"}`}>
                  {optionLabel(question.options, chosen)}
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold">정답: </dt>
                <dd className="inline text-good">
                  {optionLabel(question.options, question.correctAnswer)}
                </dd>
              </div>
              <div className="rounded-lg bg-code p-3">
                <dt className="font-semibold">해설</dt>
                <dd className="mt-1 whitespace-pre-wrap">
                  {question.explanation}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-primary" onClick={onRetry}>
          다시 풀기
        </button>
        <Link href="/" className="btn-secondary">
          다른 문제지 고르기
        </Link>
      </div>
    </section>
  );
}
