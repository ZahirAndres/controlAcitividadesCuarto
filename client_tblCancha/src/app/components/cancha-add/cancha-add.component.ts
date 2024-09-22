import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CanchaService } from '../../services/canchas.service';

@Component({
  selector: 'app-cancha-add',
  templateUrl: './cancha-add.component.html',
  styleUrls: ['./cancha-add.component.css']
})
export class CanchaAddComponent {
  cancha = {
    nombre: '',
    precio: undefined,
    descripcion: '',
    estado: 'Disponible'
  };

  constructor(
    public dialogRef: MatDialogRef<CanchaAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private canchaService: CanchaService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.canchaService.saveCancha(this.cancha).subscribe(() => {
      this.dialogRef.close(true);
      
    });
  }
}
