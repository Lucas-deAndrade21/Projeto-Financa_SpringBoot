package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.ControleSessao;
import com.example.projetofinanca.model.Transacao;
import com.example.projetofinanca.service.TransacaoService;
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

    // 1. SALVAR TRANSAÇÃO (POST)
    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Transacao transacao) {
        if (!ControleSessao.isLogado()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sessão expirada.");
        }
        
        // Vincula o usuário logado da sessão estática ao modelo real
        transacao.setUsuario(ControleSessao.usuarioLogado);
        
        Transacao salva = service.salvar(transacao);
        return ResponseEntity.ok(salva);
    }

    // 2. LISTAR APENAS AS TRANSAÇÕES DO USUÁRIO LOGADO (GET)
    @GetMapping
    public ResponseEntity<?> listarMinhasTransacoes() {
        if (!ControleSessao.isLogado()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Não autorizado.");
        }
        List<Transacao> lista = service.listarPorUsuario(ControleSessao.usuarioLogado);
        return ResponseEntity.ok(lista);
    }
}