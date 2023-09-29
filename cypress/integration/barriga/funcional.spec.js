/// <reference types="cypress" />

import loc from '../../support/locators';

describe('Should test at a funcional level', ()=> {
    before(()=> {
        cy.login('savio@email.com', 'savio')
    })

    beforeEach(()=> {
        cy.get(loc.MENU.HOME)
        cy.resetApp()
    })

    it('Should create an account', ()=> {
        cy.acessarMenuContas()

        cy.inserirConta('Pagamento de energia')

        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    it('Should update an account', ()=> {
        cy.acessarMenuContas()
        cy.xpath(loc.CONTAS.FN_XP_BTN_CHANGE('Conta para alterar')).click()

        cy.criarConta('Conta alterada')

        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
    })

    it('Should not create an account with the same name', ()=> {
        cy.acessarMenuContas()

        cy.criarConta('Conta mesmo nome')

        cy.get(loc.MESSAGE).should('contain', 'status code 400')
    })

    it('Should create a transaction', ()=> {
        cy.get(loc.MENU.MOVIMENTACAO).click()

        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Conta à pagar')
        cy.wait(5000)
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Pessoa')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Conta para movimentacoes')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()

        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Conta à pagar', '123')).should('exist')
    })

    it('Should get balance', ()=> {
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('exist')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()

        
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()

        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')

    })

    it('Should remove a transaction', ()=> {
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_DELETAR_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    })
})