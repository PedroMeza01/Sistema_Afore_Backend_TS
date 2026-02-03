import colors from 'colors';
import server from './server';

const port = Number(process.env.PORT ?? 4000); // <- number
const host = process.env.HOST ?? '0.0.0.0';

server.listen(port, host, () => {
  console.log(colors.cyan.bold(`REST API en el puerto ${port}`));
});
