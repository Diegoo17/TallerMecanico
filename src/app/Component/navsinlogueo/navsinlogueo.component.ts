import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navsinlogueo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navsinlogueo.component.html',
  styleUrl: './navsinlogueo.component.css'
})
export class NavsinlogueoComponent {
  private router = inject(Router);
}
