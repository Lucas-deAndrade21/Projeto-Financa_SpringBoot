//Adicionar evento de cadastro
const form = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (event) => {
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

        mensagem.style.color = "green";
        mensagem.textContent =
            `Usuário ${usuarioSalvo.nome} cadastrado com sucesso!`;

        form.reset();

    } catch (error) {
        mensagem.style.color = "red";
        mensagem.textContent = error.message;
        console.error(error);
    }
});

// Adicionar evento de login
const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dadosLogin = {
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
    };

    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosLogin)
        });

        // Se o backend retornar erro HTTP (401, 500, etc.)
        if (!response.ok) {
            throw new Error("Usuário ou senha inválidos.");
        }

        const resultado = await response.json();

        if (resultado.sucesso) {
            mensagem.style.color = "green";
            mensagem.textContent = "Login realizado com sucesso!";

            // Pequeno delay para exibir a mensagem antes de redirecionar
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } else {
            mensagem.style.color = "red";
            mensagem.textContent =
                resultado.mensagem || "Usuário ou senha inválidos.";
        }

    } catch (error) {
        mensagem.style.color = "red";
        mensagem.textContent = error.message || "Erro ao conectar com o servidor.";
        console.error("Erro no login:", error);
    }
});