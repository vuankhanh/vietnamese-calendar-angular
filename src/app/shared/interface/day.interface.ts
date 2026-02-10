export interface IDayInfo {
  date: Date | null;
  solarDay: number | string;
  solarMonth?: number;
  lunarDay: number;
  lunarMonth: number;
  isOffset?: boolean;
  isLeap: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: {title: string, isLunar: boolean}[];
}