"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcesoService = void 0;
exports.buildHtml = buildHtml;
const supaBaseAdmin_1 = require("../../../config/supaBaseAdmin");
const ProcesoRepository_1 = require("../repositories/ProcesoRepository");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../../../config/db");
const sequelize_1 = require("sequelize");
const Mailer_1 = require("./Mailer");
const removeSupabaseFiles_1 = require("../repositories/removeSupabaseFiles");
const ClientesRepository_1 = require("../../Clientes/repositories/ClientesRepository");
const DashboardProcesosRepository_1 = require("../../DashbordProcesos/repositories/DashboardProcesosRepository");
const DEFAULT_BUCKET = process.env.SUPABASE_BUCKET_PROCESOS || 'procesos';
function sanitizeFileName(name) {
    return name.replace(/[^\w.\-]+/g, '_');
}
function getExt(original) {
    const clean = (original || 'archivo').trim();
    const last = clean.split('.').pop();
    if (!last || last === clean)
        return 'bin';
    return last.toLowerCase();
}
function sanitizeBaseName(original) {
    const clean = (original || 'archivo').trim();
    const parts = clean.split('.');
    if (parts.length > 1)
        parts.pop();
    const base = parts.join('.') || 'archivo';
    return base.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 60);
}
exports.ProcesoService = {
    list: async (input) => {
        const today = new Date().toISOString().slice(0, 10);
        return await DashboardProcesosRepository_1.DashboardProcesosRepository.listPaginated({
            id_organizacion: input.id_organizacion,
            page: input.page,
            limit: input.limit,
            search: input.search,
            f: input.f,
            today
        });
    },
    calcBono(data) {
        const base = data.tipo_firma === 'ASESOR' ? 700 : 0;
        const extra = data.encuesta_aplicada ? 100 : 0;
        return (base + extra).toFixed(2);
    },
    finalizarProcesoEnviarCorreoYBorrarTodo: async (input) => {
        const { id_cliente, id_proceso, id_organizacion } = input;
        // 1) Snapshot
        const snapshot = await ProcesoRepository_1.ProcesoRepository.getSnapshotParaCierre({ id_cliente, id_proceso, id_organizacion });
        if (!snapshot)
            throw new Error('Proceso/cliente no encontrado');
        //console.log(snapshot.proceso.dataValues.organizacion.email_contacto_organizacion);
        const to = snapshot.proceso.dataValues.organizacion.email_contacto_organizacion;
        const proc = snapshot.proceso.toJSON();
        if (!to)
            throw new Error(`Organización sin email_contacto_organizacion. id_organizacion=${proc.id_organizacion}`);
        await Mailer_1.Mailer.send({
            to: proc.organizacion.email_contacto_organizacion,
            subject: `Proceso finalizado: ${proc.cliente?.nombre_cliente ?? ''} (${proc.id_proceso})`,
            html: buildHtml(proc)
        });
        // 3) Una sola transacción para DB
        const t = await db_1.dbLocal.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        });
        const archivos = snapshot.archivos;
        try {
            await ProcesoRepository_1.ProcesoRepository.deleteArchivosByProceso({ id_proceso, transaction: t });
            await ProcesoRepository_1.ProcesoRepository.deleteProceso({ id_proceso, transaction: t });
            await ClientesRepository_1.ClientesRepository.borrarCliente({ id_cliente, transaction: t });
            // 3.1) Borrar Storage (si esto falla, hacemos rollback de DB)
            //await removeSupabaseFiles(snapshot.archivos);
            // 3.2) Borrar DB (pasando t)
            //await ProcesoRepository.borrarDocumentosProceso({ id_proceso, transaction: t });
            //await ProcesoRepository.borrarProceso({ id_proceso, transaction: t });
            //await ProcesoRepository.borrarCliente({ id_cliente, transaction: t });
            await t.commit();
        }
        catch (err) {
            await t.rollback();
            throw err;
        }
        try {
            await (0, removeSupabaseFiles_1.removeSupabaseFiles)(archivos);
        }
        catch (error) {
            throw new Error('No se pudo borrar');
        }
        return {
            id_cliente,
            id_proceso,
            emailedTo: to,
            deletedDb: true,
            storageDeleted: true
        };
    },
    replaceArchivoSupabase: async (input) => {
        const { id_proceso_archivo, categoria, file } = input;
        const current = await ProcesoRepository_1.ProcesoRepository.findArchivoById({ id_proceso_archivo });
        if (!current)
            throw new Error('Archivo no encontrado');
        if (!file.buffer) {
            throw new Error('Archivo sin buffer. Revisa multer.memoryStorage()');
        }
        const bucket = current.storage_bucket || DEFAULT_BUCKET;
        const original = file.originalname || 'archivo';
        const ext = getExt(original);
        const safeBase = sanitizeBaseName(original);
        const uuid = crypto_1.default.randomUUID();
        // Recomendación: mantén el mismo esquema de carpetas que usas al crear
        // Si tienes org en current o input, úsalo. Si no, no lo pongas.
        // Puedes usar current.id_proceso para agrupar
        const procesoPart = current.id_proceso ? `procesos/${current.id_proceso}/` : 'procesos/';
        const newStoragePath = `${procesoPart}${safeBase}_${uuid}.${ext}`;
        // 1) Subir nuevo archivo
        const { data, error } = await supaBaseAdmin_1.supabase.storage.from(bucket).upload(newStoragePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });
        if (error)
            throw new Error(error.message);
        const { data: publicData } = supaBaseAdmin_1.supabase.storage.from(bucket).getPublicUrl(data.path);
        const publicUrl = publicData.publicUrl;
        // 2) Actualizar DB
        const updated = await ProcesoRepository_1.ProcesoRepository.updateArchivo({
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
            const { error: delErr } = await supaBaseAdmin_1.supabase.storage.from(bucket).remove([current.storage_path]);
            // NO detengas el flujo por un delete; solo log
            if (delErr)
                console.log('WARN: no se pudo borrar anterior:', delErr.message);
        }
        // 4) Si era LOCAL, opcional borrar archivo local anterior (si aún lo usabas antes)
        // if (current.storage_provider === "LOCAL" && current.storage_path) await safeUnlink(current.storage_path);
        return updated;
    },
    create: async (data, id_organizacion) => {
        // ✅ OJO: referenciar con el objeto
        const bono = exports.ProcesoService.calcBono({ tipo_firma: data.tipo_firma, encuesta_aplicada: data.encuesta_aplicada });
        const payload = {
            ...data,
            bono_asesora: data.bono_asesora ?? bono
        };
        return await ProcesoRepository_1.ProcesoRepository.create(payload, id_organizacion);
    },
    getById: async (id_proceso) => {
        return await ProcesoRepository_1.ProcesoRepository.findById(id_proceso);
    },
    update: async (id_proceso, data) => {
        const shouldRecalc = (data.tipo_firma !== undefined || data.encuesta_aplicada !== undefined) && data.bono_asesora === undefined;
        const patch = { ...data };
        if (shouldRecalc) {
            patch.bono_asesora = exports.ProcesoService.calcBono({
                tipo_firma: data.tipo_firma,
                encuesta_aplicada: data.encuesta_aplicada
            });
        }
        if (patch.listo_para_cobro) {
            if (!patch.fecha_cobro)
                throw new Error('fecha_cobro requerida');
            if (!patch.tipo_cobro)
                throw new Error('tipo_cobro requerido');
            if (!patch.monto_cobrar)
                throw new Error('monto_cobrar requerido');
        }
        return await ProcesoRepository_1.ProcesoRepository.update(id_proceso, patch);
    },
    listByCliente: async (id_cliente) => {
        return await ProcesoRepository_1.ProcesoRepository.listByCliente(id_cliente);
    },
    uploadArchivo: async (dto, file) => {
        const proceso = await ProcesoRepository_1.ProcesoRepository.findById(dto.id_proceso);
        if (!proceso)
            throw new Error('Proceso no existe');
        if (!file.buffer) {
            throw new Error('Archivo inválido (sin buffer)');
        }
        const bucket = process.env.SUPABASE_BUCKET_PROCESOS;
        const ext = path_1.default.extname(file.originalname || '');
        const base = sanitizeFileName(path_1.default.basename(file.originalname || 'archivo', ext));
        const uuid = crypto_1.default.randomUUID();
        const storagePath = `procesos/${dto.id_proceso}/${uuid}-${base}${ext}`;
        const { error } = await supaBaseAdmin_1.supabase.storage.from(bucket).upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
            cacheControl: '3600'
        });
        if (error) {
            throw new Error(`Supabase upload error: ${error.message}`);
        }
        const { data } = supaBaseAdmin_1.supabase.storage.from(bucket).getPublicUrl(storagePath);
        return await ProcesoRepository_1.ProcesoRepository.createArchivo({
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
    listArchivos: async (id_proceso) => {
        return ProcesoRepository_1.ProcesoRepository.listArchivos(id_proceso);
    }
};
//HERPERS
/** Helpers */
function escapeHtml(input) {
    const s = String(input ?? '');
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function formatValue(v) {
    if (v === null || v === undefined)
        return '';
    if (v instanceof Date)
        return v.toISOString();
    if (typeof v === 'string')
        return v;
    if (typeof v === 'number' || typeof v === 'boolean')
        return String(v);
    return JSON.stringify(v);
}
function flatten(obj, prefix = '') {
    const out = [];
    if (obj === null || obj === undefined)
        return out;
    // evita arrays/objects raros
    if (typeof obj !== 'object') {
        out.push({ key: prefix || 'value', value: obj });
        return out;
    }
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !(v instanceof Date) && !Array.isArray(v)) {
            out.push(...flatten(v, key));
        }
        else if (Array.isArray(v)) {
            // arrays: imprime tamaño y cada índice si quieres
            out.push({ key: `${key}.length`, value: v.length });
            v.forEach((item, i) => {
                if (item && typeof item === 'object')
                    out.push(...flatten(item, `${key}[${i}]`));
                else
                    out.push({ key: `${key}[${i}]`, value: item });
            });
        }
        else {
            out.push({ key, value: v });
        }
    }
    return out;
}
function buildHtml(proc) {
    const rows = flatten(proc)
        .map(({ key, value }) => {
        return `
        <tr>
          <td style="padding:6px 8px;border:1px solid #ddd;white-space:nowrap;"><b>${escapeHtml(key)}</b></td>
          <td style="padding:6px 8px;border:1px solid #ddd;">${escapeHtml(formatValue(value))}</td>
        </tr>
      `;
    })
        .join('');
    const cliente = proc?.cliente ?? {};
    const organizacion = proc?.organizacion ?? {};
    const asesor = proc?.asesor ?? {};
    const afore = proc?.afore ?? {};
    return `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color:#111;">
    <h2 style="margin:0 0 12px;">Proceso finalizado</h2>

    <p style="margin:0 0 16px;">
      <b>Estatus:</b> ${escapeHtml(proc?.estatus_proceso)}<br/>
      <b>Creado:</b> ${escapeHtml(new Date().toISOString())}
    </p>

    <h3 style="margin:16px 0 8px;">Resumen</h3>
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;margin-bottom:12px;">
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd;"><b>Cliente</b></td>
        <td style="padding:6px 8px;border:1px solid #ddd;">
          ${escapeHtml(`${cliente.nombre_cliente ?? ''} ${cliente.apellido_pat_cliente ?? ''} ${cliente.apellido_mat_cliente ?? ''}`.trim())}
          <br/>${escapeHtml(cliente.email_cliente ?? '')}
          <br/>${escapeHtml(cliente.telefono_cliente ?? '')}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd;"><b>Organización</b></td>
        <td style="padding:6px 8px;border:1px solid #ddd;">
          ${escapeHtml(organizacion.nombre_organizacion ?? '')}
          <br/>${escapeHtml(organizacion.email_contacto_organizacion ?? '')}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd;"><b>Asesor</b></td>
        <td style="padding:6px 8px;border:1px solid #ddd;">
          ${escapeHtml(`${asesor.nombre_asesor ?? ''} ${asesor.apellido_pat_asesor ?? ''} ${asesor.apellido_mat_asesor ?? ''}`.trim())}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd;"><b>Afore</b></td>
        <td style="padding:6px 8px;border:1px solid #ddd;">
          ${escapeHtml(afore.nombre_afore ?? '')}
        </td>
      </tr>
    </table>

    <h3 style="margin:16px 0 8px;">Detalle completo (todas las llaves)</h3>
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
      <thead>
        <tr>
          <th align="left" style="padding:6px 8px;border:1px solid #ddd;background:#f5f5f5;">Campo</th>
          <th align="left" style="padding:6px 8px;border:1px solid #ddd;background:#f5f5f5;">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
  `;
}
//# sourceMappingURL=Proceso.service.js.map