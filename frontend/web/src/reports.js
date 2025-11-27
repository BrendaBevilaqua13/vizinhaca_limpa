import { apiListReports, apiCreateReport, apiUpdateReportStatus,apiDeleteReport } from './api.js';
const REPORTS_PER_PAGE = 10; // Limite fixo de denúncias por página
let currentSkip = 0;        // O 'offset' inicial (começa em 0)
// Função auxiliar para verificar se o usuário está logado
function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        // Redireciona se não houver token
        window.location.href = '/public/login.html';
        return false;
    }
    return true;
}

// Função para formatar a data
function formatDate(isoString) {
    if (!isoString) return 'Data Inválida';

    let dateString = isoString;

    // 🚨 CORREÇÃO: Adiciona 'Z' se o indicador UTC estiver faltando
    // Isso força o JS a interpretar a string como UTC antes de convertê-la para o fuso local.
    if (typeof isoString === 'string' && !isoString.endsWith('Z')) {
        dateString += 'Z'; 
    }
    
    const date = new Date(dateString);
    
    // Verifica se a data é válida após a criação
    if (isNaN(date.getTime())) return 'Data Inválida'; 

    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
}
// Função para atualizar os botões de navegação e o texto da página
function setupPagination(reportsCount) {
    const prevButton = document.getElementById('prev-page-button');
    const nextButton = document.getElementById('next-page-button');
    const infoText = document.getElementById('page-info');

    // 1. Lógica do Botão ANTERIOR
    if (prevButton) {
        // Desabilita se estiver na primeira página (skip 0)
        prevButton.disabled = currentSkip === 0;
    }

    // 2. Lógica do Botão PRÓXIMO
    if (nextButton) {
        // Desabilita se o número de denúncias retornadas for MENOR que o limite, 
        // indicando que não há mais páginas.
        nextButton.disabled = reportsCount < REPORTS_PER_PAGE;
    }

    // 3. Texto Informativo da Página
    if (infoText) {
        const start = currentSkip + 1;
        const end = currentSkip + reportsCount;
        
        if (reportsCount === 0 && currentSkip === 0) {
             infoText.textContent = `Nenhuma denúncia encontrada`;
        } else if (reportsCount === 0 && currentSkip > 0) {
             infoText.textContent = `Fim da lista`;
        } else {
             infoText.textContent = `Mostrando ${start} - ${end}`;
        }
    }
}

// Funções de Navegação
function goToNextPage() {
    currentSkip += REPORTS_PER_PAGE;
    loadReports(); // Chama loadReports sem parâmetros, que usará as variáveis globais
}

function goToPrevPage() {
    // Garante que o skip não seja negativo
    currentSkip = Math.max(0, currentSkip - REPORTS_PER_PAGE);
    loadReports();
}

async function handleUpdateStatus(reportId, newStatus) {
    if (!confirm(`Tem certeza que deseja marcar a denúncia ${reportId} como "${newStatus.toUpperCase()}"?`)) {
        return;
    }
    
    // Supondo que você exportou apiUpdateReportStatus do seu api.js
    const result = await apiUpdateReportStatus(reportId, newStatus);

    if (result.success) {
        alert(`Status da denúncia ${reportId} atualizado para ${newStatus.toUpperCase()}!`);
        // Recarrega a lista para mostrar o status atualizado
        loadReports(); 
    } else {
        alert(`Erro ao atualizar o status: ${result.data}`);
        console.error("Erro ao atualizar status:", result.data);
    }
}

// --- Lógica de Listar Denúncias ---
const reportsListContainer = document.getElementById('reports-list');
if (reportsListContainer) {
    
    // 🚨 SUBSTITUA ESTE BLOCO 🚨
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Inicia o carregamento da primeira página
        loadReports();
        reportsListContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4'; 
        
        // 2. Anexa os Listeners aos botões de Paginação
        const prevButton = document.getElementById('prev-page-button');
        const nextButton = document.getElementById('next-page-button');

        if (prevButton) {
            // Quando clicar, chama a função de ir para a página anterior
            prevButton.addEventListener('click', goToPrevPage);
        }
        if (nextButton) {
            // Quando clicar, chama a função de ir para a próxima página
            nextButton.addEventListener('click', goToNextPage);
        }
        
        // **Nota:** Sua função checkAuth() deve ser chamada aqui se necessário, 
        // ou você pode mantê-la onde está no bloco if (createReportForm)
    });
}

async function loadReports(skip = currentSkip, limit = REPORTS_PER_PAGE) {
    // Nota: O teste 'typeof skip === "object"' não é mais necessário 
    // se você garantir que loadReports é chamada sem parâmetros ou com números.

    reportsListContainer.innerHTML = '<p class="text-center text-gray-500">Carregando denúncias...</p>';
    
    // 🚨 Usa as variáveis de estado globais (currentSkip e REPORTS_PER_PAGE)
    const result = await apiListReports(skip, limit);

    if (result.success) {
        const reports = result.data;
        reportsListContainer.innerHTML = ''; // Limpa antes de adicionar
        
        // 🚨 CHAMA setupPagination antes de retornar para atualizar os botões
        setupPagination(reports.length); 

        if (reports.length === 0 && skip === 0) {
            reportsListContainer.innerHTML = '<p class="text-center text-gray-500">Nenhuma denúncia encontrada.</p>';
            return;
        } 
        
        if (reports.length === 0 && skip > 0) {
            // Se não encontrou nada, mas não é a primeira página, 
            // exibe uma mensagem e retorna (a função setupPagination já lidou com os botões).
            reportsListContainer.innerHTML = '<p class="text-center text-gray-500">Não há mais denúncias.</p>';
            return;
        }

        reports.forEach(report => {
            // Verifica se é um número. Se não for, atribui 'N/A'.
            const lat = report.latitude || 'N/A';
            const lon = report.longitude || 'N/A';
            const statusColor = report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                 report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                 'bg-green-100 text-green-800';
                                
            const reportElement = document.createElement('div');
            reportElement.className = 'bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500 ';
            reportElement.innerHTML = `
                <h3 class="text-xl font-semibold text-gray-800">${report.title}</h3>
                <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColor} mt-1 mb-2">
                    Status: ${report.status.toUpperCase().replace('_', ' ')}
                </span>
                <p class="text-gray-600 mb-3">${report.description}</p>
                <div class="text-sm text-gray-500 space-y-1">
                    <p><strong>Cidadão:</strong> ${report.user ? report.user.name : 'Anônimo'}</p>
                    <p><strong>Categoria:</strong> ${report.category}</p>

                    <p><strong>Endereço:</strong> ${report.address_text || 'Localização não informada'}</p> 

                    <p><strong>Coordenadas:</strong> Lat ${lat}, Lon ${lon}</p> 
                    <p><strong>Criado em:</strong> ${formatDate(report.created_at)}</p>
                </div>
                <div class="text-sm text-gray-500 space-y-1">
                </div>
                
                <div class="mt-4 flex justify-end space-x-2"> 
                <button 
                    id="btn-delete-${report.id}"
                    class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-150"
                    data-report-id="${report.id}">
                    Excluir
                </button>
                    <button 
                        id="btn-update-${report.id}"
                        class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-150"
                        data-report-id="${report.id}"
                        data-new-status="concluida">
                        Marcar como Concluída
                    </button>
                </div>
                ${report.image_url ? `<img src="${report.image_url}" alt="Imagem da Denúncia" class="mt-3 rounded-md w-full max-h-64 object-cover">` : ''}
            `;
            
            reportsListContainer.appendChild(reportElement);
            const updateButton = reportElement.querySelector(`#btn-update-${report.id}`);
            const deleteButton = reportElement.querySelector(`#btn-delete-${report.id}`);

            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    const reportId = parseInt(deleteButton.dataset.reportId); 
                    handleDeleteReport(reportId);
                });
            }

            if (updateButton) {
                // Adiciona o manipulador de evento 'click'
                updateButton.addEventListener('click', () => {
                    // Pega os dados armazenados nos atributos 'data-'
                    const reportId = parseInt(updateButton.dataset.reportId); 
                    const newStatus = updateButton.dataset.newStatus;
                    
                    // Chama a função real
                    handleUpdateStatus(reportId, newStatus);
                });
            }
        });

    } else {
        reportsListContainer.innerHTML = `<p class="text-center text-red-600">Erro ao carregar a lista: ${result.data}</p>`;
        // 🚨 NOVO: Atualiza a paginação mesmo em caso de erro
        setupPagination(0); 
    }
}

// --- Lógica de Criar Denúncia ---
const createReportForm = document.getElementById('create-report-form');
if (createReportForm) {
    // Garante que o usuário está logado antes de permitir a criação
    document.addEventListener('DOMContentLoaded', checkAuth); 
    
    createReportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const messageElement = document.getElementById('message');

        const reportData = {
            title: form.title.value,
            description: form.description.value,
            category: form.category.value,
            address_text: form.address_text.value,
            // ⚠️ MOCK: Valores fixos para Lat/Lon. No app real, use Geolocation API.
            latitude: form.latitude.value, 
            longitude: form.longitude.value,
        };
        const imageFile = null;

        messageElement.textContent = 'Enviando denúncia...';
        messageElement.style.color = 'gray';
        const result = await apiCreateReport(reportData, imageFile);

        if (result.success) {
            messageElement.textContent = 'Denúncia criada com sucesso! Atualizando lista...';
            messageElement.style.color = 'green';
            form.reset(); // Limpa o formulário
            loadReports(); // Recarrega a lista para mostrar a nova denúncia
        } else {
            messageElement.textContent = `Erro ao criar denúncia: ${result.data}`;
            messageElement.style.color = 'red';
        }
    });
}

// --- Lógica de Logout ---
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('access_token');
        window.location.href = '/public/login.html';
    });
}

// 🚨 NOVA FUNÇÃO DE EXCLUSÃO
async function handleDeleteReport(reportId) {
    if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente a denúncia ${reportId}? Esta ação é irreversível.`)) {
        return;
    }
    
    const result = await apiDeleteReport(reportId);

    if (result.success) {
        alert(`Denúncia ${reportId} excluída com sucesso!`);
        // Recarrega a lista para mostrar a denúncia removida
        loadReports(); 
    } else {
        alert(`Erro ao excluir a denúncia: ${result.data}`);
        console.error("Erro ao excluir denúncia:", result.data);
    }
}