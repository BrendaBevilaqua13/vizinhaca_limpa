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

Moradores do bairro do Alto da Mangueira - Maracanaú.

### Processo de Validação

-   Testes com usuários reais\
-   Demonstração em ambiente controlado\
-   Feedback sobre usabilidade e clareza das telas

### Principais Feedbacks

-   Necessidade de melhorar filtros de busca\
-   Interface clara e fácil de usar\
-   Login funcionando corretamente

### Ajustes Implementados

-   Melhor organização da listagem de denúncias\
-   Ajustes visuais no layout\
-   Correção de erros de redirecionamento

------------------------------------------------------------------------

## Autor

Desenvolvido por Brenda na parte do backend e Ingrid na parte do frontend
