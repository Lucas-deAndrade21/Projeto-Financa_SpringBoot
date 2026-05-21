package com.example.projetofinanca.repository;

import com.example.projetofinanca.model.Meta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {

}