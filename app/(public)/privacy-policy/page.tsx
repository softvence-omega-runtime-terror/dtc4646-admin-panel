import type { Metadata } from "next";
import { PublicTextPage, publicPageConfig } from "../public-page";

export const metadata: Metadata = {
  title: "Privacy Policy | InterviewFIo",
  description: "Privacy policy for InterviewFIo.",
};

export default function PrivacyPolicyPage() {
  const { appName, supportEmail } = publicPageConfig;

  return (
    <PublicTextPage title="Privacy Policy">
      <section>
        <h2 className="mb-2 text-xl font-semibold">1. Overview</h2>
        <p>
          This Privacy Policy explains how {appName} collects, uses, stores, and
          protects information when you use our mobile app, dashboard, website,
          and related services.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">2. Information We Collect</h2>
        <p>
          We may collect account information such as name, email address,
          authentication details, profile information, app activity, support
          messages, device information, and content you submit while using the
          service.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">3. How We Use Information</h2>
        <p>
          We use information to create and manage accounts, provide app
          features, process user requests, provide customer support, improve
          performance, prevent abuse, maintain security, and comply with legal
          obligations.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">4. Sharing of Information</h2>
        <p>
          We do not sell personal information. We may share information with
          service providers that help us operate the app, such as hosting,
          analytics, authentication, notification, support, and infrastructure
          providers. These providers may process information only as needed to
          provide their services to us.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">5. Data Retention</h2>
        <p>
          We keep information only for as long as needed to provide the service,
          maintain security, resolve disputes, enforce our terms, or meet legal
          requirements. Users may request account or data deletion by contacting
          support.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">6. Account and Data Deletion</h2>
        <p>
          To request deletion of your account or personal data, contact us at{" "}
          <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          . After verifying the request, we will delete or anonymize account data
          unless we are required to keep certain records for legal, security, or
          fraud-prevention reasons.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">7. Security</h2>
        <p>
          We use reasonable technical and organizational measures to protect
          user information. No system is completely secure, so users should also
          protect their account credentials.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">8. Children&apos;s Privacy</h2>
        <p>
          {appName} is not intended for children under the age required by
          applicable law. If you believe a child has provided personal
          information, contact us and we will take appropriate action.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">9. Contact</h2>
        <p>
          For privacy questions or requests, contact us at{" "}
          <a className="text-blue-700 underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
          .
        </p>
      </section>
    </PublicTextPage>
  );
}
