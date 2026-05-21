// ===============================
// DASHBOARD - MoneyLens
// ===============================

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(inicializarDashboard);

// ===============================
// INICIALIZAÇÃO
// ===============================
async function inicializarDashboard() {
    try {
        const transacoes = await buscarTransacoes();
        const transacoesFiltradas = aplicarFiltroPeriodo(transacoes);

        atualizarCardDespesas(transacoesFiltradas);
        desenharGraficoCategoria(transacoesFiltradas);
        desenharGraficoTipoPagamento(transacoesFiltradas);

    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
    }
}

// ===============================
// BUSCAR TRANSAÇÕES
// ===============================
async function buscarTransacoes() {
    const response = await fetch("/api/transacoes", {
        credentials: "include"
    });

    if (response.status === 401) {
        window.location.href = "/login";
        return [];
    }

    if (!response.ok) {
        throw new Error("Erro ao buscar transações.");
    }

    return await response.json();
}

// ===============================
// FILTRO DE PERÍODO
// ===============================
function aplicarFiltroPeriodo(transacoes) {

    const periodo = document.getElementById("periodo").value;
    const hoje = new Date();

    return transacoes.filter(transacao => {

        const data = new Date(transacao.data);

        // =========================
        // MENSAL
        // =========================
        if (periodo === "mensal") {

            return (
                data.getMonth() === hoje.getMonth() &&
                data.getFullYear() === hoje.getFullYear()
            );
        }

        // =========================
        // ANUAL
        // =========================
        if (periodo === "anual") {

            return data.getFullYear() === hoje.getFullYear();
        }

        // =========================
        // PERSONALIZADO
        // =========================
        if (periodo === "personalizado") {

            const dataInicial =
                document.getElementById("data-inicial").value;

            const dataFinal =
                document.getElementById("data-final").value;

            // Se não escolher as duas datas,
            // mostra tudo
            if (!dataInicial || !dataFinal) {
                return true;
            }

            const inicio = new Date(dataInicial);
            const fim = new Date(dataFinal);

            // Ajuste pra incluir o último dia
            fim.setHours(23, 59, 59, 999);

            return data >= inicio && data <= fim;
        }

        return true;
    });
}

// ===============================
// FORMATA MOEDA
// ===============================
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ===============================
// TRADUZ TIPO PAGAMENTO
// ===============================
function traduzirTipoPagamento(tipo) {
    const mapa = {
        PIX: "Pix",
        CARTAO_CREDITO: "Crédito",
        CARTAO_DEBITO: "Débito",
        DINHEIRO: "Dinheiro",
        TRANSFERENCIA: "Transferência",
        DEPOSITO_BANCARIO: "Depósito"
    };

    return mapa[tipo] || tipo;
}

// ===============================
// CARD DESPESAS
// ===============================
function atualizarCardDespesas(transacoes) {
    const total = transacoes.reduce((soma, t) => {
        return soma + Number(t.valor || 0);
    }, 0);

    document.getElementById("despesa-total").textContent =
        formatarMoeda(total);
}

// ===============================
// AGRUPAR VALORES
// ===============================
function agruparPor(transacoes, callback) {
    const grupos = {};

    transacoes.forEach(transacao => {
        const chave = callback(transacao);

        if (!chave) return;

        if (!grupos[chave]) {
            grupos[chave] = 0;
        }

        grupos[chave] += Number(transacao.valor || 0);
    });

    return grupos;
}

// ===============================
// GRÁFICO POR CATEGORIA
// ===============================
function desenharGraficoCategoria(transacoes) {
    const agrupado = agruparPor(
        transacoes,
        t => t.categoria?.nome || "Sem Categoria"
    );

    const dados = [["Categoria", "Valor"]];

    Object.entries(agrupado).forEach(([categoria, valor]) => {
        dados.push([categoria, valor]);
    });

    if (dados.length === 1) {
        dados.push(["Sem dados", 1]);
    }

    const data = google.visualization.arrayToDataTable(dados);

    const options = {
        pieHole: 0.4,
        backgroundColor: "transparent",
        legend: {
            position: "right",
            textStyle: {
                fontSize: 12
            }
        }
    };

    const chart = new google.visualization.PieChart(
        document.getElementById("pizza-gasto-por-categoria")
    );

    chart.draw(data, options);
}

// ===============================
// GRÁFICO POR TIPO DE PAGAMENTO
// ===============================
function desenharGraficoTipoPagamento(transacoes) {
    const agrupado = agruparPor(
        transacoes,
        t => traduzirTipoPagamento(t.tipo_pagamento)
    );

    const dados = [["Tipo de Pagamento", "Valor"]];

    Object.entries(agrupado).forEach(([tipo, valor]) => {
        dados.push([tipo, valor]);
    });

    if (dados.length === 1) {
        dados.push(["Sem dados", 1]);
    }

    const data = google.visualization.arrayToDataTable(dados);

    const options = {
        pieHole: 0.4,
        backgroundColor: "transparent",
        legend: {
            position: "right",
            textStyle: {
                fontSize: 12
            }
        }
    };

    const chart = new google.visualization.PieChart(
        document.getElementById("pizza-gasto-por-tipo-pagamento")
    );

    chart.draw(data, options);
}

// ===============================
// EVENTO DO FILTRO
// ===============================
document
    .getElementById("periodo")
    .addEventListener("change", inicializarDashboard);

// ===============================
// CONTROLE DO FILTRO PERSONALIZADO
// ===============================

const selectPeriodo =
    document.getElementById("periodo");

const filtroPersonalizado =
    document.getElementById("filtro-personalizado");

const dataInicial =
    document.getElementById("data-inicial");

const dataFinal =
    document.getElementById("data-final");


// MOSTRA/ESCONDE DATAS
selectPeriodo.addEventListener("change", () => {

    if (selectPeriodo.value === "personalizado") {

        filtroPersonalizado.style.display = "flex";

    } else {

        filtroPersonalizado.style.display = "none";
    }

    inicializarDashboard();
});


// ATUALIZA DASHBOARD AO TROCAR DATA
dataInicial.addEventListener("change", inicializarDashboard);
dataFinal.addEventListener("change", inicializarDashboard);