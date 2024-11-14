import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../Service/turno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-mis-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [TurnoService],
  templateUrl: './listar-mis-turnos.component.html',
  styleUrls: ['./listar-mis-turnos.component.css']
})
export class ListarMisTurnosComponent implements OnInit {
  private turnoService = inject(TurnoService);
  private router = inject(Router);

  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  apiUrl: string = 'http://localhost:3000/turnosTotales';
  userId: string | null = '';
  fechaFiltro: string = '';
  ordenActual: 'reciente' | 'antiguo' = 'reciente';
  descripcionSeleccionada: string = '';
  mostrarModal: boolean = false;
  tipoFiltroFecha: 'dia' | 'mes' = 'dia';
  mesAnoFiltro: string = '';
  turnoSeleccionado: any = null;
  mostrarTurnosPasados: boolean = false;
  loading: boolean = true;
  isMecanico: boolean = false;

  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.id;
      this.isMecanico = user.id === 'mec';
      this.loadTurnos();
    } else {
      console.error('El usuario no está autenticado.');
    }
  }

  loadTurnos() {
    if (this.userId) {
      this.turnoService.getTurnosByUserId(this.userId).subscribe(
        (data) => {
          this.turnos = data;
          this.filtrarTurnosPasados();
          this.ordenarPorFechaReciente();
          this.loading = false;
        },
        (error) => {
          console.error('Error al cargar los turnos', error);
          this.loading = false;
        }
      );
    }
  }

  filtrarTurnosPasados() {
    if (!this.mostrarTurnosPasados) {
      this.turnosFiltrados = this.turnos.filter(turno => 
        !this.esTurnoPasado(turno.fecha, turno.hora)
      );
    } else {
      this.turnosFiltrados = [...this.turnos];
    }
    this.filtrarPorFecha();
  }

  toggleTurnosPasados() {
    this.mostrarTurnosPasados = !this.mostrarTurnosPasados;
    this.filtrarTurnosPasados();
  }

  filtrarPorFecha() {
    let turnosFiltradosTemp = this.mostrarTurnosPasados ? [...this.turnos] : 
      this.turnos.filter(turno => !this.esTurnoPasado(turno.fecha, turno.hora));

    if (this.tipoFiltroFecha === 'dia' && this.fechaFiltro) {
      turnosFiltradosTemp = turnosFiltradosTemp.filter(turno => turno.fecha === this.fechaFiltro);
    } else if (this.tipoFiltroFecha === 'mes' && this.mesAnoFiltro) {
      const [year, month] = this.mesAnoFiltro.split('-');
      turnosFiltradosTemp = turnosFiltradosTemp.filter(turno => {
        const [turnoYear, turnoMonth] = turno.fecha.split('-');
        return turnoYear === year && turnoMonth === month;
      });
    }

    this.turnosFiltrados = turnosFiltradosTemp;

    if (this.ordenActual === 'reciente') {
      this.ordenarPorFechaReciente();
    } else {
      this.ordenarPorFechaAntigua();
    }
  }

  esTurnoPasado(fecha: string, hora: string): boolean {
    const fechaTurno = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    return fechaTurno < ahora;
  }

  eliminarTurno(turno: any) {
    if (!this.isMecanico && this.esTurnoPasado(turno.fecha, turno.hora)) {
      alert('No se pueden eliminar turnos pasados');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este turno?')) {
      this.turnoService.eliminarTurno(turno.id).subscribe(
        () => {
          this.turnos = this.turnos.filter(t => t.id !== turno.id);
          this.filtrarPorFecha();
        },
        (error) => console.error('Error al eliminar el turno', error)
      );
    }
  }

  editarTurno(turno: any) {
    if (!this.isMecanico && this.esTurnoPasado(turno.fecha, turno.hora)) {
      alert('No se pueden editar turnos pasados');
      return;
    }
    this.router.navigate(['/modificar-turno', turno.id]);
  }

  ordenarPorFechaReciente() {
    this.turnosFiltrados.sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`);
      const fechaB = new Date(`${b.fecha}T${b.hora}`);
      return fechaB.getTime() - fechaA.getTime();
    });
    this.ordenActual = 'reciente';
  }

  ordenarPorFechaAntigua() {
    this.turnosFiltrados.sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`);
      const fechaB = new Date(`${b.fecha}T${b.hora}`);
      return fechaA.getTime() - fechaB.getTime();
    });
    this.ordenActual = 'antiguo';
  }

  limpiarFiltro() {
    this.fechaFiltro = '';
    this.mesAnoFiltro = '';
    this.turnosFiltrados = [...this.turnos];
    if (this.ordenActual === 'reciente') {
      this.ordenarPorFechaReciente();
    } else {
      this.ordenarPorFechaAntigua();
    }
  }

  verDescripcionCompleta(descripcion: string) {
    this.descripcionSeleccionada = descripcion;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  cambiarTipoFiltro(tipo: 'dia' | 'mes') {
    this.tipoFiltroFecha = tipo;
    this.fechaFiltro = '';
    this.mesAnoFiltro = '';
    this.filtrarPorFecha();
  }
  mostrarCard(turno: any) {
    this.turnoSeleccionado = turno; 
  }

  cerrarCard() {
    this.turnoSeleccionado = null; 
  }
}
