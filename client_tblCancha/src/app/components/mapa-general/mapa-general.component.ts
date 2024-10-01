import { Component, EventEmitter, Output } from '@angular/core';
import { Cancha } from '../../models/canchas';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var H: any;

@Component({
  selector: 'app-mapa-general',
  templateUrl: './mapa-general.component.html',
  styleUrls: ['./mapa-general.component.css']
})
export class MapaGeneralComponent {
  private platform: any;
  private map: any;
  private marker: any; // el marcador actual
  private fixedMarker: any; // marcador fijo en la ubicación deseada
  private API_URI = 'http://localhost:3000/canchas'; // Reemplaza con tu URI real

  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();
  
  public selectedCancha: Cancha | null = null; // Cambia a público

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
    // Si el marcador ya existe, no lo movemos
    if (!this.marker) {
        // Usar un ícono de mono en lugar del ícono verde
        const monkeyIconUrl = '../../../assets/location.png'; // Reemplaza con la URL de tu ícono de mono
        const monkeyIcon = new H.map.Icon(monkeyIconUrl, { size: { w: 50, h: 50 } });
        this.marker = new H.map.Marker({ lat, lng }, { icon: monkeyIcon });
        this.map.addObject(this.marker);
    }
}



  getThreeCanchas(lat: number, lon: number): Observable<Cancha[]> {
    return this.http.get<Cancha[]>(`${this.API_URI}/nearby/${lat}/${lon}`);
  }

  private addCanchasToMap(canchas: Cancha[]): void {
    const parisIcon = new H.map.Icon('../../../assets/court.png', { size: { w: 32, h: 32 } });
  
    canchas.forEach(cancha => {
      const canchaMarker = new H.map.Marker(
        { lat: cancha.latitud, lng: cancha.longitud },
        { icon: parisIcon }
      );
      this.map.addObject(canchaMarker);
  
      // Añadir evento para mostrar información al hacer clic en el marcador
      canchaMarker.addEventListener('tap', () => {
        console.log('Canchas:', cancha); // Para verificar la información de cancha
        this.showInfoBubble(canchaMarker, cancha);
      });
    });
  }
  
  private showInfoBubble(marker: H.map.Marker, cancha: Cancha): void {
    this.selectedCancha = cancha; // Actualiza la cancha seleccionada
    if (marker instanceof H.map.Marker) {
      const geometry = marker.getGeometry();
      if (geometry instanceof H.geo.Point) {
        const content = `
          <div>
            <h4>${cancha.nombre}</h4>
            <p>Ubicación: ${cancha.latitud}, ${cancha.longitud}</p>
            <p>Más detalles sobre la cancha...</p>
          </div>
        `;
  
        // Crea la burbuja de información
        const bubble = new H.ui.InfoBubble(geometry, { content });
  
        // Agrega la burbuja al mapa
        this.map.addObject(bubble);
      } else {
        console.error('Geometría del marcador no válida', geometry);
      }
    } else {
      console.error('El marcador no es un H.map.Marker', marker);
    }
  }
}
