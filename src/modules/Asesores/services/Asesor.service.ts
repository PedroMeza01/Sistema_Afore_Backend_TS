// src/modules/Asesores/services/AsesorService.ts
import { Transaction } from 'sequelize';
import { ICreateAsesorDTO, IUpdateAsesorDTO } from '../interface/Asesor.interface';
import { AsesorRepository } from '../repositories/AsesorRepository';

const cleanStr = (v?: string) => (v ?? '').trim();

export class AsesorService {
  static async create(data: ICreateAsesorDTO, id_organizacion: string, tx?: Transaction) {
    if (!id_organizacion) throw new Error('id_organizacion requerido');

    const payload = {
      id_organizacion,
      nombre_asesor: cleanStr(data.nombre_asesor),
      apellido_pat_asesor: cleanStr(data.apellido_pat_asesor),
      apellido_mat_asesor: cleanStr(data.apellido_mat_asesor),
      alias: cleanStr(data.alias),
      porcentaje_comision: data.porcentaje_comision,
      observaciones: (data.observaciones ?? '').trim(),
      activo: data.activo ?? true
    };

    return AsesorRepository.create(payload, tx);
  }

  static async getAll(id_organizacion: string) {
    if (!id_organizacion) throw new Error('id_organizacion requerido');
    return AsesorRepository.findAllByOrganizacion(id_organizacion);
  }

  static async getById(id_asesor: string, id_organizacion: string) {
    const row = await AsesorRepository.findByIdScoped(id_asesor, id_organizacion);
    if (!row) throw new Error('Asesor no encontrado');
    return row;
  }

  static async updateById(id_asesor: string, id_organizacion: string, data: IUpdateAsesorDTO, tx?: Transaction) {
    const patch: any = {};
    if (data.nombre_asesor !== undefined) patch.nombre_asesor = cleanStr(data.nombre_asesor);
    if (data.apellido_pat_asesor !== undefined) patch.apellido_pat_asesor = cleanStr(data.apellido_pat_asesor);
    if (data.apellido_mat_asesor !== undefined) patch.apellido_mat_asesor = cleanStr(data.apellido_mat_asesor);
    if (data.alias !== undefined) patch.alias = cleanStr(data.alias);
    if (data.porcentaje_comision !== undefined) patch.porcentaje_comision = data.porcentaje_comision;
    if (data.observaciones !== undefined) patch.observaciones = (data.observaciones ?? '').trim();
    if (data.activo !== undefined) patch.activo = data.activo;

    const { count, row } = await AsesorRepository.updateByIdScopedReturning(id_asesor, id_organizacion, patch, tx);

    if (!count || !row) throw new Error('Asesor no encontrado');
    return row;
  }

  static async toggleActivo(id_asesor: string, id_organizacion: string, tx?: Transaction) {
    const { count, row } = await AsesorRepository.toggleActivoScopedReturning(id_asesor, id_organizacion, tx);
    if (!count || !row) throw new Error('Asesor no encontrado');
    return row;
  }
}
