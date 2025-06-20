export const languages = ['da', 'en'] as const;
export type Language = (typeof languages)[number];
