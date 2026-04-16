import type { ReactNode } from "react";

export const publicPageConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "InterviewFIo",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@interviewfio.com",
  lastUpdated: "April 16, 2026",
};

type PublicTextPageProps = {
  title: string;
  children: ReactNode;
};

export function PublicTextPage({ title, children }: PublicTextPageProps) {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900 sm:px-10">
      <article className="mx-auto max-w-3xl text-base leading-7">
        <h1 className="mb-3 text-3xl font-bold">{title}</h1>
        <p className="mb-8 text-sm text-gray-600">
          Last updated: {publicPageConfig.lastUpdated}
        </p>
        <div className="space-y-6">{children}</div>
      </article>
    </main>
  );
}
