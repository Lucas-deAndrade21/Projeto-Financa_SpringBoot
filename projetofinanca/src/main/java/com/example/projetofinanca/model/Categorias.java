package com.example.projetofinanca.model;
import jakarta.persistence.*;
import lombok.Data; 
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categorias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String icone; // Ex: "fa-car" (Facilita a vida do Front-end)

    @Column(nullable = false)
    private Integer importancia; // Gráficos: 1 (verde) até 5 (vermelho)

}
