import { Component } from '@angular/core';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  sportsNews: any[] = [];
  countries: string[] = ['us', 'gb', 'de', 'fr']; // Ejemplo de países disponibles
  sortOptions: string[] = ['relevancy', 'popularity', 'publishedAt']; // Opciones de ordenación
  selectedCountry: string = 'us';
  selectedSort: string = 'popularity';
  sports: string[] = ['Fútbol', 'Baloncesto', 'Tenis', 'Béisbol'];  // Lista de deportes
  limit: number = 3;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    // Cargar noticias deportivas por defecto
    this.getSportsNews();
  }

  // Obtener noticias deportivas filtradas
  getSportsNews(): void {
    this.newsService.getCustomSportsNews(this.selectedCountry, this.selectedSort, this.limit)
      .subscribe((data: any) => {
        this.sportsNews = data.articles;
      });
  }

  // Cambiar el país y cargar noticias de ese país
  onCountryChange(): void {
    this.getSportsNews();
  }

  // Cambiar la opción de ordenación y cargar las noticias
  onSortChange(): void {
    this.getSportsNews();
  }
  

  // Cambiar el límite de noticias
  onLimitChange(newLimit: number): void {
    this.limit = newLimit;
    this.getSportsNews();
  }

}
