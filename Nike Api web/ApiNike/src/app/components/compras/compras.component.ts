import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiRestService } from '../../services/api-rest.service';

@Component({
  selector: 'app-compras',
  imports: [CommonModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent {

  compras: any[] = [];
  constructor(private ApiRestService: ApiRestService) {}

  getCompras() {
    const id = Number(localStorage.getItem('id'));
    this.ApiRestService.getCompras(id).subscribe(data => {
      this.compras = data;
      console.log('Compras:', this.compras);
    }, error => {
      console.error('Error al obtener compras:', error);
    });

  }
  ngOnInit() {
    this.getCompras();
  }
}
