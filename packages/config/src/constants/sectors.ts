export const SECTORS = ['Education','Healthcare','Legal','Government','Corporate'] as const;

export const SECTOR_OPTIONS = SECTORS.map((label, index) => ({
  value: index.toString(),
  label
}));
