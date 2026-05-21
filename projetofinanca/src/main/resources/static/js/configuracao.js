// ==========================================
// MODAIS
// ==========================================

function abrirModal(id) {

    document.getElementById(id).style.display = "flex";

    if (id === "modalCategorias") {
        carregarCategorias();
    }
}

function fecharModal(id) {
    document.getElementById(id).style.display = "none";
}

window.onclick = function(event) {

    document.querySelectorAll(".modal").forEach(modal => {

        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};

function toggleAccordion(element) {

    const item = element.parentElement;

    item.classList.toggle("active");
}

// ==========================================
// CATEGORIAS
// ==========================================
const API_CATEGORIAS = "/api/categorias";

const categoriasBox =
    document.querySelector(".categorias-box");

// ==========================================
// BUSCAR
// ==========================================
async function carregarCategorias() {

    try {

        const response = await fetch(API_CATEGORIAS, {
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error();
        }

        const categorias = await response.json();

        renderizarCategorias(categorias);

    } catch (error) {

        console.error(error);
    }
}

// ==========================================
// RENDER
// ==========================================
function renderizarCategorias(categorias) {

    categoriasBox.innerHTML = "";

    if (categorias.length === 0) {

        categoriasBox.innerHTML =
            `<p>Nenhuma categoria cadastrada.</p>`;

        return;
    }

    categorias.forEach(categoria => {

        const chip = document.createElement("div");

        chip.className = "categoria-chip";

        const podeExcluir =
            categoria.usuario !== null;

        chip.innerHTML = `
            ${formatarNomeCategoria(categoria.nome)}

            ${
                podeExcluir
                    ? `
                        <span
                            class="remover-chip"
                            onclick="deletarCategoria(${categoria.id})"
                        >
                            &times;
                        </span>
                    `
                    : ""
            }
        `;

        categoriasBox.appendChild(chip);
    });
}

// ==========================================
// CRIAR
// ==========================================
async function abrirNovaCategoria() {

    const nome =
        prompt("Digite o nome da nova categoria:");

    if (!nome || !nome.trim()) {
        return;
    }

    try {

        const response = await fetch(API_CATEGORIAS, {

            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome: nome.trim()
            })
        });

        if (!response.ok) {
            throw new Error();
        }

        await carregarCategorias();

    } catch (error) {

        console.error(error);

        alert("Erro ao criar categoria.");
    }
}

// ==========================================
// DELETE
// ==========================================
async function deletarCategoria(id) {

    const confirmar = confirm(
        "As transações serão movidas para 'Sem Categoria'."
    );

    if (!confirmar) return;

    try {

        const response = await fetch(
            `${API_CATEGORIAS}/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        await carregarCategorias();

        alert("Categoria removida.");

    } catch (error) {

        console.error(error);

        alert("Erro ao remover categoria.");
    }
}

// ==========================================
// FORMATAR
// ==========================================
function formatarNomeCategoria(nome) {

    if (!nome) return "";

    return nome.charAt(0).toUpperCase() +nome.slice(1).toLowerCase();
}

// ==========================================
// ALTERAR SENHA
// ==========================================
const formAlterarSenha =
    document.getElementById("formAlterarSenha");

if (formAlterarSenha) {

    formAlterarSenha.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const senhaAtual =
                document.getElementById("senhaAtual").value;

            const novaSenha =
                document.getElementById("novaSenha").value;

            const confirmarSenha =
                document.getElementById("confirmarSenha").value;

            if (novaSenha !== confirmarSenha) {
                alert("As senhas não coincidem.");
                return;
            }

            if (novaSenha.length < 6) {
                alert("Senha muito curta.");
                return;
            }

            try {

                const response = await fetch(
                    "/api/usuarios/alterar-senha",
                    {
                        method: "PUT",

                        credentials: "include",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            senhaAtual,
                            novaSenha
                        })
                    }
                );

                const mensagem =
                    await response.text();

                if (!response.ok) {
                    throw new Error(mensagem);
                }

                alert("Senha alterada!");

                formAlterarSenha.reset();

            } catch (error) {

                console.error(error);

                alert(error.message);
            }
        }
    );
}

// ==========================================
// METAS
// ==========================================
function editarMeta(botao) {

    const linha = botao.closest("tr");

    const colunas = linha.querySelectorAll("td");

    const nome = colunas[0].textContent.trim();

    const dataLimite =colunas[1].textContent.trim();

    const progresso =colunas[2].textContent.trim();

    const partes = progresso.split("|");

    const valorDesejado =partes.length > 1 ? partes[1] : "";

    document.getElementById("metaNome").value =nome;

    document.getElementById("metaDataLimite").value =dataLimite;

    document.getElementById("metaValorDesejado").value =valorDesejado;
}

// ==========================================
// INIT
// ==========================================


// ==========================================
// CARREGAR CATEGORIAS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
});