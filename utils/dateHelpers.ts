
import { DaySchedule, ShiftType, WeekDay } from '../types';

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[monthIndex];
};

export const getDaysForMonth = (year: number, month: number): DaySchedule[] => {
  const days: DaySchedule[] = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    const dayOfWeek = date.getDay();

    if (dayOfWeek === WeekDay.SUNDAY) {
      days.push({
        date: new Date(date),
        dayOfWeek,
        shifts: [
          { type: ShiftType.MORNING, slots: 2 },
          { type: ShiftType.NIGHT, slots: 2 }
        ]
      });
    } else if (dayOfWeek === WeekDay.WEDNESDAY) {
      days.push({
        date: new Date(date),
        dayOfWeek,
        shifts: [
          { type: ShiftType.NIGHT, slots: 2 }
        ]
      });
    }

    date.setDate(date.getDate() + 1);
  }

  return days;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export const formatDayName = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { weekday: 'long' });
};

export const getSlotId = (date: Date, shift: ShiftType, index: number): string => {
  const dateStr = date.toISOString().split('T')[0];
  return `${dateStr}-${shift === ShiftType.MORNING ? 'morning' : 'night'}-${index}`;
};
