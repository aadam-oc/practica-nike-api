import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiRestService } from '../../services/api-rest.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  rol: any;
  constructor(private router: Router, private ApiRestService: ApiRestService) { }
  logout() {
    this.ApiRestService.logoutUser();
    localStorage.clear();
    this.router.navigate(['/login']).catch((err) => {
      console.error('Error al redirigir:', err);
    });
  }

  ngOnInit() {
    if (localStorage.getItem('rol') !== null && localStorage.getItem('rol') !== undefined && localStorage.getItem('rol') !== '') {
      this.rol = localStorage.getItem('rol');
      
    }
  }
}
