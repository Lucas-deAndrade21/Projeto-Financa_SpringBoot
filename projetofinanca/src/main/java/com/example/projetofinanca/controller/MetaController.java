package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Meta;
import com.example.projetofinanca.repository.MetaRepository;
import com.example.projetofinanca.service.MetaService;

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
    public List<Meta> listarTodas() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meta> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Meta> criarMeta(@RequestBody Meta meta) {
        Meta saved = service.salvar(meta);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meta> atualizarMeta(
            @PathVariable Long id,
            @RequestBody Meta meta
    ) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        meta.setId(id);

        Meta updated = service.salvar(meta);

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