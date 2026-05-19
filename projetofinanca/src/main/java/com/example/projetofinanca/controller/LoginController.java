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

        if (usuarioOpt.isPresent() && encoder.matches(senha, usuarioOpt.get().getSenha())) {
            ControleSessao.usuarioLogado = usuarioOpt.get(); // Salva na sessão estática
            resposta.put("sucesso", true);
            return resposta;
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

}