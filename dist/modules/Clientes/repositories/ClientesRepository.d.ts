import Clientes from '../model/Clientes';
import { ICreateClienteDTO, IUpdateClienteDTO } from '../interface/Clientes.interface';
import { Transaction } from 'sequelize';
export declare const ClientesRepository: {
    borrarCliente: (input: {
        id_cliente: string;
        transaction: Transaction;
    }) => Promise<number>;
    getAllPaginated: ({ page, limit, search }: {
        page: any;
        limit: any;
        search: any;
    }) => Promise<{
        items: Clientes[];
        meta: {
            page: any;
            limit: any;
            totalItems: number;
            totalPages: number;
            search: any;
        };
    }>;
    getById: (id_cliente: string) => Promise<Clientes>;
    create: (data: ICreateClienteDTO) => Promise<Clientes>;
    update: (id_cliente: string, data: IUpdateClienteDTO) => Promise<Clientes>;
    toggleActivo: (id_cliente: string) => Promise<Clientes>;
};
