import { Component } from '@angular/core';
import { Insumo } from './product/product.model';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-catalogo',
  standalone: true,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class CatalogoComponent {
  insumos: Insumo[] = [];
  nuevoInsumo: Insumo = {
    nombre: '',
    precio: 0,
    imagen: ''
  };
  selectedFile: File | null = null;
  editIndex: number | null = null;
  private apiUrl = 'http://localhost:3000/productos';

  constructor(private http: HttpClient) {
    this.loadInsumos();
  }

  loadInsumos() {
    this.http.get<Insumo[]>(this.apiUrl).subscribe(data => {
      this.insumos = data;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.nuevoInsumo.imagen = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit() {
    const insumoToSave = { ...this.nuevoInsumo };

    if (this.editIndex !== null && this.editIndex >= 0) {
      const insumoId = this.insumos[this.editIndex].id;
      this.http.put<Insumo>(`${this.apiUrl}/${insumoId}`, insumoToSave).subscribe(response => {
        this.insumos[this.editIndex] = response;
        this.limpiarFormulario();
      });
    } else {
      this.http.post<Insumo>(this.apiUrl, insumoToSave).subscribe(response => {
        this.insumos.push(response);
        this.limpiarFormulario();
      });
    }
  }

  onEdit(index: number) {
    this.editIndex = index;
    this.nuevoInsumo = { ...this.insumos[index] };
  }

  onDelete(index: number) {
    const insumoId = this.insumos[index].id;
    this.http.delete(`${this.apiUrl}/${insumoId}`).subscribe(() => {
      this.insumos.splice(index, 1);
    });
  }

  limpiarFormulario() {
    this.nuevoInsumo = {
      nombre: '',
      precio: 0,
      imagen: ''
    };
    this.selectedFile = null;
    this.editIndex = null;
  }
}