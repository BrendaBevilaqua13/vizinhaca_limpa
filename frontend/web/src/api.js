const BASE_URL = window.location.origin;

/**
 * Função central para fazer requisições HTTP para o backend.
 * Gerencia tokens de autenticação, cabeçalhos e tratamento de erros.
 */
async function fetchData(endpoint, method = 'GET', data = null, needsAuth = false) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Accept': 'application/json',
    };

    // Define Content-Type para JSON se não for FormData (para upload de imagem)
    if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Adiciona o cabeçalho de autorização se necessário
    if (needsAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
        
        body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : null
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        // Trata a resposta se não houver conteúdo (como 204 No Content)
        if (response.status === 204) {
             return { success: true, status: response.status };
        }

        const result = await response.json();

        if (!response.ok) {
            // Se o token for inválido (401), limpa o localStorage e redireciona
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                // Redireciona para a tela de login
                window.location.href = '/public/login.html'; 
                return { success: false, status: 401, data: 'Sessão expirada. Faça login novamente.' };
            }
            // Trata outros erros
            console.error('Erro da API:', result);
            return { success: false, status: response.status, data: result.detail || result.error || 'Erro desconhecido' };
        }
        
        return { success: true, status: response.status, data: result };

    } catch (error) {
        console.error('Erro de rede:', error);
        return { success: false, status: 500, data: 'Falha na conexão com o servidor.' };
    }
}

// --- Funções CRUD Específicas ---

// Autenticação
async function apiLogin(email, password) {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    return await fetchData('/users/login', 'POST', formData);}

// Cadastro
async function apiSignup(name, email, password, role = 'citizen') {
    const data = { name, email, password, role };
    return await fetchData('/users/register', 'POST', data);
}

// Listar Denúncias
async function apiListReports(skip = 0, limit = 10) {
    
    const endpoint = `/reports/?skip=${skip}&limit=${limit}`; 
    
    return await fetchData(endpoint, 'GET', null, true);
}

async function apiUpdateReportStatus(reportId, newStatus) {
    const endpoint = `/reports/${reportId}/status`;
    
    
    const updateData = { 
        status: newStatus // Ex: { status: "concluida" }
    };
    
    
    return await fetchData(endpoint, 'PATCH', updateData, true); 
}
window.handleUpdateStatus = apiUpdateReportStatus;

async function apiDeleteReport(reportId) {
    const endpoint = `/reports/${reportId}`;
    
    
    const result = await fetchData(endpoint, 'DELETE', null, true); 
    
    return result;
}

// Criar Denúncia
async function apiCreateReport(reportData, imageFile = null) {
    const formData = new FormData();

    // Adiciona os campos de texto
    formData.append('title', reportData.title);
    formData.append('description', reportData.description);
    formData.append('category', reportData.category);
    formData.append('latitude', reportData.latitude);
    formData.append('longitude', reportData.longitude);
    formData.append('address_text', reportData.address_text || "");

    // --- PEGAR O user_id DO TOKEN ---
    const token = localStorage.getItem("access_token");

    let userId = null;
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.user_id;   // Agora SUB = user_id
    }

    formData.append("user_id", userId);

    // Adiciona o arquivo de imagem, se existir
    //if (imageFile) {
        //formData.append('image', imageFile, imageFile.name);
    //}
    // 🔥 DEBUG AQUI
    console.log("DEBUG FORM DATA:");
    for (let pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
    }

    // Rota protegida
    return await fetchData('/reports/create', 'POST', formData, true); 
}

// Exporta funções para uso em outros módulos JS (Importante para 'auth.js' e 'reports.js')
export { fetchData, apiLogin, apiSignup, apiListReports, apiCreateReport, apiUpdateReportStatus, apiDeleteReport};