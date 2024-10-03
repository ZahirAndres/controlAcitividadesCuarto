import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cancha } from '../../models/canchas'; // Asegúrate de que la ruta sea correcta
declare var H: any;

@Component({
  selector: 'app-selec-mapa',
  templateUrl: './selec-mapa.component.html',
  styleUrls: ['./selec-mapa.component.css']
})
export class SelecMapaComponent implements OnInit {
  private platform: any;
  private map: any;
  private marker: any; // el marcador actual
  private fixedMarker: any; // marcador fijo en la ubicación deseada
  private API_URI = 'TU_API_URI_AQUI'; // Reemplaza con tu URI real

  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();

  constructor(private http: HttpClient) {
    this.platform = new H.service.Platform({
      apikey: 'f2D9Kf7afmHS5i7Jc5LRUtP3Kpf0cVZ6FLG21hFje-4'
    });
  }

  ngOnInit(): void {
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

    this.getCurrentPosition();
    this.addFixedMarker(40.4168, -3.7038); // Ejemplo: Madrid, España

    this.map.addEventListener('tap', (evt: any) => {
      const coord = this.map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      this.addMarker(coord.lat, coord.lng);
      this.coordenadasSeleccionadas.emit({ lat: coord.lat, lng: coord.lng });
    });
  }

  private getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.setMapCenter(lat, lng);
          this.getThreeCanchas(lat, lng).subscribe(canchas => {
            this.addCanchasToMap(canchas);
          });
        },
        error => {
          console.error('Error obteniendo la geolocalización', error);
          this.setMapCenter(0, 0);
        }
      );
    } else {
      console.log('Geolocalización no soportada en este navegador');
      this.setMapCenter(0, 0);
    }
  }

  private setMapCenter(lat: number, lng: number): void {
    const newCenter = { lat, lng };
    this.map.setCenter(newCenter);
    this.map.setZoom(14);
    this.addMarker(lat, lng);
  }

  private addMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.map.removeObject(this.marker);
    }

    this.marker = new H.map.Marker({ lat, lng });
    this.map.addObject(this.marker);
  }

  private addFixedMarker(lat: number, lng: number): void {
    const fixedMarkerIcon = new H.map.Icon('https://cdn3.iconfinder.com/data/icons/tourism/eiffel200.png', { size: { w: 32, h: 32 } });
    this.fixedMarker = new H.map.Marker({ lat, lng }, { icon: fixedMarkerIcon });
    this.map.addObject(this.fixedMarker);
  }

  getThreeCanchas(lat: number, lon: number): Observable<Cancha[]> {
    return this.http.get<Cancha[]>(`${this.API_URI}/nearby/${lat}/${lon}`);
  }

  private addCanchasToMap(canchas: Cancha[]): void {
    canchas.forEach(cancha => {
      const canchaMarker = new H.map.Marker({ lat: cancha.latitud, lng: cancha.longitud }); // Asegúrate de que los nombres de las propiedades coincidan
      this.map.addObject(canchaMarker);

      // Añadir evento para mostrar información al hacer clic en el marcador
      canchaMarker.addEventListener('tap', () => {
        this.showInfoBubble(canchaMarker, cancha);
      });
    });
  }

  private showInfoBubble(marker: any, cancha: Cancha): void {
    // Crear el contenido del cuadro de información
    const content = `
      <div>
        <h4>${cancha.nombre}</h4> <!-- Asegúrate de que 'nombre' es la propiedad correcta -->
        <p>Ubicación: ${cancha.latitud}, ${cancha.longitud}</p>
        <p>Más detalles sobre la cancha...</p> <!-- Puedes añadir más detalles aquí -->
      </div>
    `;

    // Crear una burbuja de información
    const bubble = new H.ui.InfoBubble(marker.getGeometry(), {
      content: content
    });
    this.map.addObject(bubble);
  }
}
