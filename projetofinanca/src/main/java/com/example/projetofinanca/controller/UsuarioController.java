package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*") // Permite chamadas do front-end
public class UsuarioController {

    @Autowired
    private UsuarioService service;

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

    // Endpoint simples para testar cadastro
    @PostMapping("/teste-cadastro")
    public String testeCadastro(@RequestBody Usuario usuario) {
        service.cadastrar(usuario);
        return "Usuário " + usuario.getNome() + " cadastrado com sucesso no Aiven!";
    }
}