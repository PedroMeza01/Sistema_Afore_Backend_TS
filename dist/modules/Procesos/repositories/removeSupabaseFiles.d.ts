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
export declare function removeSupabaseFiles(archivos: ArchivoLike[]): Promise<{
    deleted: number;
    buckets: string[];
}>;
