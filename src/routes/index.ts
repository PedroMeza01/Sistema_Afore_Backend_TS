import { Router } from 'express';

import cat_Regimen_fiscalRouter from '../modules/Catalogos/routes/Cat_Regimen_FiscalRouter';
import cat_Tipo_ContratoRouter from '../modules/Catalogos/routes/Cat_Tipo_ContratoRouter';
import cat_Tipo_JornadaRouter from '../modules/Catalogos/routes/Cat_Tipo_JornadaRouter';
import cat_Periodicidad_PagoRouter from '../modules/Catalogos/routes/Cat_Periodicidad_PagoRouter';
import cat_BancoRouter from '../modules/Catalogos/routes/Cat_BancoRouter';
import cat_RiesgoPuestoRouter from '../modules/Catalogos/routes/Cat_Riesgo_Puesto';
import cat_forma_de_pagoRouter from '../modules/Catalogos/routes/Cat_Forma_De_PagoRouter';
import cat_uso_CFDIRouter from '../modules/Catalogos/routes/Cat_Uso_CFDIRouter';
import cat_metodo_pagoRouter from '../modules/Catalogos/routes/Cat_Metodo_De_PagoRouter';


const router = Router();


router.use('/cat_regimen_fiscal', cat_Regimen_fiscalRouter);
router.use('/cat_tipo_contrato', cat_Tipo_ContratoRouter);
router.use('/cat_tipo_jornada', cat_Tipo_JornadaRouter);
router.use('/cat_periodicidad_pago', cat_Periodicidad_PagoRouter);
router.use('/cat_riesgo_puesto', cat_RiesgoPuestoRouter);
router.use('/cat_bancos', cat_BancoRouter);
router.use('/cat_forma_de_pago', cat_forma_de_pagoRouter);
router.use('/cat_usoCFDI', cat_uso_CFDIRouter);
router.use('/cat_metodo_de_pago', cat_metodo_pagoRouter);

export default router;
