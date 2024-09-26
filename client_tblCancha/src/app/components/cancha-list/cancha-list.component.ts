import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CanchaService } from '../../services/canchas.service';
import { Cancha } from '../../models/canchas';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CanchaAddComponent } from '../cancha-add/cancha-add.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { CanchaEditComponent } from '../cancha-edit/cancha-edit.component';
import { ResponsableService } from '../../services/responsable.service';

@Component({
  selector: 'app-cancha-list',
  templateUrl: './cancha-list.component.html',
  styleUrls: ['./cancha-list.component.css'],
})
export class CanchaListComponent implements OnInit, AfterViewInit, OnDestroy {
  canchas: Cancha[] = [];
  nearbyCanchas: Cancha[] = [];
  displayedColumns: string[] = [
    'nombre',
    'precio',
    'descripcion',
    'estado',
    'usuario',
    'acciones',
  ];
  dataSource!: MatTableDataSource<Cancha>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private updateLocationInterval: any; // Almacena el identificador del intervalo

  constructor(
    private canchaService: CanchaService,
    private dialog: MatDialog,
    private responsableService: ResponsableService
  ) {}

  ngOnInit(): void {
    this.getCanchas();
    this.responsableService.getUserId();

    // Configura el intervalo para actualizar la ubicación
    this.updateLocationInterval = setInterval(() => {
      this.updateUserLocation();
    }, 5000); // Se ejecuta cada 60,000 ms (1 minuto)
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy(): void {
    // Limpia el intervalo cuando el componente se destruye
    if (this.updateLocationInterval) {
      clearInterval(this.updateLocationInterval);
    }
  }

  getCanchas(): void {
    const idResp = this.responsableService.getUserId(); 
    this.canchaService.getCanchas().subscribe((data: Cancha[]) => {
      // Filtra las canchas por el ID del responsable
      this.canchas = data.filter(cancha => cancha.idResp === idResp);
      this.dataSource = new MatTableDataSource(this.canchas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  updateLocationInDatabase(lat: number, lng: number): void {
    const idResp = this.responsableService.getUserId();
    this.responsableService.updateUserLocation(idResp, lat, lng).subscribe(
      response => {
        console.log('Ubicación actualizada en la base de datos', response);
      },
      error => {
        console.error('Error actualizando la ubicación en la base de datos', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CanchaAddComponent, {
      width: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCanchas();
      }
    });
  }

  openConfirmDialog(idCancha: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: '¿Estás seguro de que deseas eliminar esta cancha?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCancha(idCancha);
      }
    });
  }

  deleteCancha(idCancha: number): void {
    this.canchaService.deleteCancha(idCancha).subscribe(
      (resp) => {
        console.log(resp);
        this.getCanchas();
        this.updateUserLocation();
      },
      (err) => console.log(err)
    );
  }

  // Método para abrir el diálogo de edición
  editCancha(cancha: Cancha): void {
    const dialogRef = this.dialog.open(CanchaEditComponent, {
      width: '600px',
      data: cancha, // Asegúrate de pasar el objeto de cancha
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCanchas(); // Refresca la lista después de editar
      }
    });
  }

  updateUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Ubicación del usuario: Latitud: ${lat}, Longitud: ${lng}`); 
        this.updateLocationInDatabase(lat, lng);
        this.getThreeNearbyCanchas(lat, lng);
      }, error => {
        console.error('Error obteniendo la geolocalización', error);
      });
    } else {
      console.log('Geolocalización no soportada en este navegador');
    }
  }

  getThreeNearbyCanchas(lat: number, lng: number): void {
    console.log(`Obteniendo canchas cercanas a: Latitud: ${lat}, Longitud: ${lng}`);
    this.canchaService.getThreeCanchas(lat, lng).subscribe((data: Cancha[]) => {
      this.nearbyCanchas = data;
      console.log('Canchas cercanas:', this.nearbyCanchas);
    }, error => {
      console.error('Error obteniendo canchas cercanas', error);
    });
  }
}
