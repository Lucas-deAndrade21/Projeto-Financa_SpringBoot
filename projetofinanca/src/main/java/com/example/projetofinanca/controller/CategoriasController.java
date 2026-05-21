package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Categorias;
import com.example.projetofinanca.model.Transacao;
import com.example.projetofinanca.model.Usuario;
import jakarta.servlet.http.HttpSession;
import com.example.projetofinanca.repository.CategoriasRepository;
import com.example.projetofinanca.repository.TransacaoRepository;
import com.example.projetofinanca.service.CategoriasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "") // Ajustado para permitir requisições do front-end local
public class CategoriasController {

    @Autowired
    private CategoriasRepository repository;

    @Autowired
    private CategoriasService service;

    @Autowired
    private TransacaoRepository transacaoRepository;

    // 1. LISTAR: Retorna apenas as categorias globais (null) + as do usuário logado
    @GetMapping
    public ResponseEntity<?> listarTodas(HttpSession session) {

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        List<Categorias> lista = repository.findByUsuarioIsNullOrUsuario(usuarioLogado);
        return ResponseEntity.ok(lista);
    }

    // 2. SALVAR: Cadastra a categoria vinculada estritamente ao criador
    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Categorias categorias, HttpSession session) {

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sessão expirada.");
        }

        categorias.setUsuario(usuarioLogado);

        if (categorias.getNome() != null) {
            categorias.setNome(categorias.getNome().toUpperCase());
        }

        Categorias salva = service.salvar(categorias);
        return ResponseEntity.ok(salva);
    }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> excluirCategorias(@PathVariable Long id, HttpSession session) {

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Não autenticado.");
        };

        Categorias categoria =
            repository.findById(id).orElse(null);

        if (categoria == null) {
            return ResponseEntity
                .notFound()
                .build();
        }

        // impede deletar categoria global
        if (categoria.getUsuario() == null) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Categoria global não pode ser removida.");
        }

        // impede deletar categoria de outro usuário
        if (!categoria.getUsuario().getId()
            .equals(usuarioLogado.getId())) {

            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Sem permissão.");
        }

        // busca categoria padrão
        Categorias semCategoria =
            repository.findByNome("SEM_CATEGORIA").orElse(null);

        if (semCategoria == null) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Categoria padrão não encontrada.");
        }

        // busca transações da categoria
        List<Transacao> transacoes =
            transacaoRepository.findByCategoria(categoria);

        // troca categoria
        transacoes.forEach(transacao -> {
            transacao.setCategoria(semCategoria);
        });

        // salva alterações
        transacaoRepository.saveAll(transacoes);

        // remove categoria
        service.excluir(id);

        return ResponseEntity.ok(
            "Categoria removida com sucesso."
        );
        }
}