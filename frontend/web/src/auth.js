import { apiLogin, apiSignup } from './api.js';

// --- Lógica de Login ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('message');

        messageElement.textContent = 'Autenticando...';
        messageElement.style.color = 'gray';

        const result = await apiLogin(email, password);

        if (result.success) {
            messageElement.textContent = 'Login bem-sucedido! Redirecionando...';
            messageElement.style.color = 'green';

            // --- SALVA O TOKEN ---
            const token = result.data.access_token;
            if (token) {
                localStorage.setItem('access_token', token);
            }

            // --- SALVA O USER_ID (NECESSÁRIO PARA REPORTS) ---
            const userId = result.data.user_id;
            if (userId) {
                localStorage.setItem('user_id', userId);
            }

            // Redireciona para a página principal
            window.location.href = '/public/index.html';  
        } else {
            messageElement.textContent = `Erro: ${result.data}`;
            messageElement.style.color = 'red';
        }
    });
}

// --- Lógica de Cadastro ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value; 
        const messageElement = document.getElementById('message');

        messageElement.textContent = 'Registrando...';
        messageElement.style.color = 'gray';

        const result = await apiSignup(name, email, password, role);

        if (result.success) {
            messageElement.textContent = `Cadastro bem-sucedido! Faça login.`;
            messageElement.style.color = 'green';
            setTimeout(() => {
                window.location.href = '/public/login.html'; 
            }, 2000);
        } else {
            messageElement.textContent = `Erro no cadastro: ${result.data}`;
            messageElement.style.color = 'red';
        }
    });
}
