const locators = {
    LOGIN: {
        USER: '[data-test=email]',
        PASSWORD: '[data-test=passwd]',
        BTN_LOGIN: '.btn'
    },
    MENU: {
        HOME: '[data-test=menu-home]',
        SETTINGS: '[data-test=menu-settings]',
        CONTAS: '[href="/contas"]',
        RESET: '[href="/reset"]',
        MOVIMENTACAO: '[data-test=menu-movimentacao]',
        EXTRATO: '[data-test=menu-extrato]'
    },
    CONTAS: {
        NAME: '[data-test=nome]',
        BTN_SAVE: '.btn',
        FN_XP_BTN_CHANGE: (nome)=> `//table//td[contains(., '${nome}')]/..//i[@class='far fa-edit']`
    },
    MOVIMENTACAO: {
        DESCRICAO: '[data-test=descricao]',
        VALOR: '[data-test=valor]',
        INTERESSADO: '[data-test=envolvido]',
        CONTA: '[data-test=conta]',
        STATUS: '[data-test=status]',
        BTN_SALVAR: '.btn-primary'
    },
    EXTRATO: {
        LINHAS: '.list-group > li',
        FN_XP_BUSCA_ELEMENTO: (nome, valor)=> `//span[contains(., '${nome}')]/following-sibling::small[contains(., '${valor}')]`,
        FN_XP_DELETAR_ELEMENTO: (conta)=> `//span[contains(., '${conta}')]/../../..//a[2]/i`,
        FN_XP_ALTERAR_ELEMENTO: (conta)=> `//span[contains(., '${conta}')]/../../..//a[1]/i`,
        FN_XP_LINHA: (desc)=> `//span[contains(., '${desc}')]/../../../..`
        
    },
    SALDO: {
        FN_XP_SALDO_CONTA: (nome)=> `//td[contains(., '${nome}')]/../td[2]`
    },
    MESSAGE: '.toast-message'
}

export default locators;