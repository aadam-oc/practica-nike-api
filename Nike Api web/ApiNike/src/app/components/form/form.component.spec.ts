import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar HttpClientTestingModule
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule para manejar formularios reactivos
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormComponent, // Importar el componente standalone
        HttpClientTestingModule, // Importar el módulo de pruebas para HttpClient
        ReactiveFormsModule // Importar ReactiveFormsModule para manejar formularios
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('El formulario existe', () => {
    expect(component.FormularioProducto).toBeDefined();
  });

  it('se debe iniciar el formulario con todo null', () => {
    const form = component.FormularioProducto;
    expect(form.value).toEqual({
      referencia: '',
      nombre: '',
      precio: '',
      descripcion: '',
      tipoProducto: '',
      en_oferta: false
    });
  });

  it('el formulario es invalido si esta vacio', () => {
    const form = component.FormularioProducto;
    form.controls['referencia'].setValue('');
    form.controls['nombre'].setValue('');
    form.controls['precio'].setValue('');
    form.controls['descripcion'].setValue('');
    form.controls['tipoProducto'].setValue('');
    expect(form.valid).toBeFalse();
  });

  it('el formulario es vlido si los datos son correctos', () => {
    const form = component.FormularioProducto;
    form.controls['referencia'].setValue('13');
    form.controls['nombre'].setValue('Producto de prueba');
    form.controls['precio'].setValue('100');
    form.controls['descripcion'].setValue('Descripción válida del producto');
    form.controls['tipoProducto'].setValue('calzado');
    form.controls['en_oferta'].setValue(true);
    expect(form.valid).toBeTrue();
  });

  it('si referencia esta vacia el formulario es invalido', () => {
    const referenciaControl = component.FormularioProducto.controls['referencia'];
    referenciaControl.setValue('');
    expect(referenciaControl.valid).toBeFalse();
    expect(referenciaControl.errors?.['required']).toBeTrue();
  });

  it('si nombre es demasiado corto el formulario es invalido', () => {
    const nombreControl = component.FormularioProducto.controls['nombre'];
    nombreControl.setValue('ab');
    expect(nombreControl.valid).toBeFalse();
    expect(nombreControl.errors?.['minlength']).toBeTruthy();
  });

  it('si el precio es menor que 0 el formulario es invalido', () => {
    const precioControl = component.FormularioProducto.controls['precio'];
    precioControl.setValue('-1');
    expect(precioControl.valid).toBeFalse();
    expect(precioControl.errors?.['min']).toBeTruthy();
  });

  it('si la descripcion es demasiado corta el formulario es invalido', () => {
    const descripcionControl = component.FormularioProducto.controls['descripcion'];
    descripcionControl.setValue('Corta');
    expect(descripcionControl.valid).toBeFalse();
    expect(descripcionControl.errors?.['minlength']).toBeTruthy();
  });

  it('si tipo producto esta vacio el formulario es invalido', () => {
    const tipoProductoControl = component.FormularioProducto.controls['tipoProducto'];
    tipoProductoControl.setValue('');
    expect(tipoProductoControl.valid).toBeFalse();
    expect(tipoProductoControl.errors?.['required']).toBeTruthy();
  });
});