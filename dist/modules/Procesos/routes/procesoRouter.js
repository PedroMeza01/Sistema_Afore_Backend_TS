"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/Proceso/routes/proceso.routes.ts
const express_1 = require("express");
const ProcesoController_1 = require("../controllers/ProcesoController");
const uploadProcesoArchivo_1 = require("../../../middleware/uploadProcesoArchivo");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
// base: /api/procesos
// ====== LISTADOS ESPECÍFICOS (VAN PRIMERO) ======
router.get('/cliente/:id_cliente', auth_1.authMiddleware, ProcesoController_1.ProcesoController.listByCliente);
router.delete('/finalizar/:id_cliente/:id_proceso', auth_1.authMiddleware, ProcesoController_1.ProcesoController.finalizarProceso);
// ====== ARCHIVOS ======
router.post('/:id_proceso/archivos', auth_1.authMiddleware, uploadProcesoArchivo_1.uploadProcesoArchivo.single('file'), ProcesoController_1.ProcesoController.uploadArchivo);
router.get('/:id_proceso/archivos', auth_1.authMiddleware, ProcesoController_1.ProcesoController.listArchivos);
router.put('/archivos/:id_proceso_archivo', auth_1.authMiddleware, uploadProcesoArchivo_1.uploadProcesoArchivo.single('file'), ProcesoController_1.ProcesoController.replaceArchivo);
// ====== CRUD PRINCIPAL ======
router.post('/', auth_1.authMiddleware, ProcesoController_1.ProcesoController.create);
router.get('/', auth_1.authMiddleware, ProcesoController_1.ProcesoController.list);
// ojo: estas rutas “comodín” VAN AL FINAL
router.get('/:id_proceso', auth_1.authMiddleware, ProcesoController_1.ProcesoController.getById);
router.patch('/:id_proceso', auth_1.authMiddleware, ProcesoController_1.ProcesoController.update);
exports.default = router;
//# sourceMappingURL=procesoRouter.js.map