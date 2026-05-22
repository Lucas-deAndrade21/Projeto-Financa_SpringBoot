package com.example.projetofinanca.repository;

import com.example.projetofinanca.model.Meta;
import com.example.projetofinanca.model.Usuario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {

    List<Meta> findByUsuario(Usuario usuario);
}