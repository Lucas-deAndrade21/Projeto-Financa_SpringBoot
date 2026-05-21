package com.example.projetofinanca.service;

import com.example.projetofinanca.model.Meta;
import com.example.projetofinanca.repository.MetaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MetaService {

    @Autowired
    private MetaRepository repository;

    public Meta salvar(Meta meta) {
        return repository.save(meta);
    }

    public List<Meta> listarTodas() {
        return repository.findAll();
    }

    public Optional<Meta> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}