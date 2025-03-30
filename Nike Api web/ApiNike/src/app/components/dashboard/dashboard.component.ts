import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  rol: any;
  userForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private ApiRestService: ApiRestService, private router: Router) {
    this.userForm = this.fb.group({
      id: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
      rol: ['', [Validators.required]]
    });
  }

  FormularioUser = new FormGroup({
    id: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required]),
    rol: new FormControl('', [Validators.required])
  });



  onSubmit() {
    if (this.userForm.invalid) {
      console.log('Formulario inválido:', this.userForm.value);
      return;
    }

    const userData = {
      correo: this.userForm.value.email,
      contrasena: this.userForm.value.contrasena,
      rol: this.userForm.value.rol
    };

    const id = Number(this.userForm.value.id);

    this.ApiRestService.updateUsuario( userData, id).subscribe({
      next: (response) => {
        console.log('✅ Usuario actualizado:', response);
      }
    });

      






  }

  ngOnInit(): void {
      this.rol = localStorage.getItem('rol');

    
  }
}
