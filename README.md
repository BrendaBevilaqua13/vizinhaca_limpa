# Sistema de Denúncias de Lixo

## 1. Descrição do Projeto

O **Sistema de Denúncias de Lixo** é uma plataforma desenvolvida para
registrar, consultar e gerenciar denúncias de descarte irregular de
lixo.\
O objetivo principal é facilitar o monitoramento e apoiar
ações de fiscalização.

## Problema Solucionado

A falta de um canal estruturado para denúncias ambientais dificulta o
rastreamento, tratamento e resolução eficiente dos casos.\
Este sistema organiza essas informações, garantindo rastreabilidade e
rapidez no atendimento.

------------------------------------------------------------------------

## 2. Funcionalidades Implementadas

  ------------------------------------------------------------------------
  Funcionalidade                   Descrição              Status
  -------------------------------- ---------------------- ----------------
  Cadastro de Usuários             Permite criar contas   ✔️ Completo
                                   com segurança via JWT  

  Autenticação/Login               Login com geração de   ✔️ Completo
                                   token JWT              

  Registro de Denúncias            Envio de denúncia com  ✔️ Completo
                                   localização e foto     

  Listagem de Denúncias            Consulta de denúncias  ✔️ Completo
                                   paginadas                      

  Interface Pública                Páginas estáticas      ✔️ Completo
                                   servidas via FastAPI   
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 3. Tecnologias Utilizadas

-   **Linguagem:** Python 3.10+
-   **Framework:** FastAPI
-   **Banco de Dados:** SQLite + SQLAlchemy
-   **Autenticação:** JWT (PyJWT)
-   **Documentação Automática:** Swagger e ReDoc
-   **Ferramentas de desenvolvimento:** Uvicorn, Pydantic, pytest

------------------------------------------------------------------------

## 4. Arquitetura do Sistema

Arquitetura baseada em camadas:

-   **main.py** → Ponto de entrada da API\
-   **routers/** → Rotas organizadas por contexto\
-   **models/** → Modelos ORM\
-   **schemas/** → Validação com Pydantic\
-   **crud/** → Regras de negócio\
-   **database/** → Conexão e criação do banco\
-   **public/** → Interface HTML\
-   **tests/** → Testes automatizados

Fluxo simplificado:

    Frontend → Rotas FastAPI → Controllers/CRUD → Banco SQLite

------------------------------------------------------------------------

## 5. Instalação e Execução

### Pré-requisitos

-   Python 3.10+
-   pip instalado

### Instalação

``` bash
pip install -r requirements.txt
```

### Executar a API

``` bash
uvicorn src.main:app --reload
```

### Estrutura esperada de diretórios

    backend/
     ├── src/
     ├── public/
     ├── tests/
     ├── docs/
     ├── README.md

------------------------------------------------------------------------

## 6. Acesso ao Sistema

### Link da hospedagem:

url: https://vizinhaca-limpa.onrender.com/public/login.html

### Interface HTML:

-   Página inicial: `/public/index.html`
-   Login: `/public/login.html`
-   Cadastro: `/public/cadastro.html`

### API Swagger:

-   `/docs`

### Credenciais de Teste:

    email: admin@test.com
    senha: 123456

------------------------------------------------------------------------

## 7. Validação com Público-Alvo

### Público-Alvo

A validação do sistema foi realizada com a Comunidade Unida, um grupo de moradores do bairro Alto da Mangueira, em Maracanaú – CE, vinculado à Igreja Nossa Senhora do Carmo.
Esse grupo participa de ações sociais, religiosas e ambientais no bairro, sendo ideal para validar um sistema de denúncias de lixo.

O grupo completo é formado por:

Neido Gomes

Claudenia dos Santos

Sherliane Oliveira

Halama Paiva Oliveira

Mário da Silva

Hasael Barbosa

A validação ocorreu no dia 27/11, quando parte do grupo conseguiu participar da videochamada dos testes práticos da aplicação.
Os participantes ativos da validação foram:

Neido

Claudenia

Hasael

### Principais Feedbacks

-   Interface clara e fácil de usar\
-   Login funcionando corretamente

### Ajustes Implementados

-   Melhor organização da listagem de denúncias\
-   Ajustes visuais no layout\
-   Correção no controle de quem pode marcar como concluida a denuncia

------------------------------------------------------------------------

## 8. Equipe de Desenvolvimento

### 👩‍💻 Membros da Equipe
- Brenda Carla dos Santos Beviláqua
- Ingrid de Oliveira

---

### 🛠️ Papéis e Contribuições Principais

#### **Brenda Beviláqua – Backend**
Responsável por:
- Desenvolvimento da API e regras de negócio.
- Estruturação do servidor e rotas do sistema.
- Integração com o banco de dados.
- Implementação das funcionalidades principais: cadastro de denúncias, autenticação, listagem e armazenamento.
- Organização do repositório backend e documentação técnica relacionada.

#### **Ingrid de Oliveira – Frontend**
Responsável por:
- Desenvolvimento da interface visual do usuário.
- Criação das telas e componentes interativos do sistema.
- Integração do frontend com a API desenvolvida no backend.
- Garantia de usabilidade, navegação simples e experiência intuitiva.
- Organização do repositório frontend e documentação das telas.

---

Ambas colaboraram na definição dos requisitos, validação do sistema e construção do conceito geral do projeto “Vizinhança Limpa”.
