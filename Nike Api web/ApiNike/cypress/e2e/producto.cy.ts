describe('Formulario de Creación de Producto', () => {
  beforeEach(() => {
    // Antes de cada prueba, visita la página donde se encuentra el formulario
    cy.visit('/form');
  });

  it('Debería mostrar los campos de entrada correctamente', () => {
    // Verifica que todos los campos estén presentes
    cy.get('#referencia').should('exist');
    cy.get('#nombre').should('exist');
    cy.get('#precio').should('exist');
    cy.get('#descripcion').should('exist');
    cy.get('#tipoProducto').should('exist');
    cy.get('#en_oferta').should('exist');
    cy.get('#ruta_imagen').should('exist');
  });

  it('Debería completar el formulario y enviarlo', () => {
    // Completa los campos del formulario
    cy.get('#referencia').type('12');
    cy.get('#nombre').type('Producto Test');
    cy.get('#precio').type('19.99');
    cy.get('#descripcion').type('Descripción del producto de prueba');
    cy.get('#tipoProducto').select('calzado');
    cy.get('#tipoProducto').should('have.value', 'calzado'); // Verifica que el valor sea el correcto


    // Marca el checkbox de "en oferta"
    cy.get('#en_oferta').check();

    // Subir una imagen (simula la selección de un archivo)
    cy.get('#ruta_imagen').selectFile('./src/assets/carr1.jpg', { force: true });

    // Verifica que el botón esté habilitado
    cy.get('button[type="submit"]').should('not.be.disabled');

    // Envía el formulario
    cy.get('button[type="submit"]').click();

    
  });

  it('Debería mostrar errores si los campos están vacíos', () => {
    // Envía el formulario sin completar los campos
    cy.get('button[type="submit"]').invoke('removeAttr', 'disabled').click();


  });
});
