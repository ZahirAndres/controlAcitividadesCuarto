import { Component, HostListener } from '@angular/core';
import { ResponsableService } from './services/responsable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private allowLogout = true;

  constructor(private responsableService: ResponsableService) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (this.allowLogout) {
      this.responsableService.logout(); // Llama al método logout de tu servicio
    }
  }

  public preventLogout() {
    this.allowLogout = false;
  }

  public enableLogout() {
    this.allowLogout = true;
  }
}
