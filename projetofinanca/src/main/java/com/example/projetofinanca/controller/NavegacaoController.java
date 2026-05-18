package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.ControleSessao;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // Gerencia APENAS o carregamento de páginas HTML (Thymeleaf)
public class NavegacaoController {

    // 1. Tela de Login
    @GetMapping("/login")
    public String login() {
        return "login"; // templates/login.html
    }

    // 2. Tela de Cadastro de Usuário
    @GetMapping("/cadastro")
    public String cadastro() {
        return "cadastro"; // templates/cadastro.html
    }

    // 3. Dashboard (Protegido por Sessão)
    @GetMapping("/dashboard")
    public String dashboard() {
        if (!ControleSessao.isLogado()) {
            return "redirect:/login"; // Expulsa se não estiver logado
        }
        return "index"; // templates/index.html
    }

    // 4. Tela de Transações (Protegido)
    @GetMapping("/transacoes")
    public String transacoes() {
        if (!ControleSessao.isLogado()) {
            return "redirect:/login";
        }
        return "transacao"; // templates/transacao.html
    }

    // 5. Tela de Metas (Protegido)
    @GetMapping("/metas")
    public String metas() {
        if (!ControleSessao.isLogado()) {
            return "redirect:/login";
        }
        return "meta"; // templates/meta.html
    }

    @GetMapping("/logout")
    public String logout() {
        ControleSessao.encerrarSessao();
        return "redirect:/login";
    }

    @GetMapping("/relatorios")
    public String relatorio() {
        if (!ControleSessao.isLogado()) {
            return "redirect:/login";
        }
        return "relatorio"; // templates/relatorio.html
    }

    @GetMapping("/configuracoes")
    public String configuracao() {
        if (!ControleSessao.isLogado()) {
            return "redirect:/login";
        }
        return "configuracao"; // templates/configuracao.html
    }

}