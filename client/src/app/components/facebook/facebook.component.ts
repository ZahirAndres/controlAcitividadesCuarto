import { Component, OnInit } from '@angular/core';
import { FaceboolService } from '../../services/facebool.service';
import { ResponsableService } from '../../services/responsable.service';
import { Router } from '@angular/router';
import { Responsable } from '../../models/responsable';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent implements OnInit {
  user: any;

  constructor(
    private fbService: FaceboolService,
    private responsableService: ResponsableService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fbService.initFacebookSdk();
  }

  loginWithFacebook(): void {
    this.fbService.login().then(() => {
      this.fbService.getProfile().then(profile => {
        this.user = profile;

        console.log('Perfil de Facebook:', profile); // Verifica la estructura del perfil

        // Segmentar el nombre completo
        const nombreCompleto = profile.name.split(' ');
        const nombres = nombreCompleto.slice(0, -2).join(' ');
        const appPaterno = nombreCompleto[nombreCompleto.length - 2] || '';
        const appMaterno = nombreCompleto[nombreCompleto.length - 1] || '';

        const nombUsuario = profile.name.toLowerCase().replace(/\s+/g, '');
        console.log('Nombre de usuario generado:', nombUsuario); 

        const nuevoResponsable: Responsable = {
          nombUsuario: nombUsuario,
          nombres: nombres || profile.name, 
          appPaterno: appPaterno,
          appMaterno: appMaterno,
          correoElec: profile.email || '', // Asegúrate de tener un valor por defecto
          telefono: '',
          contrasenia: '',
          idRoles: 2
        };

        this.registrarUsuario(nuevoResponsable);
      }).catch(error => {
        console.error('Error obteniendo el perfil:', error);
      });
    }).catch(error => {
      console.error('Error iniciando sesión:', error);
    });
  }

  registrarUsuario(responsable: Responsable): void {
    this.responsableService.saveResponsable(responsable).subscribe(response => {
      console.log('Usuario registrado:', response);
      localStorage.setItem('user', JSON.stringify(response));
      this.responsableService.loggedIn.next(true);
      this.registroExitoso();
      this.router.navigate(['/inicio/inicio']);
            if (responsable.correoElec) {
              this.responsableService.enviarCorreoVerificacion(responsable.correoElec).subscribe(
                resp => {
                  console.log('Correo de verificación enviado:', resp);
                  this.snackBar.open('Correo de verificación enviado', 'Cerrar', {
                    duration: 2000,
                    panelClass: ['success-snackbar']
                  });
                },
                err => {
                  console.error('Error al enviar el correo de verificación:', err);
                  this.snackBar.open('Error al enviar el correo de verificación', 'Cerrar', {
                    duration: 2000,
                    panelClass: ['error-snackbar']
                  });
                }
              );

      } else {
        console.error('No se pudo enviar el correo de verificación: correo electrónico no disponible.');
      }
    }, error => {
      console.error('Error al registrar usuario:', error);
    });
  }

  registroExitoso() {
    this.snackBar.open('Registro completado con éxito, revisa tu correo', 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }
}
