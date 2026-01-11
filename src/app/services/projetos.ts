import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Interface que define a estrutura de um Projeto
 */
export interface Projeto {
  id: number;
  nome: string;
  categoriaId: number;
}

/**
 * Service responsável pela gestão de Projetos
 * Implementa CRUD completo com persistência via Ionic Storage
 */
@Injectable({ providedIn: 'root' })
export class ProjetosService {
  private projetos: Projeto[] = [];
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {
    this.initPromise = this.init();
  }

  /**
   * Inicializa o serviço carregando dados do Storage ou do JSON inicial
   */
  private async init(): Promise<void> {
    await this.storage.create();
    const saved = await this.storage.get('projetos');
    if (!saved || (Array.isArray(saved) && saved.length === 0)) {
      try {
        const resp = await fetch('assets/templates.json');
        const data = await resp.json();
        this.projetos = data.projetos || [];
        await this.save();
      } catch (error) {
        console.error('Erro ao carregar templates.json:', error);
        this.projetos = [];
      }
    } else {
      this.projetos = saved || [];
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
   * Guarda os projetos no Storage
   */
  async save() {
    await this.storage.set('projetos', this.projetos);
  }

  /**
   * Retorna todos os projetos
   */
  async getAll(): Promise<Projeto[]> {
    await this.ensureInit();
    return [...this.projetos];
  }

  /**
   * Adiciona um novo projeto
   */
  async add(proj: Projeto) {
    this.projetos.push({ ...proj, id: Date.now() });
    await this.save();
  }

  /**
   * Atualiza um projeto existente
   */
  async update(proj: Projeto) {
    const idx = this.projetos.findIndex(p => p.id === proj.id);
    if (idx !== -1) {
      this.projetos[idx] = proj;
      await this.save();
    }
  }

  /**
   * Elimina um projeto pelo ID
   * Nota: As tarefas associadas devem ser eliminadas pelo TarefasService
   */
  async delete(id: number) {
    this.projetos = this.projetos.filter(p => p.id !== id);
    await this.save();
  }

  /**
   * Retorna projetos de uma categoria específica
   */
  getByCategoria(catId: number): Projeto[] {
    return this.projetos.filter(p => p.categoriaId === catId);
  }
}
