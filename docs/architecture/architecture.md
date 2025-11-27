# Arquitetura do Sistema -- Sistema de Denúncias de Lixo

Este documento descreve a arquitetura final implementada no backend do
projeto.

##  Visão Geral da Arquitetura

A aplicação segue uma arquitetura modular baseada em **FastAPI**, com
separação clara entre: - **Rotas (routes/)** - **Modelos ORM
(models/)** - **Esquemas Pydantic (schemas/)** - **Dependências
(deps.py)** - **Configuração do banco de dados (database.py)**

##  Banco de Dados

-   Banco: **SQLite**
-   ORM: **SQLAlchemy**
-   Migrações: *não aplicável (dev/local)*

##  Autenticação

-   Baseada em **JWT**
-   Token enviado via **Bearer Authorization**
-   Proteção com dependency injection (`get_current_user`)

##  Estrutura das Rotas

-   `/users` → Autenticação e gerenciamento de usuários
-   `/reports` → CRUD de denúncias

##  Fluxo Simplificado

1.  Usuário faz login e recebe JWT\
2.  Usuário autenticado envia denúncias\
3.  Admin pode atualizar status e excluir denúncias\
4.  API serve dados para o frontend público
