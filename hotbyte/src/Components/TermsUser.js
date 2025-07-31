import React from 'react';
import { Shield, FileText, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsUser = () => {
  const lastUpdated = "July 10, 2025";

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `By accessing and using HotByte's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      content: `"Service" refers to the HotByte platform, including website, mobile application, and all related services. "User" refers to any individual who accesses or uses our Service. "Restaurant Partner" refers to food establishments that list their menus on our platform.`
    },
    {
      id: 'user-accounts',
      title: '3. User Accounts',
      content: `To access certain features of our Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.`
    },
    {
      id: 'ordering',
      title: '4. Ordering and Payment',
      content: `When you place an order through our platform, you enter into a contract with the respective restaurant. All prices are subject to change without notice. Payment must be made at the time of ordering. We accept various payment methods as displayed on our platform.`
    },
    {
      id: 'delivery',
      title: '5. Delivery Services',
      content: `Delivery times are estimates and may vary due to weather, traffic, or other circumstances beyond our control. We are not responsible for delays caused by factors outside our control. Delivery fees and minimum order requirements may apply.`
    },
    {
      id: 'cancellation',
      title: '6. Cancellation and Refunds',
      content: `Orders may be cancelled within a limited time after placement, subject to restaurant approval. Refunds will be processed according to our refund policy. We reserve the right to cancel orders in cases of suspected fraud or other violations of these terms.`
    },
    {
      id: 'user-conduct',
      title: '7. User Conduct',
      content: `You agree not to use our Service for any unlawful purpose or in any way that could damage, disable, or impair our Service. You must not attempt to gain unauthorized access to our systems or engage in any activity that interferes with our Service.`
    },
    {
      id: 'intellectual-property',
      title: '8. Intellectual Property',
      content: `All content on our platform, including text, graphics, logos, and software, is the property of HotByte or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.`
    },
    {
      id: 'privacy',
      title: '9. Privacy Policy',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.`
    },
    {
      id: 'disclaimers',
      title: '10. Disclaimers',
      content: `Our Service is provided "as is" without warranties of any kind. We do not guarantee that our Service will be uninterrupted, secure, or error-free. We are not responsible for the quality, safety, or legality of food items ordered through our platform.`
    },
    {
      id: 'limitation-liability',
      title: '11. Limitation of Liability',
      content: `To the maximum extent permitted by law, HotByte shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our Service. Our total liability shall not exceed the amount paid by you for the specific order giving rise to the claim.`
    },
    {
      id: 'indemnification',
      title: '12. Indemnification',
      content: `You agree to indemnify and hold harmless HotByte, its officers, directors, employees, and agents from any claims, damages, or expenses arising out of your use of our Service or violation of these terms.`
    },
    {
      id: 'modifications',
      title: '13. Modifications to Terms',
      content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our platform. Your continued use of our Service after any changes constitutes acceptance of the new terms.`
    },
    {
      id: 'termination',
      title: '14. Termination',
      content: `We may terminate or suspend your account and access to our Service immediately, without prior notice, for any reason, including breach of these terms. Upon termination, your right to use our Service will cease immediately.`
    },
    {
      id: 'governing-law',
      title: '15. Governing Law',
      content: `These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of California.`
    },
    {
      id: 'contact',
      title: '16. Contact Information',
      content: `If you have any questions about these Terms and Conditions, please contact us at legal@hotbyte.com or by mail at 123 Food Street, San Francisco, CA 94102.`
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(to right, #f97316, #ef4444)', color: 'white', padding: '64px 0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <FileText size={64} color="#fed7aa" />
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '16px' }}>Terms and Conditions</h1>
          <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto', color: '#ffedd5' }}>
            Please read these terms and conditions carefully before using our service.
          </p>
        </div>
      </section>

      {/* Last Updated */}
      <section style={{ padding: '32px 0', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', textAlign: 'center', color: '#4b5563' }}>
          <Clock size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </section>

      {/* Important Notice */}
      <section style={{ padding: '32px 0', backgroundColor: '#fefce8', borderBottom: '1px solid #fef08a' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', backgroundColor: '#fef9c3', border: '1px solid #fef08a', borderRadius: '8px', padding: '16px' }}>
            <AlertTriangle size={24} color="#ca8a04" style={{ flexShrink: 0, marginTop: '4px', marginRight: '12px' }} />
            <div>
              <h3 style={{ fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>Important Notice</h3>
              <p style={{ color: '#854d0e', fontSize: '14px' }}>
                By using HotByte's services, you agree to these terms and conditions.
                Please read them carefully as they contain important information about your rights and obligations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section style={{ padding: '32px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Table of Contents</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                style={{ color: '#f97316', fontSize: '18px', textDecoration: 'none', padding: '4px 0' }}
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section style={{ padding: '48px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {sections.map((section) => (
            <div key={section.id} id={section.id} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>{section.title}</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '48px 0', backgroundColor: '#111827', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Questions About These Terms?</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
            If you have any questions or concerns about these terms and conditions, we're here to help clarify them for you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href="mailto:legal@hotbyte.com"
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Email Legal Team
            </a>
            <Link
              to="/contact"
              style={{
                border: '1px solid #4b5563',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsUser;
