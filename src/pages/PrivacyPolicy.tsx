import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePageTracking } from "@/hooks/useAnalytics";

const PrivacyPolicy = () => {
  usePageTracking('/privacy-policy');
  return (
    <div className="min-h-screen font-inter overflow-x-hidden pt-24 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose dark:prose-invert">
        <h1 className="text-3xl font-bold font-poppins mb-2">GOSPOOL PRIVACY POLICY</h1>
        <p className="text-sm text-gray-500 mb-8">Effective Date: 2026<br/>Last Updated: 2026</p>

        <p>This Privacy Policy explains how Gospool (“we,” “our,” “us”) collects, uses, stores, and protects the personal data of individuals who use our ride-hailing service within church communities in Nigeria.</p>
        <p>We are committed to complying with the Nigeria Data Protection Act 2023 (NDPA) and the Nigeria Data Protection Regulation 2019 (NDPR) in protecting your privacy and personal data.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Controller</h2>
        <p>Gospool operates as the Data Controller of your personal data. For any privacy inquiries, you may contact:</p>
        <p><strong>Email:</strong> gospoolapp@gmail.com</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
        <p>We only collect the minimum personal data required to provide safe, reliable ride-hailing services.</p>
        
        <h3 className="text-xl font-medium mt-6 mb-3">For Drivers (at registration):</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Full Name</li>
          <li>Phone Number</li>
          <li>Email Address</li>
          <li>Liveliness Video</li>
          <li>Photo of your vehicle</li>
          <li>Vehicle Information (Make, Model, Plate Number)</li>
          <li>Driver’s License Number (for verification)</li>
          <li>National ID Number (NIN) (for identity verification)</li>
          <li>Church Affiliation / Parish</li>
          <li>Next of Kin details</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">For Passengers (at registration):</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Full Name</li>
          <li>Phone Number</li>
          <li>Email Address</li>
          <li>Liveliness Video</li>
          <li>National ID Number (NIN) (for identity verification)</li>
          <li>Church Affiliation / Parish</li>
          <li>Next of Kin details</li>
        </ul>

        <p>We also collect and store data on your activities on the Gospool platform. This data includes:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Ride orders</li>
          <li>Location details</li>
          <li>Ride details such as route, duration etc</li>
          <li>Review data</li>
          <li>Complaints data</li>
          <li>Chat history</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Purpose of Data Processing</h2>
        <p>We process your personal data to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Verify user identity and membership within a church community</li>
          <li>Facilitate ride matching between drivers and passengers</li>
          <li>Ensure safety and accountability of rides</li>
          <li>Communicate updates, ride details, and support services</li>
          <li>Comply with regulatory and law enforcement requirements</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Legal Basis for Processing</h2>
        <p>We process your data based on:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Consent which you have given at registration and before ride use</li>
          <li>Contractual necessity in furtherance to fulfilment of the ride hail service through the Gospool platform</li>
          <li>Legal obligation e.g., where required by Nigerian authorities</li>
          <li>Legitimate interest (ensuring platform safety and fraud prevention)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Sharing & Disclosure</h2>
        <p>Your personal data may be shared with:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Other registered users - limited data such as name, phone, picture and church for ride matching. This data will be available on a need to know basis and in such format that it cannot be stored, modified or transferred.</li>
          <li>Regulators or law enforcement where legally required</li>
          <li>Service providers for the purpose of verification or order processing. This is done under strict confidentiality agreements</li>
        </ul>
        <p>Please note that Gospool does not sell your data to third parties.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Storage & Retention</h2>
        <p>Your data will be stored securely in compliance with NDPR. under no circumstance will we store your data in hard copy format. All data will be kept only as long as necessary to provide services and comply with legal obligations. At any time when you cease to use the application, your data records may be retained for up to 5 years for audit and dispute resolution.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Subject Rights</h2>
        <p>In line with the NDPA and NDPR, you have the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Access your personal data - view your data on the Gospool platform</li>
          <li>Request correction of inaccurate data - correct any data previously captured incorrectly or update any data to reflect recent records</li>
          <li>Withdraw consent at any time - instruct us to stop processing your data on our platform generally or in specific</li>
          <li>Request deletion of your data - ask us to delete all records of your data on the Gospool platform. However, this is subject to legal obligations</li>
          <li>Object to processing in certain circumstances - particularly with respect to automated decision making</li>
          <li>Request data portability - ask us to transfer your data to any third party in furtherance of fulfilment of a service. This will be subject to appropriate security validation protocols.</li>
        </ul>
        <p>To exercise these rights, please send an email to gospoolapp@gmail.com</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Security Measures</h2>
        <p>We implement appropriate technical and organizational measures including encryption, access controls, and secure servers to protect your personal data from unauthorized access, disclosure, alteration, or destruction.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Cross-Border Data Transfer</h2>
        <p>Where data is transferred outside Nigeria, such transfers will comply with NDPR/NDPA requirements and only to countries with adequate data protection laws or subject to appropriate safeguards.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Children’s Privacy</h2>
        <p>Our service is not intended for children under 18 years. We do not knowingly collect data from minors.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to this Policy</h2>
        <p>We may update this Privacy Policy periodically. Users will be notified of significant changes via email or platform notification.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
        <p>If you have questions, complaints, or requests regarding this Privacy Policy, contact our Data Protection Officer (DPO):</p>
        <ul className="list-none mb-4">
          <li><strong>Name:</strong> DPO</li>
          <li><strong>Email:</strong> gospoolapp@gmail.com</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
