import { Suspense } from "react";
import { notFound } from "next/navigation";
import QuizRunner from "@/components/QuizRunner";
import { findPaper, loadPapers } from "@/lib/quiz/papers";

// 문제지마다 미리 페이지를 만든다. Cache Components에서는 빈 목록이 빌드 오류이므로
// 문제지가 없을 때는 자리표시 값을 넘기고 아래에서 notFound로 처리한다.
export function generateStaticParams() {
  const papers = loadPapers();
  return papers.length > 0
    ? papers.map((paper) => ({ id: paper.id }))
    : [{ id: "__none__" }];
}

// 주소(params)를 읽는 부분은 Suspense 안에 두어야 화면 전환이 바로 시작된다.
export default function PaperPage({ params }: PageProps<"/papers/[id]">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
      <Suspense
        fallback={<p className="text-muted">문제지를 불러오고 있어요…</p>}
      >
        <Paper params={params} />
      </Suspense>
    </main>
  );
}

async function Paper({ params }: Pick<PageProps<"/papers/[id]">, "params">) {
  const { id } = await params;
  const paper = findPaper(decodeURIComponent(id));
  if (!paper) notFound();

  return <QuizRunner quiz={paper.quiz} />;
}
