import { ICreateClienteDTO, IUpdateClienteDTO } from '../interface/Clientes.interface';
import { ClientesRepository } from '../repositories/ClientesRepository';

export const ClientesServices = {
  getAllPaginated: async ({ id_organizacion, page, limit, search, id_asesor }) => {
    return await ClientesRepository.getAllPaginated({ id_organizacion, page, limit, search, id_asesor });
  },

  getById: async (id_cliente: string) => {
    if (!id_cliente) throw new Error('id_cliente es requerido');
    const result = await ClientesRepository.getById(id_cliente);
    if (!result) throw new Error('Cliente no encontrado');
    return result;
  },

  create: async (data: ICreateClienteDTO, id_organizacion: string) => {
    data.id_organizacion = id_organizacion;

    // validaciones mínimas
    if (!data?.id_organizacion) throw new Error('id_organizacion es requerido');
    if (!data?.id_asesor) throw new Error('id_asesor es requerido');

    required(data.nombre_cliente, 'nombre_cliente');
    required(data.apellido_pat_cliente, 'apellido_pat_cliente');
    required(data.apellido_mat_cliente, 'apellido_mat_cliente');

    required(data.curp_cliente, 'curp_cliente');
    required(data.nss_cliente, 'nss_cliente');
    required(data.rfc_cliente, 'rfc_cliente');

    required(data.telefono_cliente, 'telefono_cliente');
    required(data.email_cliente, 'email_cliente');

    return await ClientesRepository.create(data);
  },

  update: async (id_cliente: string, data: IUpdateClienteDTO) => {
    if (!id_cliente) throw new Error('id_cliente es requerido');

    const existe = await ClientesRepository.getById(id_cliente);
    if (!existe) throw new Error('Cliente no encontrado');

    return await ClientesRepository.update(id_cliente, data);
  },

  toggleActivo: async (id_cliente: string) => {
    if (!id_cliente) throw new Error('id_cliente es requerido');
    const updated = await ClientesRepository.toggleActivo(id_cliente);
    if (!updated) throw new Error('Cliente no encontrado');
    return updated;
  }
};

function required(value: any, field: string) {
  if (!String(value ?? '').trim()) throw new Error(`${field} es requerido`);
}
