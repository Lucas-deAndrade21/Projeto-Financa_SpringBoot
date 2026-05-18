package com.example.projetofinanca.model;
import jakarta.persistence.*;
import lombok.Data; 
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data // Gera Getters, Setters, toString, equals e hashCode automaticamente
@NoArgsConstructor // Gera o construtor vazio (exigido pelo JPA)
@AllArgsConstructor // Gera um construtor com todos os campos
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String cpf;
    
    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;
    
    @Column(nullable= true)
    private String vencimento_cartao;
}