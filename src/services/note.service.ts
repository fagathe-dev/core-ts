/**
 * Service pour la gestion des entités Note via API
 */
import { ROUTES } from '@/constants/routes';
import {
  fetchGET,
  fetchPOST,
  fetchPATCH,
  fetchDELETE,
} from '@/utils/request/fetch';
import type { Note } from '@/types/index.d';
import { router } from '@/utils';

export class NoteService {
  /**
   * Récupère les notes actives d'un espace
   */
  static async listBySpace(spaceId: number | string): Promise<Note[]> {
    const rawData = await fetchGET<Note[]>(
      router(ROUTES.AJX.NOTE.LIST, { id: spaceId }),
    );
    return rawData.data;
  }

  /**
   * Crée une nouvelle note dans un espace
   */
  static async create(
    spaceId: number | string,
    data: { title?: string; content: string },
  ): Promise<Note> {
    const rawData = await fetchPOST<Note>(
      router(ROUTES.AJX.NOTE.CREATE, { id: spaceId }),
      data,
    );
    return rawData.data;
  }

  /**
   * Met à jour une note (titre, contenu, state, isPinned)
   */
  static async update(
    noteId: number | string,
    data: Partial<Pick<Note, 'title' | 'content' | 'isPinned'>> & {
      state?: string;
    },
  ): Promise<Note> {
    const rawData = await fetchPATCH<Note>(
      router(ROUTES.AJX.NOTE.UPDATE, { id: noteId }),
      data,
    );
    return rawData.data;
  }

  /**
   * Bascule l'état épinglé d'une note
   */
  static async togglePin(noteId: number | string): Promise<Note> {
    const rawData = await fetchPATCH<Note>(`/ajax/note/${noteId}/pin`);
    return rawData.data;
  }

  /**
   * Supprime définitivement une note
   */
  static async delete(noteId: number | string): Promise<void> {
    await fetchDELETE<void>(router(ROUTES.AJX.NOTE.DELETE, { id: noteId }));
  }
}
