/// <reference types="cypress" />

import loc from '../../support/locators';
import buildEnv from '../../support/buildEnv';

describe('Should test at a funcional level', ()=> {

    after(()=> {
        cy.clearLocalStorage()
    })

    beforeEach(()=> {
        buildEnv()
        cy.login('savio@email.com', 'senha errada')
        cy.get(loc.MENU.HOME)
        // cy.resetApp()
    })

    it('Should test the responsiveness', ()=> {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')

        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
            .and('not.be.visible')

        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
    })

    it('Should create an account', ()=> {

        cy.route({
            method: 'POST',
            url: '/contas',
            response: [
                {id: 3, nome: 'Pagamento de energia', visivel: true, usuario_id: 1}
            ]
        }).as('saveConta')

        cy.acessarMenuContas()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id: 3, nome: 'Pagamento de energia', visivel: true, usuario_id: 1}
            ]
        }).as('contasSave')

        cy.inserirConta('Pagamento de energia')

        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    it('Should update an account', ()=> {

        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response: {id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1}
        })

        cy.acessarMenuContas()
        cy.xpath(loc.CONTAS.FN_XP_BTN_CHANGE('Carteira')).click()

        cy.criarConta('Conta alterada')

        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
    })

    it('Should not create an account with the same name', ()=> {

        cy.route({
            method: 'POST',
            url: '/contas',
            response: {"error":"Já existe uma conta com esse nome!"},
            status: 400
            
        }).as('saveContaSameName')

        cy.acessarMenuContas()

        cy.criarConta('Conta mesmo nome')

        cy.get(loc.MESSAGE).should('contain', 'status code 400')
    })

    it('Should create a transaction', ()=> {

        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: {
                id: 1795069,
                descricao: 'Desc',
                envolvido: 'Inter',
                observacao: null,
                tipo: 'REC',
                data_transacao: '2023-09-27T03:00:00.000Z',
                data_pagamento: '2023-09-27T03:00:00.000Z',
                valor: '123.00',
                status: true,
                conta_id: 1912502,
                usuario_id: 40582,
                transferencia_id: null,
                parcelamento_id: null
            }
        }).as('createTransaction')

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalva'
        })

        cy.get(loc.MENU.MOVIMENTACAO).click()

        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        // cy.wait(5000)
        cy.get(loc.MOVIMENTACAO.VALOR).type('123,00')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Banco')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()

        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')

         cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123,00')).should('exist')
    })

    it('Should get balance', ()=> {

        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 1795191,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2023-09-27T03:00:00.000Z",
                "data_pagamento": "2023-09-27T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 1915566,
                "usuario_id": 40582,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 1795191,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2023-09-27T03:00:00.000Z",
                "data_pagamento": "2023-09-27T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 1915566,
                "usuario_id": 40582,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100,00')

        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('exist')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()

        
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()

        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [{
                id: 999,
                conta: 'Carteira',
                saldo: '4034,00'
            },
            {
                id: 99909,
                conta: 'Banco',
                saldo: '100000000,00'
            }]
        }).as('saldoFinal')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '4.034,00')

    })

    it('Should remove a transaction', ()=> {

        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            response: {},
            status: 204
        }).as('del')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_DELETAR_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    })

    it('Should validate data send to create an account', ()=> {

        cy.route({
            method: 'POST',
            url: '/contas',
            response: [
                {id: 3, nome: 'Pagamento de energia', visivel: true, usuario_id: 1}
            ],
            onRequest: req => {       //OnRequest foi usado pra validar alguns dados já que os mesmos não estão vindo da API
                console.log(req)
                expect(req.request.body.nome).to.be.empty
                expect(req.request.headers).to.have.property('Authorization')
            }
        }).as('saveConta')

        cy.acessarMenuContas()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id: 3, nome: 'Pagamento de energia', visivel: true, usuario_id: 1}
            ]
        }).as('contasSave')

        cy.inserirConta('{CONTROL}')
        // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty') //Foi usado com o mesmo intuito do onRequest
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    it('Should test colors', ()=> {

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                {
                    conta: "Conta para movimentacoes",
                    id: 1795189,
                    descricao: "Receita paga",
                    envolvido: "AAA",
                    observacao: null,
                    tipo: "REC",
                    data_transacao: "2023-09-27T03:00:00.000Z",
                    data_pagamento: "2023-09-27T03:00:00.000Z",
                    valor: "-1500.00",
                    status: true,
                    conta_id: 1915564,
                    usuario_id: 40582,
                    transferencia_id: null,
                    parcelamento_id: null
                },
                {
                    conta: "Conta com movimentacao",
                    id: 1795190,
                    descricao: "Receita pendente",
                    envolvido: "BBB",
                    observacao: null,
                    tipo: "REC",
                    data_transacao: "2023-09-27T03:00:00.000Z",
                    data_pagamento: "2023-09-27T03:00:00.000Z",
                    valor: "-1500.00",
                    status: false,
                    conta_id: 1915565,
                    usuario_id: 40582,
                    transferencia_id: null,
                    parcelamento_id: null
                },
                {
                    conta: "Conta para saldo",
                    id: 1795191,
                    descricao: "Despesa paga",
                    envolvido: "CCC",
                    observacao: null,
                    tipo: "DESP",
                    data_transacao: "2023-09-27T03:00:00.000Z",
                    data_pagamento: "2023-09-27T03:00:00.000Z",
                    valor: "3500.00",
                    status: true,
                    conta_id: 1915566,
                    usuario_id: 40582,
                    transferencia_id: null,
                    parcelamento_id: null
                },
                {
                    conta: "Conta para saldo",
                    id: 1795192,
                    descricao: "Despesa pendente",
                    envolvido: "DDD",
                    observacao: null,
                    tipo: "DESP",
                    data_transacao: "2023-09-27T03:00:00.000Z",
                    data_pagamento: "2023-09-27T03:00:00.000Z",
                    valor: "-1000.00",
                    status: false,
                    conta_id: 1915566,
                    usuario_id: 40582,
                    transferencia_id: null,
                    parcelamento_id: null
                }
            ],
        })

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa pendente')).should('have.class', 'despesaPendente')
    })
})