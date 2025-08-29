import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`block w-full px-4 py-3 border-2 border-border placeholder-text-secondary focus:outline-none focus:ring-primary focus:border-primary text-base bg-surface text-text-primary ${className}`}
      {...props}
    />
  );
};

export default Input;