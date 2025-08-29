import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bill } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const HomePage: React.FC = () => {
  const [billTitle, setBillTitle] = useState<string>('');
  const navigate = useNavigate();

  const handleCreateBill = () => {
    if (billTitle.trim()) {
      const billId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const newBill: Bill = {
        id: billId,
        title: billTitle.trim(),
        members: [],
        expenses: [],
      };
      try {
        localStorage.setItem(`bill-${billId}`, JSON.stringify(newBill));
        navigate(`/bill/${billId}`);
      } catch (error) {
        console.error("Failed to save bill data to local storage:", error);
        alert("ไม่สามารถสร้างบิลได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full">
            <div className="p-6 sm:p-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">Sip & Split</h1>
                <p className="text-base sm:text-lg text-text-secondary mb-8">สร้างบิลและหารค่าใช้จ่ายแบบไม่เท่าเทียมได้ง่ายๆ ใช้ฟรี ไม่เก็บข้อมูล เพราะทำไม่เป็น</p>
                <div className="space-y-4">
                    <Input 
                        type="text"
                        placeholder="ตั้งชื่อบิลให้หน่อย"
                        value={billTitle}
                        onChange={(e) => setBillTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateBill()}
                        aria-label="ชื่อบิล"
                    />
                    <Button onClick={handleCreateBill} disabled={!billTitle.trim()} className="w-full">
                        สร้างบิลใหม่
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default HomePage;