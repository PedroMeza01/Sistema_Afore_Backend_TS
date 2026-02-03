"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSupabaseFiles = removeSupabaseFiles;
const supaBaseAdmin_1 = require("../../../config/supaBaseAdmin");
function normalizeArchivo(a) {
    // Sequelize instance (ProcesoArchivo)
    if ('dataValues' in a && a.dataValues) {
        const bucket = (a.dataValues.storage_bucket ?? '').trim();
        const path = (a.dataValues.storage_path ?? '').trim();
        if (!bucket || !path)
            return null;
        return { bucket, path };
    }
    // Plain object
    const plain = a;
    const bucket = (plain.storage_bucket ?? '').trim();
    const path = (plain.storage_path ?? '').trim();
    if (!bucket || !path)
        return null;
    return { bucket, path };
}
async function removeSupabaseFiles(archivos) {
    if (!archivos?.length)
        return { deleted: 0, buckets: [] };
    const byBucket = {};
    for (const a of archivos) {
        const norm = normalizeArchivo(a);
        if (!norm)
            continue;
        (byBucket[norm.bucket] ||= []).push(norm.path);
    }
    const buckets = Object.keys(byBucket);
    let deleted = 0;
    for (const bucket of buckets) {
        const paths = Array.from(new Set(byBucket[bucket])); // sin duplicados
        const { data, error } = await supaBaseAdmin_1.supabase.storage.from(bucket).remove(paths);
        if (error) {
            throw new Error(`Supabase remove error (bucket=${bucket}): ${error.message}`);
        }
        deleted += data?.length ?? paths.length;
    }
    return { deleted, buckets };
}
//# sourceMappingURL=removeSupabaseFiles.js.map