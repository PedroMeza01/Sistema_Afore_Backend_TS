"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClientesController_1 = require("../controllers/ClientesController");
const router = (0, express_1.Router)();
// base: /api/clientes
router.get('/', ClientesController_1.ClientesController.getAll);
router.get('/:id', ClientesController_1.ClientesController.getById);
router.post('/', ClientesController_1.ClientesController.create);
router.put('/:id', ClientesController_1.ClientesController.update);
router.patch('/:id/toggle', ClientesController_1.ClientesController.toggleActivo);
exports.default = router;
//# sourceMappingURL=clientesRouter.js.map