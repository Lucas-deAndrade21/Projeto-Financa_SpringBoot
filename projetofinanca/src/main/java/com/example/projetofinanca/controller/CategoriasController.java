package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Categorias;
import com.example.projetofinanca.repository.CategoriasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriasController {

    @Autowired
    private CategoriasRepository repository;

    // Retorna todas as categorias do banco em formato JSON
    @GetMapping
    public List<Categorias> listarTodas() {
        return repository.findAll();
    }
}