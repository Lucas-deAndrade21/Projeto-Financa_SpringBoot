package com.example.projetofinanca.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "metas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @Column(precision = 19, scale = 2)
    private BigDecimal valorDesejado;

    @Column(precision = 19, scale = 2)
    private BigDecimal valorGuardado = BigDecimal.ZERO; // Começa com zero por padrão

    private Integer importancia; // Gráficos: 1 (verde) até 5 (vermelho)
    private LocalDate dataLimite;
    private LocalDate dataInicio;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categorias categoria;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

}