import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { Tarefa } from  '../../models/tarefas.models';
import { TarefaService } from '../../services/tarefa.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {

   //formulario reativo para criar tarefas
   formNovaTarefa!: FormGroup;

   //array de tarefas que vao da tela 
    tarefas: Tarefa[] = [];

    //status  do filtro

    filtro: 'todas' | 'pendentes' | 'concluidas' = 'todas';

    constructor(
               private snackBar: MatSnackBar,
               private tarefaService: TarefaService 
              ){ }

    ngOnInit(): void {

      //init form
      this.formNovaTarefa = new FormGroup({
        titulo: new FormControl('',[ Validators.required, Validators.minLength(3)])
      });

      //carrega tarefas iniciais
      this.carregarTarefas();
    }
    
     //Carrega tarefas atuais do serviço
    carregarTarefas():void{
      this.tarefas = this.tarefaService.getTarefas(this.filtro);
    }

    //cria uma nova tarefa se for valido

    adicionar():void{
      if (this.formNovaTarefa.valid){
        const titulo = this.formNovaTarefa.get('titulo')?.value;
        this.tarefaService.criarTarefa(titulo)
        this.formNovaTarefa.reset();
        this.carregarTarefas();
        this.snackBar.open('Deu certo!!!!!!!!><><><<><><><>>','fechar', {
          duration: 2000
        });
      }else{
        this.snackBar.open('Deu errado!!!!!!!!><><><<><><><>>','fechar', {
          duration: 2000
        });
      }
    }
    
    /**Altera status de uma tarefa
     * @param tarefa tarefa que vai ser alterada
     */
    alterarStatus(tarefa: Tarefa): void{
      this.tarefaService.alterarStatusTarefa(tarefa.id, !tarefa.concluida);
      this.carregarTarefas();

      const msg = tarefa.concluida ? 'tarefa reaberta': 'tarefa concluida';
      this.snackBar.open(msg,'fechar',{
        duration: 2000
      });
    }

    /**Define o filtro de visualização de tarefas
    * @param f filtro do tipo 'todas' | 'pendentes' | 'concluidas
    */
   definirFiltro(f: 'todas' | 'pendentes' | 'concluidas'): void{
     this.filtro = f;
     this.carregarTarefas();
   }
}
