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
const Proceso_1 = __importDefault(require("./Proceso"));
let ProcesoArchivo = class ProcesoArchivo extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "id_proceso_archivo", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Proceso_1.default),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Index)('idx_proceso_archivo_id_proceso'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "id_proceso", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Proceso_1.default),
    __metadata("design:type", Proceso_1.default)
], ProcesoArchivo.prototype, "proceso", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Index)('idx_proceso_archivo_categoria'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "categoria", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "nombre_original", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(120)),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "mime_type", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], ProcesoArchivo.prototype, "tamano_bytes", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(16)),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "storage_provider", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(80)),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "storage_bucket", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "storage_path", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ProcesoArchivo.prototype, "public_url", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], ProcesoArchivo.prototype, "activo", void 0);
ProcesoArchivo = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'proceso_archivo',
        timestamps: true
    })
], ProcesoArchivo);
exports.default = ProcesoArchivo;
//# sourceMappingURL=ProcesoArchivo.js.map