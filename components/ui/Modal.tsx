import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity" onClick={onClose}>
      <div 
        className="relative bg-surface border-2 border-border w-full max-w-md m-4 p-6" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          <button onClick={onClose} className="p-2 text-text-secondary hover:bg-border hover:text-text-primary transition-colors">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;