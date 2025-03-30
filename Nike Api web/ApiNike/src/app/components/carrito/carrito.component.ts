import { Component } from '@angular/core';
import { ApiRestService } from '../../services/api-rest.service';
import { CommonModule } from '@angular/common';
import { Carrito } from '../../interfaces/carrito';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carrito: Carrito[] = [];
  
  constructor(private ApiRestService: ApiRestService) {
  }

  comprarCarrito() {
    const id = Number(localStorage.getItem('id'));
    
    this.ApiRestService.comprarCarrito(id).subscribe({
      next: (response) => {
        console.log('✅ Compra realizada:', response);
      }
    });
  }

  ngOnInit() {
    const id = Number(localStorage.getItem('id'));

    this.ApiRestService.getCarrito( id ).subscribe({
      next: (response) => {
        console.log('✅ Carrito:', response);
        console.log(response.id);
        console.log(response.referencia_producto);
        console.log(response.cantidad);
        this.carrito = response;
      }
    });
  }
}
