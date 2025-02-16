/// <reference types="cypress" />

// Add custom commands here
// For example:
// Cypress.Commands.add('login', (email, password) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      // Define types for custom commands here
      // login(email: string, password: string): Chainable<void>
    }
  }
}

export {}; // Make this a module 