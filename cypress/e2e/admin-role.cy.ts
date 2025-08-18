// cypress/e2e/admin-role.cy.ts

describe('Admin Role Specific Tests', () => {
  beforeEach(() => {
    cy.clearAuthCookies()
  })

  it('should perform complete admin login flow', () => {
    // Start from home or any page
    cy.visit('/')
    
    //click on Sign In
    cy.contains('Sign In').click()
    
    // Login as admin
    cy.loginAs('admin')
    
    // Should redirect to admin dashboard
    cy.verifyRedirectToRole('admin')
    
    // Verify admin-specific elements (you'll need to add these based on your dashboard)
    cy.contains('Admin Dashboard').should('be.visible')
    // cy.get('[data-testid="admin-menu"]').should('be.visible')
  })

  it('should maintain admin session across page reloads', () => {
    cy.setAuthCookies('admin')
    cy.visit('/admin/dashboard')
    
    // Reload page
    cy.reload()
    
    // Should still be on admin dashboard
    cy.url().should('include', '/admin/dashboard')
    cy.getCookie('role').should('have.property', 'value', 'admin')
  })
})
