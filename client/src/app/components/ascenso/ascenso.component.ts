import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsableService } from '../../services/responsable.service';
import { NotificationService } from '../../services/notificacion.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { loadScript, PayPalNamespace } from '@paypal/paypal-js';

@Component({
  selector: 'app-ascenso',
  templateUrl: './ascenso.component.html',
  styleUrls: ['./ascenso.component.css']
})
export class AscensoComponent implements OnInit {
  ascensoForm: FormGroup;
  showProgressBar = false;
  private paypal: PayPalNamespace | null = null;

  constructor(
    private responsableService: ResponsableService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public notificationService: NotificationService
  ) {
    this.ascensoForm = this.fb.group({
      razon: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPayPalScript();
  }

  loadPayPalScript() {
    loadScript({ clientId: "AcaWZbFYfVqdakSWVvzBnQ9UhR1fi_l1y9pwq2sCu95G2tJsBo4qg7uAH9uLZAQ8zl4I-JqboC50gDSx" })
      .then((paypal) => {
        this.paypal = paypal;
        this.renderPayPalButton();
      })
      .catch((err) => {
        console.error('Error al cargar PayPal:', err);
      });
  }

  renderPayPalButton() {
    if (this.paypal && typeof this.paypal.Buttons === 'function') {
      this.paypal.Buttons({
        createOrder: (data, actions) => {
          if (actions.order) {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  currency_code: 'USD',
                  value: '10.00'
                }
              }]
            });
          } else {
            console.error('actions.order es undefined');
            return Promise.reject();
          }
        },
        onApprove: (data, actions) => {
          if (actions.order) {
            return actions.order.capture().then((details: any) => {
              this.onSubscriptionSuccess(details);
            });
          } else {
            console.error('actions.order es undefined');
            return Promise.reject();
          }
        },
        onError: (err) => {
          console.error('Error en el pago:', err);
          /* this.envioFallido(); */
        }
      }).render('#paypal-button-container');
    } else {
      console.error('PayPal no está disponible.');
    }
  }

  onSubscriptionSuccess(details: any) {
    const razon = this.ascensoForm.get('razon')?.value;
    this.responsableService.enviarCorreoAscenso(razon).subscribe(
      response => {
        console.log('Correo enviado exitosamente:', response);
        this.notificationService.showNotification('Solicitud de ascenso enviada correctamente');
        setTimeout(() => {
          this.showProgressBar = false;
          this.dialog.closeAll();
        }, 1000);
      },
      error => {
        console.error('Error al enviar el correo:', error);
        this.showProgressBar = false;
        this.envioFallido();
      }
    );
  }

  onSubmit() {
    if (this.ascensoForm.valid) {
      this.showProgressBar = true;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          message: '¿Estás seguro de que deseas enviar la solicitud de ascenso?',
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this.renderPayPalButton();
        } else {
          this.showProgressBar = false;
        }
      });
    } else {
      console.error('La razón del ascenso es requerida.');
    }
  }

  onCancel() {
    this.dialog.closeAll();
    this.ascensoForm.reset();
  }

  envioExitoso() {
    this.snackBar.open('Correo enviado con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  envioFallido() {
    this.snackBar.open('Correo enviado sin éxito', 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}