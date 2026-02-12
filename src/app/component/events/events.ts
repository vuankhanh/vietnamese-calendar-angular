import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChange, SimpleChanges, ViewChildren } from '@angular/core';
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
export class Events implements OnChanges, OnInit, AfterViewInit {
  @Input() tabGroupIndex: number = 0;
  @Input() events: IEvent[] = [];

  @Output() eventSelected = new EventEmitter<IEventWithDate>();

  @ViewChildren('eventItem', { read: ElementRef }) eventItems?: QueryList<ElementRef>;

  eventsWithDate: IEventWithDate[] = [];
  private fisrtNotPassedEventIndex: ElementRef<any> | undefined;

  ngOnChanges(simpleChanges: SimpleChanges) {
    const tabGroupIndexChange: SimpleChange | undefined = simpleChanges['tabGroupIndex'];
    const tabGroupIndexCurrentValue: number = tabGroupIndexChange?.currentValue;
    const tabGroupIndexPreviousValue: number = tabGroupIndexChange?.previousValue;
    
    if (tabGroupIndexPreviousValue != undefined && tabGroupIndexCurrentValue === 0 && tabGroupIndexPreviousValue !== tabGroupIndexCurrentValue) {
      setTimeout(() => {
        if (this.fisrtNotPassedEventIndex) {
          this.fisrtNotPassedEventIndex.nativeElement.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }, 150);
    }

  }

  ngOnInit(): void {
    this.mapEventsToWithDate();
  }

  ngAfterViewInit(): void {
    //Lấy ra vị trí của event có isPassed = false đầu tiên
    const firstNotPassedEvent = this.eventsWithDate.findIndex(event => !event.isPassed);
    this.fisrtNotPassedEventIndex = this.eventItems?.toArray()[firstNotPassedEvent];
    if (this.fisrtNotPassedEventIndex) {
      this.fisrtNotPassedEventIndex.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private mapEventsToWithDate() {
    this.eventsWithDate = this.events.map(event => {
      const newDate = new Date();
      const currentYear = newDate.getFullYear();

      let lunarDay: number, lunarMonth: number, solarDay: number, solarMonth: number, date: Date, isPassed: boolean;
      if (event.isLunar) {
        lunarDay = event.day;
        lunarMonth = event.month;
        const solarDate = getSolarDate(lunarDay, lunarMonth, currentYear+(event.offsetYear ?? 0));
        solarDay = solarDate.day;
        solarMonth = solarDate.month;
        date = new Date(currentYear, solarMonth - 1, solarDay);
        isPassed = date.getTime() < newDate.getTime();
      } else {
        solarDay = event.day;
        solarMonth = event.month;
        const lunarDate = getLunarDate(solarDay, solarMonth, currentYear+(event.offsetYear ?? 0));
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

  goToEventCalendar(event: IEventWithDate) {
    this.eventSelected.emit(event);
  }
}
