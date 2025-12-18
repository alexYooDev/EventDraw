import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12">
      <div className="w-full px-4 sm:px-8 lg:px-16 bg-white shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Didi Beauty Studio - Luck of a Draw</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: December 17, 2025</p>
        </div>

        {/* Content */}
        <div className="prose max-w-none text-left">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 mb-2">When you submit feedback through our platform, we collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Name:</strong> Your full name</li>
              <li><strong>Email:</strong> Your email address</li>
              <li><strong>Feedback:</strong> Your comments and feedback about our services</li>
              <li><strong>Timestamp:</strong> Date and time of submission</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-2">We use your information for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Entering you into our prize draw</li>
              <li>Contacting you if you win</li>
              <li>Improving our services based on your feedback</li>
              <li>Analyzing customer satisfaction trends</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Data Storage and Security</h2>
            <p className="text-gray-700">
              Your data is stored securely in encrypted databases. We implement industry-standard security measures 
              including HTTPS encryption, password hashing, and secure authentication to protect your information.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Retention</h2>
            <p className="text-gray-700">
              We retain your information for 12 months from the date of submission. After this period, 
              your data will be automatically deleted from our systems.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Your Rights (GDPR)</h2>
            <p className="text-gray-700 mb-2">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request corrections to your data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Object:</strong> Object to processing of your data</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Cookies</h2>
            <p className="text-gray-700">
              We use essential cookies to maintain your login session (admin only). No tracking or 
              advertising cookies are used.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
            <p className="text-gray-700 mb-2">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Vercel:</strong> Frontend hosting</li>
              <li><strong>Railway:</strong> Backend hosting and database</li>
              <li><strong>Resend:</strong> Email notification service</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
            <p className="text-gray-700">
              For privacy-related questions or to exercise your rights, contact us at:
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Email:</strong> didibeautystudiobne@gmail.com<br />
              <strong>Business:</strong> Didi Beauty Studio
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this privacy policy from time to time. Changes will be posted on this page 
              with an updated revision date.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link 
            to="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Feedback Form
          </Link>
        </div>
      </div>
    </div>
  );
}
