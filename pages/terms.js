import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-white hover:underline mb-4 inline-block flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <FileText size={48} />
            <div>
              <h1 className="text-5xl font-bold mb-2">Terms of Service</h1>
              <p className="text-xl opacity-90">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using ChurchAssist ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              ChurchAssist provides worship presentation tools, lyrics management, and related resources for churches and worship teams. Our Service includes:
            </p>
            <ul>
              <li>Access to a library of worship song lyrics</li>
              <li>Worship service planning and presentation tools</li>
              <li>PowerPoint and PDF generation features</li>
              <li>Educational tutorials and technical resources</li>
            </ul>

            <h2>3. User Responsibilities</h2>
            <h3>3.1 Acceptable Use</h3>
            <p>You agree to use ChurchAssist only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any copyright, trademark, or intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload malicious code or viruses</li>
            </ul>

            <h3>3.2 Content Usage</h3>
            <p>
              Song lyrics and worship content are provided for legitimate worship and religious purposes only. Users are responsible for ensuring they have appropriate licenses (e.g., CCLI) for public performance of copyrighted songs.
            </p>

            <h2>4. Intellectual Property</h2>
            <h3>4.1 Our Content</h3>
            <p>
              ChurchAssist and its original content, features, and functionality are owned by ChurchAssist and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h3>4.2 User Content</h3>
            <p>
              Worship services you create remain your property. By using our Service, you grant us a license to store and display this content solely for the purpose of providing the Service to you.
            </p>

            <h3>4.3 Third-Party Content</h3>
            <p>
              Song lyrics and other worship content may be subject to third-party copyrights. It is your responsibility to obtain necessary licenses (CCLI, etc.) for public performance.
            </p>

            <h2>5. Disclaimers and Limitations</h2>
            <h3>5.1 Service "As Is"</h3>
            <p>
              ChurchAssist is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
            </p>

            <h3>5.2 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, ChurchAssist shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
            </p>

            <h2>6. Data and Privacy</h2>
            <p>
              Your use of ChurchAssist is also governed by our Privacy Policy. We store most data locally on your device and implement security measures to protect any transmitted data.
            </p>

            <h2>7. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice. We may also update these Terms from time to time. Continued use after changes constitutes acceptance.
            </p>

            <h2>8. Account Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
            </p>

            <h2>10. Copyright Compliance</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-4">
              <p className="font-semibold mb-2">⚠️ Important Notice</p>
              <p className="mb-0">
                ChurchAssist provides tools for worship presentation. Users are responsible for ensuring they have appropriate licenses (CCLI, etc.) for displaying copyrighted songs in public worship services.
              </p>
            </div>

            <h2>11. Support and Contact</h2>
            <p>
              For questions about these Terms or support inquiries:
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
              <p className="mb-0">
                <strong>Email:</strong> <a href="mailto:contact@churchassist.in" className="text-blue-600 hover:underline">contact@churchassist.in</a><br />
                <strong>Website:</strong> <a href="https://churchassist.in" className="text-blue-600 hover:underline">https://churchassist.in</a>
              </p>
            </div>

            <h2>12. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="mt-0">Thank You</h3>
              <p className="mb-0">
                Thank you for using ChurchAssist to enhance your worship services. We're committed to providing tools that serve the church and honor God.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}