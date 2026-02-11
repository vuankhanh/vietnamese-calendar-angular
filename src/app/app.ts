import { Component, signal } from '@angular/core';
import { MaterialModule } from './shared/module/material';
import { Calendar } from './component/calendar/calendar';
import { Rule } from './component/rule/rule';

@Component({
  selector: 'app-root',
  imports: [
    Calendar,
    Rule,

    MaterialModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly tabSelectedIndex = signal(0);
  onSelectedIndexChange(index: number){
    this.tabSelectedIndex.set(index);
  }
}
