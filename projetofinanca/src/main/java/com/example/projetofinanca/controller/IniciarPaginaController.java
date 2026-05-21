package com.example.projetofinanca.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IniciarPaginaController {

    @GetMapping("/")
    public String abrirLogin() {
        return "login";
    }
}