import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; 

  constructor(private fb: FormBuilder, private ApiRestService: ApiRestService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  FormularioLogin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required])
  });



  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('Formulario inválido:', this.loginForm.value);
      return;
    }
  
    const loginData = {
      correo: this.loginForm.value.email,
      contrasena: this.loginForm.value.password
    };
  
    console.log('📤 Enviando datos:', JSON.stringify(loginData));
  
    this.ApiRestService.loginUser(loginData).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('id', response.user.id);
        localStorage.setItem('email', response.user.correo);
        localStorage.setItem('rol', response.user.rol);
        
    
        // Verificar si el token está guardado correctamente
        console.log('Token guardado en localStorage:', localStorage.getItem('token'));
    
        // Redirección después del login exitoso
        this.router.navigate(['/home']).catch((err) => {
            
          console.error('Error al redirigir:', err);
        });
      },
      error: (err) => {
        console.error('❌ Error en el login', err);
        this.errorMessage = 'Credenciales incorrectas. Inténtalo nuevamente.';
      }
    });
    
  }
  
  ngOnInit(): void {
  }
}
