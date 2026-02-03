import { Model } from 'sequelize-typescript';
import Proceso from './Proceso';
export type StorageProvider = 'SUPABASE' | 'LOCAL' | 'S3' | 'GCS';
export default class ProcesoArchivo extends Model {
    id_proceso_archivo: string;
    id_proceso: string;
    proceso?: Proceso;
    categoria: string;
    nombre_original: string;
    mime_type: string;
    tamano_bytes: number;
    storage_provider: StorageProvider;
    storage_bucket: string;
    storage_path: string;
    public_url: string | null;
    activo: boolean;
}
