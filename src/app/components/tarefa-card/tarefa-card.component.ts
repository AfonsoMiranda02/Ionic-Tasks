import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Tarefa, TarefasService } from '../../services/tarefas';

/**
 * Componente que exibe um card com lista de tarefas
 * Suporta reordenação e ações de editar/eliminar
 */
@Component({
  selector: 'app-tarefa-card',
  templateUrl: './tarefa-card.component.html',
  standalone: false
})
export class TarefaCardComponent {
  @Input() titulo: string = '';
  @Input() tarefas: Tarefa[] = [];
  
  @Output() onEditar = new EventEmitter<number>();
  @Output() onEliminar = new EventEmitter<number>();

  constructor(private tarefasService: TarefasService) {}

  /**
   * Emite evento para editar tarefa
   */
  editar(id: number) {
    this.onEditar.emit(id);
  }

  /**
   * Emite evento para eliminar tarefa
   */
  eliminar(id: number) {
    this.onEliminar.emit(id);
  }

  /**
   * Finaliza a animação de reordenação
   */
  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    ev.detail.complete();
  }

  /**
   * Verifica se uma tarefa está em atraso
   */
  estaEmAtraso(tarefa: Tarefa): boolean {
    return this.tarefasService.estaEmAtraso(tarefa);
  }
}