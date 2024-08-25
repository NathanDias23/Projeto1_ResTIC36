interface ConversionHistory {

    from: string;
    to: string;
    amount: number;
    result: number;
    date: string;
    
}

// Função para atualizar o ícone da moeda selecionada
function updateCurrencyIcon(selectElement: HTMLSelectElement, iconElement: HTMLImageElement) {

    const currency = selectElement.value;
    const iconPath = `icons/${currency.toLowerCase()}.png`;
    iconElement.src = iconPath;

}

// Função para fazer a conversão de moeda

async function convertCurrency() {

    const fromCurrency = (document.getElementById('from-currency') as HTMLSelectElement).value;
    const toCurrency = (document.getElementById('to-currency') as HTMLSelectElement).value;
    const amount = parseFloat((document.getElementById('amount') as HTMLInputElement).value);

    if (isNaN(amount) || amount <= 0) {

        alert('Por favor, insira um valor válido.');
        return;

    }

    try {

        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const result = amount * rate;

        (document.getElementById('result-text') as HTMLHeadingElement).innerText = `Resultado: ${result.toFixed(2)} ${toCurrency}`;

        // Adiciona o resultado ao histórico
        addToHistory({ from: fromCurrency, to: toCurrency, amount, result, date: new Date().toLocaleString() });
    } catch (error) {

        alert('Erro ao obter a taxa de câmbio. Tente novamente mais tarde.');

    }

}

// Função para adicionar uma conversão ao histórico
function addToHistory(entry: ConversionHistory) {

    const historyList = document.getElementById('history-list') as HTMLUListElement;
    const listItem = document.createElement('li');
    listItem.innerHTML = `${entry.amount} ${entry.from} = ${entry.result.toFixed(2)} ${entry.to} <span>${entry.date}</span>`;
    historyList.insertBefore(listItem, historyList.firstChild);

    // Salva no localStorage
    saveHistory(entry);

}

// Função para salvar o histórico no localStorage
function saveHistory(entry: ConversionHistory) {

    const history = getHistory();
    history.push(entry);
    localStorage.setItem('conversionHistory', JSON.stringify(history));

}

// Função para obter o histórico do localStorage
function getHistory(): ConversionHistory[] {

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
    const historyList = document.getElementById('history-list') as HTMLUListElement;
    historyList.innerHTML = '';
    
}

// Configuração dos listeners
document.getElementById('convert-btn')?.addEventListener('click', convertCurrency);

(document.getElementById('from-currency') as HTMLSelectElement).addEventListener('change', (event) => {
    updateCurrencyIcon(event.target as HTMLSelectElement, document.getElementById('from-icon') as HTMLImageElement);
});

(document.getElementById('to-currency') as HTMLSelectElement).addEventListener('change', (event) => {
    updateCurrencyIcon(event.target as HTMLSelectElement, document.getElementById('to-icon') as HTMLImageElement);
});

document.getElementById('clear-history-btn')?.addEventListener('click', clearHistory);

// Carrega o histórico ao iniciar a página
loadHistory();
