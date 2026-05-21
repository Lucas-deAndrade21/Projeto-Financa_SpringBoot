package com.example.projetofinanca.repository;

import com.example.projetofinanca.model.Categorias;
import com.example.projetofinanca.model.Transacao;
import com.example.projetofinanca.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    // O Spring Data gera: SELECT * FROM transacoes WHERE usuario_id = ? ORDER BY data DESC
    List<Transacao> findByUsuarioOrderByDataDesc(Usuario usuario);

    List<Transacao> findByCategoria(Categorias categoria);
}