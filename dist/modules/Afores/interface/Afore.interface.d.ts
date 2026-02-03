export interface ICreateAforeDTO {
    nombre_afore: string;
}
export interface IUpdateAforeDTO {
    nombre_afore?: string;
}
export interface IAforeResponseDTO {
    id_afore: string;
    nombre_afore: string;
    createdAt?: Date;
    updatedAt?: Date;
}
