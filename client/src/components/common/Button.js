import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClass = `
    btn 
    btn--${variant} 
    btn--${size} 
    ${disabled ? 'btn--disabled' : ''} 
    ${loading ? 'btn--loading' : ''} 
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="btn__spinner">
          <div className="spinner"></div>
        </span>
      )}
      <span className={loading ? 'btn__text--loading' : 'btn__text'}>
        {children}
      </span>
    </button>
  );
};

export default Button;
