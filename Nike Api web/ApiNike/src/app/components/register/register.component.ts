import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() registerEvent = new EventEmitter<any>(); 
  title = 'Form-Registro';
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private ApiRestService: ApiRestService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = {
        correo: this.registerForm.value.email,
        contrasena: this.registerForm.value.password,
        rol: 'user'
      };
      console.log('Datos del formulario:', userData);
      this.registerEvent.emit(userData);
      this.ApiRestService.registerUser(userData).subscribe({
        next: (response) => {
          console.log('✅ Usuario registrado:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('id', response.user.id);
          localStorage.setItem('email', response.user.email);
          localStorage.setItem('rol', response.user.rol);
          localStorage.setItem('nombre', response.user.nombre);
          this.router.navigate(['/login']).catch((err) => {
            console.error('Error al redirigir:', err);
          });
        }
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  ngOnInit(): void {
    
  }
}
