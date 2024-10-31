import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cancha } from '../../models/canchas';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

declare var H: any;


interface WeatherResponse {
  weather: Array<{ main: string; icon: string }>;
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    weather: Array<{ description: string; icon: string }>;
    main: { temp: number; temp_min: number; temp_max: number; };
  }>;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  private platform: any;
  private map: any;
  private userMarker: any;
  public selectedCircle: any;
  private weatherMarker: any;
  public weatherData: any;
  public forecastData: ForecastResponse | null = null;
  public showForecast: boolean = false; // Estado para mostrar/ocultar pronóstico
  private API_URI = 'http://localhost:3000/canchas'; // Reemplaza con tu URI real
  private infoBubble: any; // Variable para almacenar el InfoBubble
  temperatura: number | string = 'N/A';
  mostrarGrafica: boolean = false; // Variable para controlar la visibilidad de las gráficas
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: '#4CAF50', // Color del fondo del tooltip
        titleColor: '#fff', // Color del título del tooltip
        bodyColor: '#fff', // Color del cuerpo del tooltip
        borderColor: '#ddd', // Color del borde del tooltip
        borderWidth: 1, // Grosor del borde del tooltip
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };
  
  public lineChartData: ChartData<'line'> = {
    labels: [],  // Se llenará con las fechas del pronóstico
    datasets: [
      {
        data: [],  // Se llenará con los valores de temperatura
        label: 'Temperatura',
        borderColor: 'rgba(135, 206, 235, 1)',
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        fill: true,
      },
    ],
  };
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number, lng: number }>();
  public friendlyWeatherMessage: string = ''; // Propiedad para almacenar el mensaje amigable
  constructor(private http: HttpClient) {
    this.platform = new H.service.Platform({
      apikey: 'f2D9Kf7afmHS5i7Jc5LRUtP3Kpf0cVZ6FLG21hFje-4'
    });
  }
  public selectedCancha: Cancha | null = null; // Cambia a público
  ngOnInit(): void {
    const defaultLayers = this.platform.createDefaultLayers();
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
      this.addSelectedCircle(coord.lat, coord.lng);
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
          this.getThreeCanchas(lat, lng); // Obtener canchas cercanas
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
    this.addUserMarker(lat, lng);
  }

  private addUserMarker(lat: number, lng: number): void {
    if (this.userMarker) {
      this.map.removeObject(this.userMarker);
      console.log('Marcador del usuario eliminado');
    }

    this.userMarker = new H.map.Marker({ lat, lng });
    this.map.addObject(this.userMarker);
    console.log('Marcador del usuario agregado en:', lat, lng);
  }

  private addSelectedCircle(lat: number, lng: number): void {
    if (this.selectedCircle) {
      this.map.removeObject(this.selectedCircle);
      console.log('Círculo seleccionado eliminado');
    }

    this.getWeather(lat, lng);
  }

 
  private getWeather(lat: number, lng: number): void {
    const apiKey = '6dba42a5e518da89bc6aa9125d9d8b14';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=es`;

    this.http.get<WeatherResponse>(url).subscribe(data => {
      this.weatherData = data;

      if (data.weather && data.weather.length > 0) {
        const weatherCondition = data.weather[0].main;
        const weatherIcon = data.weather[0].icon;
        this.addSelectedCircleWithWeather(lat, lng, weatherCondition, weatherIcon);
        this.friendlyWeatherMessage = this.getFriendlyWeatherMessage(weatherCondition);
        console.log(this.friendlyWeatherMessage); // Para depuración
        // Llama a getForecast solo si se va a mostrar
        if (this.showForecast) {
          this.getForecast(lat, lng);
        }
      } else {
        console.warn('No se encontraron datos de clima en la respuesta');
      }
    }, error => {
      console.error('Error al obtener los datos del clima', error);
    });
  }
  toggleGrafica() {
    this.mostrarGrafica = !this.mostrarGrafica;
  }


  private addSelectedCircleWithWeather(lat: number, lng: number, weatherCondition: string, weatherIcon: string): void {
    const circleColor = this.getCircleColor(weatherCondition);
    const circle = new H.map.Circle(
      { lat, lng },
      500,
      {
        style: {
          fillColor: circleColor,
          strokeColor: circleColor,
          lineWidth: 4
        }
      }
    );

    this.selectedCircle = circle;
    this.map.addObject(this.selectedCircle);
    console.log('Nuevo círculo seleccionado agregado en:', lat, lng);

    this.addWeatherMarker(lat, lng, weatherIcon);
  }

  private getCircleColor(condition: string): string {
    switch (condition) {
      case 'Clear':
        return 'rgba(0, 255, 0, 0.5)';
      case 'Clouds':
        return 'rgba(0, 0, 255, 0.5)';
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        return 'rgba(128, 128, 128, 0.5)';
      case 'Snow':
        return 'rgba(255, 255, 255, 0.5)';
      default:
        return 'rgba(255, 255, 0, 0.5)';
    }
  }

  private addWeatherMarker(lat: number, lng: number, icon: string): void {
    if (this.weatherMarker) {
      this.map.removeObject(this.weatherMarker);
      console.log('Marcador del clima eliminado');
    }

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const weatherMarkerIcon = new H.map.Icon(iconUrl, { size: { w: 100, h: 100 } });

    this.weatherMarker = new H.map.Marker({ lat, lng }, { icon: weatherMarkerIcon });
    this.map.addObject(this.weatherMarker);
    console.log('Marcador del clima agregado en:', lat, lng);
  }

  private getThreeCanchas(lat: number, lon: number): void {
    this.http.get<Cancha[]>(`${this.API_URI}/nearby/${lat}/${lon}`).subscribe(canchas => {
      this.addCanchasToMap(canchas);
    }, error => {
      console.error('Error al obtener canchas cercanas', error);
    });
  }

  private addCanchasToMap(canchas: Cancha[]): void {
    const canchaIcon = new H.map.Icon('assets/court.png', { size: { w: 32, h: 32 } });
  
    canchas.forEach(cancha => {
      const canchaMarker = new H.map.Marker(
        { lat: cancha.latitud, lng: cancha.longitud },
        { icon: canchaIcon }
      );
      this.map.addObject(canchaMarker);
  
       // Añadir evento para mostrar información al hacer clic en el marcador
       canchaMarker.addEventListener('pointerenter', () => {
        console.log('Canchas:', cancha); // Para verificar la información de cancha
        this.showInfoBubble(canchaMarker, cancha);
        
      });
      canchaMarker.addEventListener('pointerleave', () => {
        setTimeout(() => {
          this.hideInfoBubble();
        }, 500); // Retraso para evitar cierres prematuros
      });})
      
  }

  private showInfoBubble(marker: H.map.Marker, cancha: Cancha): void {
    this.selectedCancha = cancha; // Actualiza la cancha seleccionada
    if (marker instanceof H.map.Marker) {
        const geometry = marker.getGeometry();
        if (geometry instanceof H.geo.Point) {
            const temperature = this.weatherData?.main?.temp; // Obtener la temperatura
            
            // Aquí, en lugar de solo mostrar en la burbuja, también puedes utilizar el componente de info
            const content = `
                <div>
                    <h4>${cancha.nombre}</h4>
                    <p>Ubicación: ${cancha.latitud}, ${cancha.longitud}</p>
                    <p>Temperatura actual: ${temperature ? temperature + ' °C' : 'N/A'}</p>
                    <p>Más detalles sobre la cancha...</p>
                </div>
            `;

            // Crea la burbuja de información
            const bubble = new H.ui.InfoBubble(geometry, { content });

            // Agrega la burbuja al mapa y guarda la referencia
            this.infoBubble = bubble;
            this.map.addObject(this.infoBubble);
        } else {
            console.error('Geometría del marcador no válida', geometry);
        }
    } else {
        console.error('El marcador no es un H.map.Marker', marker);
    }
    const closeButton = document.getElementById('close-bubble');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.hideInfoBubble();
      });
    }
    
    
    const infoBubbleDiv = document.getElementById('info-bubble');
    if (infoBubbleDiv) {
      infoBubbleDiv.addEventListener('mouseleave', () => {
        setTimeout(() => {
          this.hideInfoBubble();
        }, 500); // Retraso para permitir al usuario mover el cursor de vuelta si es necesario
      });
}
  }
  

  private hideInfoBubble(): void {
    if (this.infoBubble) {
      this.map.removeObject(this.infoBubble);
      this.infoBubble = null; // Reiniciar la variable después de eliminar
    }
  }

  private getForecast(lat: number, lng: number): void {
    const apiKey = '6dba42a5e518da89bc6aa9125d9d8b14';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=es`;

    this.http.get<ForecastResponse>(url).subscribe(data => {
      this.forecastData = data;
      this.updateForecastChart(data); 
    }, error => {
      console.error('Error al obtener el pronóstico', error);
    });
  }
  private updateForecastChart(forecast: ForecastResponse): void {
    if (forecast && forecast.list) {
      // Filtra los datos para tomar solo aquellos que corresponden a cada 6 horas
      const filteredList = forecast.list.filter((item, index) => index % 2 === 0); // Toma cada segundo elemento
      const labels = filteredList.map(item => new Date(item.dt * 1000).toLocaleDateString());
      const temperatures = filteredList.map(item => item.main.temp);
  
      // Actualizar los datos de la gráfica
      this.lineChartData.labels = labels;
      this.lineChartData.datasets[0].data = temperatures;
    }
  }
  

  public toggleForecast(): void {
    this.showForecast = !this.showForecast;
    if (this.showForecast && this.forecastData) {
      console.log('Mostrando pronóstico:', this.forecastData);
    }
  }
  private getFriendlyWeatherMessage(weatherCondition: string): string {
    switch (weatherCondition) {
      case 'Clear':
        return '¡El clima está despejado! Es un buen día para salir.';
      case 'Clouds':
        return 'Hay algunas nubes en el cielo, pero aún puedes disfrutar de un buen paseo.';
      case 'Rain':
        return 'No salgas, va a llover. ¡Lleva un paraguas!';
      case 'Drizzle':
        return 'Parece que va a lloviznar. Mejor quédate en casa.';
      case 'Thunderstorm':
        return 'Hay tormentas. Es mejor quedarse adentro por ahora.';
      case 'Snow':
        return '¡Está nevando! Ideal para un día de invierno, pero mantente abrigado.';
      default:
        return 'El clima es variable. Mantente informado y preparado.';
    }
  }
}

