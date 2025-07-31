import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const ButtonU = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  style = {},
  ...props
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: '#f97316', // orange-500
      color: 'white',
      border: 'none',
    },
    secondary: {
      backgroundColor: '#e5e7eb', // gray-200
      color: '#111827', // gray-900
      border: 'none',
    },
    danger: {
      backgroundColor: '#ef4444', // red-500
      color: 'white',
      border: 'none',
    },
    success: {
      backgroundColor: '#22c55e', // green-500
      color: 'white',
      border: 'none',
    },
  };

  const sizeStyles = {
    sm: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
    },
  };

  const disabledStyles = (disabled || loading)
    ? { opacity: 0.5, cursor: 'not-allowed' }
    : {};

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        borderRadius: '0.375rem',
        transition: 'background-color 0.2s',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...disabledStyles,
        ...style,
      }}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" style={{ marginRight: '0.5rem' }} />}
      {children}
    </button>
  );
};

export default ButtonU;
