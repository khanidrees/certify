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

describe('User Type Selection and Submit Button', () => {
  beforeEach(() => {
    // You can replace this with the URL or mount your component if using cypress-react-unit-test
    cy.clearAllCookies();
    cy.visit('/auth/signup');
  });

  it('Shows "Learner" and "Organization" radio buttons', () => {
    cy.get('input[type="radio"][name="userType"]').should('have.length', 2);
    cy.contains('Learner').should('exist');
    cy.contains('Organization').should('exist');
  });

  it('Default selection and behavior', () => {
    // Assuming default userType is 'learner' (if different, adjust)
    cy.get('input[value="learner"]').should('not.be.checked');
    cy.get('input[value="org"]').should('be.checked');

    

    
    cy.get('button[type="submit"]')
      .should('not.be.disabled');
  });

  it('Selecting "Organization" enables the submit button and hides the warning', () => {
    cy.get('input[value="org"]').check({ force: true });

    cy.get('input[value="org"]').should('be.checked');
    cy.get('input[value="learner"]').should('not.be.checked');

    // The learner warning message should not be visible
    cy.contains('Learners cannot register. Please contact your organization.').should('not.exist');

    // Submit button should be enabled
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('Selecting "Learner" disables the submit button and shows the warning again', () => {
    // First select org and then learner to test toggling
    cy.get('input[value="org"]').check({ force: true });
    cy.get('input[value="learner"]').check({ force: true });

    cy.get('input[value="learner"]').should('be.checked');

    cy.contains('Learners cannot register. Please contact your organization.').should('be.visible');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Submit button triggers form submission only when enabled', () => {
    // Stub the form submission or button click handler if possible.
    // This example assumes you have a form wrapping the button.
    
    // Try submit when disabled
    cy.get('button[type="submit"]').click();
    // You can assert something that should NOT happen here, like no request sent

    // Select org to enable the button
    cy.get('input[value="org"]').check({ force: true });

    // Now submit
    cy.get('button[type="submit"]').click();

    // Here you could check for a form submission side effect or API call if mocked
  });
});