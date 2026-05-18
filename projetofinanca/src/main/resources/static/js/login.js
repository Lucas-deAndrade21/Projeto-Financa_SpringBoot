const formLogin = document.getElementById("loginForm");
const msgLogin = document.getElementById("mensagemLogin");

if (formLogin) {
    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault(); // <-- Agora sim ele vai travar a URL!

        const dadosLogin = {
            email: document.getElementById("email").value,
            senha: document.getElementById("senha").value
        };

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosLogin)
            });

            if (!response.ok) {
                throw new Error("Usuário ou senha inválidos.");
            }

            const resultado = await response.json();

            if (resultado.sucesso) {
                msgLogin.style.color = "green";
                msgLogin.textContent = "Login realizado com sucesso!";

                setTimeout(() => {
                    window.location.href = "/dashboard"; // Encaminha para o NavegacaoController
                }, 1000);
            } else {
                msgLogin.style.color = "red";
                msgLogin.textContent = resultado.mensagem || "Usuário ou senha inválidos.";
            }

        } catch (error) {
            msgLogin.style.color = "red";
            msgLogin.textContent = error.message || "Erro ao conectar com o servidor.";
            console.error("Erro no login:", error);
        }
    });
}