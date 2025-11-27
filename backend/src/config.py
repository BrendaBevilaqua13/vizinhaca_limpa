from dotenv import load_dotenv
import os
load_dotenv()

# Em dev usaremos SQLite por padrão
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
SECRET_KEY = os.getenv("SECRET_KEY", "troque_esta_chave_para_producao")
