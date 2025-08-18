/// <reference types="cypress" />

describe('AppHeader Navigation - Unauthenticated User', () => {
  beforeEach(() => {
    // Assumes you start at the home page (unauthenticated by default)
    cy.visit('/');
  });

  it('shows header and marketing links', () => {
    cy.get('header').should('be.visible');
    cy.get('a[href="/auth/signin"]').contains('Sign In').should('be.visible');
    cy.get('nav a').contains('Features').should('be.visible');
    cy.get('nav a').contains('How It Works').should('be.visible');
    cy.get('nav a').contains('Demo').should('be.visible');
  });

  it('can navigate using header links', () => {
    cy.get('nav').within(() => {
      cy.contains('a', 'Features').click();
    });
    cy.url().should('include', '#features');

    cy.get('nav').within(() => {
      cy.contains('a', 'How It Works').click();
    });
    cy.url().should('include', '#how-it-works');
    //get first
    cy.get('a[href="/public/course/demo/learner/demo"]').contains("Demo").click(); 
    cy.url().should('include', '/public/course/demo/learner/demo');
  });

  it('navigates to sign-in page', () => {
    cy.get('a[href="/auth/signin"]').click();
    cy.url().should('include', '/auth/signin');
  });

  // it('shows and hides the mobile menu', () => {
  //   cy.viewport('iphone-6');
  //   // Open mobile menu (hamburger icon)
  //   cy.get('button')
  //     .find('svg')
  //     .should('exist')
  //     .click();

  //   cy.contains('Features').should('be.visible');
  //   cy.contains('How It Works').should('be.visible');
  //   cy.contains('Demo').should('be.visible');

  //   // Close menu by clicking the hamburger/X again
  //   cy.get('button')
  //     .find('svg')
  //     .should('exist')
  //     .click();

  //   // Menu should now be closed (links not visible)
  //   cy.contains('Features').should('not.be.visible');
  // });

  // it('navigates using mobile menu', () => {
  //   cy.viewport('iphone-6');
  //   cy.get('button')
  //     .find('svg')
  //     .should('exist')
  //     .click(); // Open

  //   cy.contains('Demo').should('be.visible').click();
  //   cy.url().should('include', '/public/course/demo/learner/demo');
  // });
});
