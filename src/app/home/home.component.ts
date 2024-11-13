import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { DisplayCommentsComponent } from '../display-comments/display-comments.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MapComponent, DisplayCommentsComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  get usuarioLogueado(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}
