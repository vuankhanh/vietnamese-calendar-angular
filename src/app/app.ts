import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/module/material';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MaterialModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vietnamese-calendar-angular');
}
