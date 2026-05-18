import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

export type FileCategory = 'recipes' | 'profile';

export interface UploadedFileResponse {
  id: string;
  relativePath: string;
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private blobServiceClient: BlobServiceClient | null = null;
  private readonly containerName: string;
  private readonly allowedCategories: FileCategory[] = ['recipes', 'profile'];
  private initialized = false;

  constructor(private readonly configService: ConfigService) {
    this.containerName =
      this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME') || 'files';

    this.logger.log(`FilesService initializing with container: ${this.containerName}`);
  }

  private init() {
    if (this.initialized) return;

    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );

    if (!connectionString) {
      this.logger.error('Azure storage connection string is not configured');
      throw new Error('Azure storage connection string is not configured');
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.initialized = true;
    this.logger.log('FilesService Azure client initialized');
  }

  async uploadFile(
    file: Express.Multer.File,
    category: string,
  ): Promise<UploadedFileResponse> {
    this.init();

    if (!file) {
      throw new Error('No file provided');
    }

    const validCategory = this.validateCategory(category);

    if (!this.blobServiceClient) {
      throw new Error('Azure storage client not initialized');
    }

    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    await containerClient.createIfNotExists();

    const id = uuidv4();
    const extension = file.originalname.split('.').pop() || '';
    const blobName = `${validCategory}/${id}.${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    return {
      id,
      relativePath: `/${validCategory}/${id}.${extension}`,
    };
  }

  private validateCategory(category: string): FileCategory {
    if (!this.allowedCategories.includes(category as FileCategory)) {
      throw new Error(
        `Invalid category. Allowed: ${this.allowedCategories.join(', ')}`,
      );
    }
    return category as FileCategory;
  }
}
