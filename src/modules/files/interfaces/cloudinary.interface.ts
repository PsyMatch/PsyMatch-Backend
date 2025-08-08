import { UploadApiResponse } from 'cloudinary';

export interface CloudinaryInstance {
  uploader: {
    upload: (
      file: string,
      options?: {
        folder?: string;
        public_id?: string;
        overwrite?: boolean;
        [key: string]: unknown;
      },
    ) => Promise<UploadApiResponse>;
  };
  url: (
    publicId: string,
    options?: {
      fetch_format?: string;
      quality?: string;
      crop?: string;
      gravity?: string;
      width?: number;
      height?: number;
      [key: string]: unknown;
    },
  ) => string;
}
