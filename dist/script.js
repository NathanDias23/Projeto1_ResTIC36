"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
// Função para atualizar o ícone da moeda selecionada
function updateCurrencyIcon(selectElement, iconElement) {
    const currency = selectElement.value;
    const iconPath = `icons/${currency.toLowerCase()}.png`;
    iconElement.src = iconPath;
}
// Função para fazer a conversão de moeda
function convertCurrency() {
    return __awaiter(this, void 0, void 0, function* () {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        const amount = parseFloat(document.getElementById('amount').value);
        if (isNaN(amount) || amount <= 0) {
            alert('Por favor, insira um valor válido.');
            return;
        }
        try {
            const response = yield fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const data = yield response.json();
            const rate = data.rates[toCurrency];
            const result = amount * rate;
            document.getElementById('result-text').innerText = `Resultado: ${result.toFixed(2)} ${toCurrency}`;
            // Adiciona o resultado ao histórico
            addToHistory({ from: fromCurrency, to: toCurrency, amount, result, date: new Date().toLocaleString() });
        }
        catch (error) {
            alert('Erro ao obter a taxa de câmbio. Tente novamente mais tarde.');
        }
    });
}
// Função para adicionar uma conversão ao histórico
function addToHistory(entry) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `${entry.amount} ${entry.from} = ${entry.result.toFixed(2)} ${entry.to} <span>${entry.date}</span>`;
    historyList.insertBefore(listItem, historyList.firstChild);
    // Salva no localStorage
    saveHistory(entry);
}
// Função para salvar o histórico no localStorage
function saveHistory(entry) {
    const history = getHistory();
    history.push(entry);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
}
// Função para obter o histórico do localStorage
function getHistory() {
    const history = localStorage.getItem('conversionHistory');
    return history ? JSON.parse(history) : [];
}
// Função para carregar o histórico ao iniciar
function loadHistory() {
    const history = getHistory();
    history.forEach(addToHistory);
}
// Função para limpar o histórico
function clearHistory() {
    localStorage.removeItem('conversionHistory');
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
}
// Configuração dos listeners
(_a = document.getElementById('convert-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', convertCurrency);
document.getElementById('from-currency').addEventListener('change', (event) => {
    updateCurrencyIcon(event.target, document.getElementById('from-icon'));
});
document.getElementById('to-currency').addEventListener('change', (event) => {
    updateCurrencyIcon(event.target, document.getElementById('to-icon'));
});
(_b = document.getElementById('clear-history-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', clearHistory);
// Carrega o histórico ao iniciar a página
loadHistory();
