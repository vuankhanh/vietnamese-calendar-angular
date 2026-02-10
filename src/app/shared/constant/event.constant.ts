import { IEvent } from "../interface/event.interface";

export const SOLAR_EVENTS: IEvent[] = [
  { title: 'Tết Dương Lịch', day: 1, month: 1, isLunar: false, isNoticeable: false, description:' asdasdsadas' },
  { title: 'Valentine', day: 14, month: 2, isLunar: false, isNoticeable: false },
  { title: 'Quốc tế Phụ nữ', day: 8, month: 3, isLunar: false, isNoticeable: false },
  { title: 'Ngày Giải phóng miền Nam', day: 30, month: 4, isLunar: false, isNoticeable: false },
  { title: 'Ngày Quốc tế Lao Động', day: 1, month: 5, isLunar: false, isNoticeable: false },
  { title: 'Ngày Quốc khánh', day: 2, month: 9, isLunar: false, isNoticeable: false },
];

export const LUNAR_EVENTS: IEvent[] = [
  { title: 'Tết Nguyên Đán', day: 1, month: 1, isLunar: true, isNoticeable: false },
  { title: 'Tết Nguyên Đán (H+1)', day: 2, month: 1, isLunar: true, isNoticeable: false },
  { title: 'Tết Nguyên Đán (H+2)', day: 3, month: 1, isLunar: true, isNoticeable: false },
  { title: 'Giỗ Tổ Hùng Vương', day: 10, month: 3, isLunar: true, isNoticeable: false },
  { title: 'Tết Trung Thu', day: 15, month: 8, isLunar: true, isNoticeable: false },
];