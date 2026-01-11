import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { NgForm } from '@angular/forms';
import { TarefasService, Tarefa } from '../../services/tarefas';
import { ProjetosService, Projeto } from '../../services/projetos';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Página de criação/edição de Tarefas
 * Permite criar novas tarefas ou editar existentes
 * Inclui integração com Capacitor Camera para adicionar imagens
 */
@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.page.html',
  styleUrls: ['./tarefa.page.scss'],
  standalone: false
})
export class TarefaPage implements OnInit {
  public photo: string | undefined;
  tarefa: Tarefa = { id: 0, projetoId: 0, titulo: '', descricao: '', dataLimite: '', concluida: false };
  editar = false;
  projetos: Projeto[] = [];

  constructor(
    private tarefasService: TarefasService,
    private projetosService: ProjetosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Inicializa a página carregando projetos e verificando se é edição
   */
  async ngOnInit() {
    this.projetos = await this.projetosService.getAll();
    this.route.queryParams.subscribe(async params => {
      const id = params['id'];
      if (id) {
        // Modo edição: carregar tarefa existente
        const todas = await this.tarefasService.getAll();
        const existente = todas.find((t: Tarefa) => t.id == id);
        if (existente) {
          this.tarefa = { ...existente };
          this.photo = existente.imagem;
          this.editar = true;
        }
      }
    });
  }

  /**
   * Captura uma foto usando o plugin Capacitor Camera
   */
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      if (image.webPath) {
        this.photo = image.webPath;
      } else {
        console.warn('Nenhuma foto foi capturada.');
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    }
  }

  /**
   * Submete o formulário criando ou atualizando a tarefa
   */
  async onSubmit(form: NgForm) {
    if (form.valid) {
      this.tarefa.imagem = this.photo;
      if (this.editar && this.tarefa.id) {
        await this.tarefasService.update(this.tarefa);
      } else {
        await this.tarefasService.add(this.tarefa);
      }
      this.router.navigateByUrl('/lista');
    }
  }
}
