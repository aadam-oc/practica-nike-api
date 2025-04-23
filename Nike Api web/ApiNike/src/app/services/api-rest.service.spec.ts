import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar el módulo de pruebas para HttpClient
import { ApiRestService } from './api-rest.service';

describe('ApiRestService', () => {
  let service: ApiRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Agregar HttpClientTestingModule para manejar dependencias de HttpClient
    });
    service = TestBed.inject(ApiRestService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy(); // Verificar que el servicio se crea correctamente
  });
});
