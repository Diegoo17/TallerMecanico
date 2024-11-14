import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TurnoService } from '../../Service/turno.service';
import { Turno } from '../../Interface/turno';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-turno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,HttpClientModule
  ],
  providers: [TurnoService],
  templateUrl: './modificar-turno.component.html',
  styleUrls: ['./modificar-turno.component.css']
})
export class ModificarTurnoComponent implements OnInit {
  turnoForm!: FormGroup;
  turnoId: string = '';
  turnoOriginal: Turno | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private turnoService: TurnoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params => {
      this.turnoId = params['id'];
      this.cargarTurno();
    });
  }

  private initForm(): void {
    this.turnoForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', [Validators.required, this.validarFechaFutura()]],
      hora: ['', [Validators.required, Validators.pattern(/^(1[3-9]|1[0-9]):[0-5][0-9]$/)]],
    });
  }

  private esTurnoPasado(fecha: string, hora: string): boolean {
    const fechaTurno = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    return fechaTurno < ahora;
  }

  private cargarTurno(): void {
    this.turnoService.getTurnos().subscribe(turnos => {
      const turno = turnos.find(t => t.id === this.turnoId);
      if (turno) {
        if (this.esTurnoPasado(turno.fecha, turno.hora)) {
          this.errorTurnosPasados()
          this.router.navigate(['/misTurnos']);
          return;
        }

        this.turnoOriginal = turno;
        this.turnoForm.patchValue({
          titulo: turno.titulo,
          descripcion: turno.descripcion,
          fecha: turno.fecha,
          hora: turno.hora
        });
      } else {
        this.turnoNoEncontrado()
        this.router.navigate(['/misTurnos']);
      }
    });
  }

  onSubmit(): void {
    if (this.turnoForm.invalid) {
      this.turnoForm.markAllAsTouched();
      return;
    }

    const turnoActualizado = {
      ...this.turnoOriginal,
      ...this.turnoForm.value
    };

    // Verificar si el horario está disponible (excepto si es el mismo horario del turno actual)
    if (this.horarioCambiado(turnoActualizado)) {
      this.turnoService.verificarTurnoExistente(turnoActualizado.fecha, turnoActualizado.hora)
        .subscribe(exists => {
          if (exists) {
            this.turnoForm.get('hora')?.setErrors({ turnoExistente: true });
          } else {
            this.actualizarTurno(turnoActualizado);
          }
        });
    } else {
      this.actualizarTurno(turnoActualizado);
    }
  }

  private horarioCambiado(turnoActualizado: Turno): boolean {
    return this.turnoOriginal?.fecha !== turnoActualizado.fecha ||
           this.turnoOriginal?.hora !== turnoActualizado.hora;
  }

  private actualizarTurno(turno: Turno): void {
    this.turnoService.actualizarTurno(this.turnoId, turno).subscribe({
      next: () => {
        this.turnoActualizado()
        this.router.navigate(['/misTurnos']);
      },
      error: (error) => {
        console.error('Error al actualizar el turno:', error);
        this.errorTurnoActualizado()
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

  cancelar(): void {
    this.router.navigate(['/misTurnos']);
  }


  async errorTurnosPasados() {
    await Swal.fire('Error', 'No se pueden editar turnos pasados', 'error');
  }
  async turnoNoEncontrado() {
    await Swal.fire('No encontrado', 'El turno no fue encontrado', 'question');
  }
  async turnoActualizado() {
    await Swal.fire('Turno actualizado', 'El turno fue actualizado correctamente', 'success');
  }
  async errorTurnoActualizado() {
    await Swal.fire('Error', 'El turno no fue actualizado correctamente', 'error');
  }

}
