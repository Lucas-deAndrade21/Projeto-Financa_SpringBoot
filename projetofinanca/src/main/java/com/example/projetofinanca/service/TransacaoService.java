package com.example.projetofinanca.service;

import com.example.projetofinanca.model.Transacao;
import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository repository;

    public Transacao salvar(Transacao transacao) {
        return repository.save(transacao);
    }

    public List<Transacao> listarPorUsuario(Usuario usuario) {
        return repository.findByUsuarioOrderByDataDesc(usuario);
    }
}