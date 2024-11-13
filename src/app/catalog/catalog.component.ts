import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { CataloglistComponent } from '../cataloglist/cataloglist.component';
import { CatalogaddComponent } from '../catalogadd/catalogadd.component';
import { CatalogeditComponent } from '../catalogedit/catalogedit.component';
import { RouterModule } from '@angular/router';
import { Product } from '../Interface/product.interface';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CataloglistComponent,
    CatalogaddComponent,
    CatalogeditComponent
  ],
  providers: [ProductService],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Product | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts()?.subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
    });
  }

  onAdd(product: Product) {
    this.productService.addProduct(product).subscribe({
      next: (response) => this.products.push(response),
      error: (err) => console.error(err),
    });
  }

  onEdit(product: Product) {
    this.currentProduct = product;
  }

  onEditSubmit(product: Product) {
    this.productService.updateProduct(product.id!, product).subscribe({
      next: (response) => {
        const index = this.products.findIndex((p) => p.id === response.id);
        if (index !== -1) this.products[index] = response;
        this.currentProduct = null;
      },
      error: (err) => console.error(err),
    });
  }

  onDelete(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
      },
      error: (err) => console.error(err),
    });
  }
}
