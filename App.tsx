
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, UserPlus, Sun, Moon } from 'lucide-react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db, SLOTS_COLLECTION } from './firebase';
import { getDaysForMonth, getMonthName, getSlotId } from './utils/dateHelpers';
import SlotInput from './components/SlotInput';
import { ShiftType, WeekDay } from './types';

const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [year] = useState(2026);
  const [volunteerData, setVolunteerData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, SLOTS_COLLECTION), (snapshot) => {
      const data: Record<string, string> = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data().volunteerName || '';
      });
      setVolunteerData(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore listener error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const days = useMemo(() => getDaysForMonth(year, currentMonth), [year, currentMonth]);

  const nextMonth = () => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  const prevMonth = () => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-24">
      {/* Header Estilo Novo Imagem */}
      <header className="bg-[#4a36d1] text-white px-4 py-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Lado Esquerdo: Branding */}
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 opacity-90" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold leading-tight">Escala de Voluntários 2026</h1>
              <p className="text-sm italic opacity-80">Domingos e Quartas</p>
            </div>
          </div>

          {/* Lado Direito: Controles */}
          <div className="flex items-center gap-4">
            {/* Navegação de Mês */}
            <div className="flex items-center bg-white rounded-xl overflow-hidden px-2 py-1 border border-white/10 shadow-lg">
              <button 
                onClick={prevMonth} 
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                aria-label="Mês Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xl font-black px-4 min-w-[180px] text-center text-black">
                {getMonthName(currentMonth)} {year}
              </span>
              <button 
                onClick={nextMonth} 
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                aria-label="Próximo Mês"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Botão Pessoas */}
            <button className="bg-white text-[#4a36d1] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-50 transition-all active:scale-95">
              <UserPlus className="w-5 h-5" />
              Pessoas
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day, idx) => {
              const isSunday = day.dayOfWeek === WeekDay.SUNDAY;
              const headerBg = isSunday ? "bg-[#FFF9F2]" : "bg-[#F5F7FF]";
              const accentColor = isSunday ? "text-orange-600" : "text-[#4a36d1]";
              const dayName = day.date.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0].toUpperCase();

              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                  {/* Cabeçalho do Card */}
                  <div className={`px-6 py-4 flex items-center gap-4 ${headerBg}`}>
                    <span className={`text-3xl font-black ${accentColor}`}>
                      {day.date.getDate()}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] font-bold text-slate-400 tracking-widest">
                        {dayName}
                      </span>
                      <span className="text-base font-bold text-black uppercase">
                        {getMonthName(currentMonth)}
                      </span>
                    </div>
                  </div>

                  {/* Turnos */}
                  <div className="p-6 space-y-8">
                    {day.shifts.map((shift, sIdx) => {
                      const isMorning = shift.type === ShiftType.MORNING;
                      const shiftIcon = isMorning ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;
                      const shiftColor = isMorning ? "text-orange-600" : "text-[#4a36d1]";

                      return (
                        <div key={sIdx} className="space-y-4">
                          <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider ${shiftColor}`}>
                            {shiftIcon}
                            PERÍODO {shift.type}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: shift.slots }).map((_, i) => {
                              const slotId = getSlotId(day.date, shift.type, i);
                              return (
                                <SlotInput 
                                  key={slotId}
                                  slotId={slotId}
                                  initialValue={volunteerData[slotId] || ''}
                                  dateStr={day.date.toISOString().split('T')[0]}
                                  shift={shift.type}
                                  slotIndex={i}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {days.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Nenhuma escala definida para este mês.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
