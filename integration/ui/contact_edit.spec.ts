import {cyEditContactIcon, cyConversationList,  cyContactEmailInput, cyContactPhoneInput, cyContactAddressInput, cyContactCityInput, cyContactOrganizationInput} from 'handles';

describe(`edit a conversation's contact details`, () => {

    cy.visit('/ui/conversations');
    cy.wait(500);
    cy.get(`[data-cy=${cyConversationList}]`).first().click()

    it('a click on the edit icon triggers the contact edit', () => {
        cy.get(`[data-cy=${cyEditContactIcon}]`).click()
        cy.get(`[data-cy=${cyContactEmailInput}]`).type('name@email.com');
        cy.get(`[data-cy=${cyContactPhoneInput}]`).type('+49 30 901820');
        cy.get(`[data-cy=${cyContactAddressInput}]`).type('404 Berliner street');
        cy.get(`[data-cy=${cyContactCityInput}]`).type('Berlin');
        cy.get(`[data-cy=${cyContactOrganizationInput}]`).type('Airy');

        //click on Save button 
        cy.get(`[data-cy=${}]`).click();
        cy.get(`[data-cy=${cyContactEmailInput}]`).contains('name@email.com');
        cy.get(`[data-cy=${cyContactPhoneInput}]`).contains('+49 30 901820');
        cy.get(`[data-cy=${cyContactAddressInput}]`).contains('404 Berliner street');
        cy.get(`[data-cy=${cyContactCityInput}]`).contains('Berlin');
        cy.get(`[data-cy=${cyContactOrganizationInput}]`).contains('Airy');



    })

    //cancel the contact edit on click on the cancel icon 

    //edits the contact details 

})