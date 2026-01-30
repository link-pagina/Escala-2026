
import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Loader2, AlertCircle, User, ChevronDown } from 'lucide-react';
import { saveSlot } from '../firebase';
import { ShiftType } from '../types';

interface Volunteer {
  id: string;
  name: string;
}

interface SlotInputProps {
  slotId: string;
  initialValue: string;
  dateStr: string;
  shift: ShiftType;
  slotIndex: number;
  availableVolunteers: Volunteer[];
}

const SlotInput: React.FC<SlotInputProps> = ({ slotId, initialValue, dateStr, shift, slotIndex, availableVolunteers }) => {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = useCallback(async (selectedName: string) => {
    if (selectedName === initialValue) return;
    
    setStatus('saving');
    try {
      await saveSlot(slotId, {
        volunteerName: selectedName,
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
  }, [initialValue, slotId, dateStr, shift, slotIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    handleSave(newValue);
  };

  return (
    <div className="relative flex items-center w-full group">
      <div className="absolute left-3 text-slate-400 z-10">
        <User className="w-4 h-4" />
      </div>
      
      <select
        value={value}
        onChange={handleChange}
        className={`w-full pl-9 pr-10 py-3 text-sm appearance-none border rounded-xl transition-all duration-200 outline-none cursor-pointer
          ${status === 'error' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}
          ${status === 'success' ? 'border-green-500 bg-green-50' : ''}
          ${!value ? 'text-slate-400 italic' : 'text-slate-900 font-medium'}
        `}
      >
        <option value="">Selecione um voluntário...</option>
        {availableVolunteers
          .sort((a,b) => a.name.localeCompare(b.name))
          .map((v) => (
            <option key={v.id} value={v.name}>
              {v.name}
            </option>
          ))}
      </select>

      <div className="absolute right-3 flex items-center gap-2 pointer-events-none">
        {status === 'saving' && (
          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
        {status === 'idle' && (
          <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
        )}
      </div>
    </div>
  );
};

export default SlotInput;
