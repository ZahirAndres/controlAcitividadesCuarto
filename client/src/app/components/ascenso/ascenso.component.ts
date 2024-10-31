import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsableService } from '../../services/responsable.service';
import { NotificationService } from '../../services/notificacion.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

declare var paypal: any;

@Component({
  selector: 'app-ascenso',
  templateUrl: './ascenso.component.html',
  styleUrls: ['./ascenso.component.css']
})
export class AscensoComponent implements OnInit {
  ascensoForm: FormGroup;
  showProgressBar = false;
  private paypalLoaded: boolean = false;
  public currency: string = 'MXN';
  public total: number = 200.00;

  constructor(
    private responsableService: ResponsableService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public notificationService: NotificationService,
    private http: HttpClient
  ) {
    this.ascensoForm = this.fb.group({
      razon: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPayPalScript();
  }

  loadPayPalScript(): void {
    if (this.paypalLoaded) {
      this.initPayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.getClientId()}&currency=${this.currency}&locale=es_MX`;
    script.onload = () => {
      this.paypalLoaded = true;
      this.initPayPalButton();
    };
    script.onerror = () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar el script de PayPal.',
      });
    };
    document.body.appendChild(script);
  }

  getClientId(): string {
    return 'AcaWZbFYfVqdakSWVvzBnQ9UhR1fi_l1y9pwq2sCu95G2tJsBo4qg7uAH9uLZAQ8zl4I-JqboC50gDSx';
  }

  initPayPalButton(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: this.currency,
              value: this.total.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Pago completado',
            text: 'Pago realizado por: ' + details.payer.name.given_name,
          });
          console.log('Detalles del pago:', details);
          this.onSubscriptionSuccess(details);
        });
      }
    }).render('#paypal-button-container');
  }

  onSubscriptionSuccess(details: any) {
    const razon = this.ascensoForm.get('razon')?.value;
    const paymentDetails = { ...details, razon };
  
    // Obtén la información del pagador
    const payerInfo = {
      nombre: details.payer.name.given_name,
      apellido: details.payer.name.surname,  
      correo: details.payer.email_address,      
      idTransaccion: details.id,                
      monto: details.purchase_units[0].amount.value, 
      moneda: details.purchase_units[0].amount.currency_code, 
      estado: details.status,                  
      fecha: new Date().toISOString(),         
      metodoPago: "PayPal",                  
      descripcion: "Suscripción a servicios premium" 
  };
  
    this.responsableService.enviarCorreoAscenso(razon, payerInfo).subscribe(
      response => {
        console.log('Correo enviado exitosamente:', response);
        this.notificationService.showNotification('Solicitud de ascenso enviada correctamente');
        this.sendPaymentDetailsToBackend(paymentDetails);
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
          this.initPayPalButton();
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

  // Enviar detalles del pago al backend
  sendPaymentDetailsToBackend(details: any): void {
    this.http.post('https://localhost:3000/responsables/pago', details)
      .subscribe(
        response => {
          console.log('Detalles del pago guardados exitosamente:', response);
        },
        error => {
          console.error('Error al guardar los detalles del pago:', error);
        }
      );
  } 
}
