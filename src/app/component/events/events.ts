import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { IEvent, IEventWithDate } from '../../shared/interface/event.interface';
import { MaterialModule } from '../../shared/module/material';
import { ZeroPrefixPipe } from '../../shared/pipe/zero-prefix-pipe';
import { getLunarDate, getSolarDate } from '@dqcai/vn-lunar';

@Component({
  selector: 'app-events',
  imports: [
    MaterialModule,

    ZeroPrefixPipe
  ],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  @Input() events: IEvent[] = [];

  eventsWithDate: IEventWithDate[] = [];
  ngOnInit(): void {
    this.mapEventsToWithDate();
  }

  private mapEventsToWithDate() {
    this.eventsWithDate = this.events.map(event => {
      const newDate = new Date();
      const currentYear = newDate.getFullYear();

      let lunarDay: number, lunarMonth: number, solarDay: number, solarMonth: number, date: Date, isPassed: boolean;
      if(event.isLunar) {
        lunarDay = event.day;
        lunarMonth = event.month;
        const solarDate = getSolarDate(lunarDay, lunarMonth, currentYear);
        solarDay = solarDate.day;
        solarMonth = solarDate.month;
        date = new Date(currentYear, solarMonth - 1, solarDay);
        isPassed = date.getTime() < newDate.getTime();
      } else {
        solarDay = event.day;
        solarMonth = event.month;
        const lunarDate = getLunarDate(solarDay, solarMonth, currentYear);
        lunarDay = lunarDate.day;
        lunarMonth = lunarDate.month;
        date = new Date(currentYear, solarMonth - 1, solarDay);
        isPassed = date.getTime() < newDate.getTime();
      }

      return {
        ...event,
        date,
        lunarDay,
        lunarMonth,
        solarDay,
        solarMonth,
        isPassed
      };
    });

    this.eventsWithDate = this.eventsWithDate.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
