import {
  cyConversationList,
  cyEditContactIcon,
  cyCancelEditContactIcon,
  cyContactEmail,
  cyContactPhone,
  cyContactTitle,
  cyContactAddress,
  cyContactCity,
  cyContactOrganization,
  cyContactSaveButton,
  cyContactExtendable,
} from 'handles';

describe('Display and edit the contact details of a conversation', () => {
  before(() => {
    cy.visit('/inbox/inbox/');
    cy.url().should('include', '/inbox');
    cy.get(`[data-cy=${cyConversationList}]`).first().click();
  });

  beforeEach(() => {
    cy.get(`[data-cy=${cyEditContactIcon}]`).click();
  });

  it('displays default values if there is no information', () => {
    cy.get(`[data-cy=${cyContactEmail}]`).clear();
    cy.get(`[data-cy=${cyContactPhone}]`).clear();
    cy.get(`[data-cy=${cyContactTitle}]`).clear();
    cy.get(`[data-cy=${cyContactAddress}]`).clear();
    cy.get(`[data-cy=${cyContactCity}]`).clear();
    cy.get(`[data-cy=${cyContactOrganization}]`).clear();

    cy.get(`[data-cy=${cyContactSaveButton}]`).click();

    cy.get(`[data-cy=${cyContactEmail}]`).contains('email');

    cy.get(`[data-cy=${cyContactExtendable}]`).click();

    cy.get(`[data-cy=${cyContactPhone}]`).contains('phone');
    cy.get(`[data-cy=${cyContactTitle}]`).contains('title');
    cy.get(`[data-cy=${cyContactAddress}]`).contains('address');
    cy.get(`[data-cy=${cyContactCity}]`).contains('city');
    cy.get(`[data-cy=${cyContactOrganization}]`).contains('company name');
  });

  it('edits and saves contact details', () => {
    cy.get(`[data-cy=${cyContactEmail}]`).clear().type('name@email.com');
    cy.get(`[data-cy=${cyContactPhone}]`).clear().type('+49 30 901820');
    cy.get(`[data-cy=${cyContactTitle}]`).clear().type('Mr.');
    cy.get(`[data-cy=${cyContactAddress}]`).clear().type('404 Berliner street');
    cy.get(`[data-cy=${cyContactCity}]`).clear().type('Berlin');
    cy.get(`[data-cy=${cyContactOrganization}]`).clear().type('Airy');

    cy.get(`[data-cy=${cyContactSaveButton}]`).click();
    cy.get(`[data-cy=${cyContactEmail}]`).contains('name@email.com');
    cy.get(`[data-cy=${cyContactPhone}]`).contains('+49 30 901820');
    cy.get(`[data-cy=${cyContactTitle}]`).contains('Mr.');

    cy.get(`[data-cy=${cyContactExtendable}]`).click();

    cy.get(`[data-cy=${cyContactAddress}]`).contains('404 Berliner street');
    cy.get(`[data-cy=${cyContactCity}]`).contains('Berlin');
    cy.get(`[data-cy=${cyContactOrganization}]`).contains('Airy');
  });

  it('cancels the contact edit', () => {
    cy.get(`[data-cy=${cyContactEmail}]`).clear().type('anotherName@email.com');
    cy.get(`[data-cy=${cyContactPhone}]`).clear().type('123');
    cy.get(`[data-cy=${cyContactTitle}]`).clear().type('Mrs.');
    cy.get(`[data-cy=${cyContactAddress}]`).clear().type('London Street');
    cy.get(`[data-cy=${cyContactCity}]`).clear().type('London');
    cy.get(`[data-cy=${cyContactOrganization}]`).clear().type('A company');

    cy.get(`[data-cy=${cyCancelEditContactIcon}]`).click();

    cy.get(`[data-cy=${cyContactEmail}]`).contains('name@email.com');
    cy.get(`[data-cy=${cyContactPhone}]`).contains('+49 30 901820');
    cy.get(`[data-cy=${cyContactTitle}]`).contains('Mr.');

    cy.get(`[data-cy=${cyContactExtendable}]`).click();

    cy.get(`[data-cy=${cyContactAddress}]`).contains('404 Berliner street');
    cy.get(`[data-cy=${cyContactCity}]`).contains('Berlin');
    cy.get(`[data-cy=${cyContactOrganization}]`).contains('Airy');
  });
});
