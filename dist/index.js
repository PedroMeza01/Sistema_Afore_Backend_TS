"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const server_1 = __importDefault(require("./server"));
const port = Number(process.env.PORT ?? 4000); // <- number
const host = process.env.HOST ?? '0.0.0.0';
server_1.default.listen(port, host, () => {
    console.log(colors_1.default.cyan.bold(`REST API en el puerto ${port}`));
});
//# sourceMappingURL=index.js.map