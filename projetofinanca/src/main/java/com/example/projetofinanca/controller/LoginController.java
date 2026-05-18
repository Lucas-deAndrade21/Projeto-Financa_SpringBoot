package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.ControleSessao;
import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsuarioRepository repository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Endpoint para testar se o controller está funcionando
    @GetMapping("/login/testevivo")
    public String teste() {
        return "LoginController está vivo!";
    }

    // Endpoint de login
    @PostMapping("/login")
    public Map<String, Object> efetuarLogin(@RequestBody Map<String, String> dados) {

        String email = dados.get("email");
        String senha = dados.get("senha");

        Map<String, Object> resposta = new HashMap<>();

        Optional<Usuario> usuarioOpt = repository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Verifica a senha digitada com o hash armazenado
            if (encoder.matches(senha, usuario.getSenha())) {

                // Armazena na sessão simples da aplicação
                ControleSessao.usuarioLogado = usuario;

                resposta.put("sucesso", true);
                resposta.put("mensagem", "Login realizado com sucesso!");
                resposta.put("usuario", usuario);

                return resposta;
            }
        }

        resposta.put("sucesso", false);
        resposta.put("mensagem", "Usuário ou senha inválidos.");

        return resposta;
    }

    // Endpoint para verificar usuário logado
    @GetMapping("/usuario-logado")
    public Map<String, Object> usuarioLogado() {

        Map<String, Object> resposta = new HashMap<>();

        if (ControleSessao.usuarioLogado != null) {
            resposta.put("logado", true);
            resposta.put("usuario", ControleSessao.usuarioLogado);
        } else {
            resposta.put("logado", false);
            resposta.put("mensagem", "Nenhum usuário logado.");
        }

        return resposta;
    }

    // Logout
    @PostMapping("/logout")
    public Map<String, String> logout() {

        ControleSessao.encerrarSessao();

        Map<String, String> resposta = new HashMap<>();
        resposta.put("mensagem", "Logout realizado com sucesso!");

        return resposta;
    }
}