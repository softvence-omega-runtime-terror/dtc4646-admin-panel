import type { Metadata } from "next";
import { PublicTextPage, publicPageConfig } from "../public-page";

export const metadata: Metadata = {
  title: "Help Center | InterviewFIo",
  description: "Help and support information for InterviewFIo.",
};

export default function HelpCenterPage() {
  const { appName, supportEmail } = publicPageConfig;

  return (
    <PublicTextPage title="Help Center">
      <section>
        <h2 className="mb-2 text-xl font-semibold">Support</h2>
        <p>
          If you need help with {appName}, contact our support team at{" "}
          <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Account Help</h2>
        <p>
          For login problems, password issues, profile updates, or account
          access questions, email support with the email address connected to
          your account.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Technical Support</h2>
        <p>
          If the app is not working as expected, include your device model,
          operating system version, app version, and a short description of the
          issue when contacting support.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Privacy and Data Requests</h2>
        <p>
          For privacy questions, data access requests, or account deletion
          requests, contact{" "}
          <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          .
        </p>
      </section>
    </PublicTextPage>
  );
}
