import axios from 'axios';

const url_base = 'http://serv-back-n1:8080/api/lanches';

export async function GET(request: Request) {
    const resposta = await axios.get(url_base);
    return new Response(JSON.stringify(resposta.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST(request: Request) {
    const dados = await request.json();
    await axios.post(url_base, dados);
    return new Response(JSON.stringify({ "sucesso": true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}