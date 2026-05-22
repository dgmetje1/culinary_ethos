import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

vi.mock('@azure/storage-blob', () => {
  const mockUploadData = vi.fn().mockResolvedValue({});
  const mockGetBlockBlobClient = vi.fn().mockReturnValue({
    uploadData: mockUploadData,
  });
  const mockCreateIfNotExists = vi.fn().mockResolvedValue({});
  const mockGetContainerClient = vi.fn().mockReturnValue({
    createIfNotExists: mockCreateIfNotExists,
    getBlockBlobClient: mockGetBlockBlobClient,
  });
  const mockBlobServiceClient = {
    getContainerClient: mockGetContainerClient,
  };

  return {
    BlobServiceClient: {
      fromConnectionString: vi.fn(() => mockBlobServiceClient),
    },
  };
});

import { FilesService } from './files.service';

describe('FilesService', () => {
  let service: FilesService;
  let mockConfigService: any;

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('fake-image-data'),
    size: 1024,
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
  };

  beforeEach(() => {
    mockConfigService = {
      get: vi.fn(),
    };
    service = new FilesService(mockConfigService);
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AZURE_STORAGE_CONNECTION_STRING') return 'DefaultEndpointsProtocol=https;AccountName=test;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net';
        if (key === 'AZURE_STORAGE_CONTAINER_NAME') return 'test-container';
        return null;
      });

      const result = await service.uploadFile(mockFile, 'recipes');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('relativePath');
      expect(result.relativePath).toMatch(/^\/recipes\//);
    });

    it('should throw BadRequestException when no file provided', async () => {
      mockConfigService.get.mockReturnValue('connection-string');

      await expect(
        service.uploadFile(null as any, 'recipes'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid category', async () => {
      mockConfigService.get.mockReturnValue('connection-string');

      await expect(
        service.uploadFile(mockFile, 'invalid-category' as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid category with message mentioning allowed values', async () => {
      mockConfigService.get.mockReturnValue('connection-string');

      await expect(
        service.uploadFile(mockFile, 'invalid' as any),
      ).rejects.toThrow('Invalid category. Allowed: recipes, profile');
    });

    it('should throw InternalServerErrorException when connection string is not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(
        service.uploadFile(mockFile, 'recipes'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should upload a profile file successfully', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AZURE_STORAGE_CONNECTION_STRING') return 'DefaultEndpointsProtocol=https;AccountName=test;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net';
        if (key === 'AZURE_STORAGE_CONTAINER_NAME') return 'test-container';
        return null;
      });

      const result = await service.uploadFile(mockFile, 'profile');

      expect(result.relativePath).toMatch(/^\/profile\//);
    });

    it('should handle file with no extension', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AZURE_STORAGE_CONNECTION_STRING') return 'DefaultEndpointsProtocol=https;AccountName=test;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net';
        if (key === 'AZURE_STORAGE_CONTAINER_NAME') return 'test-container';
        return null;
      });

      const fileNoExt: Express.Multer.File = { ...mockFile, originalname: 'testfile' };
      const result = await service.uploadFile(fileNoExt, 'recipes');

      expect(result.relativePath).toMatch(/^\/recipes\//);
    });
  });
});
