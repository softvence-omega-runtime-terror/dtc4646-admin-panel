import type { Metadata } from "next";
import { PublicTextPage, publicPageConfig } from "../public-page";

export const metadata: Metadata = {
  title: "Contact Us | InterviewFIo",
  description: "Contact and support email for InterviewFIo.",
};

export default function ContactUsPage() {
  const { appName, supportEmail } = publicPageConfig;

  return (
    <PublicTextPage title="Contact Us">
      <section>
        <h2 className="mb-2 text-xl font-semibold">Support Email</h2>
        <p>
          For support, privacy questions, account questions, or general
          inquiries about {appName}, email us at{" "}
          <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Response Time</h2>
        <p>
          We try to respond to support requests as soon as possible. Please
          include the email address connected to your account when your request
          is account-related.
        </p>
      </section>
    </PublicTextPage>
  );
}
