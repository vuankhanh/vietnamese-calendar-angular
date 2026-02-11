export interface IEvent {
  title: string;
  day: number;
  month: number;
  description?: string;
  isLunar: boolean;
  isNoticeable: boolean;
  offsetYear?: number;
}

export interface IEventWithDate extends IEvent {
  date: Date;
  lunarDay: number;
  lunarMonth: number;
  solarDay: number;
  solarMonth: number;
  isPassed: boolean;
}