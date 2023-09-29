/// <reference types="cypress" />

describe('Should test at a funcional level', ()=> {

    let token

    before(()=> {
        cy.getToken('savio@email.com', 'savio')
            .then(tkn => {
                token = tkn
            })
    })

    beforeEach(()=> {
        cy.resetRest(token)
    })

    it('Should create an account', ()=> {
        cy.request({
            method: 'POST',
            url: '/contas',
            headers: {
                Authorization: `JWT ${token}`
            },
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')  

        cy.get('@response').then(res=> {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
    })

    it('Should update an account', ()=> {
        cy.getContaByName('Conta para movimentacoes', token)
        .then(contaId => {
            cy.request({
                method: 'PUT',
                url: `/contas/${contaId}`,
                headers: {
                    Authorization: `JWT ${token}`
                },
                body: {
                    nome: 'Conta alterada via rest'
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 200)
    })

    it('Should not create an account with the same name', ()=> {
        cy.request({
            method: 'POST',
            url: '/contas',
            headers: {
                Authorization: `JWT ${token}`
            },
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')  

        cy.get('@response').then(res=> {
            console.log(res)
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    })

    it('Should create a transaction', ()=> {
        cy.getContaByName('Conta para movimentacoes', token)
            .then(contaId=> {
                cy.request({
                    method: 'POST',
                    url: '/transacoes',
                    headers: {
                        Authorization: `JWT ${token}`
                    },
                    body: {
                        conta_id: contaId,
                        data_pagamento: Cypress.moment().add({days: 1}).format('DD/MM/YYYY'),
                        data_transacao: Cypress.moment().format('DD/MM/YYYY'),
                        descricao: "Desc",
                        envolvido: "Inter",
                        status: true,
                        tipo: "REC",
                        valor: "123"
                    }
                }).as('response')
            })
        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist', 201)
    })

    it('Should get balance', ()=> {
        cy.request({
            method: 'GET',
            url: '/saldo',
            headers: {
                Authorization: `JWT ${token}`
            }
        }).then(res => {
            console.log(res)
            let saldoConta = null
            res.body.forEach(c=> {
                if(c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('534.00')
        })

        cy.request({
            method: 'GET',
            url: '/transacoes',
            headers: {
                Authorization: `JWT ${token}`
            },
            qs: {
                descricao: 'Movimentacao 1, calculo saldo'
            }
        }).then(res=> {
            cy.request({
                method: 'PUT',
                url: `/transacoes/${res.body[0].id}`,
                headers: {
                    Authorization: `JWT ${token}`
                },
                body: {
                    status: true,
                    data_transacao: Cypress.moment(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id
                }
            }).its('status').should('be.equal', 200)
        })

        cy.request({
            method: 'GET',
            url: '/saldo',
            headers: {
                Authorization: `JWT ${token}`
            }
        }).then(res => {
            console.log(res)
            let saldoConta = null
            res.body.forEach(c=> {
                if(c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('4034.00')
        })

    })

    it('Should remove a transaction', ()=> {
        cy.request({
            method: 'GET',
            url: '/transacoes',
            headers: {
                Authorization: `JWT ${token}`
            },
            qs: {
                descricao: 'Movimentacao para exclusao'
            }
        }).then(res=> {
            cy.request({
                method: 'DELETE',
                url: `/transacoes/${res.body[0].id}`,
                headers: {
                    Authorization: `JWT ${token}`
                }
            }).its('status').should('be.equal', 204)
        })
    })
})