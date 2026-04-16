import type { Metadata } from "next";
import { PublicTextPage, publicPageConfig } from "../public-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | InterviewFIo",
  description: "Terms and conditions for InterviewFIo.",
};

export default function TermsAndConditionsPage() {
  const { appName, supportEmail } = publicPageConfig;

  return (
    <PublicTextPage title="Terms & Conditions">
      <section>
        <h2 className="mb-2 text-xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By accessing or using {appName}, you agree to these Terms &
          Conditions. If you do not agree, please do not use the service.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">2. Use of the Service</h2>
        <p>
          You agree to use {appName} only for lawful purposes and in a way that
          does not harm the service, other users, or any third party. You are
          responsible for the information you submit through the app or
          dashboard.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">3. Account Responsibility</h2>
        <p>
          You are responsible for keeping your account credentials secure. If
          you believe your account has been accessed without permission, contact
          us as soon as possible.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">4. Content and Data</h2>
        <p>
          You retain responsibility for the content, responses, profile details,
          and other information you provide to {appName}. We may process that
          information only as needed to operate, maintain, secure, and improve
          the service.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">5. Service Availability</h2>
        <p>
          We work to keep {appName} available and reliable, but we do not
          guarantee that the service will always be uninterrupted, error-free, or
          available at all times.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">6. Termination</h2>
        <p>
          We may suspend or terminate access if a user violates these terms,
          misuses the service, or creates risk for the platform, other users, or
          third parties.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">7. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          .
        </p>
      </section>
    </PublicTextPage>
  );
}
