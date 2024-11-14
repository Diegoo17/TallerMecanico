import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../Interface/product.interface';


@Component({
  selector: 'app-catalogadd',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catalogadd.component.html',
  styleUrl: './catalogadd.component.css'
})

export class CatalogaddComponent {
  @Output() addProduct = new EventEmitter<Product>();
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.nonNullable.group({
      id: [null],
      nombre: ['', [Validators.required,Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      imagen: ['', Validators.required]
    });
  }

  onSubmit(){
    const productToSave = { ...this.productForm.value };

    if(this.productForm.invalid)return;

   if (productToSave.id === null) {
      delete productToSave.id;
    }
    this.addProduct.emit(productToSave);
    this.productForm.reset();
  }

  onFileSelected(event: Event):void{
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productForm.patchValue({ imagen: reader.result as string });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}

