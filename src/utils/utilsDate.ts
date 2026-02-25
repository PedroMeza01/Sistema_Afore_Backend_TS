export const isISODate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export const toStartUTC = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
export const toEndUTC = (iso: string) => new Date(`${iso}T23:59:59.999Z`);
