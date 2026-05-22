function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

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

const API_METAS = "/api/metas";

const tabelaMetas =
    document.getElementById("tabelaMetas");

const formMeta =
    document.querySelector(".meta-form");

let metaEditandoId = null;

// ==========================================
// CARREGAR METAS
// ==========================================
async function carregarMetas() {

    try {

        const response = await fetch(API_METAS, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error();
        }

        const metas = await response.json();

        renderizarMetas(metas);

    } catch (error) {

        console.error(error);

        tabelaMetas.innerHTML = `
            <tr>
                <td colspan="4">
                    Erro ao carregar metas.
                </td>
            </tr>
        `;
    }
}

// ==========================================
// RENDERIZAR
// ==========================================
function renderizarMetas(metas) {

    tabelaMetas.innerHTML = "";

    if (metas.length === 0) {

        tabelaMetas.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhuma meta cadastrada.
                </td>
            </tr>
        `;

        return;
    }

    metas.forEach(meta => {

        tabelaMetas.innerHTML += `
            <tr>

                <td>${meta.nome}</td>

                <td>${meta.dataLimite || "-"}</td>

                <td>
                    ${formatarMoeda(
                        Number(meta.valorGuardado || 0)
                    )}
                    /
                    ${formatarMoeda(
                        Number(meta.valorDesejado || 0)
                    )}
                </td>

                <td class="acoes-meta">

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarMeta(${meta.id})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirMeta(${meta.id})"
                    >
                        Excluir
                    </button>

                </td>

            </tr>
        `;
    });
}

// ==========================================
// SALVAR META
// ==========================================
if(formMeta) {
    formMeta.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const body = {

                nome:
                    document.getElementById("metaNome").value,

                descricao:
                    document.getElementById("metaDescricao").value,

                dataLimite:
                    document.getElementById("metaDataLimite").value,

                valorDesejado:
                    Number(
                        document.getElementById(
                            "metaValorDesejado"
                        ).value
                    ),

                importancia:
                    Number(
                        document.getElementById(
                            "metaImportancia"
                        ).value
                    ),

                valorAtual: 0
            };

            try {

                const url =
                    metaEditandoId
                        ? `${API_METAS}/${metaEditandoId}`
                        : API_METAS;

                const method =
                    metaEditandoId
                        ? "PUT"
                        : "POST";

                const response = await fetch(url, {

                    method,

                    credentials: "include",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error();
                }

                formMeta.reset();

                metaEditandoId = null;

                await carregarMetas();

                alert(
                    metaEditandoId
                        ? "Meta atualizada."
                        : "Meta criada."
                );

            } catch (error) {

                console.error(error);

                alert("Erro ao salvar meta.");
            }
        }
    );
}

// ==========================================
// EDITAR
// ==========================================
async function editarMeta(id) {

    try {

        const response = await fetch(
            `${API_METAS}/${id}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        const meta = await response.json();

        metaEditandoId = meta.id;

        document.getElementById("metaNome").value =
            meta.nome || "";

        document.getElementById("metaDescricao").value =
            meta.descricao || "";

        document.getElementById("metaDataLimite").value =
            meta.dataLimite || "";

        document.getElementById("metaValorDesejado").value =
            meta.valorDesejado || "";

        document.getElementById("metaImportancia").value =
            meta.importancia || "";

    } catch (error) {

        console.error(error);

        alert("Erro ao carregar meta.");
    }
}

// ==========================================
// EXCLUIR
// ==========================================
async function excluirMeta(id) {

    const confirmar =
        confirm("Deseja excluir esta meta?");

    if (!confirmar) return;

    try {

        const response = await fetch(
            `${API_METAS}/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        await carregarMetas();

        alert("Meta removida.");

    } catch (error) {

        console.error(error);

        alert("Erro ao excluir meta.");
    }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarCategorias();

        carregarMetas();
    }
);