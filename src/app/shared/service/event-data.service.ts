import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvent } from '../interface/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventDataService {
  private readonly lunarEvent = './data/lunar-event.json';
  private readonly solarEvent = './data/solar-event.json';

  private readonly httpClient: HttpClient = inject(HttpClient);

  getLunarEvents(): Observable<IEvent[]> {
    return this.httpClient.get<IEvent[]>(this.lunarEvent);
  }

  getSolarEvents(): Observable<IEvent[]> {
    return this.httpClient.get<IEvent[]>(this.solarEvent);
  }
}
