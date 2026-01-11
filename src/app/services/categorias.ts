import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Interface que define a estrutura de uma Categoria
 */
export interface Categoria {
  id: number;
  nome: string;
}

/**
 * Service responsável pela gestão de Categorias
 * Implementa CRUD completo com persistência via Ionic Storage
 */
@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private categorias: Categoria[] = [];
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {
    this.initPromise = this.init();
  }

  /**
   * Inicializa o serviço carregando dados do Storage ou do JSON inicial
   */
  private async init(): Promise<void> {
    await this.storage.create();
    const saved = await this.storage.get('categorias');
    if (!saved || (Array.isArray(saved) && saved.length === 0)) {
      // Se não houver dados no storage, carregar do JSON de templates
      try {
        const resp = await fetch('assets/templates.json');
        const data = await resp.json();
        this.categorias = data.categorias || [];
        await this.save();
      } catch (error) {
        console.error('Erro ao carregar templates.json:', error);
        this.categorias = [];
      }
    } else {
      this.categorias = saved || [];
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
   * Guarda as categorias no Storage
   */
  async save() {
    await this.storage.set('categorias', this.categorias);
  }

  /**
   * Retorna todas as categorias
   */
  async getAll(): Promise<Categoria[]> {
    await this.ensureInit();
    return [...this.categorias];
  }

  /**
   * Retorna todas as categorias (síncrono - usar apenas se tiver certeza que está inicializado)
   */
  getAllSync(): Categoria[] {
    return [...this.categorias];
  }

  /**
   * Adiciona uma nova categoria
   */
  async add(cat: Categoria) {
    this.categorias.push({ ...cat, id: Date.now() });
    await this.save();
  }

  /**
   * Atualiza uma categoria existente
   */
  async update(cat: Categoria) {
    const idx = this.categorias.findIndex(c => c.id === cat.id);
    if (idx !== -1) {
      this.categorias[idx] = cat;
      await this.save();
    }
  }

  /**
   * Elimina uma categoria pelo ID
   */
  async delete(id: number) {
    this.categorias = this.categorias.filter(c => c.id !== id);
    await this.save();
  }
}
