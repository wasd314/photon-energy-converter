interface UnitProps {
  // 1 {この単位} が x J に相当するときの x
  coefficient: number;
  // true: 正比例, false: 反比例
  proportional: boolean;
  // 物理量の名前
  quantityName: string;
  // katex 表示の物理量
  mathQuantity: string;
  // katex 表示の単位
  mathUnit: string;
}
export const units: UnitProps[] = [
  {
    coefficient: 1,
    proportional: true,
    quantityName: 'Energy',
    mathQuantity: 'E',
    mathUnit: '\\mathrm{J}',
  },
  {
    coefficient: 1.60218e-19,
    proportional: true,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{eV}',
  },
  {
    coefficient: 1.98645e-25,
    proportional: false,
    quantityName: 'Wavelength',
    mathQuantity: '\\lambda',
    mathUnit: '\\mathrm{m}',
  },
  {
    coefficient: 1.98645e-16,
    proportional: false,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{nm}',
  },
  {
    coefficient: 1.98645e-23,
    proportional: true,
    quantityName: 'Wavenumber',
    mathQuantity: '\\tilde{\\nu}',
    mathUnit: '\\mathrm{cm}^{-1}',
  },
  {
    coefficient: 6.62607e-34,
    proportional: false,
    quantityName: 'Period',
    mathQuantity: '\\tau',
    mathUnit: '\\mathrm{s}',
  },
  {
    coefficient: 6.62607e-19,
    proportional: false,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{fs}',
  },
  {
    coefficient: 6.62607e-34,
    proportional: true,
    quantityName: 'Frequency',
    mathQuantity: '\\nu',
    mathUnit: '\\mathrm{Hz}',
  },
  {
    coefficient: 6.62607e-22,
    proportional: true,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{THz}',
  },
  {
    coefficient: 1.05457e-34,
    proportional: true,
    quantityName: 'Angular frequency',
    mathQuantity: '\\omega',
    mathUnit: '\\mathrm{rad}\\, \\mathrm{s}^{-1}',
  },
  {
    coefficient: 1.05457e-19,
    proportional: true,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{rad}\\, \\mathrm{fs}^{-1}',
  },
  {
    coefficient: 1.38065e-23,
    proportional: true,
    quantityName: 'Temperature',
    mathQuantity: 'T',
    mathUnit: '\\mathrm{K}',
  },
  {
    coefficient: 9.27401e-24,
    proportional: true,
    quantityName: 'Magnetic flux density',
    mathQuantity: 'B',
    mathUnit: '\\mathrm{T}',
  },
];
