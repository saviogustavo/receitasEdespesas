const buildEnv = () => {
    cy.server()
        
    cy.route({
        method: 'POST',
        url: '/signin',
        response: {
            id: 1000,
            nome: 'Usuário falso',
            token: 'String muito grande'
        }
    }).as('signin')

    cy.route({
        method: 'GET',
        url: '/saldo',
        response: [{
            id: 999,
            conta: 'Carteira',
            saldo: '100,00'
        },
        {
            id: 99909,
            conta: 'Banco',
            saldo: '100000000,00'
        }]
    }).as('saldo')

    cy.route({
        method: 'GET',
        url: '/contas',
        response: [
            {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
            {id: 2, nome: 'Banco', visivel: true, usuario_id: 1}
        ]
    }).as('contas')

    cy.route({
        method: 'GET',
        url: '/extrato/**',
        response: [
            {
                conta: "Conta para movimentacoes",
                id: 1795189,
                descricao: "Movimentacao para exclusao",
                envolvido: "AAA",
                observacao: null,
                tipo: "DESP",
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
                descricao: "Movimentacao de conta",
                envolvido: "BBB",
                observacao: null,
                tipo: "DESP",
                data_transacao: "2023-09-27T03:00:00.000Z",
                data_pagamento: "2023-09-27T03:00:00.000Z",
                valor: "-1500.00",
                status: true,
                conta_id: 1915565,
                usuario_id: 40582,
                transferencia_id: null,
                parcelamento_id: null
            },
            {
                conta: "Conta para saldo",
                id: 1795191,
                descricao: "Movimentacao 1, calculo saldo",
                envolvido: "CCC",
                observacao: null,
                tipo: "REC",
                data_transacao: "2023-09-27T03:00:00.000Z",
                data_pagamento: "2023-09-27T03:00:00.000Z",
                valor: "3500.00",
                status: false,
                conta_id: 1915566,
                usuario_id: 40582,
                transferencia_id: null,
                parcelamento_id: null
            },
            {
                conta: "Conta para saldo",
                id: 1795192,
                descricao: "Movimentacao 2, calculo saldo",
                envolvido: "DDD",
                observacao: null,
                tipo: "DESP",
                data_transacao: "2023-09-27T03:00:00.000Z",
                data_pagamento: "2023-09-27T03:00:00.000Z",
                valor: "-1000.00",
                status: true,
                conta_id: 1915566,
                usuario_id: 40582,
                transferencia_id: null,
                parcelamento_id: null
            },
            {
                conta: "Conta para saldo",
                id: 1795193,
                descricao: "Movimentacao 3, calculo saldo",
                envolvido: "EEE",
                observacao: null,
                tipo: "REC",
                data_transacao: "2023-09-27T03:00:00.000Z",
                data_pagamento: "2023-09-27T03:00:00.000Z",
                valor: "1534.00",
                status: true,
                conta_id: 1915566,
                usuario_id: 40582,
                transferencia_id: null,
                parcelamento_id: null
            },
            {
                conta: "Conta para extrato",
                id: 1795194,
                descricao: "Movimentacao para extrato",
                envolvido: "FFF",
                observacao: null,
                tipo: "DESP",
                data_transacao: "2023-09-27T03:00:00.000Z",
                data_pagamento: "2023-09-27T03:00:00.000Z",
                valor: "-220.00",
                status: true,
                conta_id: 1915567,
                usuario_id: 40582,
                transferencia_id: null,
                parcelamento_id: null
            }
        ],
    })
}

export default buildEnv