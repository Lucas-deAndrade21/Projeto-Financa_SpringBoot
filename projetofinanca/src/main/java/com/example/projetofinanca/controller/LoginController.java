package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.repository.UsuarioRepository;
import com.example.projetofinanca.model.ControleSessao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@Controller
@RequestMapping("/")
public class LoginController {

    @Autowired
    private UsuarioRepository repository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // 1. Exibe a tela de login
    @GetMapping("/login")
    public String telaLogin() {
        return "login"; // Abre o login.html
    }

    // 2. Processa o envio do formulário de login
    @PostMapping("/login")
    public String efetuarLogin(@RequestParam("email") String email, 
                               @RequestParam("senha") String senha, 
                               Model model) {
        
        // Busca o usuário pelo e-mail no banco (Crie esse método no seu UsuarioRepository se não tiver)
        Optional<Usuario> usuarioOpt = repository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Compara a senha digitada com a senha criptografada do banco
            if (encoder.matches(senha, usuario.getSenha())) {
                
                // MÁGICA: Guarda o usuário na nossa variável estática!
                ControleSessao.usuarioLogado = usuario;
                
                // Redireciona para a lista de usuários ou painel principal
                return "redirect:/index"; 
            }
        }

        // Se chegou aqui, é porque o e-mail ou a senha estão errados
        model.addAttribute("erro", "Usuário ou senha inválidos!");
        return "login";
    }

    // 3. Rota para fazer Logout
    @GetMapping("/logout")
    public String logout() {
        ControleSessao.encerrarSessao();
        return "redirect:/login";
    }
}