import { supabase } from '../../../config/supaBaseAdmin';
import { ICreateProcesoDTO, IUpdateProcesoDTO, IUploadProcesoArchivoDTO } from '../interface/Proceso.interface';
import { ProcesoRepository } from '../repositories/ProcesoRepository';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import archiver from 'archiver';
import { PassThrough } from 'stream';
import { dbLocal } from '../../../config/db';
import { Transaction } from 'sequelize';
const DEFAULT_BUCKET = process.env.SUPABASE_BUCKET_PROCESOS || 'procesos';

function sanitizeFileName(name: string) {
  return name.replace(/[^\w.\-]+/g, '_');
}

async function safeUnlink(p?: string | null) {
  if (!p) return;
  try {
    await fs.unlink(p);
  } catch {}
}
function getExt(original: string) {
  const clean = (original || 'archivo').trim();
  const last = clean.split('.').pop();
  if (!last || last === clean) return 'bin';
  return last.toLowerCase();
}

function sanitizeBaseName(original: string) {
  const clean = (original || 'archivo').trim();
  const parts = clean.split('.');
  if (parts.length > 1) parts.pop();
  const base = parts.join('.') || 'archivo';
  return base.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 60);
}

type FinalizarInput = {
  id_cliente: string;
  id_proceso: string;
  id_organizacion: string;
};
export const ProcesoService = {
  calcBono(data: { tipo_firma?: string; encuesta_aplicada?: boolean }) {
    const base = data.tipo_firma === 'ASESOR' ? 700 : 0;
    const extra = data.encuesta_aplicada ? 100 : 0;
    return (base + extra).toFixed(2);
  },
  finalizarProcesoEnviarCorreoYBorrarTodo: async (input: FinalizarInput) => {
    const { id_cliente, id_proceso, id_organizacion } = input;

    // 1) Snapshot
    const snapshot = await ProcesoRepository.getSnapshotParaCierre({ id_cliente, id_proceso, id_organizacion });
    if (!snapshot) throw new Error('Proceso/cliente no encontrado');
    console.log(snapshot);
    // 2) Enviar correo (si falla, NO borres)
    /* await Mailer.send({
      to,
      subject: `Proceso finalizado: ${snapshot.cliente?.nombre ?? ''} (${id_proceso})`,
      html: buildHtml(snapshot)
    });

    // 3) Una sola transacción para DB
    const t = await dbLocal.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    });

    try {
      // 3.1) Borrar Storage (si esto falla, hacemos rollback de DB)
      await removeSupabaseFiles(snapshot.documentos);

      // 3.2) Borrar DB (pasando t)
      await ProcesoRepository.borrarDocumentosProceso({ id_proceso, transaction: t });
      await ProcesoRepository.borrarProceso({ id_proceso, transaction: t });
      await ProcesoRepository.borrarCliente({ id_cliente, transaction: t });

      await t.commit();

      return {
        id_cliente,
        id_proceso,
        emailedTo: to,
        deletedDocs: snapshot.documentos.length
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }*/
  },

  replaceArchivoSupabase: async (input: {
    id_proceso_archivo: string;
    categoria: string | null;
    file: Express.Multer.File; // ← trae buffer
  }) => {
    const { id_proceso_archivo, categoria, file } = input;

    const current = await ProcesoRepository.findArchivoById({ id_proceso_archivo });
    if (!current) throw new Error('Archivo no encontrado');

    if (!file.buffer) {
      throw new Error('Archivo sin buffer. Revisa multer.memoryStorage()');
    }

    const bucket = current.storage_bucket || DEFAULT_BUCKET;

    const original = file.originalname || 'archivo';
    const ext = getExt(original);
    const safeBase = sanitizeBaseName(original);
    const uuid = crypto.randomUUID();

    // Recomendación: mantén el mismo esquema de carpetas que usas al crear
    // Si tienes org en current o input, úsalo. Si no, no lo pongas.
    // Puedes usar current.id_proceso para agrupar
    const procesoPart = current.id_proceso ? `procesos/${current.id_proceso}/` : 'procesos/';

    const newStoragePath = `${procesoPart}${safeBase}_${uuid}.${ext}`;

    // 1) Subir nuevo archivo
    const { data, error } = await supabase.storage.from(bucket).upload(newStoragePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

    if (error) throw new Error(error.message);
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    const publicUrl = publicData.publicUrl;
    // 2) Actualizar DB
    const updated = await ProcesoRepository.updateArchivo({
      id_proceso_archivo,

      categoria: categoria ?? current.categoria,

      nombre_original: original,
      mime_type: file.mimetype,
      tamano_bytes: file.size,

      storage_provider: 'SUPABASE',
      storage_bucket: bucket,
      storage_path: data?.path ?? newStoragePath,
      public_url: publicUrl, // o genera publicUrl si el bucket es público

      activo: true
    });

    // 3) Borrar el anterior si era supabase y path cambió (recomendado)
    if (current.storage_provider === 'SUPABASE' && current.storage_path && current.storage_path !== newStoragePath) {
      const { error: delErr } = await supabase.storage.from(bucket).remove([current.storage_path]);
      // NO detengas el flujo por un delete; solo log
      if (delErr) console.log('WARN: no se pudo borrar anterior:', delErr.message);
    }

    // 4) Si era LOCAL, opcional borrar archivo local anterior (si aún lo usabas antes)
    // if (current.storage_provider === "LOCAL" && current.storage_path) await safeUnlink(current.storage_path);

    return updated;
  },
  create: async (data: ICreateProcesoDTO, id_organizacion: string) => {
    // ✅ OJO: referenciar con el objeto
    const bono = ProcesoService.calcBono({ tipo_firma: data.tipo_firma, encuesta_aplicada: data.encuesta_aplicada });

    const payload: ICreateProcesoDTO = {
      ...data,
      bono_asesora: data.bono_asesora ?? bono
    };

    return await ProcesoRepository.create(payload, id_organizacion);
  },

  getById: async (id_proceso: string) => {
    return await ProcesoRepository.findById(id_proceso);
  },

  update: async (id_proceso: string, data: IUpdateProcesoDTO) => {
    const shouldRecalc =
      (data.tipo_firma !== undefined || data.encuesta_aplicada !== undefined) && data.bono_asesora === undefined;

    const patch: IUpdateProcesoDTO = { ...data };

    if (shouldRecalc) {
      patch.bono_asesora = ProcesoService.calcBono({
        tipo_firma: data.tipo_firma,
        encuesta_aplicada: data.encuesta_aplicada
      });
    }

    if (patch.listo_para_cobro) {
      if (!patch.fecha_cobro) throw new Error('fecha_cobro requerida');
      if (!patch.tipo_cobro) throw new Error('tipo_cobro requerido');
      if (!patch.monto_cobrar) throw new Error('monto_cobrar requerido');
    }

    return await ProcesoRepository.update(id_proceso, patch);
  },

  listByCliente: async (id_cliente: string) => {
    return await ProcesoRepository.listByCliente(id_cliente);
  },

  uploadArchivo: async (dto: IUploadProcesoArchivoDTO, file: Express.Multer.File) => {
    const proceso = await ProcesoRepository.findById(dto.id_proceso);
    if (!proceso) throw new Error('Proceso no existe');

    if (!file.buffer) {
      throw new Error('Archivo inválido (sin buffer)');
    }

    const bucket = process.env.SUPABASE_BUCKET_PROCESOS;

    const ext = path.extname(file.originalname || '');
    const base = sanitizeFileName(path.basename(file.originalname || 'archivo', ext));

    const uuid = crypto.randomUUID();

    const storagePath = `procesos/${dto.id_proceso}/${uuid}-${base}${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
      cacheControl: '3600'
    });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

    return await ProcesoRepository.createArchivo({
      id_proceso: dto.id_proceso,
      categoria: dto.categoria,
      nombre_original: file.originalname,
      mime_type: file.mimetype,
      tamano_bytes: file.size,
      storage_provider: 'SUPABASE',
      storage_bucket: bucket,
      storage_path: storagePath,
      public_url: data?.publicUrl ?? null,
      activo: true
    });
  },

  listArchivos: async (id_proceso: string) => {
    return ProcesoRepository.listArchivos(id_proceso);
  }
};

//HERPERS

/** Helpers */

function totalBytes(files: { buffer: Buffer }[]) {
  return files.reduce((acc, f) => acc + f.buffer.length, 0);
}

function buildHtml(snapshot: any) {
  const { cliente, proceso, documentos } = snapshot;

  // pon aquí TODOS tus campos relevantes
  return `
    <h2>Proceso finalizado</h2>
    <h3>Cliente</h3>
    <ul>
      <li><b>Nombre:</b> ${escapeHtml(cliente?.nombre ?? '')}</li>
      <li><b>ID Cliente:</b> ${escapeHtml(cliente?.id_cliente ?? '')}</li>
      <li><b>CURP:</b> ${escapeHtml(cliente?.curp ?? '')}</li>
      <li><b>Teléfono:</b> ${escapeHtml(cliente?.telefono ?? '')}</li>
      <li><b>Email:</b> ${escapeHtml(cliente?.email ?? '')}</li>
    </ul>

    <h3>Proceso</h3>
    <ul>
      <li><b>ID Proceso:</b> ${escapeHtml(proceso?.id_proceso ?? '')}</li>
      <li><b>Tipo:</b> ${escapeHtml(proceso?.tipo ?? '')}</li>
      <li><b>Estado:</b> ${escapeHtml(proceso?.estado ?? '')}</li>
      <li><b>Creado:</b> ${escapeHtml(String(proceso?.createdAt ?? ''))}</li>
      <li><b>Finalizado:</b> ${new Date().toISOString()}</li>
    </ul>

    <h3>Documentos (${documentos?.length ?? 0})</h3>
    <ul>
      ${(documentos ?? []).map((d: any) => `<li>${escapeHtml(d.nombre ?? d.storage_path ?? '')}</li>`).join('')}
    </ul>

    <p>Adjuntos incluidos en este correo.</p>
  `;
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

type DocRow = {
  id_documento: string;
  nombre?: string | null;
  storage_bucket: string;
  storage_path: string;
  mime?: string | null;
};

async function downloadSupabaseFiles(documentos: DocRow[]) {
  const out: { filename: string; buffer: Buffer; contentType: string }[] = [];

  for (const d of documentos) {
    const bucket = d.storage_bucket;
    const path = d.storage_path;

    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) throw new Error(`No se pudo descargar archivo ${path}: ${error.message}`);

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    out.push({
      filename: sanitizeFilename(d.nombre ?? path.split('/').pop() ?? 'archivo'),
      buffer,
      contentType: d.mime ?? 'application/octet-stream'
    });
  }

  return out;
}

async function removeSupabaseFiles(documentos: DocRow[]) {
  // agrupar por bucket para evitar llamadas innecesarias
  const byBucket = documentos.reduce<Record<string, string[]>>((acc, d) => {
    acc[d.storage_bucket] ??= [];
    acc[d.storage_bucket].push(d.storage_path);
    return acc;
  }, {});

  for (const bucket of Object.keys(byBucket)) {
    const paths = byBucket[bucket];

    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw new Error(`No se pudo borrar archivos en storage bucket=${bucket}: ${error.message}`);
  }
}

function sanitizeFilename(name: string) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').slice(0, 150);
}

async function zipBuffers(files: { filename: string; buffer: Buffer }[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = new PassThrough();
    const chunks: Buffer[] = [];

    stream.on('data', c => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);

    archive.on('error', reject);
    archive.pipe(stream);

    for (const f of files) archive.append(f.buffer, { name: f.filename });
    archive.finalize();
  });
}
