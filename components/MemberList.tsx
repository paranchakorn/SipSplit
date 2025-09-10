import React from 'react';
import { Member } from '../types';
import Card from './ui/Card';
import MemberChip from './ui/MemberChip';
import Button from './ui/Button';
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
  onAdd: () => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, onEdit, onDelete, onAdd }) => {
  return (
    <Card>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold">สมาชิกในกลุ่ม</h2>
          <Button onClick={onAdd} variant="secondary" className="px-3 py-2 text-sm flex items-center gap-1.5 whitespace-nowrap">
            <UserPlusIcon className="h-5 w-5" />
            เพิ่มสมาชิก
          </Button>
        </div>
        {members.length > 0 ? (
          <ul className="space-y-3">
            {members.map(member => (
              <li key={member.id} className="flex items-center justify-between p-3 bg-surface">
                <div className="min-w-0 mr-2">
                    <MemberChip member={member} />
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button onClick={() => onEdit(member)} aria-label={`แก้ไข ${member.name}`} className="p-2 text-text-secondary hover:text-primary hover:bg-border transition-colors">
                        <PencilSquareIcon className="h-6 w-6" />
                    </button>
                    <button onClick={() => onDelete(member.id)} aria-label={`ลบ ${member.name}`} className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-900/50 transition-colors">
                        <TrashIcon className="h-6 w-6" />
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