import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar HttpClientTestingModule
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Importar 'of' para simular observables
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent, // Importar el componente standalone
        HttpClientTestingModule // Importar el módulo de pruebas para HttpClient
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Simular parámetros de ruta
            queryParams: of({}) // Simular parámetros de consulta
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Verificar que el componente se crea correctamente
  });
});
