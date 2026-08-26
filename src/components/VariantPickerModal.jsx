'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function VariantPickerModal() {
  const router = useRouter();
  const { variantModal, closeVariantPicker, addToCart } = useStore();
  const { isOpen, product, action } = variantModal;

  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (product && product.axes) {
      // Pre-select first option for each axis if available
      const initial = {};
      product.axes.forEach((axis) => {
        if (axis.values && axis.values.length > 0) {
          initial[axis.name] = axis.values[0].label;
        }
      });
      setSelectedOptions(initial);
    } else {
      setSelectedOptions({});
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSelectOption = (axisName, label) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [axisName]: label,
    }));
  };

  const isComplete =
    product.axes &&
    product.axes.length > 0 &&
    product.axes.every((axis) => Boolean(selectedOptions[axis.name]));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) return;

    const variantLabel = Object.entries(selectedOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    // Find matched variant id
    const matchedVariant = product.variants?.find((v) => {
      const opts = v.options instanceof Map ? Object.fromEntries(v.options) : v.options;
      if (!opts) return false;
      return Object.entries(selectedOptions).every(([axis, val]) => opts[axis] === val);
    });

    const variantId = matchedVariant?.id || '';

    addToCart(product, variantLabel, variantId, 1);
    closeVariantPicker();

    if (action === 'buy') {
      router.push('/checkout');
    }
  };

  return (
    <div className="vp-overlay" onClick={closeVariantPicker}>
      <div className="vp-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="vp-close"
          onClick={closeVariantPicker}
          aria-label="Close"
        >
          <i className="ri-close-line"></i>
        </button>

        <h2 className="vp-title">Choose Your Options</h2>

        <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'center' }}>
          <img
            src={product.primaryImage || product.images?.[0]}
            alt={product.title}
            style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, lineHeight: '1.3' }}>
              {product.title}
            </h4>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#000000' }}>
              ৳ {product.sellingPrice}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {product.axes?.map((axis) => {
            const isColor = axis.values.some((v) => v.swatch);

            return (
              <div key={axis.name} className="vp-axis">
                <p className="vp-axis-label">
                  Select {axis.name}:{' '}
                  <span style={{ color: '#000000', fontWeight: 800 }}>
                    {selectedOptions[axis.name] || 'Required'}
                  </span>
                </p>

                {isColor ? (
                  <div className="color-grid">
                    {axis.values.map((v) => (
                      <div key={v.label} className="color-option">
                        <button
                          type="button"
                          className={`color-dot ${
                            selectedOptions[axis.name] === v.label ? 'is-selected' : ''
                          }`}
                          style={{ backgroundColor: v.swatch || '#000000' }}
                          onClick={() => handleSelectOption(axis.name, v.label)}
                          title={v.label}
                        ></button>
                        <span
                          className={`color-name ${
                            selectedOptions[axis.name] === v.label ? 'is-selected' : ''
                          }`}
                        >
                          {v.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="vp-size-grid">
                    {axis.values.map((v) => (
                      <button
                        key={v.label}
                        type="button"
                        className={`vp-size-btn ${
                          selectedOptions[axis.name] === v.label ? 'is-selected' : ''
                        }`}
                        onClick={() => handleSelectOption(axis.name, v.label)}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            className="vp-submit"
            disabled={!isComplete}
          >
            {isComplete
              ? action === 'buy'
                ? 'Proceed to Checkout (Buy Now)'
                : 'Confirm & Add to Cart'
              : 'Please Select All Options'}
          </button>
        </form>
      </div>
    </div>
  );
}
