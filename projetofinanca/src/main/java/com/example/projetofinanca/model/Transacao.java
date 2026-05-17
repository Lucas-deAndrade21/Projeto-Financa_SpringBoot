package com.example.projetofinanca.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.example.projetofinanca.model.enums.*;

@Entity
@Table(name = "transacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING) // Salva o nome (RECEITA) no banco em vez do número 0 ou 1
    private TipoTransacao tipo;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    @ManyToOne // Relacionamento: Muitas transações pertencem a um usuário
    @JoinColumn(name = "usuario_id") // Nome da coluna da chave estrangeira no banco
    private Usuario usuario;
}