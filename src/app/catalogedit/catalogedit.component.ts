import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../Interface/product.interface';

@Component({
  selector: 'app-catalogedit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catalogedit.component.html',
  styleUrl: './catalogedit.component.css'
})
export class CatalogeditComponent implements OnChanges{
  @Input() product:Product | null = null;
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  editForm:FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      imagen: [''],
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
        ...this.editForm.value
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