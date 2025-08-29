import React, { useState, useEffect, useCallback } from 'react';
import { Member, Expense } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id'> & { id?: string }) => void;
  members: Member[];
  expenseToEdit?: Expense | null;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSaveExpense, members, expenseToEdit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setDescription(expenseToEdit.description);
        setAmount(expenseToEdit.amount.toString());
        setPaidById(expenseToEdit.paidById);
        setParticipants(expenseToEdit.participants);
      } else {
        setDescription('');
        setAmount('');
        if (members.length > 0) {
          setPaidById(members[0].id);
          setParticipants(members.map(m => m.id));
        } else {
          setPaidById('');
          setParticipants([]);
        }
      }
    }
  }, [isOpen, members, expenseToEdit]);

  const handleParticipantChange = (memberId: string) => {
    setParticipants(prev => 
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const selectAllParticipants = () => {
    setParticipants(members.map(m => m.id));
  };

  const clearAllParticipants = () => {
    setParticipants([]);
  };

  const handleAmountBlur = useCallback(() => {
    const value = amount.trim();
    if (!/[+-]/.test(value)) {
      return;
    }

    const validExpressionRegex = /^\d+(\.\d+)?([+\-]\d+(\.\d+)?)*$/;
    const sanitizedValue = value.replace(/\s/g, '');

    if (validExpressionRegex.test(sanitizedValue)) {
      try {
        const result = new Function(`return ${sanitizedValue}`)();
        if (typeof result === 'number' && isFinite(result)) {
          setAmount(String(result));
        }
      } catch (error) {
        console.error("Could not evaluate expression:", error);
      }
    }
  }, [amount]);

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (description.trim() && !isNaN(numericAmount) && numericAmount > 0 && paidById && participants.length > 0) {
      const expenseData = {
        description: description.trim(),
        amount: numericAmount,
        paidById,
        participants,
      };

      onSaveExpense(expenseToEdit ? { ...expenseData, id: expenseToEdit.id } : expenseData);
      onClose();
    }
  };

  const isFormValid = description.trim() && parseFloat(amount) > 0 && paidById && participants.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expenseToEdit ? "แก้ไขค่าใช้จ่าย" : "เพิ่มค่าใช้จ่ายใหม่"}>
      <div className="space-y-4">
        <Input type="text" placeholder="รายละเอียด" value={description} onChange={e => setDescription(e.target.value)} />
        <Input 
          type="text" 
          inputMode="decimal"
          placeholder="จำนวนเงิน (เช่น 50+120-10)" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          onBlur={handleAmountBlur}
        />
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">จ่ายโดย</label>
          <select value={paidById} onChange={e => setPaidById(e.target.value)} className="w-full p-3 border border-border bg-surface text-text-primary focus:ring-primary focus:border-primary text-base rounded-none appearance-none">
            {members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">หารกันระหว่าง</label>
          <div className="flex gap-4 mb-2">
            <button onClick={selectAllParticipants} className="text-sm text-primary hover:underline">เลือกทั้งหมด</button>
            <button onClick={clearAllParticipants} className="text-sm text-primary hover:underline">ล้างทั้งหมด</button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1 p-2 border border-border">
            {members.map(member => (
              <label key={member.id} className="flex items-center gap-3 p-2 hover:bg-border cursor-pointer">
                <input type="checkbox" checked={participants.includes(member.id)} onChange={() => handleParticipantChange(member.id)} className="h-5 w-5 text-primary focus:ring-primary bg-surface border-border rounded-none"/>
                <div className="flex items-center gap-2 text-base">
                  <span className="h-4 w-4" style={{ backgroundColor: member.color }}></span>
                  <span>{member.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {expenseToEdit ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มค่าใช้จ่าย'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddExpenseModal;