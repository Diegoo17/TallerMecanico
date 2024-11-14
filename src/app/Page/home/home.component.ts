import { Component } from '@angular/core';
import { MapComponent } from '../../Component/map/map.component';
import { DisplayCommentsComponent } from '../../Component/display-comments/display-comments.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ContactarsePorMailComponent } from '../../Component/contactarse-por-mail/contactarse-por-mail.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MapComponent, DisplayCommentsComponent, HttpClientModule, ContactarsePorMailComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  get usuarioLogueado(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}
