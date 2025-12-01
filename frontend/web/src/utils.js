
export function formatErrorResponse(responseData) {
    if (responseData && responseData.detail) {
        // Trata erros de validação (422) que vêm como uma lista
        if (Array.isArray(responseData.detail)) {
            let message = "Erro de Validação:";
            responseData.detail.forEach(err => {
                // Adiciona o campo e a mensagem de erro específica
                const field = err.loc && err.loc.length > 1 ? err.loc[1] : 'campo';
                message += `\n- ${field}: ${err.msg}`;
            });
            return message;
        } 
        // Trata outros erros, como 401 Unauthorized, onde 'detail' é uma string
        else if (typeof responseData.detail === 'string') {
            return responseData.detail;
        }
    }
    // Retorna a resposta JSON completa se não conseguir formatar, mas não como [object Object]
    return JSON.stringify(responseData); 
}