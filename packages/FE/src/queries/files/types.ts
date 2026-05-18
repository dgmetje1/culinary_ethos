export type FileCategory = 'recipes' | 'profile';

export interface UploadFileResponse {
  id: string;
  relativePath: string;
}

export interface UploadFileParams {
  file: File;
  category: FileCategory;
}