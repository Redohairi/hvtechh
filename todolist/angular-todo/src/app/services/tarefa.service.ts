import { Injectable } from "@angular/core";
import { Tarefa } from '../models/tarefas.models';

@Injectable({
    providedIn: 'root'
})
export class TarefaService {

    /**
     * Nome da chave do Local Storage que é a camada de persistencia.
     * Readonly para nao mudar o valor em tempo de execucao.
     * Private para não ser acessado de fora da classe.
     */
    private readonly LOCAL_STORAGE_KEY = 'listaTarefas';

    constructor() { }

    public getTarefas(
        status: 'todas' | 'pendentes'  | 'concluidas' = 'todas'
    ): Tarefa[] {
            const tarefas = this.lerTarefasDoLocalStorage();

            switch (status) {
                case 'pendentes':
                    return tarefas.filter(t => !t.concluida);
                case 'concluidas':
                    return tarefas.filter(t => t.concluida);
                default:
                    return tarefas;
    }
}
  /**
   * Cria uma nova tarefa e a salva no localStorage.
   * Retorna a tarefa recém-criada.
   * @param titulo Texto que descreve a tarefa.
   */

    public criarTarefa(titulo: string): Tarefa {
        const tarefas = this.lerTarefasDoLocalStorage();
        const novaTarefa: Tarefa = {
            id: Date.now(),
            titulo,
            concluida: false
        };
    
        tarefas.push(novaTarefa);
        this.escreverTarefasNoLocalStorage(tarefas);
    
        return novaTarefa;

    }

    /**
     * Altera o status de uma tarefa para concluída
     * @param id ID da tarefa a ser concluída
     * @param concluida Valor de status final: true (concluido) false (pendente)
     */

    public alterarStatusTarefa(id: number, concluida: boolean): void {
        //procura todas as tarefas
        const tarefas = this.lerTarefasDoLocalStorage();

        //pega o indice da tarefa que vai ser alterada
        const index = tarefas.findIndex(t => t.id === id);

        //se existir a tarefa com o id passado, altera o status
        if(index !== -1){
            tarefas[index].concluida = concluida;
            this.escreverTarefasNoLocalStorage(tarefas);
        }

    }
    /**
     * Le as tarefas do localstorage e retorna uma array de tarefas
     * @returns Array de tarefas
     */

    private lerTarefasDoLocalStorage(): Tarefa[] {
        const tarefas = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        return tarefas ? JSON.parse(tarefas) : [];
    }
    

    
     //Converte um array de tarefas em json e salva

    private escreverTarefasNoLocalStorage(tarefas: Tarefa[]): void{
        localStorage.setItem(
            this.LOCAL_STORAGE_KEY,
            JSON.stringify(tarefas)
        )
    };

}
