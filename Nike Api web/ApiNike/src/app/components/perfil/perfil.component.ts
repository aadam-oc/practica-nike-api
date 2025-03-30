import { Component } from '@angular/core';
import { ComprasComponent } from '../compras/compras.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { get } from 'http';

@Component({
  selector: 'app-perfil',
  imports: [ComprasComponent, DashboardComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  rolPre = localStorage.getItem('rol');
  updateForm: FormGroup;

  usuarios: any[] = [];


  constructor(private fb: FormBuilder, private router: Router, private ApiRestService: ApiRestService) {
    this.updateForm = this.fb.group({
      correo: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
  }

  getallUsuarios() {
    this.ApiRestService.getUsuarios().subscribe({
      next: (response) => {
        console.log('✅ Usuarios obtenidos:', response);
        this.usuarios = response;
      },
      error: (error) => {
        console.error('❌ Error al obtener usuarios:', error);
      }
    });
  }



  onSubmit() {

    

    if (this.updateForm.invalid) {
      console.log('Formulario inválido:', this.updateForm.value);
      return;
    }

    const id = Number(localStorage.getItem('id'));
    const updateData = {
      correo: this.updateForm.value.correo,
      contrasena: this.updateForm.value.contrasena,
      rol: localStorage.getItem('rol')
    };

    console.log('📤 Enviando datos:', JSON.stringify(updateData));

    this.ApiRestService.updateUsuario(updateData, id).subscribe({
      next: (response) => {
        console.log('✅ Usuario actualizado:', response);
        localStorage.setItem('email', response.user.correo);
        this.router.navigate(['/perfil']).catch((err) => {
          console.error('❌ Error al redirigir a /perfil:', err);
        });
      },
      error: (error) => {
        console.error('❌ Error al actualizar usuario:', error);
      }
    });

  }

  ngOnInit(): void {
    this.getallUsuarios();
  }
}
