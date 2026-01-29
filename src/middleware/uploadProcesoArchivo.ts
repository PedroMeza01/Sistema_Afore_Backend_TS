import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'procesos');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeBase = (path.basename(file.originalname || 'archivo', ext) || 'archivo')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 60);
    const uniq = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase}_${uniq}${ext}`);
  }
});

function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // deja abierto; si quieres, limita a pdf/jpg/png:
  // const ok = ['application/pdf','image/jpeg','image/png'].includes(file.mimetype);
  // return cb(ok ? null : new Error('Tipo de archivo no permitido'), ok);
  cb(null, true);
}

export const uploadProcesoArchivo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});
