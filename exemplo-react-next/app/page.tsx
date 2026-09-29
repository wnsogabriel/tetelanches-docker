'use client';

import axios from 'axios';

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import 'bootstrap/dist/css/bootstrap.css'

// A tela conversa com o "garcom" (app/api/lanches/...), que repassa
// o pedido para o back dentro da rede Docker.
const url_base = '/api/lanches';

// Molde do JSON: espelho da entidade Lanche.java
interface iLanche {
  id: number|null;
  nome: string;
  preco: number;
  descricao: string;
}

// ===================== Chamadas a API (CRUD) =====================

// READ: busca a lista de lanches
const obterDados = async (): Promise<Array<iLanche>> => {
  try {
    const resposta = await axios.get(url_base);
    return resposta.data;
  } catch (erro: any) {
    console.error('Erro ao buscar os dados:', erro.message);
    return [];
  }
}

// CREATE: envia um lanche novo
const incluirLanche = async (dados: iLanche): Promise<boolean> => {
  try {
    await axios.post(url_base, dados);
    return true;
  } catch (erro: any) {
    console.error('Erro ao inserir os dados:', erro.message);
    return false;
  }
}

// UPDATE: substitui os dados de um lanche existente
const atualizarLanche = async (dados: iLanche): Promise<boolean> => {
  try {
    await axios.put(`${url_base}/${dados.id}`, dados);
    return true;
  } catch (erro: any) {
    console.error('Erro ao atualizar os dados:', erro.message);
    return false;
  }
}

// DELETE: remove um lanche pelo id
const excluirLanche = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${url_base}/${id}`);
    return true;
  } catch (erro: any) {
    console.error('Erro ao excluir:', erro.message);
    return false;
  }
}

// ===================== Aparencia =====================

// Formata numero como moeda brasileira: 18.9 -> "R$ 18,90"
const formatarPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Componentes do Bootstrap (botao, card) mudam de cor pelas variaveis --bs-*.
// E o jeito oficial de personalizar o Bootstrap sem brigar com o CSS dele.
const estiloBotaoTete = {
  '--bs-btn-bg': '#E8720C',
  '--bs-btn-border-color': '#E8720C',
  '--bs-btn-color': '#FFFFFF',
  '--bs-btn-hover-bg': '#F4B942',
  '--bs-btn-hover-border-color': '#F4B942',
  '--bs-btn-hover-color': '#4A2E1A',
  '--bs-btn-active-bg': '#F4B942',
  '--bs-btn-active-border-color': '#F4B942',
  '--bs-btn-active-color': '#4A2E1A',
  '--bs-btn-disabled-bg': '#E8720C',
  '--bs-btn-disabled-border-color': '#E8720C',
  '--bs-btn-disabled-color': '#FFFFFF',
} as CSSProperties;

const estiloBotaoEditar = {
  '--bs-btn-color': '#7A9A3E',
  '--bs-btn-border-color': '#7A9A3E',
  '--bs-btn-hover-bg': '#7A9A3E',
  '--bs-btn-hover-border-color': '#7A9A3E',
  '--bs-btn-hover-color': '#FFFFFF',
  '--bs-btn-active-bg': '#7A9A3E',
  '--bs-btn-active-color': '#FFFFFF',
} as CSSProperties;

const estiloCardLanche = { '--bs-card-border-color': '#F4B942' } as CSSProperties;
const estiloCardEmEdicao = { '--bs-card-border-color': '#7A9A3E', borderWidth: '2px' } as CSSProperties;

// ===================== Componentes =====================

interface cardapioProps {
  dados: Array<iLanche>;
  idEmEdicao: number | null;
  onEditar: (lanche: iLanche) => void;
  onExcluir: (lanche: iLanche) => void;
}

// Lista de lanches em formato de cardapio (um card por lanche)
function CardapioLanches({ dados, idEmEdicao, onEditar, onExcluir }: cardapioProps) {
  if (dados.length === 0) {
    return (
      <div className="tw:rounded-2xl tw:border-2 tw:border-dashed tw:border-dourado tw:p-10 tw:text-center tw:text-marrom/70">
        Nenhum lanche no cardápio ainda. Cadastre o primeiro ao lado!
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {/* O map percorre cada lanche e devolve um card */}
      {dados.map((lanche) => (
        <div className="col" key={lanche.id}>
          <div className="card h-100 shadow-sm"
               style={lanche.id === idEmEdicao ? estiloCardEmEdicao : estiloCardLanche}>
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                <h3 className="h5 fw-semibold mb-0">{lanche.nome}</h3>
                <span className="tw:whitespace-nowrap tw:rounded-full tw:bg-laranja tw:px-3 tw:py-1 tw:text-sm tw:font-semibold tw:text-white">
                  {formatarPreco(lanche.preco)}
                </span>
              </div>
              <p className="card-text tw:text-marrom/80">{lanche.descricao}</p>
              <div className="mt-auto d-flex align-items-center justify-content-between gap-2">
                <small className="tw:text-oliva tw:font-semibold">Cód. {lanche.id}</small>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm" style={estiloBotaoEditar}
                          onClick={() => onEditar(lanche)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger"
                          onClick={() => onExcluir(lanche)}>Excluir</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface iFormLancheProps {
  lancheEmEdicao: iLanche | null;
  onSalvar: (dados: iLanche) => void;
  onCancelar: () => void;
}

// Formulario que serve para cadastrar (CREATE) e para editar (UPDATE)
function FormLanche({ lancheEmEdicao, onSalvar, onCancelar }: iFormLancheProps){
  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState(0)
  const [descricao, setDescricao] = useState("")

  const editando = lancheEmEdicao !== null;

  // Quando um lanche e escolhido para editar, preenche os campos com os dados dele.
  // Quando a edicao termina ou e cancelada, limpa os campos.
  useEffect(() => {
    setNome(lancheEmEdicao?.nome ?? "");
    setPreco(lancheEmEdicao?.preco ?? 0);
    setDescricao(lancheEmEdicao?.descricao ?? "");
  }, [lancheEmEdicao])

  // So libera o botao com nome preenchido e preco maior que zero
  const podeSalvar = nome.trim() !== "" && preco > 0;

  const salvarClique = () => {
      // Editando: mantem o id (vira PUT). Novo: id null (vira POST).
      const lanche = { id: lancheEmEdicao?.id ?? null, nome: nome, preco: preco, descricao: descricao };
      if (!editando) {
        setNome("");
        setPreco(0);
        setDescricao("");
      }
      onSalvar(lanche);
  }

  return(
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 fw-bold mb-1">{editando ? "Editar lanche" : "Novo lanche"}</h2>
        <p className="tw:text-sm tw:text-marrom/70 tw:mb-4">
          {editando ? `Alterando o lanche Cód. ${lancheEmEdicao?.id}.` : "Preencha e ele entra no cardápio na hora."}
        </p>

        <label className='form-label fw-semibold'>Nome</label>
        <input type="text" value={nome} className='form-control mb-3'
               placeholder="Ex: X-Tudo"
               onChange={e => setNome(e.target.value)}/>

        <label className='form-label fw-semibold'>Preço</label>
        <div className="input-group mb-3">
          <span className="input-group-text">R$</span>
          <input type="number" step="0.01" min="0" value={preco} className='form-control'
                 onChange={e => setPreco(Number(e.target.value))}/>
        </div>

        <label className='form-label fw-semibold'>Descrição</label>
        <textarea value={descricao} className='form-control mb-4' rows={3}
                  placeholder="Ex: Pão, carne, queijo, ovo e salada"
                  onChange={e => setDescricao(e.target.value)}/>

        <button className='btn w-100 fw-semibold py-2' style={estiloBotaoTete}
                disabled={!podeSalvar} onClick={salvarClique}>
          {editando ? "Salvar alterações" : "Adicionar ao cardápio"}
        </button>

        {editando && (
          <button className='btn btn-link w-100 mt-2 tw:text-marrom/70' onClick={onCancelar}>
            Cancelar edição
          </button>
        )}
      </div>
    </div>
  )
}

function App() {

  const [lanches, setLanches] = useState(new Array<iLanche>())
  const [carregado, setCarregado] = useState(false)
  const [emEdicao, setEmEdicao] = useState<iLanche | null>(null)

  // Sempre que "carregado" volta para false, busca a lista de novo
  useEffect(() => {
    obterDados().then((dados) => {
      setLanches(dados);
      setCarregado(true);
    })
  }, [carregado])

  // Decide entre CREATE e UPDATE pelo id
  const salvar = (dados: iLanche) => {
    const operacao = dados.id === null ? incluirLanche(dados) : atualizarLanche(dados);
    operacao.then((resultado) => {
      if (resultado) {
        setEmEdicao(null);
        setCarregado(false);
      }
    })
  }

  const editar = (lanche: iLanche) => {
    setEmEdicao(lanche);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // no celular, sobe ate o formulario
  }

  const excluir = (lanche: iLanche) => {
    if (lanche.id === null) return;
    if (!window.confirm(`Excluir "${lanche.nome}" do cardápio?`)) return;
    excluirLanche(lanche.id).then((resultado) => {
      if (resultado) {
        if (emEdicao?.id === lanche.id) setEmEdicao(null);
        setCarregado(false);
      }
    })
  }

  return (
    <div className="tw:flex tw:min-h-screen tw:flex-col tw:bg-creme tw:font-corpo tw:text-marrom">

      {/* Cabecalho: logo a esquerda, slogan a direita */}
      <header className="tw:bg-marrom tw:text-creme">
        <div className="container py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* A logo fica em public/logo-tete.png; tudo que esta em "public" e servido a partir da raiz "/" */}
          <h1 className="mb-0">
            <img src="/logo-tete.png" alt="Tetê Lanches" className="tw:h-20 tw:w-auto tw:md:h-24" />
          </h1>
          <p className="mb-0 tw:text-creme/80">Lanche raiz, artesanal e em família.</p>
        </div>
      </header>

      {/* Conteudo: formulario a esquerda, cardapio a direita */}
      <main className="container py-5 tw:flex-1">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-4">
            <div className="tw:lg:sticky tw:lg:top-6">
              <FormLanche lancheEmEdicao={emEdicao}
                          onSalvar={salvar}
                          onCancelar={() => setEmEdicao(null)} />
            </div>
          </div>

          <div className="col-lg-8">
            <div className="d-flex align-items-baseline justify-content-between mb-3">
              <h2 className="h3 fw-bold mb-0">Cardápio</h2>
              <span className="tw:text-sm tw:text-marrom/70">{lanches.length} {lanches.length === 1 ? 'item' : 'itens'}</span>
            </div>
            {!carregado && lanches.length === 0
              ? <p className="tw:text-marrom/70">Carregando cardápio...</p>
              : <CardapioLanches dados={lanches}
                                 idEmEdicao={emEdicao?.id ?? null}
                                 onEditar={editar}
                                 onExcluir={excluir} />}
          </div>
        </div>
      </main>

      {/* Rodape */}
      <footer className="tw:bg-marrom tw:text-creme/80 tw:text-sm">
        <div className="container py-4 d-flex flex-wrap justify-content-between gap-2">
          <span>Tetê Lanches · Maracanã/Tijuca, RJ</span>
          <span>Projeto acadêmico · Desenvolvimento Backend · UVA 2026</span>
        </div>
      </footer>
    </div>
  )
}

export default App