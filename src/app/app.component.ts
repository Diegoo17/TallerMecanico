// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavegadorComponent } from './navegador/navegador.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: `./app.component.html`,
  imports: [RouterOutlet, NavegadorComponent],
})
export class AppComponent {}
