import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar HttpClientTestingModule
import { ProductsComponent } from './products.component';
import { ApiRestService } from '../../services/api-rest.service';
import { of } from 'rxjs';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let apiService: jasmine.SpyObj<ApiRestService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiRestService', [
      'getProductos',
      'eliminarProducto',
      'anadirAlCarrito'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ProductsComponent, // Importar el componente standalone
        HttpClientTestingModule // Importar el módulo de pruebas para HttpClient
      ],
      providers: [
        { provide: ApiRestService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiRestService) as jasmine.SpyObj<ApiRestService>;
  });

  it('should create the component', () => {
    apiService.getProductos.and.returnValue(of([])); // Simular respuesta vacía
    fixture.detectChanges(); // Forzar la detección de cambios
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    const mockProductos = [
      { referencia: '13', nombre: 'Producto 1', precio: 100, descripcion: 'Descripción 1', cantidad: 10 },
      { referencia: '45', nombre: 'Producto 2', precio: 200, descripcion: 'Descripción 2', cantidad: 5 }
    ];
    apiService.getProductos.and.returnValue(of(mockProductos)); // Simular respuesta del servicio

    component.ngOnInit();

    expect(apiService.getProductos).toHaveBeenCalled();
    expect(component.productos).toEqual(mockProductos);
  });

  it('should delete a product when eliminarProducto is called', () => {
    const mockProductos = [
      { referencia: '13', nombre: 'Producto 1', precio: 100, descripcion: 'Descripción 1', cantidad: 10 },
      { referencia: '45', nombre: 'Producto 2', precio: 200, descripcion: 'Descripción 2', cantidad: 5 }
    ];
    component.productos = mockProductos;
    apiService.eliminarProducto.and.returnValue(of(null)); // Simular eliminación exitosa

    component.eliminarProducto('13');

    expect(apiService.eliminarProducto).toHaveBeenCalledWith('13');
    expect(component.productos.length).toBe(1);
    expect(component.productos[0].referencia).toBe('45');
  });

  it('should add a product to the cart when anadirAlCarrito is called', () => {
    const referencia = '13';
    const mockCarritoInfo = {
      referencia: referencia,
      id_usuario: '1'
    };
    spyOn(localStorage, 'getItem').and.returnValue('1');
    apiService.anadirAlCarrito.and.returnValue(of(null)); // Simular adición exitosa

    component.anadirAlCarrito(referencia);

    expect(apiService.anadirAlCarrito).toHaveBeenCalledWith(mockCarritoInfo);
  });

  it('should set the user role from localStorage on initialization', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'rol') return 'admin';
      return null;
    });

    apiService.getProductos.and.returnValue(of([])); // Simular respuesta vacía
    component.ngOnInit();

    expect(component.rol).toBe('admin');
  });

});
