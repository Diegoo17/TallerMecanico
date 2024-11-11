import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';

@Component({
  selector: 'app-reserva-turno-form',
  standalone: true,
  templateUrl: './reserva-turno-form.component.html',
  styleUrls: ['./reserva-turno-form.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, NavlogueadoComponent],
})
export class ReservaTurnoFormComponent implements OnInit {
  turnoForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.turnoForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', [Validators.required, this.validarFechaFutura()]], 
      hora: ['', [Validators.required, Validators.pattern(/^(1[3-9]|1[0-9]):[0-5][0-9]$/)]], 
    });
  }

  onSubmit() {
    if (this.turnoForm.invalid) {
      this.turnoForm.markAllAsTouched(); 
      return;
    }

    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      alert('Debe iniciar sesión para reservar un turno');
      return;
    }

    const user = JSON.parse(userStr);
    const nuevoTurno = {
      ...this.turnoForm.value,
      userId: user.id,
      userName: user.nombre
    };

    this.verificarTurnoExistente(nuevoTurno.fecha, nuevoTurno.hora).subscribe((turnoExists) => {
      if (turnoExists) {
        this.turnoForm.get('hora')?.setErrors({ turnoExistente: true });
      } else {
        this.guardarTurno(nuevoTurno);
      }
    });
  }

  verificarTurnoExistente(fecha: string, hora: string): Observable<boolean> {
    return this.http
      .get<any[]>(`http://localhost:3000/turnosTotales?fecha=${fecha}&hora=${hora}`)
      .pipe(map((turnos) => turnos.length > 0));
  }

  guardarTurno(turno: any) {
    this.http.post('http://localhost:3000/turnosTotales', turno).subscribe({
      next: () => {
        alert("Turno reservado exitosamente!");
        this.turnoForm.reset();
        this.router.navigate(['/']); 
      },
      error: (error) => {
        console.error('Error al guardar el turno:', error);
        alert('Error al reservar el turno, por favor intenta de nuevo.');
      },
    });
  }

  private validarFechaFutura() {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaSeleccionada = new Date(control.value);
      const fechaActual = new Date();
  
      if (fechaSeleccionada <= fechaActual) {
        return { fechaNoValida: true }; 
      }
  
      const anioSeleccionado = fechaSeleccionada.getFullYear();
      if (anioSeleccionado > 2025) {
        return { añoNoValido: true }; 
      }
  
      return null;
    };
  }
}
