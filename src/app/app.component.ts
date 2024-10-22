// src/app/app.component.ts
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<app-register></app-register>`,
  imports: [RegisterComponent], 
})
export class AppComponent {}
