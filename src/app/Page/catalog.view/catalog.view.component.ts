import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../Service/product.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-catalog-user-view',
  standalone: true,
  templateUrl: './catalog.view.component.html',
  styleUrls: ['./catalog.view.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ProductService]
})

export class CatalogUserViewComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  window: any;
  searchTerm: string = '';
  filteredProducts: any[] = [];

  constructor() {}
  productService= inject(ProductService)
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  filterProducts() {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSelect(product: any) {
    this.selectedProduct = this.selectedProduct === product ? null : product;
  }

  contactUs(): string {
    if (this.selectedProduct) {
      return `https://wa.me/+5492235719422?text=Hola%2C%20estoy%20interesado%20en%20este%20producto:%0A${this.selectedProduct.nombre}`;
    }
    return '';
  }

  openWhatsApp() {
    if (this.selectedProduct) {
      const url = this.contactUs();
      window.open(url, '_blank');
    }
  }

  get usuarioLogueado(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}
