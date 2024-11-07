import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from './product.service';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';
import { Product } from '../Interface/product.interface';

@Component({
  selector: 'app-catalog',
  standalone: true,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,NavlogueadoComponent],
  providers: [ProductService]
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  editForm: FormGroup;
  currentProduct: any = null;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.nonNullable.group({
      id: [null],
      nombre: ['', [Validators.required,Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      imagen: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(3)]],
      imagen: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    if(this.productService.getProducts() !== null){
    this.productService.getProducts()?.subscribe({
      next: (data: any)=> {
      this.products = data;
    },
      error: (err:Error)=>{
      console.error(err.message);
    },
    }
);}
  }

  onFileSelected(event: Event, form: FormGroup): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        form.patchValue({ imagen: reader.result as string });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit() {
    const productToSave = { ...this.productForm.value };

    if(this.productForm.invalid)return;

   if (productToSave.id === null) {
      delete productToSave.id;
    }

    if (this.isEditMode && productToSave.id !=null) {
     this.productService.updateProduct(productToSave.id, productToSave).subscribe({
      next: (response: any) => {
       const index = this.products.findIndex(product => product.id === productToSave.id);
       this.products[index] = response;
       this.resetForm();
      },
      error: (err:Error)=>{
        console.error(err.message);
      }
    });
   } else {
      this.productService.addProduct(productToSave).subscribe({
        next: (response: any) => {
        this.products.push(response);
        this.resetForm();
     },
        error: (err:Error) =>{
          console.error(err.message);
        }
    });
   }
  }

  onEdit(product: any) {
    this.isEditMode = true;
    this.currentProduct = product;
    this.editForm.patchValue(product);
  }

  onEditSubmit() {
    const productToSave = { ...this.editForm.getRawValue() };
    this.productService.updateProduct(productToSave.id, productToSave).subscribe({
      next:(response: any) => {
      const index = this.products.findIndex(product => product.id === productToSave.id);
      this.products[index] = response;
      this.resetForm();
      this.isEditMode = false;
    },
      error:(err:Error)=>{
        console.error(err.message);
      },
  });
  }

  onMouseOver(product: any) {
    this.currentProduct = product;
  }

  onMouseLeave() {
    this.currentProduct = null;
  }

  onDelete(id: number | undefined) {
    if (id != null){
    this.productService.deleteProduct(id).subscribe({
      next:() => {
      this.products = this.products.filter(product => product.id !== id);
    },
      error:(err:Error)=>{
      console.error(err.message);
      }
  });
  }
}

  resetForm() {
    this.productForm.reset({
      id: null,
      nombre: '',
      precio: 0,
      imagen: ''
    });
    this.editForm.reset({
      id: null,
      nombre: '',
      precio: 0,
      imagen: ''
    });
    this.currentProduct = null;
  }
}
