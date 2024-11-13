import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavsinlogueoComponent } from '../navsinlogueo/navsinlogueo.component';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navegador',
  standalone: true,
  imports: [CommonModule, NavsinlogueoComponent, NavlogueadoComponent],
  templateUrl: './navegador.component.html',
  styleUrl: './navegador.component.css'
})
export class NavegadorComponent implements OnInit, OnDestroy {
  estaLogueado: boolean = false;
  private suscripcionRutas: Subscription;

  constructor(private router: Router) {
    // Verificar estado inicial
    this.verificarEstadoLogin();

    // Suscribirse a los cambios de ruta
    this.suscripcionRutas = this.router.events.pipe(
      filter(evento => evento instanceof NavigationEnd)
    ).subscribe(() => {
      this.verificarEstadoLogin();
    });
  }

  ngOnInit() {
    // Escuchar cambios en localStorage
    window.addEventListener('storage', this.manejarCambiosStorage);
  }

  ngOnDestroy() {
    // Limpiar suscripciones
    if (this.suscripcionRutas) {
      this.suscripcionRutas.unsubscribe();
    }
    window.removeEventListener('storage', this.manejarCambiosStorage);
  }

  private manejarCambiosStorage = (evento: StorageEvent) => {
    if (evento.key === 'currentUser') {
      this.verificarEstadoLogin();
    }
  }

  private verificarEstadoLogin() {
    const usuarioStr = localStorage.getItem('currentUser');
    this.estaLogueado = !!usuarioStr;
  }
}
