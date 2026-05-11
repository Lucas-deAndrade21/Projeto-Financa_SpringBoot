package com.example.projetofinanca.controller;

import com.example.projetofinanca.model.Usuario;
import com.example.projetofinanca.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller; // Mudamos de RestController para Controller
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired 
    private UsuarioService service;

    @GetMapping("/testevivo")
    @ResponseBody
    public String teste() {
        return "O Controller está vivo e ouvindo!";
    }

    // 1. O método que EXIBE a tela (GET)
    @GetMapping("/novo")
    public String exibirFormulario(Model model) {
        // Criamos um "boneco" de usuário vazio para o formulário preencher
        model.addAttribute("usuario", new Usuario());
        return "formulario"; // O Spring vai buscar o arquivo cadastro.html em templates
    }

    // 2. O método que RECEBE os dados da tela (POST)
    @PostMapping("/salvar")
    public String salvarUsuario(@ModelAttribute Usuario usuario) {
        service.cadastrar(usuario); // O Service agora cuida da senha antes de salvar
        return "redirect:/usuarios/sucesso";
    }
    
    @GetMapping("/sucesso")
    @ResponseBody // Usamos isso aqui só para mostrar uma mensagem rápida sem precisar de outro HTML
    public String sucesso() {
        return "Usuário cadastrado com sucesso no Aiven!";
    }

    @GetMapping("/lista_usuarios")
    public String listar(Model model) {
        model.addAttribute("usuarios", service.listarTodos());
        return "lista_usuarios";
    }

    // EDITAR (Abre o formulário com os dados preenchidos)
    @PostMapping("/editar")
    public String editar(@RequestParam("id") Long id, Model model) {
        // Buscamos o usuário no banco pelo ID enviado pelo form oculto
        Usuario usuarioExistente = service.buscarPorId(id);
        // Mandamos o usuário carregado para o MESMO cadastro.html
        model.addAttribute("usuario", usuarioExistente);
        return "formulario"; 
    }

    @PostMapping("/excluir")
    public String excluir(@RequestParam("id") Long id) {
        service.excluir(id);
        return "redirect:/usuarios/lista_usuarios";
    }

}