/**
 * UploaderManager — Gestionnaire d'upload de fichiers pour la Space View.
 *
 * S'interface avec le DragNDrop natif pour intercepter les fichiers glissés
 * depuis le système de fichiers et les envoie au backend via fetchPOST (FormData).
 * Gère aussi l'upload classique via input file.
 */

import { fetchPOST, router } from '@/utils';
import { ROUTES } from '@/constants';
import { FileComponent } from '@/components/File';
import type { FileProps } from '@/components/File';

export interface UploaderManagerOptions {
  spaceId: string;
  dropZone: HTMLElement;
  fileContainer: HTMLElement;
  folderId?: number | null;
}

export class UploaderManager {
  private readonly spaceId: string;
  private readonly dropZone: HTMLElement;
  private readonly fileContainer: HTMLElement;
  private folderId: number | null;

  constructor(options: UploaderManagerOptions) {
    this.spaceId = options.spaceId;
    this.dropZone = options.dropZone;
    this.fileContainer = options.fileContainer;
    this.folderId = options.folderId ?? null;

    this.init();
  }

  private init(): void {
    // Empêcher le comportement par défaut du navigateur (ouvrir le fichier)
    this.dropZone.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', (e: DragEvent) => {
      // Vérifier qu'on quitte bien la zone et pas un enfant
      if (!this.dropZone.contains(e.relatedTarget as Node)) {
        this.dropZone.classList.remove('drag-over');
      }
    });

    this.dropZone.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        this.uploadFiles(files);
      }
    });
  }

  /**
   * Permet de changer le dossier cible dynamiquement.
   */
  public setFolderId(folderId: number | null): void {
    this.folderId = folderId;
  }

  /**
   * Upload via un <input type="file"> classique.
   */
  public handleInputChange(input: HTMLInputElement): void {
    if (input.files && input.files.length > 0) {
      this.uploadFiles(input.files);
      input.value = ''; // Reset pour permettre de re-sélectionner le même fichier
    }
  }

  /**
   * Envoie les fichiers au backend via FormData.
   */
  private async uploadFiles(fileList: FileList): Promise<void> {
    const formData = new FormData();

    for (let i = 0; i < fileList.length; i++) {
      formData.append('files[]', fileList[i]);
    }

    if (this.folderId !== null) {
      formData.append('folder_id', this.folderId.toString());
    }

    try {
      const response = await fetchPOST<FileProps[]>(
        router(ROUTES.AJX.FILE.LIST, { id: this.spaceId }),
        formData,
      );

      // Injecter les nouveaux fichiers dans le DOM
      const createdFiles: FileProps[] = response.data ?? [];
      createdFiles.forEach((fileData) => {
        const component = new FileComponent(fileData);
        this.fileContainer.prepend(component.getElement());
      });
    } catch (error) {
      console.error("Erreur lors de l'upload des fichiers :", error);
    }
  }
}
