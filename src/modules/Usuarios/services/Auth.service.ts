import { ICambiarContrasena, ICreateUsuario, IIniciarSesion } from '../interface/Auth.interface';
import { generateToken } from '../../../utils/jwt';
import { AuthRepository } from '../repositories/AuthRepository';
import { checkPassword, hashPassword } from '../../../utils/hashPassword';

export const AuthService = {
  createEmpleado: async (data: ICreateUsuario) => {
    const contrasenaHash = await hashPassword(data.password);
    //console.log(contrasenaHash);
    data.password = await hashPassword(data.password);
    return await AuthRepository.crearUsuario(data);
  },
  iniciarSesion: async (data: IIniciarSesion) => {
    const { username, password } = data;
    //console.log('INICIAR SESION SERRVICE', data);
    const usuario = await AuthRepository.usuarioPorUser(username);
    if (!usuario) throw new Error('Usuario no encontrado');
    const rol = usuario.rol_usuario;
    //  console.log(usuario);
    const passwordCorrecta = await checkPassword(password, usuario.password_hash);
    if (!passwordCorrecta) throw new Error('Contraseña incorrecta.');
    //console.log('PASSWORDCORRECTA', passwordCorrecta);
    const token = generateToken(usuario.id_usuario, username, usuario.id_organizacion);
    return { token, rol };
  },

  getAll: async () => {
    return await AuthRepository.getAll();
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
