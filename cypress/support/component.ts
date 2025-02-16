/// <reference types="cypress" />
import { mount } from '@cypress/react18';
import { MountOptions, MountReturn } from '@cypress/react18';
import './commands';

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      spy: () => any;
    }
  }
}

// @ts-ignore
Cypress.Commands.add('mount', mount);

// @ts-ignore
Cypress.Commands.add('spy', () => {
  return cy.wrap(cy.spy());
});

// Example of adding a command for component testing
// Cypress.Commands.add('dismissModal', () => {
//   cy.get('.modal-close').click();
// }); 