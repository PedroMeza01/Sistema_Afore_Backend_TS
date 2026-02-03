"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const generalLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 400, // Limit each IP to 400 requests per windowMs
    message: 'Demasiados solicitudes, por favor intente de nuevo más tarde.'
});
exports.generalLimiter = generalLimiter;
const authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 3 * 60 * 1000,
    max: 5,
    message: 'Demasiados intentos de inicio de sesion. Por favor intente de nuevo más tarde.'
});
exports.authLimiter = authLimiter;
//# sourceMappingURL=limiter.js.map