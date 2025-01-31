import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../Service/turno.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Turno } from '../../Interface/turno';
import { UserService } from '../../Service/user.service';

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
  descripcionSeleccionada: string = '';
  mostrarModal: boolean = false;
  turnoSeleccionado: any = null;
  mostrarTurnosPasados: boolean = false;
  isMecanico: boolean = false;

  constructor(private turnoService: TurnoService, private router: Router) {}

  ngOnInit() {
    this.loadTurnos();
    this.checkIfMecanico();
  }

  loadTurnos() {
    this.turnoService.getTurnos().subscribe(
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

  esTurnoPasado(fecha: string, hora: string): boolean {
    const fechaTurno = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    return fechaTurno < ahora;
  }
  eliminarTurno(turno: any) {
    if (!this.isMecanico && this.esTurnoPasado(turno.fecha, turno.hora)) {
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

  verDescripcionCompleta(descripcion: string) {
    this.descripcionSeleccionada = descripcion;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
  mostrarCard(turno: any) {
    this.turnoSeleccionado = turno; 
  }

  cerrarCard() {
    this.turnoSeleccionado = null; 
  }
 
  editarTurno(turno: any) {
    if (this.esTurnoPasado(turno.fecha, turno.hora)) {
      this.editarTurnoPasado();
      return;
    }
    this.router.navigate(['/modificar-turno', turno.id]);
  }

  checkIfMecanico() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.isMecanico = user.id === 'mec';
    }
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
