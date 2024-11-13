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
  @Output() editProduct = new EventEmitter <Product>();
  editForm:FormGroup;

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
    }
  }

  onSubmit() {
    if (this.editForm.invalid) return;
    const updatedProduct = { ...this.editForm.getRawValue(), id: this.product?.id } as Product;
    this.editProduct.emit(updatedProduct);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editForm.patchValue({ imagen: reader.result as string });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}

