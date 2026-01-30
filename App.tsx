
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, UserPlus, Sun, Moon, Calendar } from 'lucide-react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db, SLOTS_COLLECTION, VOLUNTEERS_COLLECTION } from './firebase';
import { getDaysForMonth, getMonthName, getSlotId } from './utils/dateHelpers';
import SlotInput from './components/SlotInput';
import VolunteerModal from './components/VolunteerModal';
import { ShiftType, WeekDay } from './types';

interface Volunteer {
  id: string;
  name: string;
}

const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [year] = useState(2026);
  const [volunteerSlots, setVolunteerSlots] = useState<Record<string, string>>({});
  const [volunteersList, setVolunteersList] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!db) return;

    // Listener para os slots da escala
    const unsubSlots = onSnapshot(collection(db, SLOTS_COLLECTION), (snapshot) => {
      const data: Record<string, string> = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data().volunteerName || '';
      });
      setVolunteerSlots(data);
      setLoading(false);
    });

    // Listener para a lista de pessoas cadastradas
    const unsubVolunteers = onSnapshot(collection(db, VOLUNTEERS_COLLECTION), (snapshot) => {
      const list: Volunteer[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, name: doc.data().name });
      });
      setVolunteersList(list);
    });

    return () => {
      unsubSlots();
      unsubVolunteers();
    };
  }, []);

  const days = useMemo(() => getDaysForMonth(year, currentMonth), [year, currentMonth]);

  const nextMonth = () => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  const prevMonth = () => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-24">
      <header className="bg-[#4a36d1] text-white px-4 py-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 opacity-90" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold leading-tight tracking-tight">Escala de Voluntários 2026</h1>
              <p className="text-sm italic opacity-80">Gestão de Equipes e Turnos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[#4a36d1] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap"
            >
              <UserPlus className="w-5 h-5" />
              Pessoas
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">Sincronizando com banco de dados...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day, idx) => {
              const isSunday = day.dayOfWeek === WeekDay.SUNDAY;
              const headerBg = isSunday ? "bg-[#FFF9F2]" : "bg-[#F5F7FF]";
              const accentColor = isSunday ? "text-orange-600" : "text-[#4a36d1]";
              
              const weekdayName = day.date.toLocaleDateString('pt-BR', { weekday: 'long' });
              const capitalizedWeekday = weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1).split('-')[0];
              const formattedDate = day.date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });

              return (
                <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <div className={`px-6 py-5 flex items-center justify-between ${headerBg} border-b border-slate-100/50`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSunday ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-[#4a36d1]'}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h2 className={`text-lg md:text-xl font-extrabold tracking-tight ${accentColor}`}>
                        {capitalizedWeekday} - {formattedDate}
                      </h2>
                    </div>
                    <div className="hidden sm:block">
                      <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${isSunday ? 'border-orange-200 text-orange-600 bg-orange-50' : 'border-indigo-200 text-[#4a36d1] bg-indigo-50'}`}>
                        {isSunday ? 'Culto de Domingo' : 'Culto de Quarta'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-10">
                    {day.shifts.map((shift, sIdx) => {
                      const isMorning = shift.type === ShiftType.MORNING;
                      const shiftIcon = isMorning ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;
                      const shiftColor = isMorning ? "text-orange-600" : "text-[#4a36d1]";

                      return (
                        <div key={sIdx} className="space-y-5">
                          <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] ${shiftColor}`}>
                            {shiftIcon}
                            TURNO {shift.type}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: shift.slots }).map((_, i) => {
                              const slotId = getSlotId(day.date, shift.type, i);
                              return (
                                <SlotInput 
                                  key={slotId}
                                  slotId={slotId}
                                  initialValue={volunteerSlots[slotId] || ''}
                                  dateStr={day.date.toISOString().split('T')[0]}
                                  shift={shift.type}
                                  slotIndex={i}
                                  availableVolunteers={volunteersList}
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
              <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-semibold">Nenhuma escala definida para este mês.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <VolunteerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        volunteers={volunteersList}
      />
    </div>
  );
};

export default App;
