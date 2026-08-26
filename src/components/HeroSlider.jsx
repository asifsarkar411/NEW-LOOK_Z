'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider({ banners = [] }) {
  const [active, setActive] = useState(0);

  const defaultBanners = [
    {
      _id: '1',
      title: 'New Season Arrival',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&auto=format&fit=crop&q=80',
      link: '/shop',
    },
    {
      _id: '2',
      title: 'Premium Mens Fashion',
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=80',
      link: '/shop?category=mens-fashion',
    },
    {
      _id: '3',
      title: 'Womens & Ethnic Trends',
      image:
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&auto=format&fit=crop&q=80',
      link: '/shop?category=womens-fashion',
    },
  ];

  const slides = banners.length > 0 ? banners : defaultBanners;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev + slides.length - 1) % slides.length);
  };

  return (
    <section className="sf-hero">
      {slides.map((slide, index) => (
        <Link
          key={slide._id || index}
          href={slide.link || '/shop'}
          className={`sf-hero-slide ${active === index ? 'is-active' : ''}`}
          aria-label={slide.title}
        >
          <img
            src={slide.image}
            alt={slide.title}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </Link>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="sf-hero-nav prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <button
            type="button"
            className="sf-hero-nav next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </>
      )}
    </section>
  );
}
