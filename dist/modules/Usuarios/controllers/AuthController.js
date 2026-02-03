"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
//import { ICambiarContrasena } from '../../interface/Usuarios/Auth.interface';
const Auth_service_1 = require("../services/Auth.service");
class AuthController {
    static getAll = async (req, res) => {
        try {
            const usuarios = await Auth_service_1.AuthService.getAll();
            res.status(201).json({
                mensaje: 'Usuario creado exitosamente',
                usuario: usuarios
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: error.message });
        }
    };
    static createUsuario = async (req, res) => {
        try {
            const usuario = await Auth_service_1.AuthService.createEmpleado(req.body);
            res.status(201).json({
                mensaje: 'Usuario creado exitosamente',
                usuario: usuario
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: error.message });
        }
    };
    static iniciarSesion = async (req, res) => {
        try {
            //console.log(req.body);
            const loginUser = await Auth_service_1.AuthService.iniciarSesion(req.body);
            res.status(201).json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: loginUser.token,
                rol: loginUser.rol
            });
        }
        catch (error) {
            console.error(error);
            res.status(401).json({
                mensaje: error.message || 'Error al iniciar sesión'
            });
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map