// ===============================
// RELATÓRIO ANUAL POR CATEGORIA
// ===============================

const tabelaRelatorio = document.querySelector("#relatorio-anual tbody");
const botaoGerarRelatorio = document.getElementById("gerar-relatorio");

// Nomes dos meses (índices 0 a 11)
const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

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
// FORMATAR MOEDA
// ===============================
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ===============================
// GERAR RELATÓRIO
// ===============================
async function gerarRelatorio() {
    try {
        const transacoes = await buscarTransacoes();

        // Estrutura:
        // {
        //   "ALIMENTACAO": [0, 0, 150, 300, ...]
        // }
        const relatorio = {};

        transacoes
            .filter(transacao =>
                transacao.tipo_transacao === "DESPESA"
            )
            .forEach(transacao => {

                const categoria =
                    transacao.categoria?.nome || "Sem Categoria";

                const data = new Date(transacao.data);
                const mes = data.getMonth();

                const valor = Number(transacao.valor || 0);

                if (!relatorio[categoria]) {
                    relatorio[categoria] = Array(12).fill(0);
                }

                relatorio[categoria][mes] += valor;
            });

        // Limpa tabela
        tabelaRelatorio.innerHTML = "";

        // Sem dados
        const categorias = Object.keys(relatorio);

        if (categorias.length === 0) {
            tabelaRelatorio.innerHTML = `
                <tr>
                    <td colspan="13" style="text-align:center; padding:20px;">
                        Nenhuma transação encontrada.
                    </td>
                </tr>
            `;
            return;
        }

        // Monta linhas
        categorias
            .sort()
            .forEach(categoria => {
                const valores = relatorio[categoria];

                let linha = `<tr>`;
                linha += `<td>${categoria}</td>`;

                valores.forEach(valor => {
                    linha += `<td>${formatarMoeda(valor)}</td>`;
                });

                linha += `</tr>`;

                tabelaRelatorio.innerHTML += linha;
            });

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);

        tabelaRelatorio.innerHTML = `
            <tr>
                <td colspan="13" style="text-align:center; padding:20px;">
                    Erro ao carregar relatório.
                </td>
            </tr>
        `;
    }
}

// ======================================
// EXPORTAR RELATÓRIO PARA EXCEL (CSV)
// ======================================
function exportarParaExcel() {
    const tabela = document.getElementById("relatorio-anual");

    if (!tabela) {
        alert("Tabela não encontrada.");
        return;
    }

    let csv = [];

    // Percorre todas as linhas da tabela
    for (let i = 0; i < tabela.rows.length; i++) {
        const linha = [];
        const colunas = tabela.rows[i].querySelectorAll("th, td");

        colunas.forEach(coluna => {
            let texto = coluna.innerText
                .replace(/"/g, '""') // escapa aspas
                .trim();

            // Coloca entre aspas para preservar vírgulas
            linha.push(`"${texto}"`);
        });

        csv.push(linha.join(";"));
    }

    // Junta todas as linhas
    const conteudoCSV = "\uFEFF" + csv.join("\n");

    // Cria o arquivo
    const blob = new Blob([conteudoCSV], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    // Nome do arquivo com data atual
    const hoje = new Date();
    const nomeArquivo =
        `relatorio_${hoje.getFullYear()}_${String(
            hoje.getMonth() + 1
        ).padStart(2, "0")}.csv`;

    // Cria link de download
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

botaoGerarRelatorio.addEventListener("click", async () => {
    await gerarRelatorio();   // Atualiza a tabela
    exportarParaExcel();      // Baixa o arquivo
});

// Carrega automaticamente ao abrir a página
document.addEventListener("DOMContentLoaded", gerarRelatorio);