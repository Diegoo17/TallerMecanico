import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navlogueado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navlogueado.component.html',
  styleUrls: ['./navlogueado.component.css']
})
export class NavlogueadoComponent implements OnInit {
  isMecanico: boolean = false;
  private router = inject(Router);
  private authS = inject(AuthService);

  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.isMecanico = user.id === 'mec';
    }
  }

  navegarACatalogo() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id === 'mec') {
        this.router.navigate(['/catalog']);
      } else {
        this.router.navigate(['/catalogview']);
      }
    }
  }

  cerrarSesion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de cerrar sesión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authS.logout();
        
        this.router.navigate(['/home']).then(() => {
          window.location.href = '/home';
        });
      }
    });
  }
}
