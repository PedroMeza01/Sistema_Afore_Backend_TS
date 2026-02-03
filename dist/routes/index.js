"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organizacionRouter_1 = __importDefault(require("../modules/Organizacion/routes/organizacionRouter"));
const clientesRouter_1 = __importDefault(require("../modules/Clientes/routes/clientesRouter"));
const AuthRouter_1 = __importDefault(require("../modules/Usuarios/routes/AuthRouter"));
const aforeRouter_1 = __importDefault(require("../modules/Afores/routes/aforeRouter"));
const asesorRouter_1 = __importDefault(require("../modules/Asesores/routes/asesorRouter"));
const auth_1 = require("../middleware/auth");
const procesoRouter_1 = __importDefault(require("../modules/Procesos/routes/procesoRouter"));
const dashboardProceso_route_1 = __importDefault(require("../modules/DashbordProcesos/routes/dashboardProceso.route"));
const router = (0, express_1.Router)();
router.use('/organizacion', organizacionRouter_1.default);
router.use('/usuarios', AuthRouter_1.default);
router.use('/clientes', auth_1.authMiddleware, clientesRouter_1.default);
router.use('/afores', auth_1.authMiddleware, aforeRouter_1.default);
router.use('/asesores', auth_1.authMiddleware, asesorRouter_1.default);
router.use('/procesos', procesoRouter_1.default);
router.use('/dashboard', dashboardProceso_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map