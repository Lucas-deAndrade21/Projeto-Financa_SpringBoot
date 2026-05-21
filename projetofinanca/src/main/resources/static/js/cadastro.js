// ==========================================
// EVENTO DE CADASTRO
// ==========================================

const formCadastro = document.getElementById("cadastroForm");
const msgCadastro = document.getElementById("mensagem");

if (formCadastro) {

    formCadastro.addEventListener("submit", async (event) => {

        event.preventDefault();

        const usuario = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            senha: document.getElementById("senha").value
        };

        try {

            const response = await fetch("http://localhost:8080/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar usuário.");
            }

            const usuarioSalvo = await response.json();

            msgCadastro.textContent =
                `Cadastrado com sucesso! Volte para a tela de Login.`;

            msgCadastro.style.color = "#16a34a";

            formCadastro.reset();

        } catch (error) {

            msgCadastro.textContent = error.message;

            msgCadastro.style.color = "#dc2626";

            console.error(error);
        }

    });

const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", () => {

    let valor = cpfInput.value.replace(/\D/g, "");

    valor = valor.substring(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpfInput.value = valor;

});

}