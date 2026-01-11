import { Component, OnInit } from '@angular/core';
import { CategoriasService, Categoria } from '../../services/categorias';
import { ProjetosService } from '../../services/projetos';
import { AlertController } from '@ionic/angular';

/**
 * Página de gestão de Categorias
 * Permite criar, editar e eliminar categorias
 */
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: false
})
export class CategoriasPage implements OnInit {
  categorias: Categoria[] = [];
  novaCategoria: string = '';
  editandoId: number | null = null;
  nomeEdit: string = '';

  constructor(
    private categoriasService: CategoriasService,
    private projetosService: ProjetosService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.load();
  }

  /**
   * Carrega todas as categorias
   */
  async load() {
    this.categorias = await this.categoriasService.getAll();
  }

  /**
   * Adiciona uma nova categoria
   */
  async adicionar() {
    if (this.novaCategoria.trim()) {
      await this.categoriasService.add({ id: 0, nome: this.novaCategoria.trim() });
      this.novaCategoria = '';
      this.load();
    }
  }

  /**
   * Elimina uma categoria (apenas se não tiver projetos associados)
   */
  async remover(id: number) {
    // Verificar se há projetos associados a esta categoria
    const projetos = await this.projetosService.getAll();
    const projetosComCategoria = projetos.filter(p => p.categoriaId === id);
    
    if (projetosComCategoria.length > 0) {
      // Mostrar alerta se houver projetos
      const alert = await this.alertController.create({
        header: 'Não é possível eliminar',
        message: `Esta categoria tem ${projetosComCategoria.length} projeto(s) associado(s). Elimine primeiro os projetos ou altere a categoria deles.`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    // Se não houver projetos, eliminar a categoria
    await this.categoriasService.delete(id);
    await this.load();
  }

  /**
   * Inicia modo de edição de uma categoria
   */
  iniciarEditar(cat: Categoria) {
    this.editandoId = cat.id;
    this.nomeEdit = cat.nome;
  }

  /**
   * Guarda as alterações de uma categoria
   */
  async guardarEdicao() {
    if (this.nomeEdit.trim() && this.editandoId !== null) {
      await this.categoriasService.update({ id: this.editandoId, nome: this.nomeEdit });
      this.editandoId = null;
      this.nomeEdit = '';
      this.load();
    }
  }

  /**
   * Cancela a edição
   */
  cancelarEdicao() {
    this.editandoId = null;
    this.nomeEdit = '';
  }
}

