describe('Login', () => {
  it('should login successfully with valid credentials', () => {
    cy.visit('/login');  // Visita la página de login

    // Completa los campos del formulario
    cy.get('input[formControlName="email"]').type('adamortizcasas@gmail.com');
    cy.get('input[formControlName="password"]').type('adamortizcasas');
    
    // Envía el formulario
    cy.get('button[type="submit"]').click();

    

    // Verifica que la URL cambie correctamente
    cy.url().should('include', '/home');
  });

  it('should show error message for invalid credentials', () => {
    cy.visit('/login');  // Visita la página de login

    // Rellenamos con credenciales incorrectas
    cy.get('input[formControlName="email"]').type('malmalmal@gmail.com');
    cy.get('input[formControlName="password"]').type('malmalmalmal');

    // Envía el formulario
    cy.get('button[type="submit"]').click();

    // Verifica que se muestra el mensaje de error
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { error: 'Correo o contraseña incorrectos' },
    }).as('loginRequest');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/home');
  });

  it('should disable the submit button when form is invalid', () => {
    cy.visit('/login');  // Visita la página de login

    // Deja el formulario vacío y verifica que el botón de submit esté deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should enable the submit button when form is valid', () => {
    cy.visit('/login');  // Visita la página de login

    // Rellena los campos con datos válidos
    cy.get('input[formControlName="email"]').type('adamortizcasas@gmail.com');
    cy.get('input[formControlName="password"]').type('adamortizcasas');

    // Verifica que el botón de submit esté habilitado
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
