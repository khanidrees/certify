/// <reference types="cypress" />

describe('Organization Signup Page', () => {
  beforeEach(() => {
    cy.visit('/auth/signup'); // Adjust route if needed
  });

  it('renders all form inputs and UI components', () => {
    cy.contains('Create Organization Account').should('be.visible');
    cy.get('input[name="organizationName"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Submit Request').should('exist');
    cy.contains('Already have an account?').should('exist');
    cy.contains('Organization registration requires admin approval').should('exist');
  });

  it('shows client-side validation errors on empty submission', () => {
    cy.get('button[type="submit"]').click();

    cy.get('p.text-red-500')
      .should('contain', 'Organization name is required.')
      .and('exist');

    cy.get('p.text-red-500')
      .should('contain', 'Email address is required.')
      .and('exist');

    cy.get('p.text-red-500')
      .should('contain', 'Password is required.')
      .and('exist');
  });

  it('shows client-side validation for invalid email and short organization name/password', () => {
    cy.get('input[name="organizationName"]').type('ab');
    cy.get('input[name="username"]').type('invalid-email');
    cy.get('input[name="password"]').type('123');

    cy.get('button[type="submit"]').click();

    cy.get('p.text-red-500').should('contain', 'Organization name must be at least 3 characters.');
    cy.get('p.text-red-500').should('contain', 'Please enter a valid email address.');
    cy.get('p.text-red-500').should('contain', 'Password must be at least 6 characters.');
  });

  it('toggles password visibility properly', () => {
    cy.get('input[name="password"]').type('MySecret123!');
    // Initially hidden password
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');

    // Click to show password
    cy.get('button[aria-label="Show password"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');

    // Click to hide password again
    cy.get('button[aria-label="Hide password"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('submits the form with valid data successfully', () => {
    const uniqueEmail = `testorg+${Date.now()}@example.com`;

    cy.get('input[name="organizationName"]').clear().type('Valid Organization');
    cy.get('input[name="username"]').clear().type(uniqueEmail);
    cy.get('input[name="password"]').clear().type('ValidPass123');

    cy.get('button[type="submit"]').click();

    // Check for presence of success or approval-related message
    cy.get('div.mt-4')
    .should('be.visible')
    .should(($el) => {
      const text = $el.text().toLowerCase();
      expect(
        text.includes('user created') 
      ).to.be.true;
    });
    cy.get('input[name="organizationName"]').clear().type('Valid Organization');
    cy.get('input[name="username"]').clear().type(uniqueEmail);
    cy.get('input[name="password"]').clear().type('ValidPass123');

    cy.get('button[type="submit"]').click();

    // Check for presence of success or approval-related message
    cy.get('div.mt-4')
    .should('be.visible')
    .should(($el) => {
      const text = $el.text().toLowerCase();
      expect(
        text.includes('registration failed') 
      ).to.be.true;
    });
    
  });

  it('navigates to sign-in page on clicking "Already have an account?"', () => {
    cy.contains('Already have an account?').click();
    cy.url().should('include', '/auth/signin');
  });
});
