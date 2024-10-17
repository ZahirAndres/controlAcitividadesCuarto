import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ResponsableService } from '../../services/responsable.service';
import { FaceboolService } from '../../services/facebool.service'; // Importar el servicio de Facebook
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AscensoComponent } from '../ascenso/ascenso.component';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  userRole: number = 0;
  nombUsuario: string = '';
  rol: string = '';
  profileImageUrl: string | null = null;

  isLoggedIn$: Observable<boolean>;

  constructor(
    private responsableService: ResponsableService,
    private fbService: FaceboolService, // Inyectar FaceboolService
    private router: Router,
    private dialog: MatDialog
  ) {
    this.isLoggedIn$ = this.responsableService.loggedIn.asObservable();
    this.userRole = this.responsableService.getUserRole();
    
    this.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const idResp = user.idResp;

        if (idResp) {
          this.responsableService.getResponsableById(idResp).subscribe(responsable => {
            this.nombUsuario = responsable.nombUsuario ?? 'Visitante';
          });
        }

        // Asignar el rol basado en userRole
        this.userRole = this.responsableService.getUserRole();
        this.rol = this.getRoleName(this.userRole);

        // Suscribirse a los cambios en la imagen de perfil
        this.fbService.profileImageUrl$.subscribe(url => {
          this.profileImageUrl = url; // Asignar la URL de la imagen obtenida desde el servicio
        });

      } else {
        // Cuando no está autenticado
        this.rol = 'Visitante';
        this.profileImageUrl = null; // No hay foto de perfil
      }
    });
  }

  ngOnInit() {
    this.userRole = this.responsableService.getUserRole();
    this.isLoggedIn$ = this.responsableService.loggedIn.asObservable();
  }

  logout() {
    this.responsableService.logout();
    this.router.navigate(['/ingresar']);
  }

  canAccess(role: number[]): boolean {
    return role.includes(this.userRole);
  }

  getRoleName(role: number): string {
    switch (role) {
      case 1: return 'Administrador';
      case 2: return 'Usuario';
      case 4: return 'Programador';
      default: return 'Visitante';
    }
  }

  openForm() {
    this.dialog.open(AscensoComponent, {
      width: '400px'
    });
  }
}
