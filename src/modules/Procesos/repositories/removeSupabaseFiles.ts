import { supabase } from '../../../config/supaBaseAdmin';

export type ArchivoPlain = {
  storage_bucket?: string | null;
  storage_path?: string | null;
  public_url?: string | null;
};

export type ArchivoSequelize = {
  dataValues?: {
    storage_bucket?: string | null;
    storage_path?: string | null;
    public_url?: string | null;
  };
};

export type ArchivoLike = ArchivoPlain | ArchivoSequelize;

function normalizeArchivo(a: ArchivoLike): { bucket: string; path: string } | null {
  // Sequelize instance (ProcesoArchivo)
  if ('dataValues' in a && a.dataValues) {
    const bucket = (a.dataValues.storage_bucket ?? '').trim();
    const path = (a.dataValues.storage_path ?? '').trim();
    if (!bucket || !path) return null;
    return { bucket, path };
  }

  // Plain object
  const plain = a as ArchivoPlain;
  const bucket = (plain.storage_bucket ?? '').trim();
  const path = (plain.storage_path ?? '').trim();
  if (!bucket || !path) return null;

  return { bucket, path };
}

export async function removeSupabaseFiles(archivos: ArchivoLike[],) {
  if (!archivos?.length) return { deleted: 0, buckets: [] as string[] };

  const byBucket: Record<string, string[]> = {};

  for (const a of archivos) {
    const norm = normalizeArchivo(a);
    if (!norm) continue;

    (byBucket[norm.bucket] ||= []).push(norm.path);
  }

  const buckets = Object.keys(byBucket);
  let deleted = 0;

  for (const bucket of buckets) {
    const paths = Array.from(new Set(byBucket[bucket])); // sin duplicados

    const { data, error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      throw new Error(`Supabase remove error (bucket=${bucket}): ${error.message}`);
    }

    deleted += data?.length ?? paths.length;
  }

  return { deleted, buckets };
}
