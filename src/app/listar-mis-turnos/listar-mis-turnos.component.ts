import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';

@Component({
  selector: 'app-listar-mis-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NavlogueadoComponent],
  templateUrl: './listar-mis-turnos.component.html',
  styleUrls: ['./listar-mis-turnos.component.css']
})
export class ListarMisTurnosComponent {
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  apiUrl: string = 'http://localhost:3000/turnosTotales';
  userId: string | null = '';
  fechaFiltro: string = ''; 

  constructor(private http: HttpClient) {}

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
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.turnos = data.filter(turno => turno.userId === this.userId);
        this.turnosFiltrados = this.turnos;
      },
      (error) => {
        console.error('Error al cargar los turnos', error);
      }
    );
  }

  eliminarTurno(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este turno?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.turnos = this.turnos.filter(turno => turno.id !== id);
          this.filtrarPorFecha(); 
        },
        (error) => {
          console.error('Error al eliminar el turno', error);
        }
      );
    }
  }

  editarTurno(turno: any) {
    alert('Funcionalidad de editar turno en desarrollo.');
  }

  filtrarPorFecha() {
    if (this.fechaFiltro) {
      this.turnosFiltrados = this.turnos.filter(turno => turno.fecha === this.fechaFiltro);
    } else {
      this.turnosFiltrados = [...this.turnos];  
    }
  }

  ordenarPorFechaReciente() {
    this.turnosFiltrados.sort((b,a) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }
}
