import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Interface que define a estrutura de uma Tarefa
 */
export interface Tarefa {
  id: number;
  projetoId: number;
  titulo: string;
  descricao: string;
  dataLimite: string;
  concluida: boolean;
  imagem?: string;
}

/**
 * Service responsável pela gestão de Tarefas
 * Implementa CRUD completo com persistência via Ionic Storage
 */
@Injectable({ providedIn: 'root' })
export class TarefasService {
  private tarefas: Tarefa[] = [];
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {
    this.initPromise = this.init();
  }

  /**
   * Inicializa o serviço carregando dados do Storage ou do JSON inicial
   */
  private async init(): Promise<void> {
    await this.storage.create();
    const saved = await this.storage.get('tarefas');
    if (!saved || (Array.isArray(saved) && saved.length === 0)) {
      try {
        const resp = await fetch('assets/templates.json');
        const data = await resp.json();
        this.tarefas = data.tarefas || [];
        await this.save();
      } catch (error) {
        console.error('Erro ao carregar templates.json:', error);
        this.tarefas = [];
      }
    } else {
      this.tarefas = saved || [];
    }
  }

  /**
   * Garante que o serviço está inicializado
   */
  private async ensureInit(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  /**
   * Guarda as tarefas no Storage
   */
  async save() {
    await this.storage.set('tarefas', this.tarefas);
  }

  /**
   * Retorna todas as tarefas
   */
  async getAll(): Promise<Tarefa[]> {
    await this.ensureInit();
    return [...this.tarefas];
  }

  /**
   * Adiciona uma nova tarefa
   */
  async add(task: Tarefa) {
    this.tarefas.push({ ...task, id: Date.now() });
    await this.save();
  }

  /**
   * Atualiza uma tarefa existente
   */
  async update(task: Tarefa) {
    const idx = this.tarefas.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      this.tarefas[idx] = task;
      await this.save();
    }
  }

  /**
   * Elimina uma tarefa pelo ID
   */
  async delete(id: number) {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    await this.save();
  }

  /**
   * Retorna tarefas de um projeto específico
   */
  async getByProjeto(projId: number): Promise<Tarefa[]> {
    await this.ensureInit();
    return this.tarefas.filter(t => t.projetoId === projId);
  }

  /**
   * Move uma tarefa para outro projeto
   */
  async moverParaProjeto(tarefaId: number, novoProjetoId: number) {
    const tarefa = this.tarefas.find(t => t.id === tarefaId);
    if (tarefa) {
      tarefa.projetoId = novoProjetoId;
      await this.save();
    }
  }

  /**
   * Verifica se uma tarefa está em atraso
   */
  estaEmAtraso(tarefa: Tarefa): boolean {
    if (tarefa.concluida) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataLimite = new Date(tarefa.dataLimite);
    dataLimite.setHours(0, 0, 0, 0);
    return dataLimite < hoje;
  }
}
