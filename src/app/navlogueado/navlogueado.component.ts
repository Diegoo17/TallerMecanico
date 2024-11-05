import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navlogueado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navlogueado.component.html',
  styleUrl: './navlogueado.component.css'
})
export class NavlogueadoComponent {
  constructor(private router: Router) {}

  cerrarSesion() {
    localStorage.removeItem('currentUser'); // o localStorage.clear() si quieres limpiar todo
    this.router.navigate(['/home']);
  }
}