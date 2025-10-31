import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formLogin
  errorMsg = signal<string>('')

  constructor(
    private formSvc: FormBuilder,
    private auth: AuthService,
    private router: Router
  ){
    this.formLogin = this.formSvc.group({
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
    });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onSubmit(){
    const email = this.formLogin.value.email ?? ''
    const password = this.formLogin.value.password ?? ''

    const res = this.auth.login({ email, password });

    if (!res.ok) {
      this.errorMsg.set(res.msg || 'No autorizado');
      return;
    }

    this.router.navigate(['/dashboard']);
  }

  getError(control:string){
    if (control === 'global') return this.errorMsg()

    switch(control){
      case 'email':
        if(this.formLogin.controls.email.errors?.['required'])
          return "El campo email es requerido";
        else if(this.formLogin.controls.email.errors?.['email'])
          return "El email no es correcto";
        break;
      case 'password': 
        if(this.formLogin.controls.password.errors?.['required'])
          return "El campo password es requerido";
        break;
    }
    return "";
  }
}