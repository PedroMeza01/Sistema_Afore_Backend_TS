"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token requerido" });
        return;
    }
    const isBearer = authHeader.startsWith("Bearer ");
    const token = isBearer ? authHeader.slice(7).trim() : authHeader.trim();
    if (!token) {
        res.status(401).json({ message: "Token requerido" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ aquí “regresas” el objeto (pero hacia el request)
        req.user = decoded;
        req.token = token;
        next();
        return;
    }
    catch (err) {
        res.status(401).json({ message: "Token inválido" });
        return;
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map