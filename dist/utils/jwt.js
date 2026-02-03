"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id_user, username, id_organizacion) => {
    const token = jsonwebtoken_1.default.sign({ id_user, username, id_organizacion }, process.env.JWT_SECRET, {
        expiresIn: '8h'
    });
    return token;
};
exports.generateToken = generateToken;
//# sourceMappingURL=jwt.js.map