// ==========================================
//  EVENTO DE CADASTRO
// ==========================================
const formCadastro = document.getElementById("cadastroForm");
const msgCadastro = document.getElementById("mensagemCadastro"); // Garanta que o ID no HTML seja este

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar usuário.");
            }

            const usuarioSalvo = await response.json();

            msgCadastro.style.color = "green";
            msgCadastro.textContent = `Usuário ${usuarioSalvo.nome} cadastrado com sucesso!`;
            formCadastro.reset();

        } catch (error) {
            msgCadastro.style.color = "red";
            msgCadastro.textContent = error.message;
            console.error(error);
        }
    });
}
