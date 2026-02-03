"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/Asesores/routes/asesores.routes.ts
const express_1 = require("express");
const AsesorController_1 = require("../controllers/AsesorController");
const router = (0, express_1.Router)();
// base: /api/asesores
router.post('/', AsesorController_1.AsesorController.create);
router.get('/', AsesorController_1.AsesorController.getAll);
router.get('/:id', AsesorController_1.AsesorController.getById);
router.put('/:id', AsesorController_1.AsesorController.update);
router.patch('/:id/toggle', AsesorController_1.AsesorController.toggleActivo);
exports.default = router;
//# sourceMappingURL=asesorRouter.js.map