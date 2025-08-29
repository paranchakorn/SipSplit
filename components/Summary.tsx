import React from 'react';
import { Settlement } from '../types';
import Card from './ui/Card';
import MemberChip from './ui/MemberChip';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface SummaryProps {
  settlements: Settlement[];
}

const Summary: React.FC<SummaryProps> = ({ settlements }) => {
  return (
    <Card>
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">สรุปว่าใครต้องจ่ายใคร?</h2>
        {settlements.length > 0 ? (
          <ul className="space-y-3">
            {settlements.map((settlement, index) => (
              <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-surface rounded-lg gap-2">
                <div className="flex items-center gap-2 font-medium text-base flex-wrap">
                  <MemberChip member={settlement.from} />
                  <ArrowRightIcon className="h-5 w-5 text-text-secondary flex-shrink-0" />
                  <MemberChip member={settlement.to} />
                </div>
                <div className="font-bold text-lg text-primary self-end sm:self-center whitespace-nowrap">
                  {settlement.amount.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary">เพิ่มสมาชิก แล้วเพิ่มค่าใช้จ่าย เพื่อดูสรุป</p>
        )}
      </div>
    </Card>
  );
};

export default Summary;
