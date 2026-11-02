import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "문제풀이",
  description: "문제지를 골라 문제를 풀고 점수와 해설을 확인해요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
