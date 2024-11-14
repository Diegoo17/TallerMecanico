import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactarse-por-mail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contactarse-por-mail.component.html',
  styleUrls: ['./contactarse-por-mail.component.css']
})
export class ContactarsePorMailComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Getters para facilitar el acceso en el template
  get f() { return this.contactForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {
      // Obtener el formulario HTML y enviarlo
      const form = document.querySelector('form');
      if (form) {
        form.submit();
      }
    }
  }
}
