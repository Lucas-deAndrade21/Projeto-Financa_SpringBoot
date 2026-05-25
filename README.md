
<h1 align="center" style="color:#16a34a;"> 💸 MoneyLens </h1>

<div align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

</div>

Sistema web de controle financeiro pessoal desenvolvido com **Spring Boot**, **Java**, **MySQL**, **HTML/CSS/JavaScript** e integração com **Google Charts**.

O objetivo do projeto é permitir que usuários gerenciem suas finanças de forma simples, visual e organizada, acompanhando receitas, despesas, categorias e métricas financeiras em tempo real.

---

<h1 align="center" style="color:#16a34a;">  ✨ Funcionalidades </h1>

O MoneyLens oferece uma experiência completa de gerenciamento financeiro pessoal, permitindo o cadastro e autenticação segura de usuários com senhas criptografadas via BCrypt. A plataforma possibilita o controle de receitas e despesas, edição e remoção de transações, suporte a valores monetários reais e filtros inteligentes por período mensal, anual ou personalizado.

Além disso, o sistema conta com gerenciamento dinâmico de categorias, incluindo categorias globais e personalizadas por usuário, além de uma lógica segura que redireciona automaticamente transações para a categoria “Sem Categoria” quando necessário.

O dashboard apresenta gráficos interativos, indicadores financeiros em tempo real, insights automáticos sobre gastos, métodos de pagamento mais utilizados, maiores movimentações do período e resumo das transações recentes.

---

<h1 align="center" style="color:#16a34a;"> 🛠️ Tecnologias Utilizadas </h1>

## 🔙 Back-end

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring MVC](https://img.shields.io/badge/Spring_MVC-Framework-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-ORM-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## 🎨 Front-end

![HTML5](https://img.shields.io/badge/HTML5-Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Style-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📚 Bibliotecas e extensões

![Google Charts](https://img.shields.io/badge/Google_Charts-Data_Visualization-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-Java_Library-BC4521?style=for-the-badge)
![Postman](https://img.shields.io/badge/Postman-API_Testing-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![BCrypt](https://img.shields.io/badge/BCrypt-Security-blue?style=for-the-badge)

---

<h1 align="center" style="color:#16a34a;"> 🧠 Arquitetura </h1>
O projeto segue o padrão **MVC (Model-View-Controller)**, separando responsabilidades entre camada de controle, regras de negócio, persistência de dados e interface visual.


## 🗄️ Estrutura do Projeto

```bash
src
 ├── controller   → Responsável por receber as requisições HTTP e controlar as rotas da aplicação.
 ├── model        → Contém as entidades e classes que representam os dados do sistema.
 ├── repository   → Camada de acesso ao banco de dados utilizando Spring Data JPA.
 ├── service      → Implementa as regras de negócio e processamento da aplicação.
 ├── templates    → Arquivos HTML renderizados pelo Thymeleaf no front-end.
 ├── static
 │    ├── css
 │    ├── js
 │    └── img
```

--- 

<h1 align="center" style="color:#16a34a;"> ▶️ Execução do Projeto </h1>

## 1️⃣ Clone o repositório

```bash
git clone https://github.com/Lucas-deAndrade21/Projeto-Financa_SpringBoot.git
```

## 2️⃣ Execute a aplicação

Pelo VSCode ou IntelliJ IDEA:

```cmd
./mvnw spring-boot:run
```

Caso utilize o VSCode, recomenda-se instalar a extensão Spring Boot Extension Pack para facilitar a execução da aplicação.

## 🌐 Acesso da Aplicação

Após iniciar o servidor, acesse:

**👉 [http://localhost:8080/login](http://localhost:8080/login)**

---

<h1 align="center" style="color:#16a34a;"> 📸 Preview </h1> 

<img width="1901" height="1293" alt="Dashboard_Moneylens" src="https://github.com/user-attachments/assets/e8d20764-c4d4-4aeb-93f5-f99bb9fcdc08" />

---

 <h1 align="center" style="color:#16a34a;"> 👨‍💻 Autores </h1>

<div align="center">

| 👤 Nome | 💼 Função | 📌 Responsabilidades |
|------|------|------|
| [**Carlos Eduardo**](https://github.com/Karlos-Eduardo-Mrqs) | Back-end & Arquitetura | Estrutura do sistema e banco de dados, regras de negócio |
| [**Lucas De Andrade**](https://github.com/Lucas-deAndrade21) | Front-end & UI/UX | Interface, experiência do usuário e gestão de tarefas |
| [**Victor Leon**](https://github.com/VictorLMMartello) | Back-end & Integrações | Integrações, modelagem e regras de negócio |

</div>

---
