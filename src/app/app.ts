import { Component, inject, signal, ViewChild } from '@angular/core';
import { MaterialModule } from './shared/module/material';
import { Calendar } from './component/calendar/calendar';
import { Rule } from './component/rule/rule';
import { Album } from './component/album/album';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { filter, map, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    Calendar,
    Rule,
    Album,

    MaterialModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly tabSelectedIndex = signal(0);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      take(1),
      map(() => {
        const currentUrl = this.router.url;
        if (currentUrl.includes('calendar')) {
          return 0;
        } else if (currentUrl.includes('rule')) {
          return 1;
        } else if (currentUrl.includes('album')) {
          return 2;
        } else {
          return 0;
        }
      })
    ).subscribe((tabIndex) => {
      this.tabSelectedIndex.set(tabIndex);
    });
  }

  onSelectedIndexChange(index: number) {
    if (index === 0 && !this.router.url.includes('calendar')) {
      this.router.navigate(['/calendar']);
    } else if (index === 1 && !this.router.url.includes('rule')) {
      this.router.navigate(['/rule']);
    } else if (index === 2 && !this.router.url.includes('album')) {
      this.router.navigate(['/album']);
    }
    this.tabSelectedIndex.set(index);
  }
}
