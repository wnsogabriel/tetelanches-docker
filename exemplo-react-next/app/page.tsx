'use client';

import axios from 'axios';

import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'

const url_base = '/api/lanches';

interface iLanche {
  id: number|null;
  nome: string;
  preco: number;
  descricao: string;
}

const obterDados = async (): Promise<Array<iLanche>> => {
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

const incluirLanche = async (dados: iLanche): Promise<boolean> => {
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

interface tabLancheProps {
  dados: Array<iLanche>;
}

function TabelaLanches({ dados }: tabLancheProps) {
  return (
    <table className='table table-striped'>
      <thead className='table-dark'>
        <tr>
          <td>Id</td><td>Nome</td><td>Preço</td><td>Descrição</td>
        </tr>
      </thead>
      <tbody>
        {/* O método map percorre cada produto e retorna um elemento <tr> */}
        {dados.map((lanche) => (
          <tr key={lanche.id}>
            <td>{lanche.id}</td>
            <td>{lanche.nome}</td>
            <td>{lanche.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>{lanche.descricao}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface iFormLancheProps {
   onAdd: (dados: iLanche) => void;
}

function FormLanche({onAdd}: iFormLancheProps){
  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState(0)
  const [descricao, setDescricao] = useState("")

  const addClique = () => {
      const lanche = {id:null, nome: nome, preco: preco, descricao: descricao};
      setNome("");
      setPreco(0);
      setDescricao("");
      onAdd(lanche);
  }

  return(
    <div>
      <label className='form-label'>Nome:</label>
      <input type="text" value={nome} className='form-control'
             onChange={e => setNome(e.target.value)}/>
      <br/>
      <label className='form-label'>Preço:</label>
      <input type="number" step="0.01" value={preco} className='form-control'
             onChange={e => setPreco(Number(e.target.value))}/>
      <br/>
      <label className='form-label'>Descrição:</label>
      <input type="text" value={descricao} className='form-control'
             onChange={e => setDescricao(e.target.value)}/>
      <br/>
      <button className='btn btn-primary' onClick={addClique}>Adicionar</button>
    </div>
  )
}

function App() {

  const [lanches, setLanches] = useState(new Array<iLanche>())
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    obterDados().then((dados) => {
      setLanches(dados);
      setCarregado(true);
    })
  }, [carregado])

  return (
    <>
      <section id="center">
        <h1>Centro</h1>
        <FormLanche onAdd={(dados)=>{
          incluirLanche(dados).then((resultado) => { 
            if(resultado)
              setCarregado(false);
          })
        }} />
        <TabelaLanches dados={lanches} />
      </section>
      <section id="footer">
        Footer
      </section>
    </>
  )
}

export default App