import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponsableService } from '../../services/responsable.service';
import { FaceboolService } from '../../services/facebool.service';
import { Responsable } from '../../models/responsable';

@Component({
  selector: 'app-ayudanos-conocerte',
  templateUrl: './ayudanos-conocerte.component.html',
  styleUrls: ['./ayudanos-conocerte.component.css']
})
export class AyudanosConocerteComponent implements OnInit {
  responsableForm: FormGroup;
  roles = [{ idRoles: 1, rol: 'Administrador' }, { idRoles: 2, rol: 'Usuario' }, { idRoles: 3, rol: 'Externo' }];
  passwordVisible = false;
  existingUsernameError: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private responsableService: ResponsableService,
    private fbService: FaceboolService,
    private router: Router
  ) {
    this.responsableForm = this.fb.group({
      nombUsuario: ['', [Validators.required, Validators.pattern('^[a-z0-9._]+$')]],
      telefono: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      correoElec: ['', [Validators.email]],
      contrasenia: ['', [Validators.required, this.passwordStrengthValidator]],
      confContrasenia: ['', [Validators.required]],
      nombres: ['', [Validators.required, this.noNumbersValidator]],
      appPaterno: ['', [Validators.required, this.noNumbersValidator]],
      appMaterno: ['', [this.noNumbersValidator]],
      numControl: ['', [Validators.pattern('^[A-Za-z0-9]*$')]],
      grupo: [''],
      idRoles: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.responsableForm.valueChanges.subscribe(() => {
      this.existingUsernameError = null;
      this.errorMessage = null;
    });
  }

  ngOnInit(): void {
    this.fbService.getUserInfo().then((userInfo: any) => {
      const userInfoKeys: Array<keyof typeof userInfo> = ['username', 'email', 'firstName', 'lastName', 'phone'];
      
      userInfoKeys.forEach((key) => {
        if (key in userInfo) {
          this.responsableForm.patchValue({
            [key]: userInfo[key] // Este es el cambio clave
          });
        }
      });
    }).catch((error: any) => {
      console.error('Error obteniendo información del usuario de Facebook:', error);
    });
  }

  getTooltipMessage(field: 'nombUsuario' | 'telefono' | 'correoElec' | 'contrasenia' | 'confContrasenia' | 'nombres' | 'appPaterno' | 'appMaterno' | 'numControl' | 'grupo'): string {
    const tooltips = {
      nombUsuario: 'Nombre de usuario. No se permiten mayúsculas.',
      telefono: 'Teléfono. Solo números.',
      correoElec: 'Correo electrónico válido.',
      contrasenia: 'Contraseña. Debe incluir números, mayúsculas, minúsculas y caracteres especiales.',
      confContrasenia: 'Confirmar contraseña.',
      nombres: 'Nombres. No se permiten números.',
      appPaterno: 'Apellido Paterno. No se permiten números.',
      appMaterno: 'Apellido Materno. No se permiten números.',
      numControl: 'Matrícula. Solo letras y números.',
      grupo: 'Grupo. Formato: AAA0000'
    };
    return tooltips[field];
  }

  passwordStrengthValidator(control: any) {
    if (control.value && !control.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      return { passwordStrength: true };
    }
    return null;
  }

  passwordMatchValidator(group: FormGroup) {
    if (group.get('contrasenia')?.value !== group.get('confContrasenia')?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  noNumbersValidator(control: any) {
    if (control.value && control.value.match(/\d/)) {
      return { noNumbers: true };
    }
    return null;
  }

  saveResponsable() {
    if (this.responsableForm.valid) {
      const responsable: Responsable = this.responsableForm.value;
      this.responsableService.saveResponsable(responsable).subscribe(
        () => {
          this.router.navigate(['/success']);
        },
        (error) => {
          this.errorMessage = 'Error al registrar el responsable.';
        }
      );
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  limpiar() {
    this.responsableForm.reset();
    this.existingUsernameError = null;
    this.errorMessage = null;
  }
}
