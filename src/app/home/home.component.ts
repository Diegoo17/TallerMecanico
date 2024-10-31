import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { NavsinlogueoComponent } from '../navsinlogueo/navsinlogueo.component';
import { NavlogueadoComponent } from "../navlogueado/navlogueado.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavsinlogueoComponent, MapComponent, NavlogueadoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {


}
