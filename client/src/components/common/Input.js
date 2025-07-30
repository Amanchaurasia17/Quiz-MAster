import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  icon,
  ...props
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            input 
            ${error ? 'input--error' : ''} 
            ${disabled ? 'input--disabled' : ''}
            ${icon ? 'input--with-icon' : ''}
          `.trim()}
          {...props}
        />
      </div>
      
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
