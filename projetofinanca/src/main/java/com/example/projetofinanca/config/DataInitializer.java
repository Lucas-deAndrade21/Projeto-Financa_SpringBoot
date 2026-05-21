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
        // Garante que todas as categorias do enum existam no banco (upsert)
        for (TipoCategoria valorEnum : TipoCategoria.values()) {
            String nome = valorEnum.name();

            boolean existe = categoriasRepository.findByNome(nome).isPresent();

            if (!existe) {
                Categorias novaCategoria = new Categorias();
                novaCategoria.setNome(nome);
                categoriasRepository.save(novaCategoria);
            }
        }
    }
}