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
const ProcesoArchivo_1 = __importDefault(require("./ProcesoArchivo"));
const Organizacion_1 = __importDefault(require("../../Organizacion/model/Organizacion"));
const Clientes_1 = __importDefault(require("../../Clientes/model/Clientes"));
const Afores_1 = __importDefault(require("../../Afores/model/Afores"));
const Asesor_1 = __importDefault(require("../../Asesores/model/Asesor"));
let Proceso = class Proceso extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Proceso.prototype, "id_proceso", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Organizacion_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Proceso.prototype, "id_organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Organizacion_1.default, {
        foreignKey: 'id_organizacion',
        targetKey: 'id_organizacion',
        as: 'organizacion'
    }),
    __metadata("design:type", Organizacion_1.default)
], Proceso.prototype, "organizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Clientes_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Proceso.prototype, "id_cliente", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Clientes_1.default, {
        foreignKey: 'id_cliente',
        targetKey: 'id_cliente',
        as: 'cliente'
    }),
    __metadata("design:type", Clientes_1.default)
], Proceso.prototype, "cliente", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Afores_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Proceso.prototype, "id_afore", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Afores_1.default, {
        foreignKey: 'id_afore',
        targetKey: 'id_afore',
        as: 'afore'
    }),
    __metadata("design:type", Afores_1.default)
], Proceso.prototype, "afore", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Asesor_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Proceso.prototype, "id_asesor", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Asesor_1.default, {
        foreignKey: 'id_asesor',
        targetKey: 'id_asesor',
        as: 'asesor'
    }),
    __metadata("design:type", Asesor_1.default)
], Proceso.prototype, "asesor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", String)
], Proceso.prototype, "fecha_firma", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20)),
    __metadata("design:type", String)
], Proceso.prototype, "tipo_firma", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", String)
], Proceso.prototype, "fecha_baja_imss", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", String)
], Proceso.prototype, "fecha_46_dias", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Proceso.prototype, "requiere_cita_afore", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", String)
], Proceso.prototype, "cita_afore", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(5)),
    __metadata("design:type", String)
], Proceso.prototype, "acompanamiento", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20)),
    __metadata("design:type", String)
], Proceso.prototype, "modo_retiro", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Proceso.prototype, "expediente_actualizado", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Proceso.prototype, "app_vinculada", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Proceso.prototype, "tramite_solicitado", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20)),
    __metadata("design:type", String)
], Proceso.prototype, "resultado_tramite", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Proceso.prototype, "observacion_tramite", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Proceso.prototype, "listo_para_cobro", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", String)
], Proceso.prototype, "fecha_cobro", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20)),
    __metadata("design:type", String)
], Proceso.prototype, "tipo_cobro", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2)),
    __metadata("design:type", String)
], Proceso.prototype, "monto_cobrar", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2)),
    __metadata("design:type", String)
], Proceso.prototype, "comision_asesora", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Proceso.prototype, "encuesta_aplicada", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2)),
    __metadata("design:type", String)
], Proceso.prototype, "bono_asesora", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20)),
    __metadata("design:type", String)
], Proceso.prototype, "estatus_proceso", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Proceso.prototype, "motivo_estatus", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ProcesoArchivo_1.default, {
        foreignKey: 'id_proceso',
        sourceKey: 'id_proceso',
        as: 'archivos'
    }),
    __metadata("design:type", Array)
], Proceso.prototype, "archivos", void 0);
Proceso = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'proceso',
        timestamps: true
    })
], Proceso);
exports.default = Proceso;
//# sourceMappingURL=Proceso.js.map