import { Component, Inject } from '@angular/core';
import { Cancha } from '../../models/canchas';
import { CanchaService } from '../../services/canchas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancha-edit',
  templateUrl: './cancha-edit.component.html',
  styleUrls: ['./cancha-edit.component.css'] // Asegúrate de que este sea "styleUrls" y no "styleUrl"
})
export class CanchaEditComponent {
  cancha: Cancha;

  constructor(
    public dialogRef: MatDialogRef<CanchaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cancha,
    private canchaService: CanchaService
  ) {
    this.cancha = { ...data }; // Copia los datos de la cancha a editar
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.cancha.idCancha !== undefined) {
      this.canchaService.updateCancha(this.cancha.idCancha, this.cancha).subscribe(() => {
        this.dialogRef.close(true);
      }, err => {
        console.error('Error al actualizar la cancha:', err);
        this.dialogRef.close(false);
      });
    } else {
      console.error('ID de cancha no definido');
      this.dialogRef.close(false);
    }
  }
}
