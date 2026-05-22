import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('multer', () => ({
  memoryStorage: vi.fn(() => ({})),
  default: { memoryStorage: vi.fn(() => ({})) },
}));

import { FilesController } from './files.controller';

describe('FilesController', () => {
  let controller: FilesController;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      uploadFile: vi.fn(),
    };
    controller = new FilesController(mockService);
  });

  describe('uploadFile', () => {
    it('should upload a file and return response', async () => {
      const mockResponse = {
        id: 'file123',
        relativePath: '/recipes/test-image.jpg',
      };
      mockService.uploadFile.mockResolvedValue(mockResponse);
      const mockFile = {
        fieldname: 'file',
        originalname: 'test-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 4,
      } as Express.Multer.File;
      const dto = { category: 'recipes' };

      const result = await controller.uploadFile(mockFile, dto);

      expect(result).toEqual(mockResponse);
      expect(mockService.uploadFile).toHaveBeenCalledWith(mockFile, 'recipes');
    });

    it('should upload a profile file', async () => {
      const mockResponse = {
        id: 'file456',
        relativePath: '/profile/avatar.jpg',
      };
      mockService.uploadFile.mockResolvedValue(mockResponse);
      const mockFile = {
        originalname: 'avatar.jpg',
      } as Express.Multer.File;
      const dto = { category: 'profile' };

      const result = await controller.uploadFile(mockFile, dto);

      expect(result).toEqual(mockResponse);
      expect(mockService.uploadFile).toHaveBeenCalledWith(mockFile, 'profile');
    });
  });
});
