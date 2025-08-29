
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-surface border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/#" className="text-2xl font-bold text-primary">
            Sip & Split
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;