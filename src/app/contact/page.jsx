'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#e11d48' }}>
            We Are Here For You
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, marginTop: '4px' }}>Contact Us</h1>
          <p style={{ fontSize: '15px', color: '#64748b', marginTop: '8px' }}>
            Have questions about your order, sizing, or custom inquiries? Reach out anytime!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px' }}>
          {/* Contact Details Column */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Get In Touch</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
              Our support team is available from 9:00 AM to 10:00 PM (GMT+6), 7 days a week.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  <i className="ri-phone-line"></i>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Phone & Support</p>
                  <a href="tel:+8801824416130" style={{ fontWeight: 700, fontSize: '15px' }}>
                    +8801824416130
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  <i className="ri-whatsapp-line"></i>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>WhatsApp Direct</p>
                  <a
                    href="https://wa.me/8801824416130"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontWeight: 700, fontSize: '15px' }}
                  >
                    +880 1824-416130
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#fee2e2',
                    color: '#e11d48',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  <i className="ri-mail-line"></i>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Email Inquiry</p>
                  <a href="mailto:contact@newlookz.com" style={{ fontWeight: 700, fontSize: '15px' }}>
                    contact@newlookz.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  <i className="ri-map-pin-line"></i>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Office & Hub</p>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>Mirpur 1, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Send a Message</h3>

            {submitted ? (
              <div
                style={{
                  padding: '24px',
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <i className="ri-checkbox-circle-fill" style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}></i>
                <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Message Sent Successfully!</h4>
                <p style={{ fontSize: '13px', marginTop: '6px' }}>Our representative will respond to your email or phone shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message or inquiry..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-checkout"
                  style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '8px' }}
                >
                  Send Message <i className="ri-send-plane-line"></i>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
