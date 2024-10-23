// src/app/app.component.ts
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<app-login></app-login><app-register></app-register>`,
  imports: [RegisterComponent, LoginComponent],
})
export class AppComponent {}
