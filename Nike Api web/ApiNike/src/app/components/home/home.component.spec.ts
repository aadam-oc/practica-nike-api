import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Importar 'of' para simular observables
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent], // Importar el componente standalone
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

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Verificar que el componente se crea correctamente
  });
});
