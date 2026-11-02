import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseQuizFile } from "./validate";
import type { Quiz } from "./types";

// 서버(빌드)에서만 쓴다. question-papers 폴더의 .json 파일 하나가 문제지 하나다.
// 경로를 path.join(process.cwd(), "question-papers", ...) 꼴로 고정해 두어야
// 빌드 도구가 이 폴더만 배포 묶음에 넣는다(변수로 감추면 프로젝트 전체가 들어간다).

export type Paper = {
  // 파일 이름에서 .json을 뺀 값. 주소(/papers/<id>)에 쓴다.
  id: string;
  quiz: Quiz;
};

// 파일 이름 순으로 읽는다. 잘못된 파일이 하나라도 있으면 오류를 내서 빌드를 멈춘다.
export function loadPapers(): Paper[] {
  const files = readdirSync(path.join(process.cwd(), "question-papers"))
    .filter((file) => file.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "ko", { numeric: true }));

  return files.map((file) => {
    const result = parseQuizFile(
      readFileSync(path.join(process.cwd(), "question-papers", file), "utf8"),
    );
    if (!result.ok) {
      throw new Error(
        `question-papers/${file} 파일에 고쳐야 할 곳이 있어요.\n- ${result.errors.join("\n- ")}`,
      );
    }
    return { id: file.slice(0, -".json".length), quiz: result.quiz };
  });
}

export function findPaper(id: string): Paper | undefined {
  return loadPapers().find((paper) => paper.id === id);
}
