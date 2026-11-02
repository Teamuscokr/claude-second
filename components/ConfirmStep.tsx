import Link from "next/link";

type Props = {
  title: string;
  questionCount: number;
  onStart: () => void;
};

export default function ConfirmStep({ title, questionCount, onStart }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="font-semibold">문제 {questionCount}개</p>
        <p className="text-muted">
          한 문제씩 풀고, 마지막 문제까지 답한 뒤 “제출”을 누르면 점수와 해설을
          볼 수 있어요.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-primary" onClick={onStart}>
          풀이 시작
        </button>
        <Link href="/" className="btn-secondary">
          다른 문제지 고르기
        </Link>
      </div>
    </section>
  );
}
