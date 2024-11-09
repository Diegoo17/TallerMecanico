import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';

@Component({
  selector: 'app-listar-todos-los-turnos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NavlogueadoComponent],
  templateUrl: './listar-todos-los-turnos.component.html',
  styleUrl: './listar-todos-los-turnos.component.css'
})
export class ListarTodosLosTurnosComponent {
  turnos: any[] = [];
  loading: boolean = true;
  apiUrl: string = 'http://localhost:3000/turnosTotales'; 

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
        },
        (error) => {
          console.error('Error al eliminar el turno', error);
        }
      );
    }
  }

  sortTurnos() {
    this.turnos.sort((b,a) => b.fechaHora.getTime() - a.fechaHora.getTime());
  }
}



