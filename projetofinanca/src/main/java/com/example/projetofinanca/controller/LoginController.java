package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/")
@CrossOrigin(
    origins = "http://localhost:8080",
    allowCredentials = "true"
)
public class LoginController {

    @Autowired
    private UsuarioRepository repository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public Map<String, Object> efetuarLogin(
            @RequestBody Map<String, String> dados,
            HttpSession session) {

        String email = dados.get("email");
        String senha = dados.get("senha");

        Map<String, Object> resposta = new HashMap<>();

        Optional<Usuario> usuarioOpt = repository.findByEmail(email);

        if (usuarioOpt.isPresent()
                && encoder.matches(senha, usuarioOpt.get().getSenha())) {

            Usuario usuario = usuarioOpt.get();

            session.setAttribute("usuarioLogado", usuario);

            resposta.put("sucesso", true);
            resposta.put("usuario", usuario.getNome());

            return resposta;
        }

        resposta.put("sucesso", false);
        resposta.put("mensagem", "Usuário ou senha inválidos.");

        return resposta;
    }

    @GetMapping("/usuario-logado")
    public Map<String, Object> usuarioLogado(HttpSession session) {

        Map<String, Object> resposta = new HashMap<>();

        Usuario usuario =
                (Usuario) session.getAttribute("usuarioLogado");

        if (usuario != null) {
            resposta.put("logado", true);
            resposta.put("usuario", usuario);
        } else {
            resposta.put("logado", false);
        }

        return resposta;
    }
}