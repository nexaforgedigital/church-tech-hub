import Link from 'next/link';
import { ChevronLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-white hover:underline mb-4 inline-block flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Shield size={48} />
            <div>
              <h1 className="text-5xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-xl opacity-90">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to ChurchAssist ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our worship presentation and lyrics management platform.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Contact Information:</strong> Name and email address when you contact us</li>
              <li><strong>Service Data:</strong> Worship services you create and save</li>
              <li><strong>Feedback:</strong> Comments, questions, and support requests</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              <li><strong>Local Storage:</strong> Service data saved in your browser for offline access</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and improve our worship presentation services</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send important updates about our platform</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>

            <h2>4. Data Storage and Security</h2>
            <p>
              Your worship service data is primarily stored locally in your browser using localStorage. We implement industry-standard security measures to protect any data transmitted to our servers. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>We may use third-party services for:</p>
            <ul>
              <li><strong>Hosting:</strong> Vercel for website hosting</li>
              <li><strong>Analytics:</strong> Anonymous usage statistics (if implemented)</li>
              <li><strong>Email:</strong> Contact form submissions</li>
            </ul>
            <p>These services have their own privacy policies governing their use of your information.</p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Export your worship service data</li>
              <li>Opt-out of communications</li>
            </ul>

            <h2>7. Children's Privacy</h2>
            <p>
              ChurchAssist is not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
              <p className="mb-0">
                <strong>Email:</strong> <a href="mailto:contact@churchassist.in" className="text-blue-600 hover:underline">contact@churchassist.in</a><br />
                <strong>Website:</strong> <a href="https://churchassist.in" className="text-blue-600 hover:underline">https://churchassist.in</a>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="mt-0">Our Commitment</h3>
              <p className="mb-0">
                ChurchAssist is designed with privacy in mind. Most of your data stays on your device, and we only collect what's necessary to provide you with the best worship presentation experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}