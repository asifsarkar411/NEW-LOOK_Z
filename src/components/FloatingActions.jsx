'use client';

import React from 'react';

export default function FloatingActions({ whatsapp = '8801824416130', phone = '01824416130', email = 'contact@newlookz.com' }) {
  return (
    <div className="floating-icons">
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn whatsapp-icon"
        aria-label="WhatsApp"
        title="WhatsApp Support"
      >
        <i className="ri-whatsapp-line"></i>
      </a>

      <a
        href={`mailto:${email}`}
        className="floating-btn email-icon"
        aria-label="Email"
        title="Email Support"
      >
        <i className="ri-mail-line"></i>
      </a>

      <a
        href={`tel:${phone}`}
        className="floating-btn call-icon"
        aria-label="Call Us"
        title="Call Us"
      >
        <i className="ri-phone-line"></i>
      </a>
    </div>
  );
}
