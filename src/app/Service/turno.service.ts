import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Turno } from '../Interface/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:3000/turnosTotales';

  constructor(private http: HttpClient) { }


  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.apiUrl);
  }


  getTurnosByUserId(userId: string): Observable<Turno[]> {
    return this.getTurnos().pipe(
      map(turnos => turnos.filter(turno => turno.idUsuario === userId))
    );
  }

  crearTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  eliminarTurno(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  verificarTurnoExistente(fecha: string, hora: string): Observable<boolean> {
    return this.http.get<Turno[]>(`${this.apiUrl}?fecha=${fecha}&hora=${hora}`)
      .pipe(map(turnos => turnos.length > 0));
  }

  actualizarTurno(id: string, turno: Partial<Turno>): Observable<Turno> {
    return this.http.put<Turno>(`${this.apiUrl}/${id}`, turno);
  }
}
