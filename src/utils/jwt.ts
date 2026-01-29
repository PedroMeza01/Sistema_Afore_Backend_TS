import Jwt from 'jsonwebtoken';

export const generateToken = (id_user: string, username: string, id_organizacion: string) => {
  const token = Jwt.sign({ id_user, username, id_organizacion }, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });
  return token;
};
