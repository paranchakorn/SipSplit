import React from 'react';
import { Member } from '../../types';

interface MemberChipProps {
  member: Member;
  className?: string;
}

const getContrastingTextColor = (hexColor: string): string => {
  if (!hexColor || hexColor.length < 7) return '#000000';
  try {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  } catch (error) {
    console.error("Error parsing color:", hexColor, error);
    return '#000000';
  }
};

const MemberChip: React.FC<MemberChipProps> = ({ member, className = '' }) => {
  const chipStyle = {
    backgroundColor: member.color,
    color: getContrastingTextColor(member.color),
  };

  return (
    <div 
      className={`inline-flex items-center px-3 py-1.5 text-base font-medium whitespace-nowrap border-2 border-transparent ${className}`}
      style={chipStyle}
    >
      {member.name}
    </div>
  );
};

export default MemberChip;