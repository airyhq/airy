import {HttpClientInstance} from '../../httpClient';

export const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    return await HttpClientInstance.uploadFile({file: formData});
  } catch (error) {
    return error;
  }
};
