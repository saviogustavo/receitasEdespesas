import loc from './locators';

Cypress.Commands.add('login', (email, password) => {
    cy.visit('https://barrigareact.wcaquino.me/')
    cy.get(loc.LOGIN.USER).type(email)
    cy.get(loc.LOGIN.PASSWORD).type(password)

    cy.get(loc.LOGIN.BTN_LOGIN).click()

    cy.get(loc.MESSAGE).should('contain', 'Bem vindo')
})

Cypress.Commands.add('resetApp', ()=> {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.RESET).click()
})

Cypress.Commands.add('getToken', (user, password)=> {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            redirecionar: false,
            senha: password
        }
    }).its('body.token').should('not.be.empty')
    .then(token => {
        return token
    })
})

Cypress.Commands.add('resetRest', token => {
    cy.request({
        method: 'GET',
        url: '/reset',
        headers: {
            Authorization: `JWT ${token}`
        }
    }) 
})

Cypress.Commands.add('getContaByName', (nome, token)=> {
    cy.request({
        method: 'GET',
        url: '/contas',
        headers: {
            Authorization: `JWT ${token}`
        },
        qs: {
            nome: nome
        }
    }).then(res=> {
        return res.body[0].id
    })
})