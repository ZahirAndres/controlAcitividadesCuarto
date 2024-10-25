import { Component, Input } from '@angular/core';
import { Cancha } from '../../models/canchas';

@Component({
  selector: 'app-cancha-info',
  templateUrl: './cancha-info.component.html',
  styleUrls: ['./cancha-info.component.css']
})
export class CanchaInfoComponent {
  @Input() cancha: Cancha | null = null;
  @Input() temperatura: number | string = 'N/A'; // Nuevo input para la temperatura

  cerrar() {
    this.cancha = null; 
  }
}
