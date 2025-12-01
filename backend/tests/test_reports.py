import sys
import os
from fastapi import status

# Garante que o backend está no PYTHONPATH
sys.path.append(os.path.abspath(os.path.dirname(__file__) + "/.."))

from fastapi.testclient import TestClient
from src.main import app  

client = TestClient(app)

def test_root_route():
    response = client.get("/")
    assert response.status_code == 200

def test_get_reports_all():
    response = client.get("/reports")
    # A rota correta é GET /reports/
    assert response.status_code in (200, 307, 308)

def test_not_found_route():
    """Testa se uma rota inexistente retorna 404."""
    response = client.get("/rota_que_nao_existe")
    assert response.status_code == 404
'''
def test_create_user():
    """Testa se é possível criar um usuário simples."""
    
    payload = {
        "name": "teste3",
        "email": "teste3@hotmail.com",
        "password": "senha123"
    }

    response = client.post("/users/register", json=payload)

    # Deve retornar status 201 Created
    assert response.status_code == 200

    data = response.json()

    # Verifica campos básicos
    assert "id" in data
    assert data["name"] == "teste3"
    assert data["email"] == "teste3@hotmail.com"
'''

def test_public_index_accessible_without_login():
    """
    Testa que /public/index.html responde com sucesso (200),
    já que arquivos estáticos não passam pela autenticação.
    """
    response = client.get("/public/index.html")
    assert response.status_code == 200
    assert "html" in response.text.lower()