"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const uuid_1 = require("uuid");
const Usuarios_1 = __importDefault(require("../model/Usuarios"));
const Organizacion_1 = __importDefault(require("../../Organizacion/model/Organizacion"));
exports.AuthRepository = {
    crearUsuario: async (data) => {
        //console.log(data);
        const usuarioExistente = await Usuarios_1.default.findOne({
            where: { username: data.username }
        });
        if (usuarioExistente) {
            throw new Error(`Ya existe un usuario asignado al empleado. El usuario es: ${usuarioExistente.username}`);
        }
        const nuevoUUID = (0, uuid_1.v4)();
        return await Usuarios_1.default.create({
            id_usuario: nuevoUUID,
            password_hash: data.password,
            ...data
        });
    },
    actualizarContra: async (usuarioweb, nuevaContraHasheada) => {
        const usuario = await Usuarios_1.default.findOne({ where: { username: usuarioweb } });
        if (!usuario) {
            throw new Error('Usuario no encontrado para actualizar la contraseña.');
        }
        return await Usuarios_1.default.update({ password_user: nuevaContraHasheada }, { where: { username: usuarioweb } });
    },
    getAll: async () => {
        return await Usuarios_1.default.findAll({
            attributes: ['id_usuario', 'username', 'rol_usuario'],
            include: {
                model: Organizacion_1.default,
                attributes: ['id_organizacion', 'nombre_organizacion']
            }
        });
    },
    usuarioPorUser: async (username) => {
        return await Usuarios_1.default.findOne({
            where: { username }
        });
    }
};
//# sourceMappingURL=AuthRepository.js.map