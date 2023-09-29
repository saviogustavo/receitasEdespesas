import loc from './locators'

Cypress.Commands.add('acessarMenuContas', ()=> {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.CONTAS).click()
})

Cypress.Commands.add('inserirConta', (conta)=> {
    cy.get(loc.CONTAS.NAME).type(conta)
    cy.get(loc.CONTAS.BTN_SAVE).click()
})

Cypress.Commands.add('criarConta', (conta)=> {
    cy.get(loc.CONTAS.NAME)
            .clear()
            .type(conta)
    cy.get(loc.CONTAS.BTN_SAVE).click()
})
