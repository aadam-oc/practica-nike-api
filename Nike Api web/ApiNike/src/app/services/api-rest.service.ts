import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { get } from 'node:http';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  constructor(private http: HttpClient) { }

  private apiUrlImagenes = 'http://172.17.131.11:3000'; 
  private apiUrlProductos = 'http://localhost:3000';

  subirImagen(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrlImagenes}/upload`, formData);
  }

  // Obtener productos desde la API
  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrlProductos}/nike/productos`);
  }

  // Añadir producto a la API
  añadirProducto(producto: Product): Observable<any> {
    
    return this.http.post(`${this.apiUrlProductos}/nike/productos`, producto);
  }

  

  //editar producto en la API
  editarProducto(producto: Product, referencia: string): Observable<any> {
    return this.http.put(`${this.apiUrlProductos}/nike/productos/${referencia}`, producto);
  }

  // Verificar si un producto existe en la API por su referencia
  productoExistente(referencia: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrlProductos}/nike/productos/existe/${referencia}`);
  }

  // Obtener un producto por su referencia desde la API
  getProductoReferencia(referencia: string): Observable<any> {
    return this.http.get(`${this.apiUrlProductos}/nike/productos/${referencia}`);
  }

  eliminarProducto(referencia: string): Observable<any> {
    return this.http.delete(`${this.apiUrlProductos}/nike/productos/${referencia}`);
  }

  anadirAlCarrito(infoCarrito: any): Observable<any> {
    console.log(infoCarrito);
    return this.http.post(`${this.apiUrlProductos}/nike/carrito`, infoCarrito);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlProductos}/nike/login`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrlProductos}/nike/register`, user);
  }

  logoutUser(): Observable<any> {
    return this.http.post(`${this.apiUrlProductos}/nike/logout`, null);
  }

  updateUsuario(user: any, id: number): Observable<any> {
    return this.http.put(`${this.apiUrlProductos}/nike/usuarios/${id}`, user);
  }

  getCarrito(id_usuario: number): Observable<any> {
    return this.http.get(`${this.apiUrlProductos}/nike/carrito/${id_usuario}`);
  }

  comprarCarrito(id_usuario: number): Observable<any> {
    return this.http.post(`${this.apiUrlProductos}/nike/comprar/${id_usuario}`, null);
  }

  getCompras(id_usuario: number): Observable<any> {
    return this.http.get(`${this.apiUrlProductos}/nike/compras/${id_usuario}`);
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrlProductos}/nike/usuarios`);
  }
}
