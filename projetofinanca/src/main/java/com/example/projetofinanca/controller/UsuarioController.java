package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.repository.UsuarioRepository;
import com.example.projetofinanca.service.UsuarioService;

import java.util.Map;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;
    
    @Autowired
    private UsuarioRepository repository;

    private final BCryptPasswordEncoder encoder =new BCryptPasswordEncoder();


    // Teste rápido para verificar se o controller está funcionando
    @GetMapping("/testevivo")
    public String teste() {
        return "O RestController está vivo e ouvindo!";
    }

    // Listar todos os usuários
    @GetMapping
    public List<Usuario> listarTodos() {
        return service.listarTodos();
    }

    // Buscar usuário por ID
    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // Salvar novo usuário
    @PostMapping
    public Usuario salvarUsuario(@RequestBody Usuario usuario) {
        return service.cadastrar(usuario);
    }

    // Atualizar usuário existente
    @PutMapping("/{id}")
    public Usuario atualizarUsuario(@PathVariable Long id,
                                    @RequestBody Usuario usuario) {
        usuario.setId(id);
        return service.cadastrar(usuario);
    }

    // Excluir usuário
    @DeleteMapping("/{id}")
    public String excluirUsuario(@PathVariable Long id) {
        service.excluir(id);
        return "Usuário excluído com sucesso!";
    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody Map<String, String> dados,HttpSession session) {

        Usuario usuarioLogado =(Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sessão expirada.");
        }

        String senhaAtual = dados.get("senhaAtual");
        String novaSenha = dados.get("novaSenha");

        Usuario usuario =repository.findById(usuarioLogado.getId()).orElse(null);

        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado.");
        }

            // verifica senha atual
        if (!encoder.matches(senhaAtual,usuario.getSenha())) {
            return ResponseEntity.badRequest().body("Senha atual incorreta.");
        }

            // salva nova senha criptografada
        usuario.setSenha(encoder.encode(novaSenha));

        repository.save(usuario);

        return ResponseEntity.ok("Senha alterada com sucesso.");
    }

}