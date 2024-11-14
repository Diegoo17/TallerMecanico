import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../Interface/product.interface';

import { CatalogeditComponent } from '../../Component/catalogedit/catalogedit.component';
import { CatalogaddComponent } from '../../Component/catalogadd/catalogadd.component';
import { CataloglistComponent } from '../../Component/cataloglist/cataloglist.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  providers: [ProductService],
  imports: [ CatalogeditComponent, CatalogaddComponent, CataloglistComponent, CommonModule]
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  currentProduct: Product | null = null;
  isEditMode: boolean = false;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts()?.subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err: Error) => {
        console.error(err.message);
      }
    });
  }

  onAddProduct(product: Product) {
    this.productService.addProduct(product).subscribe({
      next: (response: Product) => {
        this.products.push(response);
      },
      error: (err: Error) => {
        console.error(err.message);
      }
    });
  }

  updateProduct(updatedProduct: Product) {
    if(updatedProduct.id!=null)
    this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: (product: Product) => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = product;
        }
        this.cancelEdit();
      },
      error: (err: Error) => {
        console.error(err.message);
      }
    });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.currentProduct = null;
  }

  onEditRequest(product: Product) {
    this.isEditMode = true;
    this.currentProduct = product;
  }

  onDeleteRequest(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(product => product.id !== id);
      },
      error: (err: Error) => {
        console.error(err.message);
      }
    });
  }

  onMouseOverProduct(product: Product | null) {
    this.currentProduct = product;
  }

  onEditCancel() {
    this.isEditMode = false;
    this.currentProduct = null;
  }

  onEditSave() {
    this.isEditMode = false;
    this.currentProduct = null;
    this.loadProducts();
  }
}
