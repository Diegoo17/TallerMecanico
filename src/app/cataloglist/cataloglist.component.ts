import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../Interface/product.interface';

@Component({
  selector: 'app-cataloglist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cataloglist.component.html',
  styleUrls: ['./cataloglist.component.css']
})
export class CataloglistComponent {
  @Input() products: Product[] = [];
  @Input() currentProduct: Product | null = null;
  @Output() editRequest = new EventEmitter<Product>();
  @Output() deleteRequest = new EventEmitter<number>();

  onEdit(product: Product) {
    this.editRequest.emit(product);
  }

  onDelete(id: number) {
    this.deleteRequest.emit(id);
  }
}
