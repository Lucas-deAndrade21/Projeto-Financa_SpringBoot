package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Meta;
import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.repository.MetaRepository;
import com.example.projetofinanca.service.MetaService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metas")
@CrossOrigin(origins = "*")
public class MetaController {

    @Autowired
    private MetaService service;

    @Autowired
    private MetaRepository repository;

    @GetMapping("/testevivo")
    public String teste() {
        return "O RestController está vivo e ouvindo!";
    }

    @GetMapping
    public List<Meta> listarTodas(
            HttpSession session
    ) {

        Usuario usuarioLogado =
            (Usuario) session.getAttribute("usuarioLogado");

        return repository.findByUsuario(usuarioLogado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meta> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criarMeta(
            @RequestBody Meta meta,
            HttpSession session
    ) {

        Usuario usuarioLogado =
            (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Não autenticado.");
        }

        meta.setUsuario(usuarioLogado);

        Meta saved = service.salvar(meta);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarMeta(
            @PathVariable Long id,
            @RequestBody Meta metaAtualizada
    ) {

        Meta metaExistente =
                repository.findById(id).orElse(null);

        if (metaExistente == null) {
            return ResponseEntity.notFound().build();
        }

        // Atualiza apenas os campos permitidos
        metaExistente.setNome(metaAtualizada.getNome());

        metaExistente.setDescricao(
                metaAtualizada.getDescricao()
        );

        metaExistente.setValorDesejado(
                metaAtualizada.getValorDesejado()
        );

        metaExistente.setImportancia(
                metaAtualizada.getImportancia()
        );

        metaExistente.setDataLimite(
                metaAtualizada.getDataLimite()
        );

        metaExistente.setCategoria(
                metaAtualizada.getCategoria()
        );

        // NÃO ALTERA O USUÁRIO

        Meta updated =
                service.salvar(metaExistente);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirMeta(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        service.excluir(id);

        return ResponseEntity.noContent().build();
    }
}