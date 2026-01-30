
export enum ShiftType {
  MORNING = 'Manhã',
  NIGHT = 'Noite'
}

export enum WeekDay {
  SUNDAY = 0,
  WEDNESDAY = 3
}

export interface VolunteerSlot {
  id: string; // YYYY-MM-DD-SHIFT-INDEX
  date: string;
  shift: ShiftType;
  slotIndex: number;
  volunteerName: string;
}

export interface DaySchedule {
  date: Date;
  dayOfWeek: number;
  shifts: {
    type: ShiftType;
    slots: number;
  }[];
}
