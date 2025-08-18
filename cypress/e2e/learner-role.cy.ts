describe('Learner Role Specific Tests', () => {
  beforeEach(() => {
    cy.clearAuthCookies()
  })

  it('should perform complete learner login flow', () => {
    cy.visit('/')
    
    // Click on Sign In
    cy.contains('Sign In').click()
    
    cy.loginAs('learner')
    cy.verifyRedirectToRole('learner')
    
    // Verify learner-specific elements
    cy.contains('Welcome,').should('be.visible')
    // cy.get('[data-testid="learner-progress"]').should('be.visible')
  })

  it('should handle learner-specific features', () => {
    cy.setAuthCookies('learner')
    cy.visit('/learner-dashboard')
    
    // Test learner-specific functionality
    // cy.get('[data-testid="course-list"]').should('be.visible')
    // cy.get('[data-testid="certificates"]').should('be.visible')
  })
})