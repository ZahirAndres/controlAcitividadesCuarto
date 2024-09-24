import { Component, Output, EventEmitter } from '@angular/core';
import { tileLayer, latLng, Map, Marker, marker } from 'leaflet';

@Component({
  selector: 'app-selec-mapa',
  templateUrl: './selec-mapa.component.html',
  styleUrl: './selec-mapa.component.css'
})
export class SelecMapaComponent {
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' })
    ],
    zoom: 5,
    center: latLng([ 46.879966, -121.726909 ])
  };

  map: Map | null = null;
  selectedMarker: Marker | null = null;  // Inicializar selectedMarker con null

  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      if (this.selectedMarker) {
        this.map!.removeLayer(this.selectedMarker);
      }
      this.selectedMarker = marker([lat, lng]).addTo(this.map!);
      this.locationSelected.emit({ lat, lng });
    });
  }
}
