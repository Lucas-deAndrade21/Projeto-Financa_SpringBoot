package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Transacao;
import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.repository.TransacaoRepository;
import com.example.projetofinanca.service.TransacaoService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "*")
public class TransacaoController {

    @Autowired
    private TransacaoService service;

    @Autowired
    private TransacaoRepository repository;

    @GetMapping("/testevivo")
    public String teste() {
        return "O RestController está vivo e ouvindo!";
    }

    // LISTAR TRANSAÇÕES DO USUÁRIO LOGADO
    @GetMapping
    public ResponseEntity<?> listarMinhasTransacoes(
            HttpSession session
    ) {

        Usuario usuarioLogado =
                (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Não autorizado.");
        }

        List<Transacao> lista =
                service.listarPorUsuario(usuarioLogado);

        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transacao> buscarPorId(
            @PathVariable Long id
    ) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Transacao> buscarPorCategoria(
            @PathVariable Long categoriaId
    ) {

        return repository.findAll();
    }

    @GetMapping("/data/{dataInicio}")
    public List<Transacao> buscarPorDataInicio(
            @PathVariable String dataInicio
    ) {

        return repository.findAll();
    }

    @GetMapping("/tipo-pagamento/{tipoPagamento}")
    public List<Transacao> buscarPorTipoPagamento(
            @PathVariable String tipoPagamento
    ) {

        return repository.findAll();
    }

    @GetMapping("/tipo/{tipo}")
    public List<Transacao> buscarPorTipo(
            @PathVariable String tipo
    ) {

        return repository.findAll();
    }

    // SALVAR TRANSAÇÃO
    @PostMapping
    public ResponseEntity<?> salvar(
            @RequestBody Transacao transacao,
            HttpSession session
    ) {

        Usuario usuarioLogado =
                (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Sessão expirada.");
        }

        transacao.setUsuario(usuarioLogado);

        Transacao salva = service.salvar(transacao);

        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transacao> atualizarTransacao(
            @PathVariable Long id,
            @RequestBody Transacao transacao
    ) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        transacao.setId(id);

        Transacao updated = service.salvar(transacao);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirTransacao(
            @PathVariable Long id
    ) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/teste-transacao")
    public ResponseEntity<String> testeTransacao(
            @RequestBody Transacao transacao
    ) {

        service.salvar(transacao);

        return ResponseEntity.ok(
                "Transação "
                        + transacao.getDescricao()
                        + " cadastrada com sucesso no Aiven"
        );
    }
}