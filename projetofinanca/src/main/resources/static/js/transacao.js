const formTransacao = document.getElementById("formTransacao");
const tabelaExtrato = document.querySelector(".extrato table tbody");
const selectCategoria = document.getElementById("categoria");

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(dataString) {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
}

function traduzirPagamento(tipo) {
    const mapa = {
        PIX: "Pix",
        CARTAO_DEBITO: "Débito",
        CARTAO_CREDITO: "Crédito",
        DINHEIRO: "Dinheiro",
        TRANSFERENCIA: "Transferência",
        DEPOSITO_BANCARIO: "Depósito"
    };

    return mapa[tipo] || tipo;
}

async function carregarCategoriasNoFormulario() {
    try {
        const response = await fetch("/api/categorias", {
            credentials: "include"
        });

        if (!response.ok) {
            console.error("Erro ao carregar categorias.");
            return;
        }

        const categorias = await response.json();

        selectCategoria.innerHTML =
            '<option value="">Selecione uma categoria</option>';

        categorias.forEach(cat => {
            selectCategoria.innerHTML += `
                <option value="${cat.id}">
                    ${cat.nome}
                </option>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}


if (formTransacao) {
    formTransacao.addEventListener("submit", async (event) => {
        event.preventDefault();

        const novaTransacao = {
            nome: document.getElementById("nome").value,
            descricao: document.getElementById("descricao").value,
            valor: parseFloat(document.getElementById("valor").value),
            parcela:
                parseInt(document.getElementById("parcela").value) || 1,
            data: document.getElementById("data").value,
            tipo_transacao: "DESPESA",
            tipo_pagamento:
                document.getElementById("tipo_pagamento").value,
            categoria: {
                id: parseInt(
                    document.getElementById("categoria").value
                )
            }
        };

        try {
            const response = await fetch("/api/transacoes", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaTransacao)
            });

            if (response.status === 401) {
                alert("Sua sessão expirou. Faça login novamente.");
                window.location.href = "/login";
                return;
            }

            if (!response.ok) {
                throw new Error("Erro ao salvar transação.");
            }

            alert("Transação cadastrada com sucesso!");
            formTransacao.reset();

            // Define a data atual novamente
            document.getElementById("data").value =
                new Date().toISOString().split("T")[0];

            await carregarExtrato();

        } catch (error) {
            console.error("Erro na requisição:", error);
            alert(error.message);
        }
    });
}


function definirDataAtual() {
    const inputData = document.getElementById("data");

    if (inputData) {
        inputData.value = new Date()
            .toISOString()
            .split("T")[0];
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    definirDataAtual();
    await carregarCategoriasNoFormulario();
    await carregarExtrato();
});

// ==========================================
// CARREGAR EXTRATO AGRUPADO POR DATA
// ==========================================
async function carregarExtrato() {
    try {
        const response = await fetch("/api/transacoes");

        if (response.status === 401) {
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao carregar transações.");
        }

        const transacoes = await response.json();

        // Limpa a tabela
        tabelaExtrato.innerHTML = "";

        // Se não houver transações
        if (transacoes.length === 0) {
            tabelaExtrato.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; padding:20px;">
                        Nenhuma transação cadastrada.
                    </td>
                </tr>
            `;
            return;
        }

        // Ordena por data decrescente
        transacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

        // Agrupa por data
        const grupos = {};

        transacoes.forEach((transacao) => {
            const data = transacao.data;

            if (!grupos[data]) {
                grupos[data] = [];
            }

            grupos[data].push(transacao);
        });

        // Monta a tabela
        Object.keys(grupos).forEach((data) => {
            const lista = grupos[data];

            // Soma total do dia
            const totalDia = lista.reduce((soma, item) => {
                return soma + Number(item.valor);
            }, 0);

            // Cabeçalho do grupo
            tabelaExtrato.innerHTML += `
                <tr class="grupo-data">
                    <td colspan="4">
                        <span class="data">${formatarData(data)}</span>
                        <span class="total-dia">${formatarMoeda(totalDia)}</span>
                    </td>
                </tr>
            `;

            // Transações do dia
            lista.forEach((t) => {
                tabelaExtrato.innerHTML += `
                    <tr class="movimento">
                        <td>${t.nome}</td>
                        <td>${formatarMoeda(t.valor)}</td>
                        <td>${t.parcela || 1}x</td>
                        <td>${traduzirPagamento(t.tipo_pagamento)}</td>
                    </tr>
                `;
            });
        });

    } catch (error) {
        console.error("Erro ao carregar extrato:", error);

        tabelaExtrato.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:20px;">
                    Erro ao carregar transações.
                </td>
            </tr>
        `;
    }
}