# Documentação da API -- Sistema de Denúncias de Lixo

Esta documentação descreve as rotas e funcionalidades disponíveis na API
desenvolvida com **FastAPI**.

------------------------------------------------------------------------

## Autenticação (JWT)

### POST /users/login

Realiza login e retorna um token JWT.

### POST /users/register

Cadastra um novo usuário.

------------------------------------------------------------------------

##  Usuários

  Método   Rota                Descrição
  -------- ------------------- --------------------------
  POST     `/users/register`   Criar usuário
  POST     `/users/login`      Login e geração de token

------------------------------------------------------------------------

## Denúncias

### GET /reports

Retorna todas as denúncias cadastradas.

### POST /reports

Cria nova denúncia.\
 Requer token JWT.

### PUT /reports/{id}/status

Atualiza status de uma denúncia (Pendente → Concluído).\
 Requer autenticação e permissão de admin.

### DELETE /reports/{id}

Remove uma denúncia.\
 Apenas o dono da denúncia ou admin pode excluir.

------------------------------------------------------------------------

##  Estrutura de Respostas

Os objetos seguem os modelos definidos em `schemas/`.
