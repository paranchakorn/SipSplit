import React from 'react';
import { Member } from '../types';
import Card from './ui/Card';
import MemberChip from './ui/MemberChip';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, onEdit, onDelete }) => {
  return (
    <Card>
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">สมาชิกในกลุ่ม</h2>
        {members.length > 0 ? (
          <ul className="space-y-3">
            {members.map(member => (
              <li key={member.id} className="flex items-center justify-between p-2 bg-surface rounded-md">
                <div className="min-w-0 mr-2">
                    <MemberChip member={member} />
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button onClick={() => onEdit(member)} aria-label={`แก้ไข ${member.name}`} className="p-1 text-text-secondary hover:text-primary rounded-full hover:bg-border transition-colors">
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(member.id)} aria-label={`ลบ ${member.name}`} className="p-1 text-text-secondary hover:text-red-400 rounded-full hover:bg-red-900/50 transition-colors">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary">ยังไม่มีสมาชิก เพิ่มสมาชิกเพื่อเริ่มต้นใช้งาน</p>
        )}
      </div>
    </Card>
  );
};

export default MemberList;
