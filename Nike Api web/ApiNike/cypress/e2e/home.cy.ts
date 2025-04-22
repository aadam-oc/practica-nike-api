describe('Página de inicio', () => {
  it('debería cargar correctamente', () => {
    cy.visit('http://localhost:4200');
    cy.contains('Productos destacados');
  });
});
