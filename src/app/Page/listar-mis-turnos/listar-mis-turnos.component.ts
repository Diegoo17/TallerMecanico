import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../Service/turno.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listar-mis-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers:[TurnoService],
  templateUrl: './listar-mis-turnos.component.html',
  styleUrls: ['./listar-mis-turnos.component.css']
})
export class ListarMisTurnosComponent {
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
  turnoSeleccionado : any = null;

  constructor(
    private turnoService: TurnoService,
    private router: Router
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.id;
      this.cargarTurnos();
    } else {
      console.error('El usuario no está autenticado.');
    }
  }

  cargarTurnos() {
    if (this.userId) {
      this.turnoService.getTurnosByUserId(this.userId).subscribe(
        (data) => {
          this.turnos = data;
          this.turnosFiltrados = this.turnos;
          this.ordenarPorFechaReciente();
        },
        (error) => console.error('Error al cargar los turnos', error)
      );
    }
  }

  esTurnoPasado(fecha: string, hora: string): boolean {
    const fechaTurno = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    return fechaTurno < ahora;
  }

  
eliminarTurno(turno: any) {
  if (this.esTurnoPasado(turno.fecha, turno.hora)) {
    this.eliminarTurnoPasado();
    return;
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Estás a punto de eliminar este turno',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.turnoService.eliminarTurno(turno.id).subscribe(
        () => {
          this.turnos = this.turnos.filter(t => t.id !== turno.id);
          this.filtrarPorFecha();
        },
        (error) => this.errorEliminarTurno()
      );
    }
  });
}
  editarTurno(turno: any) {
    if (this.esTurnoPasado(turno.fecha, turno.hora)) {
      this.editarTurnoPasado()
      return; 
    }
    this.router.navigate(['/modificar-turno', turno.id]);
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
  async eliminarTurnoPasado() {
    await Swal.fire('Error al eliminar turno', 'No puede eliminar un turno pasado', 'error');
  }
  async errorEliminarTurno() {
    await Swal.fire('Error al eliminar turno', 'No se pudo eliminar el turno', 'error');
  }
  async editarTurnoPasado() {
    await Swal.fire('Error al editar turno', 'No puede editar un turno pasado', 'error');
  }
}
