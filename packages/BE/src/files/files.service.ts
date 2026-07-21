import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
      throw new InternalServerErrorException('Azure storage connection string is not configured');
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
      throw new BadRequestException('No file provided');
    }

    const validCategory = this.validateCategory(category);

    if (!this.blobServiceClient) {
      throw new InternalServerErrorException('Azure storage client not initialized');
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

  async downloadFile(relativePath: string): Promise<{ buffer: Buffer; contentType: string } | null> {
    this.init();
    if (!this.blobServiceClient) return null;

    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blobName = relativePath.startsWith('/')
      ? relativePath.slice(1)
      : relativePath;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      const response = await blockBlobClient.download();
      const buffer = await this.streamToBuffer(
        response.readableStreamBody!,
      );
      return {
        buffer,
        contentType: response.contentType || 'application/octet-stream',
      };
    } catch {
      return null;
    }
  }

  private async streamToBuffer(
    stream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  private validateCategory(category: string): FileCategory {
    if (!this.allowedCategories.includes(category as FileCategory)) {
      throw new BadRequestException(
        `Invalid category. Allowed: ${this.allowedCategories.join(', ')}`,
      );
    }
    return category as FileCategory;
  }
}
