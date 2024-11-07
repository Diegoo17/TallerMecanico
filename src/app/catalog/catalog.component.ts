import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from './product.service';
import { NavlogueadoComponent } from '../navlogueado/navlogueado.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,NavlogueadoComponent],
  providers: [ProductService]
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  productForm: FormGroup;
  editForm: FormGroup;
  currentProduct: any = null;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      precio: [0, Validators.required],
      imagen: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      nombre: ['', Validators.required],
      precio: [0, Validators.required],
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
      error: (err:any)=>{
      console.error('Error al cargar productos: ', err);
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

   if (productToSave.id === null) {
      delete productToSave.id;
    }

    if (this.isEditMode) {
     this.productService.updateProduct(productToSave.id, productToSave).subscribe({
      next: (response: any) => {
       const index = this.products.findIndex(product => product.id === productToSave.id);
       this.products[index] = response;
       this.resetForm();
      },
      error: (err:any)=>{
        console.error('Error al actualizar productos', err);
      }
    });
   } else {
      this.productService.addProduct(productToSave).subscribe({
        next: (response: any) => {
        this.products.push(response);
        this.resetForm();
     },
        error: (err:any) =>{
          console.error('Error al añadir productos', err);
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
      error:(err:any)=>{
        console.error('Error al guardar el producto',err);
      },
  });
  }

  onMouseOver(product: any) {
    this.currentProduct = product;
  }

  onMouseLeave() {
    this.currentProduct = null;
  }

  onDelete(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next:() => {
      this.products = this.products.filter(product => product.id !== id);
    },
      error:(err)=>{
      console.error('Error al eliminar el producto:', err);
      }
  });
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
