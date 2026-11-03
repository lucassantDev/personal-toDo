import { useState, useEffect } from "react";
import { Check } from 'lucide-react';
import { supabase } from "../lib/supabase.js";

export default function TodoMain() {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [formularioVisivel, setFormularioVisivel] = useState(false)
    const [tarefas, setTarefas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null)
    const [salvando, setSalvando] = useState(false)

    const buscarTarefas = async () => {
        const { data, error } = await supabase
            .from('tarefas')
            .select('*')
            .order('data_criacao', { ascending: false })

        if (error) alert(error.message)
        else setTarefas(data)
        setCarregando(false)
    }

    useEffect(() => {
        buscarTarefas()
    }, [])

    const cadastroTarefa = async (e) => {
        e.preventDefault()
        if (titulo === '' || descricao === '') return alert('Campo vazio')

        const { error } = await supabase
            .from('tarefas')
            .insert({ titulo, descricao })

        if (error) return alert(error.message)

        setTitulo('')
        setDescricao('')
        setFormularioVisivel(false)
        buscarTarefas()
    }

    const abrirConfirmacao = (tarefa) => {
        setTarefaSelecionada(tarefa)
    }

    const fecharConfirmacao = () => {
        if (salvando) return
        setTarefaSelecionada(null)
    }

    const confirmarAlteracao = async () => {
        if (!tarefaSelecionada) return
        setSalvando(true)

        const novoStatus = !tarefaSelecionada.tarefa_concluida

        const { error } = await supabase
            .from('tarefas')
            .update({ tarefa_concluida: novoStatus })
            .eq('id', tarefaSelecionada.id)

        setSalvando(false)

        if (error) return alert(error.message)

        setTarefas((anteriores) =>
            anteriores.map((t) =>
                t.id === tarefaSelecionada.id ? { ...t, tarefa_concluida: novoStatus } : t
            )
        )
        setTarefaSelecionada(null)
    }

    return (
        <section className="min-h-screen w-full bg-zinc-950 text-white px-6 py-12 md:px-12">
            <div className="mx-auto max-w-3xl flex flex-col gap-10">

                {/* Cabeçalho */}
                <header className="flex flex-col items-center gap-2 text-center">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                        Minhas tarefas
                    </span>
                    <h1 className="font-serif text-5xl font-bold">
                        Olá, <span className="text-violet-400">User!</span>
                    </h1>
                    <p className="text-zinc-400">
                        {tarefas.length} {tarefas.length === 1 ? 'tarefa cadastrada' : 'tarefas cadastradas'}
                    </p>
                </header>

                {/* Botão nova tarefa */}
                {!formularioVisivel && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setFormularioVisivel(true)}
                            className="cursor-pointer bg-violet-600 px-8 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-500 active:translate-y-0"
                        >
                            Nova tarefa +
                        </button>
                    </div>
                )}

                {/* Formulário */}
                {formularioVisivel && (
                    <form
                        onSubmit={cadastroTarefa}
                        className="relative flex flex-col gap-4  border border-violet-900/60 bg-zinc-900 p-6 shadow-2xl shadow-violet-950/50 md:p-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif text-2xl font-bold">Nova tarefa</h2>
                            <button
                                type="button"
                                onClick={() => setFormularioVisivel(false)}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors duration-300 hover:bg-zinc-800 hover:text-white"
                                aria-label="Fechar formulário"
                            >
                                ✕
                            </button>
                        </div>

                        <input
                            type="text"
                            name="titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título da tarefa"
                            className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                        />

                        <textarea
                            name="descricao"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descreva a tarefa"
                            rows={4}
                            className="resize-none rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                        />

                        <button
                            type="submit"
                            className="mt-2 cursor-pointer self-end rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-violet-500"
                        >
                            Cadastrar tarefa
                        </button>
                    </form>
                )}

                {/* Lista */}
                <div className="flex flex-col gap-4">
                    {carregando ? (
                        <p className="text-center text-zinc-400 animate-pulse">Carregando...</p>
                    ) : tarefas.length === 0 ? (
                        <div className="border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
                            Não há nada aqui ainda.
                        </div>
                    ) : (
                        tarefas.map((tarefa) => (
                            <article
                                key={tarefa.id}
                                className="group border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-violet-700 hover:shadow-lg hover:shadow-violet-950/40"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className=" text-2xl font-bold text-white">
                                        {tarefa.titulo}
                                    </h3>

                                    <div className="flex shrink-0 flex-col items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
                                                tarefa.tarefa_concluida
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                        >
                                            {tarefa.tarefa_concluida ? 'Concluída' : 'Pendente'}
                                        </span>

                                
                                    </div>
                                </div>

                                <p className="mt-2 text-zinc-300">{tarefa.descricao}</p>

                                <small className="mt-4 block text-xs text-zinc-500">
                                    {new Date(tarefa.data_criacao).toLocaleString('pt-BR')}
                                </small>
                            </article>
                        ))
                    )}
                </div>
            </div>

            {/* Modal de confirmação */}
            {tarefaSelecionada && (
                <div
                    onClick={fecharConfirmacao}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-violet-950/50"
                    >
                        <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                                tarefaSelecionada.tarefa_concluida
                                    ? 'bg-zinc-800 text-zinc-300'
                                    : 'bg-emerald-500/15 text-emerald-400'
                            }`}
                        >
                            <Check size={24} />
                        </div>

                        <h2 className="font-serif text-2xl font-bold text-white">
                            {tarefaSelecionada.tarefa_concluida
                                ? 'Voltar para pendente?'
                                : 'Concluir tarefa?'}
                        </h2>

                        <p className="mt-2 text-zinc-400">
                            A tarefa <span className="font-semibold text-white">"{tarefaSelecionada.titulo}"</span> será marcada como{' '}
                            <span
                                className={
                                    tarefaSelecionada.tarefa_concluida
                                        ? 'font-semibold text-zinc-300'
                                        : 'font-semibold text-emerald-400'
                                }
                            >
                                {tarefaSelecionada.tarefa_concluida ? 'pendente' : 'concluída'}
                            </span>.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={fecharConfirmacao}
                                disabled={salvando}
                                className="cursor-pointer rounded-lg px-5 py-2.5 font-semibold text-zinc-300 transition-colors duration-300 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarAlteracao}
                                disabled={salvando}
                                className={`cursor-pointer rounded-lg px-5 py-2.5 font-semibold text-white transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                                    tarefaSelecionada.tarefa_concluida
                                        ? 'bg-violet-600 hover:bg-violet-500'
                                        : 'bg-emerald-600 hover:bg-emerald-500'
                                }`}
                            >
                                {salvando
                                    ? 'Salvando...'
                                    : tarefaSelecionada.tarefa_concluida
                                        ? 'Marcar como pendente'
                                        : 'Concluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}