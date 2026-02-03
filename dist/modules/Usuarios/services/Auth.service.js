"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_1 = require("../../../utils/jwt");
const AuthRepository_1 = require("../repositories/AuthRepository");
const hashPassword_1 = require("../../../utils/hashPassword");
exports.AuthService = {
    createEmpleado: async (data) => {
        const contrasenaHash = await (0, hashPassword_1.hashPassword)(data.password);
        //console.log(contrasenaHash);
        data.password = await (0, hashPassword_1.hashPassword)(data.password);
        return await AuthRepository_1.AuthRepository.crearUsuario(data);
    },
    iniciarSesion: async (data) => {
        const { username, password } = data;
        //console.log('INICIAR SESION SERRVICE', data);
        const usuario = await AuthRepository_1.AuthRepository.usuarioPorUser(username);
        if (!usuario)
            throw new Error('Usuario no encontrado');
        const rol = usuario.rol_usuario;
        //console.log(usuario);
        const passwordCorrecta = await (0, hashPassword_1.checkPassword)(password, usuario.password_hash);
        if (!passwordCorrecta)
            throw new Error('Contraseña incorrecta.');
        //console.log('PASSWORDCORRECTA', passwordCorrecta);
        const token = (0, jwt_1.generateToken)(usuario.id_usuario, username, usuario.id_organizacion);
        return { token, rol };
    },
    getAll: async () => {
        return await AuthRepository_1.AuthRepository.getAll();
    }
    /*cambiarContra: async (data: ICambiarContrasena) => {
      const usuario = await UsuarioRepository.usuarioPorUser(data.usuarioweb);
      if (!usuario) throw new Error('Usuario no encontrado');
  
      const hashedNewPassword = await hashPassword(data.contrawebNueva);
  
      //ACTUALIZAR CONTRASEÑA
      const actualizarContraseña = await AuthRepository.actualizarContra(data.usuarioweb, hashedNewPassword);
  
      return actualizarContraseña;
      //const actualizacionUsuario = await AuthRepository.actualizarContra()
    },
  
    user: async (token: string) => {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded)
      if (typeof decoded === 'object' && decoded.id_user) {
        const user = await UsuarioRepository.findByID(decoded.id_user);
        return user;
      }
    }*/
};
//# sourceMappingURL=Auth.service.js.map