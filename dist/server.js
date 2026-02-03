"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const colors_1 = __importDefault(require("colors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db"); // Ambas conexiones
const routes_1 = __importDefault(require("./routes"));
require('dotenv').config({ path: '.env' });
async function connectDatabases() {
    try {
        await db_1.dbLocal.authenticate();
        console.log(colors_1.default.blue.bold('Conexión exitosa a base LOCAL'));
        console.log(colors_1.default.green.bold('Conexión exitosa a base VIEJA'));
        await db_1.dbLocal.sync({ alter: true }); // Sincroniza modelos si es necesario
        //await dbRemota.sync();   // Solo si quieres sincronizar también la remota
    }
    catch (error) {
        console.error(colors_1.default.red.bold('Error al conectar a las bases de datos:'));
        console.error(error);
        process.exit(1);
    }
}
connectDatabases(); // ⬅ Aquí las conecta ambas
const app = (0, express_1.default)();
//DEFINIR DOMINIOS QUE PUEDE RECIBIR PETICIONES
const withList = [process.env.FRONTEND_URL];
const corsOption = {
    origin: (origin, callback) => {
        const existe = withList.some(dominio => dominio === origin);
        if (existe) {
            callback(null, true);
        }
        else {
            callback(new Error('No permitido por cors'));
        }
    }
};
app.use((0, cors_1.default)(corsOption));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map