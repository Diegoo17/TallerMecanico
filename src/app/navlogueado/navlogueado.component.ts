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

  navegarACatalogo() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Si el ID es 'mec', es el mecánico
      if (user.id === 'mec') {
        this.router.navigate(['/catalog']);
      } else {
        this.router.navigate(['/catalogview']);
      }
    }
  }

  cerrarSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/home']);
      window.location.reload();
    }
  }
}
