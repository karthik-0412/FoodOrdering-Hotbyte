import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Button from './UI/ButtonU';
import Select from './UI/SelectU';
import InputU from './UI/InputU';
import Footer from './Footer';

const ContactUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const messageRef = useRef(null);

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Phone Support',
      details: '+1 (555) 123-4567',
      description: 'Available 24/7 for urgent matters',
    },
    {
      icon: <Mail size={24} />,
      title: 'Email Support',
      details: 'servicehotbyte@gmail.com',
      description: 'We respond within 24 hours',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Office Address',
      details: '123 Food Street, Culinary District',
      description: 'San Francisco, CA 94102',
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      details: 'Monday - Saturday',
      description: '09:00 AM - 06:00 PM',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9002/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: 'general',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (success && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [success]);

  return (<>
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(to right, #f97316, #ef4444)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contact Us</h1>
        <p>We're here to help! Reach out to us for any questions, concerns, or feedback.</p>
      </section>

      {/* Contact Information */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            padding: '0 1rem',
          }}
        >
          {contactInfo.map((info, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#f97316' }}>
                {info.icon}
              </div>
              <h3 style={{ fontWeight: '600', color: '#111827' }}>{info.title}</h3>
              <p style={{ color: '#111827' }}>{info.details}</p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            Send Us a Message
          </h2>

          {/* Success Message */}
          <div ref={messageRef}>
            {success && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #10b981',
                  color: '#065f46',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                Your message has been sent successfully! We'll get back to you soon.
              </div>
            )}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <InputU
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your full name"
              />
              <InputU
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <InputU
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'order', label: 'Order Support' },
                  { value: 'technical', label: 'Technical Support' },
                  { value: 'partnership', label: 'Partnership' },
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'complaint', label: 'Complaint' },
                ]}
              />
            </div>

            <InputU
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              placeholder="Brief description of your inquiry"
            />

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Message <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                }}
                placeholder="Please provide details about your inquiry..."
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Send size={20} />
              <span>Send Message</span>
            </Button>
          </form>
        </div>
      </section>
    </div>
    <Footer />
 </> );
};

export default ContactUser;