
import { Member, Expense, Balance, Settlement } from '../types';

export const calculateBalances = (members: Member[], expenses: Expense[]): Balance[] => {
  const balances = new Map<string, number>();

  members.forEach(member => balances.set(member.id, 0));

  expenses.forEach(expense => {
    const amountPaid = expense.amount;
    const payerId = expense.paidById;
    const participants = expense.participants;
    
    // Payer gets credit
    balances.set(payerId, (balances.get(payerId) || 0) + amountPaid);

    // Participants owe their share
    if (participants.length > 0) {
      const share = amountPaid / participants.length;
      participants.forEach(participantId => {
        balances.set(participantId, (balances.get(participantId) || 0) - share);
      });
    }
  });

  return members.map(member => ({
    member,
    amount: balances.get(member.id) || 0,
  }));
};

export const calculateSettlements = (members: Member[], expenses: Expense[]): Settlement[] => {
  const balances = calculateBalances(members, expenses);
  
  const debtors = balances.filter(b => b.amount < 0).sort((a, b) => a.amount - b.amount);
  const creditors = balances.filter(b => b.amount > 0).sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    const amountToSettle = Math.min(-debtor.amount, creditor.amount);

    if (amountToSettle > 0.01) { // Avoid floating point inaccuracies
        settlements.push({
            from: debtor.member,
            to: creditor.member,
            amount: amountToSettle,
        });
    }

    debtor.amount += amountToSettle;
    creditor.amount -= amountToSettle;

    if (Math.abs(debtor.amount) < 0.01) {
      debtorIndex++;
    }
    if (Math.abs(creditor.amount) < 0.01) {
      creditorIndex++;
    }
  }

  return settlements;
};
