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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.cancha.latitud = location.lat;
    this.cancha.longitud = location.lng;
  }

  onSubmit(): void {
    const idResp = this.responsableService.getUserId();
    if (idResp) {
      this.cancha.idResp = idResp;

      this.canchaService.saveCancha(this.cancha).subscribe(() => {
        this.dialogRef.close(true);
      }, err => {
        console.error('Error al guardar la cancha:', err);
        this.dialogRef.close(false);
      });
    } else {
      console.error('No se pudo obtener el id del responsable.');
      this.dialogRef.close(false);
    }
  }
}
