import { useState } from "react";

export default function TodoMain() {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [formularioVisivel, setFormularioVisivel] = useState(false)
    

    const cadastroTarefa = () => {
        if (titulo === '' || descricao === '') {
            alert('Campo vazio')
        } else {
            alert(`Tarefa cadastrada: ${titulo} - ${descricao}`);
        }
        
    }

    return( <>
        
        <section className="w-full h-screen px-12 border-2 border-red-400">

            <div className="w-full border h-22 flex items-center justify-center">
                <h1 className="text-4xl font-bold">Olá User!</h1>
            </div>

            {formularioVisivel && (
                <div className='w-full flex items-center justify-center'>
                    <form className="flex flex-col items-center justify-center gap-2 w-5xl h-64 border"> 
                        
                        <span className='px-6 py-2 w-12 flex items-center justify-center border cursor-pointer transition-all duration-400 ease-in-out hover:shadow-md hover:border-red-200 hover:text-red-400' onClick={() => setFormularioVisivel(false)}>X</span>
                        
                        <input type="text"
                            name='titulo'
                            onChange={(e) => setTitulo(e.target.value)}
                            className='border w-2/3 p-2' placeholder='Título da tarefa' />

                        <textarea
                            name='descricao'
                            onChange={(e) => setDescricao(e.target.value)}
                            className="border w-2/3 p-2" placeholder="Descreva a tarefa">
                        </textarea>
                        
                        <button onClick={() => cadastroTarefa()} className="mt-4 w-fit px-6 py-2 cursor-pointer border transition-all duration-400 ease-in-out hover:shadow-md hover:border-gray-200">Cadastrar tarefa</button>
                    </form>
                </div>
            )}
            
            <div className="h-22 flex items-center justify-center">
                <button onClick={() => setFormularioVisivel(true)} className="w-fit px-6 py-2 cursor-pointer border transition-all duration-400 ease-in-out hover:shadow-md hover:border-gray-200">
                    Nova Tarefa +
                </button>
            </div>

            <div className='border h-44 '>
                <p className="text-center">Não há nada aqui</p>
            </div>
        </section>
         
    </>
    )
}