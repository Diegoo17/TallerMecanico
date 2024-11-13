import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../services/turno.service';

@Component({
  selector: 'app-listar-todos-los-turnos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [TurnoService],
  templateUrl: './listar-todos-los-turnos.component.html',
  styleUrls: ['./listar-todos-los-turnos.component.css']
})
export class ListarTodosLosTurnosComponent implements OnInit {
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  fechaFiltro: string = '';
  usuarioFiltro: string = '';
  ordenActual: 'reciente' | 'antiguo' = 'reciente';
  loading: boolean = true;
  tipoFiltroFecha: 'dia' | 'mes' = 'dia';
  mesAnoFiltro: string = '';

  constructor(private turnoService: TurnoService) {}

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    this.turnoService.getTurnos().subscribe(
      (data) => {
        this.turnos = data;
        this.turnosFiltrados = this.turnos;
        this.ordenarPorFechaReciente(); // Ordenar automáticamente al cargar
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los turnos', error);
        this.loading = false;
      }
    );
  }

  esTurnoPasado(fecha: string, hora: string): boolean {
    const fechaTurno = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    return fechaTurno < ahora;
  }

  eliminarTurno(turno: any) {
    if (this.esTurnoPasado(turno.fecha, turno.hora)) {
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

  filtrarPorFecha() {
    if (this.tipoFiltroFecha === 'dia' && this.fechaFiltro) {
      this.turnosFiltrados = this.turnos.filter(turno => turno.fecha === this.fechaFiltro);
    } else if (this.tipoFiltroFecha === 'mes' && this.mesAnoFiltro) {
      const [year, month] = this.mesAnoFiltro.split('-');
      this.turnosFiltrados = this.turnos.filter(turno => {
        const [turnoYear, turnoMonth] = turno.fecha.split('-');
        return turnoYear === year && turnoMonth === month;
      });
    } else {
      this.turnosFiltrados = [...this.turnos];
    }

    if (this.ordenActual === 'reciente') {
      this.ordenarPorFechaReciente();
    } else {
      this.ordenarPorFechaAntigua();
    }
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

  cambiarTipoFiltro(tipo: 'dia' | 'mes') {
    this.tipoFiltroFecha = tipo;
    this.fechaFiltro = '';
    this.mesAnoFiltro = '';
    this.filtrarPorFecha();
  }

  filtrarTurnos() {
    this.turnosFiltrados = this.turnos.filter(turno => {
      const coincideFecha = this.fechaFiltro ? turno.fecha === this.fechaFiltro : true;
      const coincideUsuario = this.usuarioFiltro ?
                              turno.userName.toLowerCase().includes(this.usuarioFiltro.toLowerCase()) :
                              true;
      return coincideFecha && coincideUsuario;
    });

    if (this.ordenActual === 'reciente') {
      this.ordenarPorFechaReciente();
    } else {
      this.ordenarPorFechaAntigua();
    }
  }
  limpiarFiltroUsuario() {
    this.usuarioFiltro = '';
    this.filtrarTurnos();
  }
}
