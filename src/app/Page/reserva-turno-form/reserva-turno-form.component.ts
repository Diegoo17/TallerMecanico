import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../Service/turno.service';

@Component({
  selector: 'app-reserva-turno-form',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [TurnoService],
  templateUrl: './reserva-turno-form.component.html',
  styleUrls: ['./reserva-turno-form.component.css'],

})
export class ReservaTurnoFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private turnoService = inject(TurnoService);
  private router = inject(Router);

  turnoForm!: FormGroup;
  maxCaracteres = 200;
  caracteresRestantes = this.maxCaracteres;

  ngOnInit(): void {
    this.turnoForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(this.maxCaracteres)]],
      fecha: ['', [Validators.required, this.validarFechaFutura()]],
      hora: ['', [Validators.required, Validators.pattern(/^(1[3-9]|1[0-9]):[0-5][0-9]$/)]],
      vehiculo: ['', [Validators.required]]
    });

    this.turnoForm.get('descripcion')?.valueChanges.subscribe(value => {
      this.caracteresRestantes = this.maxCaracteres - (value?.length || 0);
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
      idUsuario: user.id,
      userName: user.nombre,
    };

    this.turnoService.verificarTurnoExistente(nuevoTurno.fecha, nuevoTurno.hora).subscribe((turnoExists) => {
      if (turnoExists) {
        this.turnoForm.get('hora')?.setErrors({ turnoExistente: true });
      } else {
        this.guardarTurno(nuevoTurno);
      }
    });
  }

  guardarTurno(turno: any) {
    this.turnoService.crearTurno(turno).subscribe({
      next: () => {
        alert("Turno reservado exitosamente!");
        this.turnoForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al guardar el turno:', error);
        alert('Error al reservar el turno, por favor intenta de nuevo.');
      }
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
