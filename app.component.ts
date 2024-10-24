// src/app/app.component.ts
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login/login.component';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogoComponent } from './catalog/catalog/catalog.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: `./app.component.html`,
  imports: [RouterOutlet, LoginComponent, RegisterComponent, HomeComponent, CatalogoComponent],
})
export class AppComponent {}
