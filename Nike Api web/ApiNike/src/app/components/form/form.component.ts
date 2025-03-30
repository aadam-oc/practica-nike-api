import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  imagenUrl: string = '';
  imagenSeleccionada: boolean = false;
  existe: boolean = false;

  constructor(private apiRestService: ApiRestService) { }

  FormularioProducto = new FormGroup({
    referencia: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]),
    tipoProducto: new FormControl('', [Validators.required]),
    en_oferta: new FormControl(false)
  });

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.imagenSeleccionada = true;

      this.apiRestService.subirImagen(file).subscribe(response => {
        this.imagenUrl = response.imageUrl;
        this.imagenSeleccionada = false;
      });
    }
  }

  ExisteProducto(): void {

    const existe = this.apiRestService.productoExistente(this.FormularioProducto.value.referencia as string);
    if (existe) {
      this.existe = true;
      this.apiRestService.getProductoReferencia(this.FormularioProducto.value.referencia as string).subscribe(producto => {
        this.FormularioProducto.patchValue({
          referencia: producto.Referencia,
          nombre: producto.Nombre,
          precio: producto.Precio,
          descripcion: producto.Descripcion,
          tipoProducto: producto.TipoProducto,
          en_oferta: producto.EnOferta
        });
      });
      
    }
    else {
      this.existe = false;
    }
  }

  onSubmit() {
    //console.log(this.FormularioProducto.value);

    if (this.FormularioProducto.invalid) {
      alert('Formulario inválido');
      return;
    } else {
      const producto: Product = {
        referencia: this.FormularioProducto.value.referencia as string,
        nombre: this.FormularioProducto.value.nombre as string,
        precio: Number(this.FormularioProducto.value.precio),
        descripcion: this.FormularioProducto.value.descripcion as string,
        tipo_de_producto: this.FormularioProducto.value.tipoProducto as string,
        en_oferta: this.FormularioProducto.value.en_oferta as boolean,
        ruta_imagen: this.imagenUrl,
        cantidad: 1
      };

      this.apiRestService.añadirProducto(producto).subscribe(response => {
        console.log('Producto añadido:', response);
        alert('Producto añadido');
      }, error => {
        console.error('Error al añadir producto:', error);
        alert('Error al añadir producto');
      });

    }
  }
}

