package com.example.projetofinanca.service;

import com.example.projetofinanca.model.Categorias;
import com.example.projetofinanca.repository.CategoriasRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoriasService {

    @Autowired
    private CategoriasRepository repository;

    public Categorias salvar(Categorias categorias) {
        return repository.save(categorias);
    }

    public List<Categorias> listaCategorias(Categorias categorias) {
        return repository.findAll();
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}