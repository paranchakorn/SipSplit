import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bill, Member, Expense, Settlement } from '../types';
import { calculateSettlements } from '../utils/calculations';
import { getRandomColor } from '../utils/colors';
import Button from '../components/ui/Button';
import MemberList from '../components/MemberList';
import ExpenseList from '../components/ExpenseList';
import Summary from '../components/Summary';
import AddMemberModal from '../components/AddMemberModal';
import AddExpenseModal from '../components/AddExpenseModal';
import EditMemberModal from '../components/EditMemberModal';
import { LinkIcon } from '@heroicons/react/24/outline';

const BillPage: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (billId) {
      try {
        const storedBill = localStorage.getItem(`bill-${billId}`);
        if (storedBill) {
          let parsedBill: Bill = JSON.parse(storedBill);
          
          let membersUpdated = false;
          const updatedMembers = parsedBill.members.map(member => {
            if (!member.color) {
              membersUpdated = true;
              return { ...member, color: getRandomColor() };
            }
            return member;
          });

          if (membersUpdated) {
            parsedBill = { ...parsedBill, members: updatedMembers };
            localStorage.setItem(`bill-${parsedBill.id}`, JSON.stringify(parsedBill));
          }

          setBill(parsedBill);
        } else {
          console.warn(`No bill found for ID: ${billId}`);
          navigate('/');
        }
      } catch (error) {
        console.error("Failed to load bill data from local storage:", error);
        navigate('/');
      }
    }
  }, [billId, navigate]);

  const updateBill = (newBillState: Bill) => {
    setBill(newBillState);
    try {
      localStorage.setItem(`bill-${newBillState.id}`, JSON.stringify(newBillState));
    } catch (error) {
      console.error("Failed to save bill data to local storage:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกการเปลี่ยนแปลง");
    }
  };

  const addMember = (name: string) => {
    if (bill) {
      const newMember: Member = { id: Date.now().toString(), name, color: getRandomColor() };
      updateBill({ ...bill, members: [...bill.members, newMember] });
    }
  };
  
  const editMember = (memberId: string, newName: string) => {
    if (bill) {
      const updatedMembers = bill.members.map(m => 
        m.id === memberId ? { ...m, name: newName } : m
      );
      updateBill({ ...bill, members: updatedMembers });
    }
  };

  const deleteMember = (memberId: string) => {
    if (bill) {
      const isMemberInvolved = bill.expenses.some(
        expense => expense.paidById === memberId || expense.participants.includes(memberId)
      );
  
      if (isMemberInvolved) {
        alert("ไม่สามารถลบสมาชิกที่มีค่าใช้จ่ายได้ กรุณาแก้ไขรายการค่าใช้จ่ายก่อน เพื่อลบสมาชิก");
        return;
      }
  
      if (window.confirm("ต้องการลบสมาชิกคนนี้ใช่ไหม?")) {
        const updatedMembers = bill.members.filter(m => m.id !== memberId);
        updateBill({ ...bill, members: updatedMembers });
      }
    }
  };

  const saveExpense = (expenseData: Omit<Expense, 'id'> & { id?: string }) => {
    if (bill) {
      if (expenseData.id) { // Editing existing
        const updatedExpenses = bill.expenses.map(exp => 
          exp.id === expenseData.id ? { ...exp, ...expenseData } as Expense : exp
        );
        updateBill({ ...bill, expenses: updatedExpenses });
      } else { // Adding new
        const newExpense: Expense = { ...expenseData, id: Date.now().toString() } as Expense;
        updateBill({ ...bill, expenses: [...bill.expenses, newExpense] });
      }
    }
  };

  const deleteExpense = (expenseId: string) => {
    if (bill && window.confirm("ต้องการลบค่าใช้จ่ายนี้ใช่ไหม?")) {
      const updatedExpenses = bill.expenses.filter(e => e.id !== expenseId);
      updateBill({ ...bill, expenses: updatedExpenses });
    }
  };


  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const settlements: Settlement[] = useMemo(() => {
    if (bill && bill.members.length > 0 && bill.expenses.length > 0) {
      return calculateSettlements(bill.members, bill.expenses);
    }
    return [];
  }, [bill]);

  const totalExpenses = useMemo(() => {
    if (!bill) return 0;
    return bill.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [bill]);

  if (!bill) {
    return <div className="text-center p-10">กำลังโหลดข้อมูลบิล...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary truncate">{bill.title}</h1>

      <MemberList 
        members={bill.members} 
        onEdit={setEditingMember}
        onDelete={deleteMember}
        onAdd={() => setMemberModalOpen(true)}
      />
      
      <ExpenseList 
        expenses={bill.expenses} 
        members={bill.members} 
        onEdit={(expense) => { setEditingExpense(expense); setExpenseModalOpen(true); }}
        onDelete={deleteExpense}
        onAdd={() => { setEditingExpense(null); setExpenseModalOpen(true); }}
        isAddDisabled={bill.members.length === 0}
        totalExpenses={totalExpenses}
      />

      <Summary settlements={settlements} />

      <div className="pt-2">
        <Button onClick={copyLink} variant="outline" className="w-full flex items-center justify-center gap-2">
            <LinkIcon className="h-6 w-6"/>
            {copied ? 'คัดลอกลิงก์แล้ว!' : 'แชร์บิลให้เพื่อน'}
        </Button>
      </div>

      <AddMemberModal 
        isOpen={isMemberModalOpen} 
        onClose={() => setMemberModalOpen(false)} 
        onAddMember={addMember} 
      />
      <EditMemberModal 
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSave={editMember}
        member={editingMember}
      />
      <AddExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => { setExpenseModalOpen(false); setEditingExpense(null); }} 
        onSaveExpense={saveExpense} 
        members={bill.members} 
        expenseToEdit={editingExpense}
      />
    </div>
  );
};

export default BillPage;