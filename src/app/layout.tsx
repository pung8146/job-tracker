import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "개발자 채용공고 대시보드 MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
