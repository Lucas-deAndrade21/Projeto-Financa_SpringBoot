package com.example.projetofinanca.config;

import com.example.projetofinanca.model.Categorias;
import com.example.projetofinanca.model.enums.TipoCategoria; // Substitua pelo nome exato do seu Enum de categorias
import com.example.projetofinanca.repository.CategoriasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component // Diz ao Spring que essa classe deve ser gerenciada por ele
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoriasRepository categoriasRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Verifica se a tabela de categorias está vazia
        if (categoriasRepository.count() == 0) {
            // 2. Loop automático que lê todos os valores de dentro do seu Enum
            for (TipoCategoria valorEnum : TipoCategoria.values()) {
                Categorias novaCategoria = new Categorias();
                
                // Converte o nome do Enum (ex: ALIMENTACAO) em uma String bonita (Alimentação ou ALIMENTACAO)
                novaCategoria.setNome(valorEnum.name()); 
                
                // Salva fisicamente no banco do Aiven
                categoriasRepository.save(novaCategoria);
            }     
        }
    }
}