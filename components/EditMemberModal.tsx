import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { Member } from '../types';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberId: string, newName: string) => void;
  member: Member | null;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, onSave, member }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);
    }
  }, [member]);

  const handleSubmit = () => {
    if (name.trim() && member) {
      onSave(member.id, name.trim());
      onClose();
    }
  };

  if (!isOpen || !member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`แก้ไข ${member.name}`}>
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">ชื่อสมาชิก</label>
            <Input
            type="text"
            placeholder="ชื่อสมาชิก"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || name.trim() === member.name}>บันทึกการเปลี่ยนแปลง</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMemberModal;