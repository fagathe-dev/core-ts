import { FileSizeFormatter } from './FileSizeFormatter';
import { fetchAPI } from '../request/fetch';
import { ApiError } from '../request/api-error';

export interface FileUploaderConfig {
  uploadUrl: string;
  inputElement: HTMLInputElement;
  fieldName?: string;
  maxSize?: string;
  allowedMimes?: string[];
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  onProgress?: (percent: number) => void;
  onPreview?: (base64Url: string) => void;
}

export class FileUploader {
  private readonly uploadUrl: string;
  private readonly inputElement: HTMLInputElement;
  private readonly fieldName: string;
  private readonly maxSize: string | null;
  private readonly allowedMimes: string[] | null;
  private readonly onSuccess?: (data: unknown) => void;
  private readonly onError?: (error: string) => void;
  private readonly onProgress?: (percent: number) => void;
  private readonly onPreview?: (base64Url: string) => void;

  constructor(config: FileUploaderConfig) {
    this.uploadUrl = config.uploadUrl;
    this.inputElement = config.inputElement;
    this.fieldName = config.fieldName ?? 'avatar';
    this.maxSize = config.maxSize ?? null;
    this.allowedMimes = config.allowedMimes ?? null;
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
    this.onProgress = config.onProgress;
    this.onPreview = config.onPreview;

    this.inputElement.addEventListener('change', this.handleChange.bind(this));
  }

  private handleChange(): void {
    const file = this.inputElement.files?.[0];
    if (!file) return;

    if (!this.validate(file)) return;

    this.preview(file);
    this.upload(file);
  }

  private validate(file: File): boolean {
    if (this.maxSize && !FileSizeFormatter.isValid(file.size, this.maxSize)) {
      this.onError?.(
        `Le fichier dépasse la taille maximale autorisée (${this.maxSize}).`,
      );
      return false;
    }

    if (this.allowedMimes && !this.allowedMimes.includes(file.type)) {
      this.onError?.(
        `Type de fichier non autorisé (${file.type}). Types acceptés : ${this.allowedMimes.join(', ')}.`,
      );
      return false;
    }

    return true;
  }

  private preview(file: File): void {
    if (!this.onPreview || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.onPreview!(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  private async upload(file: File): Promise<void> {
    const formData = new FormData();
    formData.append(this.fieldName, file);

    try {
      const response = await fetchAPI(this.uploadUrl, {
        method: 'POST',
        body: formData,
        onUploadProgress: (event) => {
          if (this.onProgress && event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            this.onProgress(percent);
          }
        },
      });

      this.onSuccess?.(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        this.onError?.(error.getErrorMessage());
      } else {
        this.onError?.(
          error instanceof Error ? error.message : 'Erreur inconnue',
        );
      }
    }
  }
}
