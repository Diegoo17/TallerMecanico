import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../Interface/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cataloglist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cataloglist.component.html',
  styleUrl: './cataloglist.component.css'
})
export class CataloglistComponent {
  @Input() products: Product[] = [];
  @Input() currentProduct: Product | null = null;
  @Output() editRequest = new EventEmitter<Product>();
  @Output() deleteRequest = new EventEmitter <number>();

  onEdit(pr:Product){
    this.editRequest.emit(pr);
  }

  onDelete(id: number| undefined){
    if(id !==undefined){
    this.deleteRequest.emit(id);
  }
  }



}
