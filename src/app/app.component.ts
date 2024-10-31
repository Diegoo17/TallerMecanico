// src/app/app.component.ts
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login/login.component';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { CatalogComponent } from './catalog/catalog.component';
import { NavsinlogueoComponent } from './navsinlogueo/navsinlogueo.component';
import { NavlogueadoComponent } from './navlogueado/navlogueado.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: `./app.component.html`,
  imports: [RouterOutlet, LoginComponent, RegisterComponent, HomeComponent, CommonModule, MapComponent, CatalogComponent, NavsinlogueoComponent,NavlogueadoComponent],
})
export class AppComponent {}
