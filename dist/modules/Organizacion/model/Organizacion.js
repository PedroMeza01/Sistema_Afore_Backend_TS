"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Clientes_1 = __importDefault(require("../../Clientes/model/Clientes"));
const Asesor_1 = __importDefault(require("../../Asesores/model/Asesor"));
const Usuarios_1 = __importDefault(require("../../Usuarios/model/Usuarios"));
let Organizacion = class Organizacion extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Organizacion.prototype, "id_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(150)),
    __metadata("design:type", String)
], Organizacion.prototype, "nombre_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200)),
    __metadata("design:type", String)
], Organizacion.prototype, "razon_social_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Organizacion.prototype, "estatus_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(13)),
    __metadata("design:type", String)
], Organizacion.prototype, "rfc_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Organizacion.prototype, "regimen_fisca_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Organizacion.prototype, "uso_cfdi_default_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(5)),
    __metadata("design:type", String)
], Organizacion.prototype, "codigo_postal_fiscal_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(150)),
    __metadata("design:type", String)
], Organizacion.prototype, "email_contacto_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(30)),
    __metadata("design:type", String)
], Organizacion.prototype, "telefono_contacto_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(60)),
    __metadata("design:type", String)
], Organizacion.prototype, "direccion_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Organizacion.prototype, "logo_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('MXN'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.CHAR(3)),
    __metadata("design:type", String)
], Organizacion.prototype, "moneda_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Usuarios_1.default),
    __metadata("design:type", Array)
], Organizacion.prototype, "usuarios", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Asesor_1.default),
    __metadata("design:type", Array)
], Organizacion.prototype, "asesores", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Clientes_1.default),
    __metadata("design:type", Array)
], Organizacion.prototype, "clientes", void 0);
Organizacion = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'organizacion',
        timestamps: true
    })
], Organizacion);
exports.default = Organizacion;
//# sourceMappingURL=Organizacion.js.map