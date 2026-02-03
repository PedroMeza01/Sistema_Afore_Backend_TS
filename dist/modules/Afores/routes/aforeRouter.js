"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AforesController_1 = require("../controllers/AforesController");
const router = (0, express_1.Router)();
// base: /api/afores
router.post('/', AforesController_1.AforeController.create);
router.get('/', AforesController_1.AforeController.getAll);
router.get('/:id', AforesController_1.AforeController.getById);
router.put('/:id', AforesController_1.AforeController.update);
router.patch('/:id', AforesController_1.AforeController.actualizarStatus);
exports.default = router;
//# sourceMappingURL=aforeRouter.js.map