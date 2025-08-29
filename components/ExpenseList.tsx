import React from 'react';
import { Expense, Member } from '../types';
import Card from './ui/Card';
import MemberChip from './ui/MemberChip';
import { UserIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, members, onEdit, onDelete }) => {
  const getMember = (id: string): Member | undefined => members.find(m => m.id === id);

  return (
    <Card>
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">รายการค่าใช้จ่าย</h2>
        {expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.map(expense => {
              const payer = getMember(expense.paidById);
              return (
                <div key={expense.id} className="p-4 border border-border">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex-1 pr-4 w-full">
                      <p className="font-semibold text-lg break-words">{expense.description}</p>
                      <div className="text-sm text-text-secondary flex items-center gap-2 mt-1">
                        <span>จ่ายโดย</span> 
                        {payer ? <MemberChip member={payer} /> : <span className="font-medium text-text-secondary">ไม่ระบุ</span>}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between">
                      <p className="text-xl font-bold text-text-primary">
                          {expense.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                          <button onClick={() => onEdit(expense)} aria-label={`แก้ไข ${expense.description}`} className="p-2 text-text-secondary hover:text-primary hover:bg-border transition-colors">
                              <PencilSquareIcon className="h-6 w-6" />
                          </button>
                          <button onClick={() => onDelete(expense.id)} aria-label={`ลบ ${expense.description}`} className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-900/50 transition-colors">
                              <TrashIcon className="h-6 w-6" />
                          </button>
                      </div>
                    </div>
                  </div>
                  {expense.participants.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-sm text-text-secondary flex items-start gap-2">
                             <UserIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                             <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                               <span>หารกันระหว่าง:</span>
                               {expense.participants.map(id => {
                                 const member = getMember(id);
                                 return member ? <MemberChip key={id} member={member} /> : null;
                               })}
                             </div>
                          </div>
                      </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-text-secondary">ยังไม่มีรายการค่าใช้จ่าย</p>
        )}
      </div>
    </Card>
  );
};

export default ExpenseList;