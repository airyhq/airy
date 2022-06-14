import {cyEditDisplayNameIcon, cyDisplayName, cyDisplayNameInput, cyEditDisplayNameCheckmark} from 'handles';


cy.get(`[data-cy=${cyEditDisplayNameIcon}]`).click({force: true});

cy.get(`[data-cy=${cyDisplayNameInput}]`).type('new name');
cy.get(`[data-cy=${cyEditDisplayNameCheckmark}]`).click();

cy.get(`[data-cy=${cyDisplayName}]`).contains('new name');