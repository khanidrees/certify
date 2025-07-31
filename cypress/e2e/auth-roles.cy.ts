// cypress/e2e/auth-roles.cy.ts

describe('Authentication and Role-Based Access Control', () => {
  beforeEach(() => {
    // Clear cookies before each test
    cy.clearAuthCookies()
  })

  describe('Sign In Page', () => {
    it('should display sign in form correctly', () => {
      cy.visit('/auth/signin')
      
      // Check page elements
      cy.contains('Welcome Back').should('be.visible')
      cy.contains('Sign in to your VerifyCertify account').should('be.visible')
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('contain', 'Sign In')
      
      // Check navigation link
      cy.contains('Need an organization account?').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/auth/signin')
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click()
      
      // Should show client-side validation errors
      cy.contains('Email address is required').should('be.visible')
      cy.contains('Password is required').should('be.visible')
    })

    

    it('should toggle password visibility', () => {
      cy.visit('/auth/signin')
      
      cy.get('input[name="password"]').should('have.attr', 'type', 'password')
      
      // Click eye icon to show password
      cy.get('button[aria-label="Show password"]').click()
      cy.get('input[name="password"]').should('have.attr', 'type', 'text')
      
      // Click eye-off icon to hide password
      cy.get('button[aria-label="Hide password"]').click()
      cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    })
  })

  describe('Admin Role Authentication', () => {
    it('should login admin and redirect to admin dashboard', () => {
      cy.loginAs('admin')
      
      // Should redirect to admin dashboard
      cy.verifyRedirectToRole('admin')
      
      // Verify cookies are set
      cy.getCookie('token').should('exist')
      cy.getCookie('role').should('have.property', 'value', 'admin')
    })

    it('should redirect authenticated admin away from auth pages', () => {
      // Set admin cookies first
      cy.setAuthCookies('admin')
      
      // Try to visit signin page
      cy.visit('/auth/signin')
      cy.verifyRedirectToRole('admin')
      
      // Try to visit signup page
      cy.visit('/auth/signup')
      cy.verifyRedirectToRole('admin')
    })
  });

  describe('Organization Role Authentication', () => {
    it('should login organization and redirect to organization dashboard', () => {
      cy.loginAs('organization')
      
      // Should redirect to organization dashboard
      cy.verifyRedirectToRole('organization')
      
      // Verify cookies are set
      cy.getCookie('token').should('exist')
      cy.getCookie('role').should('have.property', 'value', 'organization')
    })

    it('should redirect authenticated organization away from auth pages', () => {
      cy.setAuthCookies('organization')
      
      // Try to visit signin page
      cy.visit('/auth/signin')
      cy.verifyRedirectToRole('organization')
      
      // Try to visit signup page
      cy.visit('/auth/signup')
      cy.verifyRedirectToRole('organization')
    })

    it('should allow organization to access dashboard directly', () => {
      cy.setAuthCookies('organization')
      
      cy.visit('/dashboard')
      cy.url().should('include', '/dashboard')
      cy.url().should('not.include', '/auth')
    })
  })

  describe('Learner Role Authentication', () => {
    it('should login learner and redirect to learner dashboard', () => {
      cy.loginAs('learner')
      
      // Should redirect to learner dashboard
      cy.verifyRedirectToRole('learner')
      
      // Verify cookies are set
      cy.getCookie('token').should('exist')
      cy.getCookie('role').should('have.property', 'value', 'learner')
    })

    it('should redirect authenticated learner away from auth pages', () => {
      cy.setAuthCookies('learner')
      
      // Try to visit signin page
      cy.visit('/auth/signin')
      cy.verifyRedirectToRole('learner')
      
      // Try to visit signup page  
      cy.visit('/auth/signup')
      cy.verifyRedirectToRole('learner')
    })

    it('should allow learner to access learner dashboard directly', () => {
      cy.setAuthCookies('learner')
      
      cy.visit('/learner-dashboard')
      cy.url().should('include', '/learner-dashboard')
      cy.url().should('not.include', '/auth')
    })
  })

  describe('Middleware Protection', () => {
    before(() => {
      // Clear cookies before each test
      cy.clearAuthCookies()
    })
    it('should redirect unauthenticated users to signin', () => {
      // Try to access protected routes without authentication
      
      cy.visit('/admin/dashboard')
      cy.url().should('include', '/auth/signin')
      
      cy.visit('/dashboard')  
      cy.url().should('include', '/auth/signin')
      
      cy.visit('/learner-dashboard')
      cy.url().should('include', '/auth/signin')
    })

    it('should prevent role escalation - admin cannot access other dashboards', () => {
      cy.setAuthCookies('admin')
      
      // Admin trying to access organization dashboard should redirect back to admin
      cy.visit('/dashboard')
      cy.verifyRedirectToRole('admin')
      
      // Admin trying to access learner dashboard should redirect back to admin
      cy.visit('/learner-dashboard')
      cy.verifyRedirectToRole('admin')
    })

    it('should prevent role escalation - organization cannot access other dashboards', () => {
      cy.setAuthCookies('organization')
      
      // Organization trying to access admin dashboard should redirect back to org
      cy.visit('/admin/dashboard')
      cy.verifyRedirectToRole('organization')
      
      // Organization trying to access learner dashboard should redirect back to org
      cy.visit('/learner-dashboard')
      cy.verifyRedirectToRole('organization')
    })

    it('should prevent role escalation - learner cannot access other dashboards', () => {
      cy.setAuthCookies('learner')
      
      // Learner trying to access admin dashboard should redirect back to learner
      cy.visit('/admin/dashboard')
      cy.verifyRedirectToRole('learner')
      
      // Learner trying to access organization dashboard should redirect back to learner
      cy.visit('/dashboard')
      cy.verifyRedirectToRole('learner')
    })
  })

  describe('Sign Out Flow', () => {
    it('should sign out and redirect to signin page', () => {
      // Login first
      cy.loginAs('admin')
      cy.verifyRedirectToRole('admin')
      
      // Simulate sign out by clearing cookies
      cy.clearAuthCookies()
      
      // Try to access protected route
      cy.visit('/admin/dashboard')
      cy.url().should('include', '/auth/signin')
      
      // Verify cookies are cleared
      cy.getCookie('token').should('not.exist')
      cy.getCookie('role').should('not.exist')
    })
  })

  describe('Error Handling', () => {
    before(() => {
      // Clear cookies before each test
      cy.clearAuthCookies()
    })
    it('should handle invalid credentials gracefully', () => {
      cy.visit('/auth/signin')
      
      cy.loginWithCredentials('invalid@test.com', 'wrongpassword')
      
      // Should show error message (adjust selector based on your error display)
      cy.get('[class*="bg-red"]').should('be.visible')
      
      // Should remain on signin page
      cy.url().should('include', '/auth/signin')
    })

   
  })
})
