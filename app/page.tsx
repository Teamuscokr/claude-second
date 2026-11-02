import Link from "next/link";
import { loadPapers } from "@/lib/quiz/papers";

export default function Home() {
  const papers = loadPapers();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">문제지를 골라 주세요</h1>
          <p className="text-muted">풀고 싶은 문제지를 누르면 시작할 수 있어요.</p>
        </div>

        {papers.length === 0 ? (
          <p className="rounded-xl border border-line p-4 text-muted">
            아직 준비된 문제지가 없어요.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {papers.map((paper) => (
              <li key={paper.id}>
                <Link
                  href={`/papers/${encodeURIComponent(paper.id)}`}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-xl border-2 border-line p-4 font-semibold transition-colors hover:border-accent"
                >
                  <span>{paper.quiz.title}</span>
                  <span aria-hidden className="text-muted">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
