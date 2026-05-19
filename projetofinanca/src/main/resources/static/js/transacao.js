const formTransacao = document.getElementById("formTransacao");
const tabelaExtrato = document.querySelector(".extrato table tbody");

if (formTransacao) {
    formTransacao.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Montando o objeto EXATAMENTE igual ao seu modelo Java
        const novaTransacao = {
            nome: document.getElementById("nome").value, // NOVO CAMPO NOME
            descricao: document.getElementById("descricao").value,
            valor: parseFloat(document.getElementById("valor").value),
            data: document.getElementById("data").value,
            periocidade: document.getElementById("periocidade") ? document.getElementById("periocidade").value : "ÚNICA",
            
            // 🌟 Certifique-se de que o valor abaixo está exatamente como o seu Enum TipoTransacao espera (ex: "DESPESA" ou "RECEITA")
            tipo_transacao: "DESPESA", 
            
            // 🌟 CORREÇÃO AQUI: Mudado de "DEBITO" para "CARTAO_DEBITO" para bater com o seu Enum Java!
            tipo_pagamento: "CARTAO_DEBITO",  
            
            categoria: {
                id: parseInt(document.getElementById("categoria").value)
            }
        };

        try {
            const response = await fetch("http://localhost:8080/api/transacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaTransacao)
            });

            if (response.ok) {
                alert("Transação cadastrada com sucesso!");
                formTransacao.reset();
                carregarExtrato();
            } else {
                alert("Erro ao salvar transação.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    });
}

// Renderização do extrato na tabela adaptada ao seu modelo
async function carregarExtrato() {
    try {
        const response = await fetch("http://localhost:8080/api/transacoes");
        if (!response.ok) return;

        const transacoes = await response.json();
        tabelaExtrato.innerHTML = "";

        transacoes.forEach(t => {
            const linha = `
                <tr class="movimento">
                    <td>${t.descricao}</td>
                    <td>R$ ${t.valor.toFixed(2).replace('.', ',')}</td>
                    <td>${t.tipo_transacao}</td>
                    <td>${t.tipo_pagamento}</td>
                </tr>
            `;
            tabelaExtrato.innerHTML += linha;
        });
    } catch (error) {
        console.error("Erro ao carregar extrato:", error);
    }
}

const selectCategoria = document.getElementById("categoria");

// FUNÇÃO PARA BUSCAR AS CATEGORIAS DO BANCO E INJETAR NO SELECT
async function carregarCategoriasNoFormulario() {
    try {
        const response = await fetch("http://localhost:8080/api/categorias");
        if (!response.ok) return;

        const categorias = await response.json();
        
        // Limpa o select e coloca uma instrução inicial
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';

        // Percorre as categorias vindas do Aiven e cria as tags <option>
        categorias.forEach(cat => {
            const opcao = `<option value="${cat.id}">${cat.nome}</option>`;
            selectCategoria.innerHTML += opcao;
        });

    } catch (error) {
        console.error("Erro ao carregar categorias no select:", error);
    }
}

// Executa a função automaticamente assim que a página abre
carregarCategoriasNoFormulario();
carregarExtrato(); // Sua função antiga que lista o extrato
