import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const p = control.get('password')?.value;
  const c = control.get('confirmPassword')?.value;
  if (p && c && p !== c) return { mismatch: true };
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  formRegister
  errorMsg = signal<string>('')

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ){
    this.formRegister = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: matchPasswordValidator })
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onSubmit() {
    if (this.formRegister.invalid) return;

    const name = this.formRegister.value.name ?? ''
    const email = this.formRegister.value.email ?? ''
    const password = this.formRegister.value.password ?? ''

    const res = this.auth.register({ name, email, password });

    if (!res.ok) {
      this.errorMsg.set(res.msg || 'Error');
      return;
    }

    this.router.navigate(['/login']);
  }

  getError(control: string) {
    if (control === 'global') return this.errorMsg()

    switch (control) {
      case 'name':
        if (this.formRegister.controls.name.errors?.['required'])
          return 'El nombre es requerido'
        break;
      case 'email':
        if (this.formRegister.controls.email.errors?.['required'])
          return 'El email es requerido'
        if (this.formRegister.controls.email.errors?.['email'])
          return 'El email no es correcto'
        break;
      case 'password':
        if (this.formRegister.controls.password.errors?.['required'])
          return 'La contraseña es requerida'
        if (this.formRegister.controls.password.errors?.['minlength'])
          return 'Mínimo 8 caracteres'
        break;
      case 'confirmPassword':
        if (this.formRegister.controls.confirmPassword.errors?.['required'])
          return 'Repite la contraseña'
        if (this.formRegister.errors?.['mismatch'] && this.formRegister.controls.confirmPassword.touched)
          return 'Las contraseñas no coinciden'
        break;
    }
    return ''
  }
}