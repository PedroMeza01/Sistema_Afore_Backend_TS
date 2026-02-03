import { ICreateClienteDTO, IUpdateClienteDTO } from '../interface/Clientes.interface';
export declare const ClientesServices: {
    getAllPaginated: ({ page, limit, search }: {
        page: any;
        limit: any;
        search: any;
    }) => Promise<{
        items: import("../model/Clientes").default[];
        meta: {
            page: any;
            limit: any;
            totalItems: number;
            totalPages: number;
            search: any;
        };
    }>;
    getById: (id_cliente: string) => Promise<import("../model/Clientes").default>;
    create: (data: ICreateClienteDTO, id_organizacion: string) => Promise<import("../model/Clientes").default>;
    update: (id_cliente: string, data: IUpdateClienteDTO) => Promise<import("../model/Clientes").default>;
    toggleActivo: (id_cliente: string) => Promise<import("../model/Clientes").default>;
};
