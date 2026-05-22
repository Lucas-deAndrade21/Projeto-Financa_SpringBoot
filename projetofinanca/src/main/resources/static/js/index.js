google.charts.load("current", {
    packages: ["corechart"]
});

google.charts.setOnLoadCallback(
    inicializarDashboard
);


// ===============================
// INICIALIZAÇÃO
// ===============================
async function inicializarDashboard() {

    try {

        const transacoes = await buscarTransacoes();

        const transacoesFiltradas = aplicarFiltroPeriodo(transacoes);

        // APENAS DESPESAS
        const despesas =
            transacoesFiltradas.filter(
                t => t.tipo_transacao === "DESPESA"
        );

        atualizarResumoFinanceiro(transacoesFiltradas);

        atualizarTopCategoria(despesas);

        atualizarPagamentoMaisUsado(despesas);

        atualizarMaiorGastoDiario(despesas);

        atualizarQuantidadeTransacoes(transacoesFiltradas);

        desenharGraficoCategoria(despesas);

        desenharGraficoTipoPagamento(despesas);

        atualizarUltimasTransacoes(transacoesFiltradas);

        atualizarTicketMedio(transacoesFiltradas);

        atualizarMaiorReceitaDia(transacoesFiltradas);

    } catch (error) {

        console.error(
            "Erro ao carregar dashboard:",
            error
        );
    }
}

function atualizarUltimasTransacoes(transacoes) {

    const container =
        document.getElementById("ultimas-transacoes");

    if (!container) return;

    container.innerHTML = "";

    const ultimas = [...transacoes]

        .sort((a, b) => b.id - a.id)

        .slice(0, 3);

    if (ultimas.length === 0) {

        container.innerHTML =
            "<p>Nenhuma transação encontrada.</p>";

        return;
    }

    ultimas.forEach(t => {

        const div = document.createElement("div");

        div.className = "transacao-item";

        const classe =
            t.tipo_transacao === "RECEITA"
                ? "receitas"
                : "despesas";

        div.innerHTML = `
            <div class="transacao-info">
                <strong>${t.nome}</strong>
                <span>${formatarData(t.data)}</span>
            </div>

            <div class="transacao-valor ${classe}">
                ${formatarMoeda(Number(t.valor))}
            </div>
        `;

        container.appendChild(div);
    });
}

function atualizarTicketMedio(transacoes) {

    if (transacoes.length === 0) {

        atualizarTexto(
            "ticket-medio",
            "R$ 0,00"
        );

        return;
    }

    const total = transacoes.reduce(
        (soma, t) => soma + Number(t.valor || 0),
        0
    );

    const media =
        total / transacoes.length;

    atualizarTexto(
        "ticket-medio",
        formatarMoeda(media)
    );
}

function atualizarMaiorReceitaDia(transacoes) {

    const receitasPorDia = {};

    transacoes
        .filter(t => t.tipo_transacao === "RECEITA")
        .forEach(t => {

            const data = t.data;

            receitasPorDia[data] =
                (receitasPorDia[data] || 0)
                + Number(t.valor || 0);
        });

    let maiorDia = "-";
    let maiorValor = 0;

    for (const dia in receitasPorDia) {

        if (receitasPorDia[dia] > maiorValor) {

            maiorValor = receitasPorDia[dia];

            maiorDia =
                `${formatarData(dia)} (${formatarMoeda(maiorValor)})`;
        }
    }

    atualizarTexto(
        "maior-receita-dia",
        maiorDia
    );
}

function atualizarTopCategoria(transacoes) {

    const categorias = {};

    transacoes
        .filter(t => t.tipo_transacao === "DESPESA")
        .forEach(t => {

            const nome =
                t.categoria?.nome || "Sem Categoria";

            categorias[nome] =
                (categorias[nome] || 0)
                + Number(t.valor || 0);
        });

    let topCategoria = "-";
    let maiorValor = 0;

    for (const categoria in categorias) {

        if (categorias[categoria] > maiorValor) {

            maiorValor = categorias[categoria];

            topCategoria = `${formatarCategoria(categoria)} (${formatarMoeda(maiorValor)})`;
        }
    }

    document.getElementById("top-categoria")
        .textContent = topCategoria;
}

function atualizarPagamentoMaisUsado(transacoes) {

    const pagamentos = {};

    transacoes.forEach(t => {

        const tipo = traduzirTipoPagamento(t.tipo_pagamento);

        pagamentos[tipo] = (pagamentos[tipo] || 0) + 1;
    });

    let maiorQuantidade = 0;

    Object.values(pagamentos).forEach(qtd => {

        if (qtd > maiorQuantidade) {
            maiorQuantidade = qtd;
        }
    });

    const maisUsados =
        Object.entries(pagamentos).filter(([_, qtd]) => qtd === maiorQuantidade).map(([tipo]) => tipo);

    const texto = `${maisUsados.join(", ")} (${maiorQuantidade}x)`;

    document.getElementById("top-pagamento").textContent = texto;
}

function atualizarMaiorGastoDiario(transacoes) {

    const gastosPorDia = {};

    transacoes
        .filter(t => t.tipo_transacao === "DESPESA")
        .forEach(t => {

            const data = t.data;

            gastosPorDia[data] =
                (gastosPorDia[data] || 0)
                + Number(t.valor || 0);
        });

    let maiorDia = "-";
    let maiorValor = 0;

    for (const dia in gastosPorDia) {

        if (gastosPorDia[dia] > maiorValor) {

            maiorValor = gastosPorDia[dia];

            maiorDia = `${formatarData(dia)} (${formatarMoeda(maiorValor)})`;
        }
    }

    document.getElementById("maior-gasto-dia")
        .textContent = maiorDia;
}


function atualizarQuantidadeTransacoes(transacoes) {
    document.getElementById("quantidade-transacoes").textContent = transacoes.length;
}

// ===============================
// RESUMO FINANCEIRO
// ===============================
function atualizarResumoFinanceiro(transacoes) {

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(transacao => {

        const valor = Number(transacao.valor || 0);

        if (transacao.tipo_transacao === "RECEITA") {
            receitas += valor;
        }

        if (transacao.tipo_transacao === "DESPESA") {
            despesas += valor;
        }
    });

    const saldo = receitas - despesas;

    // KPIs
    document.getElementById("renda-mensal").textContent = formatarMoeda(receitas);

    document.getElementById("despesa-total").textContent = formatarMoeda(despesas);

    document.getElementById("saldo-atual").textContent = formatarMoeda(saldo);

    document.getElementById("quantidade-transacoes").textContent =transacoes.length;
}

// ===============================
// ATUALIZAR TEXTO COM SEGURANÇA
// ===============================
function atualizarTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

// ===============================
// INSIGHTS DO DASHBOARD
// ===============================
function atualizarInsights(transacoes) {

    // =========================
    // TOP CATEGORIA
    // =========================
    const categorias = {};

    transacoes.forEach(t => {

        if (t.tipo_transacao !== "DESPESA") return;

        const nome =
            t.categoria?.nome || "Sem Categoria";

        categorias[nome] =
            (categorias[nome] || 0) + Number(t.valor);
    });

    let topCategoria = "-";
    let maiorValorCategoria = 0;

    Object.entries(categorias).forEach(([nome, valor]) => {

        if (valor > maiorValorCategoria) {
            maiorValorCategoria = valor;
            topCategoria = nome;
        }
    });

    document.getElementById("top-categoria").textContent = topCategoria;

    // =========================
    // MÉTODO MAIS USADO
    // =========================
    const pagamentos = {};

    transacoes.forEach(t => {

        const tipo =
            traduzirTipoPagamento(t.tipo_pagamento);

        pagamentos[tipo] =
            (pagamentos[tipo] || 0) + 1;
    });

    let topPagamento = "-";
    let maiorUso = 0;

    Object.entries(pagamentos).forEach(([tipo, qtd]) => {

        if (qtd > maiorUso) {
            maiorUso = qtd;
            topPagamento = tipo;
        }
    });

    document.getElementById("top-pagamento").textContent = topPagamento;

    // =========================
    // DIA COM MAIOR GASTO
    // =========================
    const gastosPorDia = {};

    transacoes.forEach(t => {

        if (t.tipo_transacao !== "DESPESA") return;

        const data = t.data;

        gastosPorDia[data] =
            (gastosPorDia[data] || 0)
            + Number(t.valor);
    });

    maiorDia = `${formatarData(dia)} (${formatarMoeda(maiorValor)})`;
    let maiorValorDia = 0;

    Object.entries(gastosPorDia).forEach(([dia, valor]) => {

        if (valor > maiorValorDia) {

            maiorValorDia = valor;

            maiorDia =
                `${dia} (${formatarMoeda(valor)})`;
        }
    });

    document.getElementById("maior-gasto-dia")
        .textContent = maiorDia;
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
                data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
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

            const dataInicial = document.getElementById("data-inicial").value;

            const dataFinal = document.getElementById("data-final").value;

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

function formatarData(dataString) {

    const [ano, mes, dia] = dataString.split("-");

    return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarCategoria(nome) {

    if (!nome) return "";

    return nome.toLowerCase().replace("_", " ").replace(/\b\w/g, letra => letra.toUpperCase());
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
    const agrupado = agruparPor(transacoes,t => t.categoria?.nome || "Sem Categoria");

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
window.addEventListener("resize",inicializarDashboard);