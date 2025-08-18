// cypress/e2e/organization-role.cy.ts

describe('Organization Role Specific Tests', () => {
  beforeEach(() => {
    cy.clearAuthCookies()
  })

  it('should perform complete organization login flow', () => {
    cy.visit('/')
    
    // Click on Sign In
    cy.contains('Sign In').click()
    
    cy.loginAs('organization')
    cy.verifyRedirectToRole('organization')
    
    // Verify organization-specific elements
    cy.contains('Organization Dashboard').should('be.visible')
    // cy.get('[data-testid="org-menu"]').should('be.visible')
  })

  it('should navigate to signup from signin page', () => {
    cy.visit('/auth/signin')
    
    cy.contains('Need an organization account?').click()
    cy.url().should('include', '/auth/signup')
  })
});

describe('Organization Courses creation and management', () => {
  beforeEach(() => {
    cy.clearAuthCookies()
    cy.loginAs('organization')
  })

  it('should create a new course', () => {
    cy.get('button').contains('Create New Course').click()
    const randomName = `Course-${Date.now()}`
    // Fill in course details
    cy.get('input[name="courseName"]').type(randomName)
    cy.get('textarea[name="description"]').type('Course description here.')
    cy.get('button[type="submit"]').click()
    
    // Verify course creation success
    cy.contains('Course created successfully.').should('be.visible')
  })

  it('should list all courses', () => {
    
    // Verify courses are listed
    cy.contains('Organization Dashboard').should('be.visible')
    cy.get('.course-card').should('have.length.greaterThan', 0)
  })
});
