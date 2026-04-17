/**
 * Service pour la gestion des entités Todo via API
 */
import { ROUTES } from '@/constants/routes';
import {
  fetchGET,
  fetchPOST,
  fetchPATCH,
  fetchDELETE,
} from '@/utils/request/fetch';
import type { Todo } from '@/types/index.d';
import { router } from '@/utils';

export class TodoService {
  /**
   * Récupère les tâches actives d'un espace
   */
  static async listBySpace(spaceId: number | string): Promise<Todo[]> {
    const rawData = await fetchGET<Todo[]>(
      router(ROUTES.AJX.TODO.LIST, { id: spaceId }),
    );
    return rawData.data;
  }

  /**
   * Crée une nouvelle tâche dans un espace
   */
  static async create(
    spaceId: number | string,
    data: { name: string; dueDate?: string | null },
  ): Promise<Todo> {
    const rawData = await fetchPOST<Todo>(
      router(ROUTES.AJX.TODO.CREATE, { id: spaceId }),
      data,
    );
    return rawData.data;
  }

  /**
   * Met à jour une tâche (nom, dueDate, isCompleted, isImportant, state)
   */
  static async update(
    todoId: number | string,
    data: Partial<
      Pick<Todo, 'name' | 'isCompleted' | 'isImportant' | 'dueDate'>
    > & {
      state?: string;
    },
  ): Promise<Todo> {
    const rawData = await fetchPATCH<Todo>(
      router(ROUTES.AJX.TODO.UPDATE, { id: todoId }),
      data,
    );
    return rawData.data;
  }

  /**
   * Supprime définitivement une tâche
   */
  static async delete(todoId: number | string): Promise<void> {
    await fetchDELETE<void>(router(ROUTES.AJX.TODO.DELETE, { id: todoId }));
  }
}
