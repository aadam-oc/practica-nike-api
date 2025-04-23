import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Importar HttpTestingController
import { ApiRestService } from './api-rest.service';
import { Product } from '../interfaces/product';

describe('ApiRestService', () => {
  let service: ApiRestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Agregar HttpClientTestingModule para manejar dependencias de HttpClient
      providers: [ApiRestService]
    });
    service = TestBed.inject(ApiRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verificar que no haya solicitudes HTTP pendientes
  });

  it('should create the service', () => {
    expect(service).toBeTruthy(); // Verificar que el servicio se crea correctamente
  });

  it('should add a product using añadirProducto', () => {
    const mockProduct: Product = {
      referencia: '123',
      nombre: 'Producto de prueba',
      precio: 100,
      descripcion: 'Descripción del producto',
      tipo_de_producto: 'calzado',
      en_oferta: false,
      ruta_imagen: 'http://example.com/image.jpg',
      cantidad: 10
    };

    service.añadirProducto(mockProduct).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne('http://localhost:3000/nike/productos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);

    req.flush({ success: true }); // Simular respuesta del servidor
  });

  it('should fetch products using getProductos', () => {
    const mockProductos = [
      { referencia: '123', nombre: 'Producto 1', precio: 100 },
      { referencia: '456', nombre: 'Producto 2', precio: 200 }
    ];

    service.getProductos().subscribe(productos => {
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne('http://localhost:3000/nike/productos');
    expect(req.request.method).toBe('GET');

    req.flush(mockProductos); // Simular respuesta del servidor
  });

  it('should edit a product using editarProducto', () => {
    const mockProduct: Product = {
      referencia: '123',
      nombre: 'Producto actualizado',
      precio: 150,
      descripcion: 'Descripción actualizada',
      tipo_de_producto: 'calzado',
      en_oferta: true,
      ruta_imagen: 'http://example.com/image-updated.jpg',
      cantidad: 5
    };

    service.editarProducto(mockProduct, '123').subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne('http://localhost:3000/nike/productos/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);

    req.flush({ success: true }); // Simular respuesta del servidor
  });

  it('should delete a product using eliminarProducto', () => {
    service.eliminarProducto('123').subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne('http://localhost:3000/nike/productos/123');
    expect(req.request.method).toBe('DELETE');

    req.flush({ success: true }); // Simular respuesta del servidor
  });
});
