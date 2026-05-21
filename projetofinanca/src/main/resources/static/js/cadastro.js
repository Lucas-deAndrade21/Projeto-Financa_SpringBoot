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
            // =========================
            // CADASTRAR USUÁRIO
            // =========================
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

            // =========================
            // LOGIN AUTOMÁTICO
            // =========================
            const loginResponse = await fetch("http://localhost:8080/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: usuario.email,
                    senha: usuario.senha
                })
            });

            if (!loginResponse.ok) {
                throw new Error("Usuário cadastrado, mas erro ao fazer login.");
            }

            const resultadoLogin = await loginResponse.json();

            if (!resultadoLogin.sucesso) {
                throw new Error("Usuário cadastrado, mas login falhou.");
            }

            // =========================
            // SUCESSO
            // =========================
            msgCadastro.textContent =
                "Cadastro realizado com sucesso!";

            msgCadastro.style.color = "#16a34a";

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);

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