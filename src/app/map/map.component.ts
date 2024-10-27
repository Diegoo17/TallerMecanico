import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
//PARA QUE FUNCIONE HACER npm install @angular/google-maps


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef<HTMLDivElement>;
  map?: google.maps.Map;

  // Coordenadas de Luis Agote 582, Mar del Plata
  center: google.maps.LatLngLiteral = { lat: -38.031872643184435, lng: -57.56433106838446 };
  zoom = 18;

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    const coordinates = new google.maps.LatLng(this.center.lat, this.center.lng);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: this.zoom
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);

    // Añadir marcador
    new google.maps.Marker({
      position: coordinates,
      map: this.map,
      title: 'Luis Agote 582, Mar del Plata'
    });
  }
}

