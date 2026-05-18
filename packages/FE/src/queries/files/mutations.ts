import { Api } from '@/lib/api';
import { useApiMutation } from '@/middleware/api';

import { UploadFileParams, UploadFileResponse } from './types';

export const useUploadFile = () => {
  const uploadFile = async (params: UploadFileParams) => {
    const api = new Api();
    const response = await api.uploadFile<UploadFileResponse>(
      'files/upload',
      params.file,
      params.category,
    );

    return response;
  };

  return useApiMutation('', uploadFile);
};