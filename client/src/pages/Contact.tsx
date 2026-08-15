import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import api from '../api/axios';

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactDetail: '',
    message: ''
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to backend contact route using configured axios instance
      const response = await api.post('/contact', formData);

      if (response.status === 200) {
        alert('Thank you for getting in touch! We will get back to you soon.');
        setFormData({ firstName: '', lastName: '', contactDetail: '', message: '' });
      } else {
        alert(response.data?.error || 'Something went wrong. Please try again later.');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.error || 'Failed to send message. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    fontSize: '0.95rem',
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: isMobile ? '6rem 1.5rem 4rem' : '8rem 2.5rem 6rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '1100px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {/* LEFT COLUMN - Contact Info */}
        <div style={{
          flex: '1 1 50%',
          padding: isMobile ? '2.5rem 1.5rem' : '4rem',
          borderRight: isMobile ? 'none' : '1px solid #f1f5f9',
          borderBottom: isMobile ? '1px solid #f1f5f9' : 'none',
        }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Need more information?<br />
            Get in touch with us
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '3rem' }}>
            A connected set of services designed to turn strategy into scale and help you discover the best campus events.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Phone */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#f1f5f9', padding: '0.8rem', borderRadius: '50%', color: '#334155', display: 'flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <span style={{ display: 'block', fontWeight: 700, color: '#1e293b', fontSize: '1.05rem', marginBottom: '0.2rem' }}>Phone Number</span>
                <a href="tel:+919501306800" style={{ color: '#64748b', textDecoration: 'none' }}>+91 9501306800</a>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#f1f5f9', padding: '0.8rem', borderRadius: '50%', color: '#334155', display: 'flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div>
                <span style={{ display: 'block', fontWeight: 700, color: '#1e293b', fontSize: '1.05rem', marginBottom: '0.2rem' }}>Email</span>
                <a href="mailto:theeventum01@gmail.com" style={{ color: '#64748b', textDecoration: 'none' }}>theeventum01@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Form */}
        <div style={{
          flex: '1 1 50%',
          padding: isMobile ? '2.5rem 1.5rem' : '4rem',
          background: '#ffffff',
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Send Message</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            Please fill out the form below with your details and message to contact us.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ ...inputStyle, flex: 1 }}
                onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ ...inputStyle, flex: 1 }}
                onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            
            <input
              type="text"
              name="contactDetail"
              placeholder="Email or Phone Number"
              value={formData.contactDetail}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />

            <textarea
              name="message"
              placeholder="Write Message Here..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />

            <motion.button
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              style={{
                background: loading ? '#cbd5e1' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(15, 23, 42, 0.2)'
              }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
