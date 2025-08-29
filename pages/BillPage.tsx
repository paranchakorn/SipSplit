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
import { PlusCircleIcon, UserPlusIcon, LinkIcon } from '@heroicons/react/24/outline';

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
          
          // Migration for members without colors
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
        alert("ไม่สามารถลบสมาชิกได้ เนื่องจากมีส่วนร่วมในค่าใช้จ่ายอย่างน้อยหนึ่งรายการ กรุณาแก้ไขรายการค่าใช้จ่ายเพื่อนำสมาชิกคนนี้ออกก่อน");
        return;
      }
  
      if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกคนนี้?")) {
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
    if (bill && window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบค่าใช้จ่ายนี้?")) {
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

  if (!bill) {
    return <div className="text-center p-10">กำลังโหลดข้อมูลบิล...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary truncate">{bill.title}</h1>
        <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={copyLink} variant="outline" className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <LinkIcon className="h-5 w-5"/>
                {copied ? 'คัดลอกลิงก์แล้ว!' : 'แชร์บิล'}
            </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Summary settlements={settlements} />
          <ExpenseList 
            expenses={bill.expenses} 
            members={bill.members} 
            onEdit={(expense) => { setEditingExpense(expense); setExpenseModalOpen(true); }}
            onDelete={deleteExpense}
          />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => { setEditingExpense(null); setExpenseModalOpen(true); }} 
              className="flex-1 flex items-center justify-center gap-2"
            >
                <PlusCircleIcon className="h-5 w-5" /> เพิ่มค่าใช้จ่าย
            </Button>
            <Button onClick={() => setMemberModalOpen(true)} variant="secondary" className="flex-1 flex items-center justify-center gap-2">
                <UserPlusIcon className="h-5 w-5" /> เพิ่มสมาชิก
            </Button>
          </div>
          <MemberList 
            members={bill.members} 
            onEdit={setEditingMember}
            onDelete={deleteMember}
          />
        </div>
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