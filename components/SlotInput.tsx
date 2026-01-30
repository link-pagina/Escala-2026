
import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Loader2, AlertCircle, User } from 'lucide-react';
import { saveSlot } from '../firebase';
import { ShiftType } from '../types';

interface SlotInputProps {
  slotId: string;
  initialValue: string;
  dateStr: string;
  shift: ShiftType;
  slotIndex: number;
}

const SlotInput: React.FC<SlotInputProps> = ({ slotId, initialValue, dateStr, shift, slotIndex }) => {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = useCallback(async () => {
    if (value === initialValue && status !== 'error') return;
    
    setStatus('saving');
    try {
      await saveSlot(slotId, {
        volunteerName: value,
        date: dateStr,
        shift: shift,
        slotIndex: slotIndex
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error("Error saving slot:", error);
      setStatus('error');
    }
  }, [value, initialValue, slotId, dateStr, shift, slotIndex, status]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3 text-slate-300">
        <User className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={onKeyDown}
        placeholder={`Pessoa ${slotIndex + 1}`}
        className={`w-full pl-9 pr-10 py-3 text-sm border rounded-xl transition-all duration-200 outline-none
          ${status === 'error' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}
          ${status === 'success' ? 'border-green-500 bg-green-50' : ''}
        `}
      />
      <div className="absolute right-3">
        {status === 'saving' && (
          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
    </div>
  );
};

export default SlotInput;
