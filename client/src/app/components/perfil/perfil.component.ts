import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsableService } from '../../services/responsable.service';
import { Responsable } from '../../models/responsable';
import { TwilioService } from '../../services/twilio.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: Responsable | null = null;
  isEditingPhone: boolean = false;
  originalPhone: string | null = null;
  verificationCode: string = '';
  lada: string = ''; // Propiedad para la lada seleccionada
  ladas: string[] = ['+52', '+1', '+34', '+54']; // Ejemplo de ladas, añade las que necesites
  isVerificationCodeSent: boolean = false; // Nueva propiedad para controlar la visibilidad del input del código

  constructor(
    private responsableService: ResponsableService,
    private snackBar: MatSnackBar,
    private twilioService: TwilioService
  ) {}

  ngOnInit(): void {
    const userId = this.responsableService.getUserId();
    if (userId) {
      this.responsableService.getResponsable(userId).subscribe(
        data => {
          this.user = data;
        },
        error => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  showWarning(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  enablePhoneEditing(): void {
    this.isEditingPhone = true;
    this.originalPhone = this.user?.telefono || null;
    this.isVerificationCodeSent = false; // Reinicia la verificación cuando se inicia la edición
    this.verificationCode = ''; // Limpia el código de verificación
  }

  sendVerificationCode(): void {
    const fullPhone = this.lada + this.user?.telefono; // Concatenar lada y número de teléfono
    this.twilioService.startVerification(fullPhone).subscribe(
      () => {
        this.isVerificationCodeSent = true; // Marca que se ha enviado el código
        this.snackBar.open('Código de verificación enviado', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      (error: any) => {
        console.error('Error sending verification code:', error);
        this.showWarning('Error al enviar el código de verificación');
      }
    );
  }

  verifyAndSavePhone(): void {
    const fullPhone = this.lada + this.user?.telefono; // Concatenar lada y número de teléfono
    this.twilioService.checkVerification(fullPhone, this.verificationCode).subscribe(
      (response: any) => {
        if (response.status === 'approved') {
          this.responsableService.updatePhone(this.user?.idResp, fullPhone).subscribe(
            () => {
              this.isEditingPhone = false;
              this.isVerificationCodeSent = false; // Reinicia después de guardar el teléfono
              this.snackBar.open('Número de teléfono actualizado', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
            },
            (error: any) => {
              console.error('Error updating phone:', error);
              this.showWarning('Error al actualizar el número de teléfono');
            }
          );
        } else {
          this.showWarning('Código de verificación incorrecto');
        }
      },
      (error: any) => {
        console.error('Error verifying code:', error);
        this.showWarning('Error al verificar el código de verificación');
      }
    );
  }

  cancelEditing(): void {
    if (this.user) {
      this.user.telefono = this.originalPhone !== null ? this.originalPhone : undefined;
    }
    this.isEditingPhone = false;
    this.isVerificationCodeSent = false; // Reinicia el estado de verificación
  }
}
