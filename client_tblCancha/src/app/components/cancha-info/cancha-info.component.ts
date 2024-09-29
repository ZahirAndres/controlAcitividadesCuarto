import { Component, Input } from '@angular/core';
import { Cancha } from '../../models/canchas'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-cancha-info',
  templateUrl: './cancha-info.component.html',
  styleUrls: ['./cancha-info.component.css']
})
export class CanchaInfoComponent {
  @Input() cancha: Cancha | null = null;

  cerrar() {
    this.cancha = null; 
  }
}
