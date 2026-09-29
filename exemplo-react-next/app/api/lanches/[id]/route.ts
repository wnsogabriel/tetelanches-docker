import axios from 'axios';

// A pasta [id] cria uma rota dinamica: /api/lanches/1, /api/lanches/2...
// O valor entre colchetes chega na funcao pelo "params".
const url_base = 'http://serv-back-n1:8080/api/lanches';

type Contexto = { params: Promise<{ id: string }> };

// UPDATE: repassa o PUT para o back
export async function PUT(request: Request, { params }: Contexto) {
    const { id } = await params;
    const dados = await request.json();
    try {
        const resposta = await axios.put(`${url_base}/${id}`, dados);
        return Response.json(resposta.data, { status: resposta.status });
    } catch (erro: any) {
        // Repassa o codigo que o back devolveu (ex: 404), ou 500 se o back nem respondeu
        return Response.json({ erro: 'Falha ao atualizar o lanche' }, { status: erro.response?.status ?? 500 });
    }
}

// DELETE: repassa a exclusao para o back
export async function DELETE(request: Request, { params }: Contexto) {
    const { id } = await params;
    try {
        await axios.delete(`${url_base}/${id}`);
        return new Response(null, { status: 204 });
    } catch (erro: any) {
        return Response.json({ erro: 'Falha ao excluir o lanche' }, { status: erro.response?.status ?? 500 });
    }
}
