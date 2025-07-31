import React from 'react';

const SelectU = ({ label, error, options, style = {}, ...props }) => {
  const baseStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '0.375rem',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    outline: 'none',
    fontSize: '1rem',
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          {label}
        </label>
      )}
      <select style={{ ...baseStyle, ...style }} {...props}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectU;
