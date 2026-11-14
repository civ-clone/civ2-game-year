export type Period = readonly [startYear: number, turns: number, step: number];
export declare const calendars: readonly (readonly Period[])[];
export default calendars;
