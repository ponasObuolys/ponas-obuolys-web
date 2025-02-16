/// <reference types="cypress" />
import React from 'react';
import { SearchBar } from '../../src/components/ui/SearchBar';

describe('SearchBar Component', () => {
  it('mounts', () => {
    const onSearch = cy.spy().as('onSearch');
    cy.mount(<SearchBar onSearch={onSearch} />);
    
    // Check if the component renders correctly
    cy.get('input[type="text"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('handles search submission', () => {
    const onSearch = cy.spy().as('onSearch');
    cy.mount(<SearchBar onSearch={onSearch} />);
    
    const searchText = 'test search';
    cy.get('input[type="text"]').type(searchText);
    cy.get('button[type="submit"]').click();
    
    cy.get('@onSearch').should('have.been.calledWith', searchText);
  });

  it('displays custom placeholder', () => {
    const onSearch = cy.spy();
    const customPlaceholder = 'Custom Search...';
    cy.mount(<SearchBar onSearch={onSearch} placeholder={customPlaceholder} />);
    
    cy.get('input[type="text"]').should('have.attr', 'placeholder', customPlaceholder);
  });
}); 