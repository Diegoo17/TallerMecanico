import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavsinlogueoComponent } from '../navsinlogueo/navsinlogueo.component';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-navegador',
  standalone: true,
  imports: [CommonModule, NavsinlogueoComponent, NavlogueadoComponent],
  templateUrl: './navegador.component.html',
  styleUrl: './navegador.component.css'
})
export class NavegadorComponent implements OnInit, OnDestroy {
  estaLogueado: boolean = false;
  private suscripcionRutas!: Subscription;
  private suscripcionNavegacion!: Subscription;

  private authS=inject(AuthService);
  private router=inject( Router);

  ngOnInit() {
    this.suscripcionRutas = this.authS.isLoggedIn$.subscribe(
      (estado) => (this.estaLogueado = estado)
    );
    this.suscripcionNavegacion = this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.verificarEstadoLogin();
      });
  }

  ngOnDestroy() {
    if (this.suscripcionRutas) {
      this.suscripcionRutas.unsubscribe();
    }
    if (this.suscripcionNavegacion) {
      this.suscripcionNavegacion.unsubscribe();
    }
  }


  private verificarEstadoLogin() {
    this.estaLogueado = this.authS.isLoggedIn();
  }

}

