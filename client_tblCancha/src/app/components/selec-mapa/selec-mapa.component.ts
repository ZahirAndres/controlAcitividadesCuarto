import { Component, Output, EventEmitter } from '@angular/core';
declare var H: any;

@Component({
  selector: 'app-selec-mapa',
  templateUrl: './selec-mapa.component.html',
  styleUrls: ['./selec-mapa.component.css']
})
export class SelecMapaComponent {
  private platform: any;
  private map: any;
  private marker: any; // el marcador actual

  
  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();

  constructor() {
   
    this.platform = new H.service.Platform({
      apikey: 'f2D9Kf7afmHS5i7Jc5LRUtP3Kpf0cVZ6FLG21hFje-4'
    });
  }

  ngAfterViewInit(): void {
    
    const defaultLayers = this.platform.createDefaultLayers();

    // Inicializar el mapa
    const mapContainer = document.getElementById('map');
    this.map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
      zoom: 14,
      center: { lat: 0, lng: 0 }
    });

    
    const mapEvents = new H.mapevents.MapEvents(this.map);
    const behavior = new H.mapevents.Behavior(mapEvents);

    
    const ui = H.ui.UI.createDefault(this.map, defaultLayers);

   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.setMapCenter(lat, lng);
      }, error => {
        console.error('Error obteniendo la geolocalización', error);
      });
    } else {
      console.log('Geolocalización no soportada en este navegador');
    }

  
    this.map.addEventListener('tap', (evt: any) => {
     
      const coord = this.map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);

      
      this.addMarker(coord.lat, coord.lng);

    
      this.coordenadasSeleccionadas.emit({ lat: coord.lat, lng: coord.lng });
    });
  }

  setMapCenter(lat: number, lng: number): void {
    const newCenter = { lat, lng };
    this.map.setCenter(newCenter);
    this.map.setZoom(14);

    //  marcador inicial 
    this.addMarker(lat, lng);
  }

  addMarker(lat: number, lng: number): void {
  
    if (this.marker) {
      this.map.removeObject(this.marker);
    }

    // nuevo marcador 
    this.marker = new H.map.Marker({ lat, lng });
    this.map.addObject(this.marker);
  }
}