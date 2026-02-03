"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
router.get('/', AuthController_1.AuthController.getAll);
router.post('/crearUsuario', AuthController_1.AuthController.createUsuario);
router.post('/iniciarSesion', AuthController_1.AuthController.iniciarSesion);
//router.patch('/cambiarContrasena/:usuarioweb', AuthController.cambiarContrasena);
//router.get('/user', AuthController.user);
exports.default = router;
//# sourceMappingURL=AuthRouter.js.map