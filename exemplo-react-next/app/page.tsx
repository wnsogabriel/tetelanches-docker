'use client';

import axios from 'axios';

import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'

const url_base = '/api/produtos';

interface iProduto {
  id: number|null;
  nome: string;
  quantidade: number;
}

const obterDados = async (): Promise<Array<iProduto>> => {
  try {
    // Faz a requisição GET para a API de teste
    const resposta = await axios.get(url_base);

    // Exibe os dados retornados no console
    console.log('Dados:', resposta.data);

    return resposta.data;
  } catch (erro: any) {
    // Trata erros caso a requisição falhe
    console.error('Erro ao buscar os dados:', erro.message);

    return [];
  }
}

const incluirProduto = async (dados: iProduto): Promise<boolean> => {
  try {
    // Faz a requisição POST para a API de teste
    await axios.post(url_base, dados);
    return true;
  } catch (erro: any) {
    // Trata erros caso a requisição falhe
    console.error('Erro ao inserir os dados:', erro.message);
    return false;
  }
}

interface tabProdProps {
  dados: Array<iProduto>;
}

function TabelaProdutos({ dados }: tabProdProps) {
  return (
    <table className='table table-striped'>
      <thead className='table-dark'>
        <tr>
          <td>Id</td><td>Nome</td><td>Quantidade</td>
        </tr>
      </thead>
      <tbody>
        {/* O método map percorre cada produto e retorna um elemento <tr> */}
        {dados.map((produto) => (
          <tr key={produto.id}>
            <td>{produto.id}</td>
            <td>{produto.nome}</td>
            <td>{produto.quantidade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface iFormProProps {
   onAdd: (dados: iProduto) => void;
}

function FormProduto({onAdd}: iFormProProps){
  const [nome, setNome] = useState("")
  const [quantidade, setQuantidade] = useState(0)

  const addClique = () => {
      const produto = {id:null, nome: nome, quantidade: quantidade};
      setNome("");
      setQuantidade(0);
      onAdd(produto);
  }

  return(
    <div>
      <label className='form-label'>Nome:</label>
      <input type="text" value={nome} className='form-control'
             onChange={e => setNome(e.target.value)}/>
      <br/>
      <label className='form-label'>Quantidade:</label>
      <input type="number" value={quantidade} className='form-control'
             onChange={e => setQuantidade(Number(e.target.value))}/>
      <br/>
      <button className='btn btn-primary' onClick={addClique}>Adicionar</button>
    </div>
  )
}

function App() {

  const [produtos, setProdutos] = useState(new Array<iProduto>())
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    obterDados().then((dados) => {
      setProdutos(dados);
      setCarregado(true);
    })
  }, [carregado])

  return (
    <>
      <section id="center">
        <h1>Centro</h1>
        <FormProduto onAdd={(dados)=>{
          incluirProduto(dados).then((resultado) => { 
            if(resultado)
              setCarregado(false);
          })
        }} />
        <TabelaProdutos dados={produtos} />
      </section>
      <section id="footer">
        Footer
      </section>
    </>
  )
}

export default App