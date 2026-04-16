import type { Metadata } from "next";
import { PublicTextPage, publicPageConfig } from "../public-page";

export const metadata: Metadata = {
  title: "About Us | InterviewFIo",
  description: "About InterviewFIo.",
};

export default function AboutUsPage() {
  const { appName, supportEmail } = publicPageConfig;

  return (
    <PublicTextPage title="About Us">
      <section>
        <h2 className="mb-2 text-xl font-semibold">{appName}</h2>
        <p>
          {appName} provides tools that help users prepare, practice, organize,
          and manage interview-related workflows through our mobile app,
          dashboard, and related services.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Our Purpose</h2>
        <p>
          Our goal is to provide a useful, secure, and accessible service for
          users who want structured support for interview preparation and
          related productivity tasks.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Contact</h2>
        <p>
          You can contact us at{" "}
          <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          .
        </p>
      </section>
    </PublicTextPage>
  );
}
