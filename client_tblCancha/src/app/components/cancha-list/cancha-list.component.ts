import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class CanchaListComponent implements OnInit, AfterViewInit {
  canchas: Cancha[] = [];
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

  constructor(
    private canchaService: CanchaService,
    private dialog: MatDialog,
    private responsableService: ResponsableService
  ) {}

  ngOnInit(): void {
    this.getCanchas();
    this.responsableService.getUserId();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

}