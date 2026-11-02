type Props = {
  fileName: string;
  questionCount: number;
  onStart: () => void;
  onReset: () => void;
};

export default function ConfirmStep({
  fileName,
  questionCount,
  onStart,
  onReset,
}: Props) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          문제 {questionCount}개를 불러왔어요
        </h1>
        <p className="break-all text-sm text-muted">파일: {fileName}</p>
        <p className="text-muted">
          한 문제씩 풀고, 마지막 문제까지 답한 뒤 “제출”을 누르면 점수와 해설을
          볼 수 있어요.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-primary" onClick={onStart}>
          풀이 시작
        </button>
        <button type="button" className="btn-secondary" onClick={onReset}>
          다른 파일 올리기
        </button>
      </div>
    </section>
  );
}
