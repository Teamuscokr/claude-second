"use client";

import { useState, type ChangeEvent } from "react";
import { MAX_FILE_BYTES, parseQuizFile } from "@/lib/quiz/validate";
import type { Quiz } from "@/lib/quiz/types";

const FORMAT_EXAMPLE = `{
  "questions": [
    {
      "question": "문제 내용",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "correctAnswer": 1,
      "explanation": "해설"
    }
  ]
}`;

type Props = {
  onLoaded: (quiz: Quiz, fileName: string) => void;
};

export default function UploadStep({ onLoaded }: Props) {
  const [errors, setErrors] = useState<string[]>([]);
  const [reading, setReading] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    // 같은 파일을 고쳐서 다시 고를 수 있도록 선택을 비운다.
    input.value = "";
    if (!file) return;

    setErrors([]);
    if (file.size > MAX_FILE_BYTES) {
      setErrors(["파일이 너무 커요. 1MB 이하의 파일을 올려 주세요."]);
      return;
    }

    setReading(true);
    try {
      const result = parseQuizFile(await file.text());
      if (result.ok) {
        onLoaded(result.quiz, file.name);
      } else {
        setErrors(result.errors);
      }
    } catch {
      setErrors(["파일을 읽지 못했어요. 다시 골라 주세요."]);
    } finally {
      setReading(false);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">문제 파일을 올려 주세요</h1>
        <p className="text-muted">
          선생님께 받은 문제 파일(.json)을 고르면 문제 풀이를 시작할 수 있어요.
          파일은 이 기기 안에서만 읽고, 어디에도 보내지 않아요.
        </p>
      </div>

      <label
        className={`btn-primary self-start ${reading ? "pointer-events-none opacity-60" : ""}`}
      >
        {reading ? "파일 읽는 중…" : "파일 선택"}
        <input
          type="file"
          accept=".json,application/json"
          className="sr-only"
          onChange={handleChange}
          disabled={reading}
        />
      </label>

      {errors.length > 0 && (
        <div role="alert" className="rounded-xl border border-bad bg-bad-soft p-4">
          <p className="font-semibold text-bad">이 파일로는 문제를 풀 수 없어요.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted">
            파일을 고친 뒤 다시 골라 주세요.
          </p>
        </div>
      )}

      <details className="rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold">
          문제 파일은 어떻게 생겼나요?
        </summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>문제는 questions 안에 차례대로 넣어요. (1개~100개)</li>
          <li>question: 문제 내용</li>
          <li>options: 보기 4개</li>
          <li>correctAnswer: 정답 번호 (1~4, 1이면 첫 번째 보기)</li>
          <li>explanation: 해설</li>
        </ul>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-code p-3 text-xs leading-relaxed">
          {FORMAT_EXAMPLE}
        </pre>
      </details>
    </section>
  );
}
