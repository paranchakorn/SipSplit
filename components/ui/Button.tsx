import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3";

  const variantStyles = {
    primary: 'bg-primary text-background hover:bg-primary/90 focus:ring-primary focus:ring-offset-background',
    secondary: 'bg-secondary text-text-primary hover:bg-secondary/90 focus:ring-secondary focus:ring-offset-background',
    outline: 'border-2 border-border bg-transparent text-text-secondary hover:bg-surface focus:ring-primary focus:ring-offset-background',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;