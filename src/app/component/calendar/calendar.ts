import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/module/material';
import { getLunarDate, LunarDate } from '@dqcai/vn-lunar';
import { IDayInfo } from '../../shared/interface/day.interface';
import { IEvent } from '../../shared/interface/event.interface';

@Component({
  selector: 'app-calendar',
  imports: [
    MaterialModule
  ],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'],
})
export class Calendar implements OnInit {
  viewDate = new Date();
  days: IDayInfo[] = [];
  readonly weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  private readonly solarEvents: IEvent[] = [
    { title: 'Tết Dương Lịch', day: 1, month: 1 },
    { title: 'Valentine', day: 14, month: 2 },
    { title: 'Valentine', day: 14, month: 2 },
    { title: 'Quốc tế Phụ nữ', day: 8, month: 3 },
    { title: 'Ngày Giải phóng miền Nam', day: 30, month: 4 },
    { title: 'Ngày Quốc tế Lao Động', day: 1, month: 5 },
    { title: 'Ngày Quốc khánh', day: 2, month: 9 },
  ];

  private readonly lunarEvents: IEvent[] = [
    { title: 'Tết Nguyên Đán', day: 1, month: 1 },
    { title: 'Tết Nguyên Đán (H+1)', day: 2, month: 1 },
    { title: 'Tết Nguyên Đán (H+2)', day: 3, month: 1 },
    { title: 'Giỗ Tổ Hùng Vương', day: 10, month: 3 },
    { title: 'Tết Trung Thu', day: 15, month: 8 },
  ];

  private lunarCache = new Map<string, { day: number; month: number; isLeap: boolean }>();

  ngOnInit() {
    this.renderCalendar();
  }

  private normalizeLunarRaw(raw: LunarDate | null) {
    if (!raw) return { day: 0, month: 0, isLeap: false };
    const day = raw.day ?? raw.day ?? (Array.isArray(raw) ? raw[0] : undefined);
    const month = raw.month ?? raw.month ?? (Array.isArray(raw) ? raw[1] : undefined);
    const isLeap = raw.leap ?? raw.leap ?? false;
    const dayNum = typeof day === 'string' ? parseInt(day, 10) : Number(day ?? 0);
    const monthNum = typeof month === 'string' ? parseInt(month, 10) : Number(month ?? 0);
    return { day: Number.isFinite(dayNum) ? dayNum : 0, month: Number.isFinite(monthNum) ? monthNum : 0, isLeap: !!isLeap };
  }

  private getLunarFor(date: Date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const key = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cached = this.lunarCache.get(key);
    if (cached) return cached;

    let raw: LunarDate | null = null;
    try {
      // use the documented API: getLunarDate(day, month, year)
      raw = getLunarDate(d, m, y);
    } catch (e) {
      console.warn('vn-lunar: getLunarDate failed', e);
      raw = null;
    }

    const normalized = this.normalizeLunarRaw(raw);
    this.lunarCache.set(key, normalized);
    return normalized;
  }

  private renderCalendar() {
    this.days = [];
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Tính toán ngày trống (offset) — bắt đầu từ thứ Hai
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
      const dayNum = prevLastDay - startOffset + i + 1;
      const d = new Date(prevYear, prevMonth, dayNum);
      const lunar = this.getLunarFor(d);
      const weekday = d.getDay();
      const isWeekend = weekday === 0;
      
      this.days.push({
        date: d,
        solarDay: dayNum,
        solarMonth: prevMonth + 1,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        isOffset: true,
        isLeap: lunar.isLeap,
        isToday: d.toDateString() === new Date().toDateString(),
        isWeekend,
        events: []
      });
    }

    // Tạo danh sách ngày
    for (let i = 1; i <= lastDay; i++) {
      const d = new Date(year, month, i);
      const lunar = this.getLunarFor(d);
      const weekday = d.getDay(); // 0 = CN
      const isWeekend = weekday === 0;

      const events: string[] = [];
      this.solarEvents.forEach(event => {
        if (event.day === i && event.month === month + 1) {
          events.push(event.title);
        }
      });
      this.days.push({
        date: d,
        solarDay: i,
        solarMonth: month + 1,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        isLeap: lunar.isLeap,
        isToday: d.toDateString() === new Date().toDateString(),
        isWeekend,
        events
      });
    }
    console.log(this.days);

    // Sau khi đã push hết các ngày trong tháng hiện tại
    const totalCells = this.days.length;
    const endOffset = (7 - (totalCells % 7)) % 7;

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= endOffset; i++) {
      const d = new Date(nextYear, nextMonth, i);
      const lunar = this.getLunarFor(d);
      const weekday = d.getDay();
      const isWeekend = weekday === 0;
      this.days.push({
        date: d,
        solarDay: i,
        solarMonth: nextMonth + 1,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        isOffset: true,
        isLeap: lunar.isLeap,
        isToday: d.toDateString() === new Date().toDateString(),
        isWeekend,
        events: []
      });
    }
  }

  nav(offset: number) {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + offset, 1);
    this.renderCalendar();
  }

  gotoCurrentMonth() {
    this.viewDate = new Date();
    this.renderCalendar();
  }
}