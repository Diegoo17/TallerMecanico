import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-todos-los-turnos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NavlogueadoComponent, FormsModule],
  templateUrl: './listar-todos-los-turnos.component.html',
  styleUrls: ['./listar-todos-los-turnos.component.css']
})
export class ListarTodosLosTurnosComponent {
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  loading: boolean = true;
  apiUrl: string = 'http://localhost:3000/turnosTotales';
  usuarioFiltro: string = ''; 
  turnoSeleccionado: any = null; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.turnos = data.map(turno => ({
          ...turno,
          fechaHora: new Date(`${turno.fecha}T${turno.hora}:00`),
        }));
        this.turnosFiltrados = this.turnos; 
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los turnos', error);
        this.loading = false;
      }
    );
  }

  deleteTurno(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este turno?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.turnos = this.turnos.filter((turno) => turno.id !== id);
          this.filtrarTurnos(); 
        },
        (error) => {
          console.error('Error al eliminar el turno', error);
        }
      );
    }
  }

  sortTurnos() {
    this.turnosFiltrados.sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime());
  }

  filtrarTurnos() {
    const filtro = this.usuarioFiltro.toLowerCase();
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.userName.toLowerCase().includes(filtro)
    );
  }
  
  verDetalles(turno: any) {
    this.turnoSeleccionado = turno;
  }

  cerrarDetalles() {
    this.turnoSeleccionado = null;
  }
}
