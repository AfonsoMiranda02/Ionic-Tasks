import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TarefasService, Tarefa } from '../../services/tarefas';
import { ProjetosService, Projeto } from '../../services/projetos';

/**
 * Página de listagem de Tarefas
 * Organiza tarefas em três categorias: To Do, In Progress (em atraso) e Done
 */
@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: false
})
export class ListaPage implements OnInit {
  toDo: Tarefa[] = [];
  inProgress: Tarefa[] = [];
  done: Tarefa[] = [];
  projetos: Projeto[] = [];

  constructor(
    private router: Router,
    private tarefasService: TarefasService,
    private projetosService: ProjetosService
  ){}

  async ngOnInit() {
    // Aguardar inicialização dos serviços se necessário
    await this.load();
  }

  /**
   * Carrega e organiza as tarefas por estado
   */
  async load() {
    const todas = await this.tarefasService.getAll();
    this.projetos = await this.projetosService.getAll();
    
    // Filtrar apenas tarefas de projetos que ainda existem
    const tarefasValidas = todas.filter((t: Tarefa) => 
      this.projetos.some(p => p.id === t.projetoId)
    );
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Tarefas não concluídas com data limite futura ou sem data
    this.toDo = tarefasValidas.filter((t: Tarefa) => {
      if (t.concluida) return false;
      if (!t.dataLimite) return true;
      const dataLimite = new Date(t.dataLimite);
      dataLimite.setHours(0, 0, 0, 0);
      return dataLimite >= hoje;
    });
    
    // Tarefas não concluídas em atraso (data limite passada)
    this.inProgress = tarefasValidas.filter((t: Tarefa) => {
      if (t.concluida) return false;
      if (!t.dataLimite) return false;
      const dataLimite = new Date(t.dataLimite);
      dataLimite.setHours(0, 0, 0, 0);
      return dataLimite < hoje;
    });
    
    // Tarefas concluídas
    this.done = tarefasValidas.filter((t: Tarefa) => t.concluida);
    console.log('Projetos carregados:', this.projetos.length);
  }

  /**
   * Navega para a página inicial
   */
  irParaHome() {
    this.router.navigateByUrl('/home');
  }

  /**
   * Elimina uma tarefa
   */
  async eliminarTarefa(id: number) {
    await this.tarefasService.delete(id);
    this.load();
  }

  /**
   * Navega para a página de edição de tarefa
   * Se id for 0, abre em modo criação
   */
  navegarParaEditar(id: number) {
    console.log('Navegando para editar tarefa, id:', id);
    if (id === 0) {
      this.router.navigateByUrl('/tarefa').then(
        () => console.log('Navegação para /tarefa bem-sucedida'),
        (err) => console.error('Erro na navegação:', err)
      );
    } else {
      this.router.navigateByUrl(`/tarefa?id=${id}`).then(
        () => console.log('Navegação para /tarefa?id=' + id + ' bem-sucedida'),
        (err) => console.error('Erro na navegação:', err)
      );
    }
  }
}
