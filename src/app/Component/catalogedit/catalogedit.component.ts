import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../Interface/product.interface';

@Component({
  selector: 'app-catalogedit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catalogedit.component.html',
  styleUrl: './catalogedit.component.css'
})
export class CatalogeditComponent implements OnChanges{
  private fb = inject(FormBuilder);

  @Input() product:Product | null = null;
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  editForm:FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  maxCaracteres=200;
  caracteresRestantes = this.maxCaracteres;

  constructor() {
    this.editForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required, Validators.maxLength(this.maxCaracteres)]],
      imagen: ['']
    });

    this.editForm.get('descripcion')?.valueChanges.subscribe(value => {
      this.caracteresRestantes = this.maxCaracteres - (value?.length || 0);
    });

  }

  ngOnChanges() {
    if (this.product) {
      this.editForm.patchValue(this.product);
      this.imagePreview = this.product.imagen;
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && this.product) {
      const updatedProduct: Product = {
        ...this.product,
        ...this.editForm.value,
        imagen: this.editForm.get('imagen')?.value || this.product.imagen
      };
      this.save.emit(updatedProduct);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.editForm.patchValue({ imagen: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }
}
