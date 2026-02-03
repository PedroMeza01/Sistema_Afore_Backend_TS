"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const DashboardProcesos_service_1 = require("../services/DashboardProcesos.service");
const getOrg = (req) => {
    // Ideal: req.user?.id_organizacion
    const orgFromToken = req.user?.id_organizacion;
    return orgFromToken ?? req.body?.id_organizacion;
};
class DashboardController {
    static getDashboard = async (req, res) => {
        try {
            const id_organizacion = getOrg(req);
            if (!id_organizacion)
                res.status(400).json({ message: 'id_organizacion requerido' });
            const data = await DashboardProcesos_service_1.DashboardService.getDashboard({ id_organizacion });
            res.json(data);
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardProcesosController.js.map