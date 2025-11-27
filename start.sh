#!/usr/bin/env bash

# Define a porta padrão se a variável $PORT não estiver definida (para testes locais)
PORT=${PORT:-8000}

# Adiciona o diretório raiz do projeto ao PYTHONPATH para que o Python encontre o pacote 'backend'
export PYTHONPATH=$PWD:$PYTHONPATH

# Inicia o Uvicorn diretamente, garantindo que ele escute em 0.0.0.0 e na porta $PORT
# O módulo é referenciado como 'backend.src.main:app'
echo "Starting Uvicorn on 0.0.0.0:$PORT..."
exec uvicorn backend.src.main:app --host 0.0.0.0 --port $PORT