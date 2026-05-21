package com.example.projetofinanca.repository;

import com.example.projetofinanca.model.Categorias;
import com.example.projetofinanca.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriasRepository extends JpaRepository<Categorias, Long> {
    // Método auxiliar para checar se a categoria já existe pelo nome
     Optional<Categorias> findByNome(String nome);

    List<Categorias> findByUsuarioIsNullOrUsuario(Usuario usuario);

}