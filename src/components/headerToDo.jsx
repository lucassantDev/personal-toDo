export default function HeaderTodo({ tarefas }) {
    return (
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
    )
}