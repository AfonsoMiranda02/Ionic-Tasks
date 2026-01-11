import { Component, OnInit } from '@angular/core';
import { TarefasService, Tarefa } from '../../services/tarefas';
import { Router } from '@angular/router';

/**
 * Página de Calendário de Tarefas
 * Mostra todas as tarefas com suas datas limite
 * Permite abrir tarefas para edição ao clicar nelas
 */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false
})
export class CalendarPage implements OnInit {
  tarefas: Tarefa[] = [];
  datas: string[] = [];

  constructor(private tarefasService: TarefasService, private router: Router) {}

  ngOnInit() {
    this.carregarTarefas();
  }

  /**
   * Carrega todas as tarefas e extrai as datas
   */
  async carregarTarefas() {
    this.tarefas = await this.tarefasService.getAll();
    this.datas = this.tarefas.map(t => t.dataLimite);
  }

  /**
   * Abre a página de edição de uma tarefa
   */
  abrirTarefa(id: number) {
    this.router.navigateByUrl(`/tarefa?id=${id}`);
  }
}

