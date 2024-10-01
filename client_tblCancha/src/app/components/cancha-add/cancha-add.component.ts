import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CanchaService } from '../../services/canchas.service';
import { ResponsableService } from '../../services/responsable.service';
import { Cancha } from '../../models/canchas';

@Component({
  selector: 'app-cancha-add',
  templateUrl: './cancha-add.component.html',
  styleUrls: ['./cancha-add.component.css']
})
export class CanchaAddComponent {
  cancha: Cancha = {
    nombre: '',
    precio: undefined,
    descripcion: '',
    estado: 'Disponible',
    idResp: undefined,
    latitud: undefined,
    longitud: undefined
  };

  constructor(
    public dialogRef: MatDialogRef<CanchaAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private canchaService: CanchaService,
    private responsableService: ResponsableService
  ) {}

  // Método que actualiza las coordenadas cuando se selecciona un punto en el mapa
  actualizarCoordenadas(event: { lat: number, lng: number }) {
    this.cancha.latitud = event.lat;
    this.cancha.longitud = event.lng;
    console.log('Coordenadas actualizadas:', this.cancha.latitud, this.cancha.longitud); // Verificar coordenadas
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    const idResp = this.responsableService.getUserId();
    if (idResp) {
      this.cancha.idResp = idResp; // Asociar la cancha con el responsable

      console.log('Datos enviados al servicio:', this.cancha); // Verificar datos enviados

      // Llamar al servicio para guardar la cancha
      this.canchaService.saveCancha(this.cancha).subscribe({
        next: () => {
          console.log('Cancha guardada con éxito');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al guardar la cancha:', err);
          this.dialogRef.close(false);
        }
      });
    } else {
      console.error('No se pudo obtener el id del responsable.');
      this.dialogRef.close(false);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}