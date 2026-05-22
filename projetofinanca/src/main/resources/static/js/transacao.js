document.addEventListener(
    "DOMContentLoaded",
    async () => {

        definirDataAtual();

        await carregarCategoriasNoFormulario();

        await carregarMetasSelect();

        await carregarExtrato();
    }
);

const formTransacao =
    document.getElementById("formTransacao");

const tabelaExtrato =
    document.querySelector(".extrato table tbody");

const selectCategoria =
    document.getElementById("categoria");

const selectMeta =
    document.getElementById("meta");

// ==========================================
// FORMATOS
// ==========================================
function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function formatarData(dataString) {

    const [ano, mes, dia] =
        dataString.split("-");

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

// ==========================================
// DEFINIR DATA ATUAL
// ==========================================
function definirDataAtual() {

    const inputData =
        document.getElementById("data");

    if (inputData) {

        inputData.value = new Date()
            .toISOString()
            .split("T")[0];
    }
}

// ==========================================
// CARREGAR CATEGORIAS
// ==========================================
async function carregarCategoriasNoFormulario() {

    try {

        const response = await fetch(
            "/api/categorias",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {

            console.error(
                "Erro ao carregar categorias."
            );

            return;
        }

        const categorias =
            await response.json();

        selectCategoria.innerHTML =
            `<option value="">
                Selecione uma categoria
            </option>`;

        categorias.forEach(cat => {

            selectCategoria.innerHTML += `
                <option value="${cat.id}">
                    ${cat.nome}
                </option>
            `;
        });

    } catch (error) {

        console.error(
            "Erro ao carregar categorias:",
            error
        );
    }
}

// ==========================================
// CARREGAR METAS
// ==========================================
async function carregarMetasSelect() {

    try {

        const response = await fetch(
            "/api/metas",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        const metas =
            await response.json();

        selectMeta.innerHTML =
            `<option value="">
                Nenhuma
            </option>`;

        metas.forEach(meta => {

            selectMeta.innerHTML += `
                <option value="${meta.id}">
                    ${meta.nome}
                </option>
            `;
        });

    } catch (error) {

        console.error(
            "Erro ao carregar metas:",
            error
        );
    }
}

// ==========================================
// SALVAR TRANSAÇÃO
// ==========================================
if (formTransacao) {

    formTransacao.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const categoriaId =
                document.getElementById(
                    "categoria"
                ).value;

            const metaId =
                document.getElementById(
                    "meta"
                ).value;

            const novaTransacao = {

                nome:
                    document.getElementById(
                        "nome"
                    ).value,

                descricao:
                    document.getElementById(
                        "descricao"
                    ).value,

                valor:
                    parseFloat(
                        document
                            .getElementById("valor")
                            .value
                            .replace(/\./g, "")
                            .replace(",", ".")
                    ),

                parcela:
                    parseInt(
                        document.getElementById(
                            "parcela"
                        ).value
                    ) || 1,

                data:
                    document.getElementById(
                        "data"
                    ).value,

                tipo_transacao:
                    document.getElementById(
                        "tipoTransacao"
                    ).value,

                tipo_pagamento:
                    document.getElementById(
                        "tipo_pagamento"
                    ).value
            };

            // Categoria opcional
            if (categoriaId) {

                novaTransacao.categoria = {
                    id: parseInt(categoriaId)
                };
            }

            // Meta opcional
            if (metaId) {

                novaTransacao.meta = {
                    id: parseInt(metaId)
                };
            }

            try {

                const response = await fetch(
                    "/api/transacoes",
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            novaTransacao
                        )
                    }
                );

                if (response.status === 401) {

                    alert(
                        "Sua sessão expirou."
                    );

                    window.location.href =
                        "/login";

                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        "Erro ao salvar transação."
                    );
                }

                alert(
                    "Transação cadastrada!"
                );

                formTransacao.reset();

                definirDataAtual();

                await carregarExtrato();

            } catch (error) {

                console.error(
                    "Erro na requisição:",
                    error
                );

                alert(error.message);
            }
        }
    );
}

// ==========================================
// EXTRATO
// ==========================================
async function carregarExtrato() {

    try {

        const response = await fetch(
            "/api/transacoes",
            {
                credentials: "include"
            }
        );

        if (response.status === 401) {

            window.location.href =
                "/login";

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Erro ao carregar transações."
            );
        }

        const transacoes =
            await response.json();

        tabelaExtrato.innerHTML = "";

        if (transacoes.length === 0) {

            tabelaExtrato.innerHTML = `
                <tr>
                    <td colspan="4"
                        style="
                            text-align:center;
                            padding:20px;
                        "
                    >
                        Nenhuma transação cadastrada.
                    </td>
                </tr>
            `;

            return;
        }

        // Ordena por data
        transacoes.sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        );

        // Agrupar por data
        const grupos = {};

        transacoes.forEach(transacao => {

            const data = transacao.data;

            if (!grupos[data]) {
                grupos[data] = [];
            }

            grupos[data].push(transacao);
        });

        // Renderiza grupos
        Object.keys(grupos).forEach(data => {

            const lista = grupos[data];

            const totalDia =
                lista.reduce(
                    (soma, item) =>
                        soma + Number(item.valor),
                    0
                );

            tabelaExtrato.innerHTML += `
                <tr class="grupo-data">
                    <td colspan="4">

                        <span class="data">
                            ${formatarData(data)}
                        </span>

                        <span class="total-dia">
                            ${formatarMoeda(totalDia)}
                        </span>

                    </td>
                </tr>
            `;

            lista.forEach(t => {

                const classe =
                    t.tipo_transacao ===
                    "RECEITA"
                        ? "receitas"
                        : "despesas";

                tabelaExtrato.innerHTML += `
                    <tr class="movimento">

                        <td>
                            ${t.nome}

                            ${
                                t.meta
                                    ? `
                                        <br>
                                        <small>
                                            Meta:
                                            ${t.meta.nome}
                                        </small>
                                    `
                                    : ""
                            }
                        </td>

                        <td class="${classe}">
                            ${formatarMoeda(
                                Number(t.valor)
                            )}
                        </td>

                        <td>
                            ${t.parcela || 1}x
                        </td>

                        <td>
                            ${traduzirPagamento(
                                t.tipo_pagamento
                            )}
                        </td>

                    </tr>
                `;
            });
        });

    } catch (error) {

        console.error(
            "Erro ao carregar extrato:",
            error
        );

        tabelaExtrato.innerHTML = `
            <tr>
                <td colspan="4"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >
                    Erro ao carregar transações.
                </td>
            </tr>
        `;
    }
}