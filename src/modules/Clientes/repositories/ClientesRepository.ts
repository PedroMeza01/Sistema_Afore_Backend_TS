import Clientes from '../model/Clientes';
import Organizacion from '../../Organizacion/model/Organizacion';
import Asesor from '../../Asesores/model/Asesor';
import { ICreateClienteDTO, IUpdateClienteDTO } from '../interface/Clientes.interface';
import { Op, Transaction, where } from 'sequelize';
export const ClientesRepository = {
  borrarCliente: async (input: { id_cliente: string; transaction: Transaction }) => {
    const { id_cliente, transaction } = input;

    const deleted = await Clientes.destroy({
      where: { id_cliente },
      transaction
    });

    if (deleted === 0) {
      throw new Error(`Cliente no encontrado o ya eliminado. id_cliente=${id_cliente}`);
    }

    return deleted;
  },
  getByNSSoCURP: async (nss?: string, curp?: string) => {
    const conditions = [];

    if (nss?.trim()) {
      conditions.push({ nss_cliente: nss.trim() });
    }

    if (curp?.trim()) {
      conditions.push({ curp_cliente: curp.trim() });
    }

    if (!conditions.length) return false;

    const cliente = await Clientes.findOne({
      where: {
        [Op.or]: conditions
      }
    });

    return !!cliente;
  },
  getAllPaginated: async ({ id_organizacion, page, limit, search, id_asesor }) => {
    const offset = (page - 1) * limit;

    const where: any = {
      id_organizacion
    };

    if (id_asesor && String(id_asesor).trim().length) {
      where.id_asesor = id_asesor;
    }
    if (search && search.trim().length) {
      const q = search.trim();

      where[Op.or] = [
        { nombre_cliente: { [Op.iLike]: `%${q}%` } },
        { apellido_pat_cliente: { [Op.iLike]: `%${q}%` } },
        { apellido_mat_cliente: { [Op.iLike]: `%${q}%` } },
        { curp_cliente: { [Op.iLike]: `%${q}%` } },
        { rfc_cliente: { [Op.iLike]: `%${q}%` } },
        { nss_cliente: { [Op.iLike]: `%${q}%` } },
        { telefono_cliente: { [Op.iLike]: `%${q}%` } },
        { email_cliente: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { rows, count } = await Clientes.findAndCountAll({
      where,
      include: [
        { model: Organizacion, required: false },
        { model: Asesor, required: false }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    // count puede venir como number o array en algunos escenarios
    const totalItems = Array.isArray(count) ? count.length : count;
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    return {
      items: rows,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        search: search ?? ''
      }
    };
  },

  getById: async (id_cliente: string) => {
    return await Clientes.findByPk(id_cliente, {
      include: [
        { model: Organizacion, required: false },
        { model: Asesor, required: false }
      ]
    });
  },

  create: async (data: ICreateClienteDTO) => {
    return await Clientes.create({
      id_organizacion: data.id_organizacion,
      id_asesor: data.id_asesor,

      nombre_cliente: data.nombre_cliente?.trim(),
      apellido_pat_cliente: data.apellido_pat_cliente?.trim(),
      apellido_mat_cliente: data.apellido_mat_cliente?.trim(),

      curp_cliente: data.curp_cliente?.trim(),
      nss_cliente: data.nss_cliente?.trim(),
      rfc_cliente: data.rfc_cliente?.trim(),

      telefono_cliente: data.telefono_cliente?.trim(),
      email_cliente: data.email_cliente?.trim(),

      observaciones: (data.observaciones ?? '').trim(),
      activo: data.activo ?? true
    });
  },

  update: async (id_cliente: string, data: IUpdateClienteDTO) => {
    const payload: any = {};

    if (data.id_asesor !== undefined) payload.id_asesor = data.id_asesor;

    if (data.nombre_cliente !== undefined) payload.nombre_cliente = data.nombre_cliente.trim();
    if (data.apellido_pat_cliente !== undefined) payload.apellido_pat_cliente = data.apellido_pat_cliente.trim();
    if (data.apellido_mat_cliente !== undefined) payload.apellido_mat_cliente = data.apellido_mat_cliente.trim();

    if (data.curp_cliente !== undefined) payload.curp_cliente = data.curp_cliente.trim();
    if (data.nss_cliente !== undefined) payload.nss_cliente = data.nss_cliente.trim();
    if (data.rfc_cliente !== undefined) payload.rfc_cliente = data.rfc_cliente.trim();

    if (data.telefono_cliente !== undefined) payload.telefono_cliente = data.telefono_cliente.trim();
    if (data.email_cliente !== undefined) payload.email_cliente = data.email_cliente.trim();

    if (data.observaciones !== undefined) payload.observaciones = (data.observaciones ?? '').trim();
    if (data.activo !== undefined) payload.activo = Boolean(data.activo);

    await Clientes.update(payload, { where: { id_cliente } });
    return await ClientesRepository.getById(id_cliente);
  },

  toggleActivo: async (id_cliente: string) => {
    const cliente = await Clientes.findByPk(id_cliente);
    if (!cliente) return null;

    cliente.activo = !Boolean(cliente.activo);
    await cliente.save();

    return await ClientesRepository.getById(id_cliente);
  }
};
