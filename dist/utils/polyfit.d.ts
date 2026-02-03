/**
 * Ajuste polinómico por mínimos cuadrados usando ecuaciones normales
 * y eliminación Gaussiana (grados 1..5). Incluye variantes:
 *  - polyfit: sobre y (puede dar negativos al extrapolar)
 *  - polyfitLog: sobre log(y) para evitar negativos (recomendado en ventas)
 * Utilidades:
 *  - polyval, polyvalClipped, polyToString
 *  - sumProjection(xs, coeffs, {clipMin})  -> suma predicciones (clipeadas)
 *  - reconcileTotals(...)                   -> coherencia de TOTAL vs SVM+SVT
 */
export type PolyfitResult = {
    degree: number;
    coeffs: number[];
};
/** Ajuste polinómico estándar (puede dar negativos). */
export declare function polyfit(x: number[], y: number[], degree?: number, lambda?: number): PolyfitResult;
/**
 * Ajuste polinómico sobre log(y). Evita negativos al predecir
 * (al re-exponenciar), muy útil para ventas.
 */
export declare function polyfitLog(x: number[], y: number[], degree?: number, // por defecto más conservador
lambda?: number): PolyfitResult;
/** Evalúa un polinomio (Horner) */
export declare function polyval(coeffs: number[], x: number): number;
/**
 * Evalúa y recorta por debajo (default 0).
 * Útil para polinomios en espacio original.
 */
export declare function polyvalClipped(coeffs: number[], x: number, clipMin?: number): number;
/**
 * Evalúa un modelo entrenado con polyfitLog: exp(polyval(...)).
 * Siempre devuelve valores >= EPS (≈0).
 */
export declare function polyvalFromLog(coeffs: number[], x: number): number;
export declare function polyToString(coeffs: number[], fractionDigits?: number): string;
/** Suma predicciones sobre xs. Útil para tus periodos/días futuros. */
export declare function sumProjection(xs: number[], coeffs: number[], opts?: {
    clipMin?: number;
    fromLog?: boolean;
    round?: boolean;
}): number;
/**
 * Reconciliación de totales:
 *  - Calcula la suma SVM+SVT (clipeada).
 *  - Calcula el total por modelo independiente (si se pasa).
 *  - Devuelve un objeto con ambos y una sugerencia de cuál mostrar,
 *    basándose en la discrepancia relativa.
 */
export declare function reconcileTotals(params: {
    xs: number[];
    coeffsSVM: number[];
    coeffsSVT: number[];
    coeffsTotal?: number[];
    fromLog?: boolean;
    clipMin?: number;
    discrepancyPct?: number;
}): {
    bySum: number;
    byModelTotal: number | null;
    use: "bySum";
    warn: boolean;
    pctDiff?: undefined;
} | {
    bySum: number;
    byModelTotal: number;
    use: "bySum" | "both";
    warn: boolean;
    pctDiff: number;
};
