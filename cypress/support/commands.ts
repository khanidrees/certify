/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//


declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'admin' | 'organization' | 'learner'): Chainable<void>
      loginWithCredentials(email: string, password: string): Chainable<void>
      verifyRedirectToRole(role: 'admin' | 'organization' | 'learner'): Chainable<void>
      clearAuthCookies(): Chainable<void>
      setAuthCookies(role: 'admin' | 'organization' | 'learner'): Chainable<void>
    }
  }
}

// Login with credentials via UI
Cypress.Commands.add('loginWithCredentials', (email: string, password: string) => {
  cy.visit('/auth/signin')
  
  // Fill in email
  cy.get('input[name="username"]')
    .clear()
    .type(email)
    .should('have.value', email)
  
  // Fill in password
  cy.get('input[name="password"]')
    .clear()
    .type(password)
    .should('have.value', password)
  
  // Submit form
  cy.get('button[type="submit"]').click()
})

// Login as specific role using environment variables
Cypress.Commands.add('loginAs', (role: 'admin' | 'organization' | 'learner') => {
  const credentials = {
    admin: {
      email: Cypress.env('ADMIN_EMAIL'),
      password: Cypress.env('ADMIN_PASSWORD')
    },
    organization: {
      email: Cypress.env('ORG_EMAIL'),
      password: Cypress.env('ORG_PASSWORD')
    },
    learner: {
      email: Cypress.env('LEARNER_EMAIL'),
      password: Cypress.env('LEARNER_PASSWORD')
    }
  }
  
  const { email, password } = credentials[role]
  cy.loginWithCredentials(email, password)
})

// Verify redirect based on role
Cypress.Commands.add('verifyRedirectToRole', (role: 'admin' | 'organization' | 'learner') => {
  const expectedUrls = {
    admin: '/admin/dashboard',
    organization: '/dashboard',
    learner: '/learner-dashboard'
  }
  
  cy.url().should('include', expectedUrls[role])
})

// Clear authentication cookies
Cypress.Commands.add('clearAuthCookies', () => {
  cy.clearCookie('token')
  cy.clearCookie('role')
})

// Set authentication cookies (for bypassing login UI)
Cypress.Commands.add('setAuthCookies', (role: 'admin' | 'organization' | 'learner') => {
  // Mock token - in real tests, you'd get this from your API
  const mockToken = `mock-${role}-token-${Date.now()}`
  
  cy.setCookie('token', mockToken, {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'lax'
  })
  
  cy.setCookie('role', role, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  })
})

export {}
