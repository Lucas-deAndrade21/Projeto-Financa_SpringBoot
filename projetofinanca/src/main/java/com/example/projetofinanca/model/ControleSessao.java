package com.example.projetofinanca.model;

public class ControleSessao {
    // Esta é a variável estática que vai guardar o usuário logado no sistema inteiro
    public static Usuario usuarioLogado = null;

    // Método utilitário para deslogar
    public static void encerrarSessao() {
        usuarioLogado = null;
    }

    // Método para verificar se tem alguém logado
    public static boolean isLogado() {
        return usuarioLogado != null;
    }
}