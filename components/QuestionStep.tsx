import type { Question } from "@/lib/quiz/types";

type Props = {
  question: Question;
  index: number;
  total: number;
  chosen: number | null;
  onChoose: (option: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

// 풀이 중에는 정답 여부·점수·해설을 보여주지 않는다.
export default function QuestionStep({
  question,
  index,
  total,
  chosen,
  onChoose,
  onPrev,
  onNext,
  onSubmit,
}: Props) {
  const isLast = index === total - 1;
  const groupName = `question-${index}`;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted">
          {index + 1} / {total}
        </p>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-line"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 whitespace-pre-wrap text-lg font-semibold leading-relaxed">
          {index + 1}. {question.question}
        </legend>
        {question.options.map((option, i) => {
          const number = i + 1;
          const selected = chosen === number;
          return (
            <label
              key={number}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-line hover:border-muted"
              }`}
            >
              <input
                type="radio"
                name={groupName}
                className="mt-1 size-5 shrink-0 accent-(--accent)"
                checked={selected}
                onChange={() => onChoose(number)}
              />
              <span className="whitespace-pre-wrap leading-relaxed">
                <span className="font-semibold">{number}.</span> {option}
              </span>
            </label>
          );
        })}
      </fieldset>

      {chosen === null && (
        <p className="text-sm text-muted">
          보기를 하나 고르면 {isLast ? "제출할" : "다음 문제로 넘어갈"} 수 있어요.
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          className="btn-secondary flex-1 sm:flex-none"
          onClick={onPrev}
          disabled={index === 0}
        >
          이전
        </button>
        <button
          type="button"
          className="btn-primary flex-1 sm:flex-none"
          onClick={isLast ? onSubmit : onNext}
          disabled={chosen === null}
        >
          {isLast ? "제출" : "다음"}
        </button>
      </div>
    </section>
  );
}
