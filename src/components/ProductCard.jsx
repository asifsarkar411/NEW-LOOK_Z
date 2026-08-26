'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted, openVariantPicker } = useStore();

  const hasVariants = product.axes && product.axes.length > 0;
  const wish = isWishlisted(product._id || product.id);

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    if (hasVariants) {
      openVariantPicker(product, 'cart');
    } else {
      addToCart(product, '', '', 1);
    }
  };

  const handleBuyNowClick = (e) => {
    e.preventDefault();
    if (hasVariants) {
      openVariantPicker(product, 'buy');
    } else {
      addToCart(product, '', '', 1);
      router.push('/checkout');
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  // Extract color swatches or size pills if available
  const colorAxis = product.axes?.find((a) => a.name.toLowerCase() === 'color');
  const sizeAxis = product.axes?.find((a) => a.name.toLowerCase() === 'size');

  return (
    <article className="product-card">
      <div className="product-image-container">
        <Link href={`/shop/${product.slug}`} aria-label={product.title}>
          <img
            className="product-image"
            src={product.primaryImage || product.images?.[0]}
            alt={product.title}
            loading="lazy"
          />
        </Link>

        {product.discountPercentage > 0 && (
          <span className="discount-badge">-{product.discountPercentage}%</span>
        )}

        <div className="action-icons">
          {/* Wishlist toggle */}
          <button
            type="button"
            className={`icon-btn ${wish ? 'is-active' : ''}`}
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <i className={wish ? 'ri-heart-fill' : 'ri-heart-line'}></i>
          </button>

          {/* Quick Cart */}
          <button
            type="button"
            className="icon-btn"
            onClick={handleAddToCartClick}
            aria-label="Add to cart"
            title="Add to cart"
          >
            <i className="ri-shopping-cart-2-line"></i>
          </button>

          {/* Quick View / Details */}
          <Link
            href={`/shop/${product.slug}`}
            className="icon-btn"
            aria-label="View details"
            title="View details"
          >
            <i className="ri-eye-line"></i>
          </Link>
        </div>
      </div>

      {/* Visual variant swatches preview */}
      {colorAxis && (
        <div className="variants-display">
          <div className="variants-section">
            <span className="variants-label">Colors:</span>
            <div className="color-swatches">
              {colorAxis.values.map((v, i) => (
                <span
                  key={i}
                  className="color-swatch"
                  style={{ backgroundColor: v.swatch || '#000000' }}
                  title={v.label}
                ></span>
              ))}
            </div>
          </div>
        </div>
      )}

      {sizeAxis && !colorAxis && (
        <div className="variants-display">
          <div className="variants-section">
            <span className="variants-label">Sizes:</span>
            <div className="size-pills">
              {sizeAxis.values.slice(0, 3).map((v, i) => (
                <span key={i} className="size-pill">
                  {v.label}
                </span>
              ))}
              {sizeAxis.values.length > 3 && (
                <span className="size-pill more">+{sizeAxis.values.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="product-info2">
        <p className="product-category">{product.subcategory || product.category}</p>

        <h3 className="product-title">
          <Link href={`/shop/${product.slug}`}>{product.title}</Link>
        </h3>

        <div className="price-container">
          <span className="selling-price">৳ {product.sellingPrice}</span>
          {product.regularPrice > product.sellingPrice && (
            <span className="regular-price">৳ {product.regularPrice}</span>
          )}
        </div>

        <div className="product-actions">
          <button
            type="button"
            className="pc-btn pc-btn-cart"
            onClick={handleAddToCartClick}
          >
            <i className="ri-shopping-cart-2-line"></i> Add to Cart
          </button>
          <button
            type="button"
            className="pc-btn pc-btn-buy"
            onClick={handleBuyNowClick}
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
