"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round2 = exports.num = exports.isUUID = void 0;
const isUUID = (value) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
};
exports.isUUID = isUUID;
const num = (x) => (x == null ? 0 : Number(x));
exports.num = num;
const round2 = (n) => Math.round(Number(n ?? 0) * 100) / 100;
exports.round2 = round2;
//# sourceMappingURL=validaciones.js.map