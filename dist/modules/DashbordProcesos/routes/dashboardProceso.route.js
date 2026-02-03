"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardProcesosController_1 = require("../controllers/DashboardProcesosController");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, DashboardProcesosController_1.DashboardController.getDashboard);
exports.default = router;
//# sourceMappingURL=dashboardProceso.route.js.map