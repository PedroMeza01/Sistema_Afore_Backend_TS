"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asISO = exports.asNum = exports.mapArray = void 0;
exports.makeMapper = makeMapper;
const get = (obj, path) => !path ? undefined : path.split('.').reduce((a, k) => (a == null ? a : a[k]), obj);
// ---- ✅ Acepta un 2do argumento opcional con autoCopy
function makeMapper(config, opts = {}) {
    return (src) => {
        const out = {};
        // Copia automática de campos con el mismo nombre
        if (opts.autoCopy) {
            for (const k of Object.keys(src)) {
                if (!(k in config))
                    out[k] = src[k];
            }
        }
        // Reglas explícitas
        for (const key in config) {
            const rule = config[key];
            if (typeof rule === 'string') {
                out[key] = get(src, rule);
                continue;
            }
            if (typeof rule === 'function') {
                out[key] = rule(src);
                continue;
            }
            if ('const' in rule) {
                out[key] = rule.const;
                continue;
            }
            const raw = rule.from ? get(src, rule.from) : src[key];
            out[key] = raw == null ? (rule.default ?? null) : (rule.map ? rule.map(raw, src) : raw);
        }
        return out;
    };
}
// mapear arrays con el mismo `opts`
const mapArray = (config, items, opts = {}) => items.map(makeMapper(config, opts));
exports.mapArray = mapArray;
// Helpers
const asNum = (x) => (x == null ? 0 : Number(x));
exports.asNum = asNum;
const asISO = (x) => (x ? new Date(x).toISOString() : null);
exports.asISO = asISO;
//# sourceMappingURL=mapperGenerico.js.map