import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: '/home/wizz_dev/Desktop/cloud_storage/',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
};
