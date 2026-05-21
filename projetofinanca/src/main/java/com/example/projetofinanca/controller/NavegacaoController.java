package com.example.projetofinanca.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class NavegacaoController {

    // Tela de Login
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // Tela de Cadastro
    @GetMapping("/cadastro")
    public String cadastro() {
        return "cadastro";
    }

    // Dashboard
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }
        return "index";
    }

    // Transações
    @GetMapping("/transacoes")
    public String transacoes(HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }
        return "transacao";
    }

    // Metas
    @GetMapping("/metas")
    public String metas(HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }
        return "meta";
    }

    // Relatórios
    @GetMapping("/relatorios")
    public String relatorio(HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }
        return "relatorio";
    }

    // Configurações
    @GetMapping("/configuracoes")
    public String configuracao(HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }
        return "configuracao";
    }

    // Logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}