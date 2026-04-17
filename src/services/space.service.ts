/**
 * Service pour la gestion des entités Space via API
 */
import { ROUTES } from '@/constants/routes';
import { fetchPOST, fetchDELETE, fetchPUT } from '@/utils/request/fetch';
import { Space } from '@/types/index.d';
import { router } from '@/utils';

export class SpaceService {
  /**
   * Crée un nouvel espace
   */
  static async create(data: Partial<Space>): Promise<Space> {
    const rawData = await fetchPOST<Space>(ROUTES.AJX.SPACE.CREATE, data);
    return rawData.data;
  }

  /**
   * Met à jour un espace existant
   */
  static async update(
    id: number | string,
    data: Partial<Space>,
  ): Promise<Space> {
    const rawData = await fetchPUT<Space>(
      router(ROUTES.AJX.SPACE.UPDATE, { id }),
      data,
    );
    return rawData.data;
  }

  /**
   * Supprime définitivement un espace
   */
  static async delete(id: number | string): Promise<void> {
    const rawData = await fetchDELETE<void>(
      router(ROUTES.AJX.SPACE.DELETE, { id }),
    );
    return rawData.data;
  }
}
