import { Component, OnInit } from '@angular/core';
import { ProjetosService, Projeto } from '../../services/projetos';
import { CategoriasService, Categoria } from '../../services/categorias';
import { TarefasService } from '../../services/tarefas';

/**
 * Página de gestão de Projetos
 * Permite criar, editar, eliminar projetos e mover tarefas entre projetos
 */
@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.page.html',
  styleUrls: ['./projetos.page.scss'],
  standalone: false
})
export class ProjetosPage implements OnInit {
  projetos: Projeto[] = [];
  categorias: Categoria[] = [];

  nomeProjeto: string = '';
  categoriaId: number | null = null;

  editandoId: number | null = null;
  nomeEdit: string = '';
  catIdEdit: number | null = null;

  constructor(
    private projetosService: ProjetosService,
    private categoriasService: CategoriasService,
    private tarefasService: TarefasService,
  ) { }

  async ngOnInit() {
    // Garantir que o storage está inicializado
    await this.categoriasService.getAll();
    await this.load();
  }

  /**
   * Carrega projetos e categorias
   */
  async load() {
    this.projetos = await this.projetosService.getAll();
    this.categorias = await this.categoriasService.getAll();
    console.log('Categorias carregadas:', this.categorias.length, this.categorias);
  }

  /**
   * Adiciona um novo projeto
   */
  async adicionar() {
    if (this.nomeProjeto.trim() && this.categoriaId) {
      await this.projetosService.add({ id: 0, nome: this.nomeProjeto, categoriaId: this.categoriaId });
      this.nomeProjeto = '';
      this.categoriaId = null;
      this.load();
    }
  }

  /**
   * Elimina um projeto e todas as suas tarefas associadas
   */
  async remover(id: number) {
    const projeto = this.projetos.find(p => p.id === id);
    if (!projeto) return;
    
    // Verificar quantas tarefas serão eliminadas
    const tarefas = await this.tarefasService.getByProjeto(id);
    
    // Mostrar confirmação
    const confirmar = confirm(
      `Tem certeza que deseja eliminar o projeto "${projeto.nome}"?\n\n` +
      `Isto irá eliminar ${tarefas.length} tarefa(s) associada(s).`
    );
    
    if (!confirmar) return;
    
    // Eliminar todas as tarefas do projeto
    for (const tarefa of tarefas) {
      await this.tarefasService.delete(tarefa.id);
    }
    // Eliminar o projeto
    await this.projetosService.delete(id);
    await this.load();
  }

  /**
   * Inicia modo de edição de um projeto
   */
  iniciarEditar(proj: Projeto) {
    this.editandoId = proj.id;
    this.nomeEdit = proj.nome;
    this.catIdEdit = proj.categoriaId;
  }

  /**
   * Guarda as alterações de um projeto
   */
  async guardarEdicao() {
    if (this.nomeEdit.trim() && this.editandoId !== null && this.catIdEdit) {
      await this.projetosService.update({ id: this.editandoId, nome: this.nomeEdit, categoriaId: this.catIdEdit });
      this.editandoId = null;
      this.nomeEdit = '';
      this.catIdEdit = null;
      this.load();
    }
  }

  /**
   * Cancela a edição
   */
  cancelarEdicao() {
    this.editandoId = null;
    this.nomeEdit = '';
    this.catIdEdit = null;
  }

  /**
   * Retorna o nome da categoria pelo ID
   */
  categoriaNome(id: number): string {
    const categoria = this.categorias.find(c => c.id === id);
    if (!categoria) {
      return 'Categoria eliminada';
    }
    return categoria.nome;
  }

  /**
   * Função de comparação para o select
   */
  compareWith(o1: number, o2: number): boolean {
    return o1 === o2;
  }

  /**
   * TrackBy function para melhor performance
   */
  trackByCategoria(index: number, cat: Categoria): number {
    return cat.id;
  }
}

