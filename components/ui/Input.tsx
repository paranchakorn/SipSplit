
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-text-primary ${className}`}
      {...props}
    />
  );
};

export default Input;