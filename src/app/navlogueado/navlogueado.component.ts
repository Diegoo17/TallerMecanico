import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navlogueado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navlogueado.component.html',
  styleUrls: ['./navlogueado.component.css']
})
export class NavlogueadoComponent {
  constructor(private router: Router) {}

  cerrarSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/home']);
      window.location.reload();
    }
  }
}
