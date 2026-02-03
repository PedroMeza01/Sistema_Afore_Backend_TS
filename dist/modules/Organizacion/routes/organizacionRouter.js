"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrganizacionController_1 = require("../controllers/OrganizacionController");
const router = (0, express_1.Router)();
// base: /api/organizaciones
router.get('/', OrganizacionController_1.OrganizacionController.getAll);
router.post('/', OrganizacionController_1.OrganizacionController.create);
router.get('/:id', OrganizacionController_1.OrganizacionController.getById);
//router.put('/:id', OrganizacionController.update);
//router.patch('/:id/activar', OrganizacionController.activar);
//router.patch('/:id/desactivar', OrganizacionController.desactivar);
exports.default = router;
//# sourceMappingURL=organizacionRouter.js.map