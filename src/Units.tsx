interface UnitProps {
  /** 1 {この単位} が x J に相当するときの x */
  coefficient: number;
  /** true: 正比例, false: 反比例 */
  proportional: boolean;
  /** 物理量の名前 */
  quantityName: string;
  /** katex 表示の物理量 */
  mathQuantity: string;
  /** katex 表示の単位 */
  mathUnit: string;
}
export const units: UnitProps[] = [
  {
    // J / J
    coefficient: 1,
    proportional: true,
    quantityName: 'Energy',
    mathQuantity: 'E',
    mathUnit: '\\mathrm{J}',
  },
  {
    // e / C
    // = e / J V^-1
    coefficient: 1.602176634e-19,
    proportional: true,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{eV}',
  },
  {
    // N_A^-1 / ((J/kJ) mol)
    // = (kJ/J) / (N_A mol)
    coefficient: 1000 / 6.02214076e23,
    proportional: true,
    quantityName: 'Molar energy',
    mathQuantity: 'E_\\text{m}',
    mathUnit: '\\mathrm{kJ} / \\mathrm{mol}',
  },
  {
    // N_A^-1 / ((J/kcal) mol)
    // = (kcal/J) / (N_A mol)
    coefficient: 4184 / 6.02214076e23,
    proportional: true,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{kcal} / \\mathrm{mol}',
  },
  {
    // h c / J m
    // eslint-disable-next-line no-loss-of-precision
    coefficient: 1.9864458571489287e-25,
    proportional: false,
    quantityName: 'Wavelength',
    mathQuantity: '\\lambda',
    mathUnit: '\\mathrm{m}',
  },
  {
    // h c / J nm
    coefficient: 1.9864458571489287e-16,
    proportional: false,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{nm}',
  },
  {
    // h c / J cm
    // eslint-disable-next-line no-loss-of-precision
    coefficient: 1.9864458571489287e-23,
    proportional: true,
    quantityName: 'Wavenumber',
    mathQuantity: '\\tilde{\\nu}',
    mathUnit: '\\mathrm{cm}^{-1}',
  },
  {
    // h / J s
    coefficient: 6.62607015e-34,
    proportional: false,
    quantityName: 'Period',
    mathQuantity: '\\tau',
    mathUnit: '\\mathrm{s}',
  },
  {
    // h / J fs
    coefficient: 6.62607015e-19,
    proportional: false,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{fs}',
  },
  {
    // h / J s
    coefficient: 6.62607015e-34,
    proportional: true,
    quantityName: 'Frequency',
    mathQuantity: '\\nu',
    mathUnit: '\\mathrm{Hz}',
  },
  {
    // h / J THz^-1
    // = h / J ps
    coefficient: 6.62607015e-22,
    proportional: true,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{THz}',
  },
  {
    // hbar / J s rad^-1
    coefficient: 6.62607015e-34 / (2 * Math.PI),
    proportional: true,
    quantityName: 'Angular frequency',
    mathQuantity: '\\omega',
    mathUnit: '\\mathrm{rad}\\, \\mathrm{s}^{-1}',
  },
  {
    // hbar / J fs rad^-1
    coefficient: 6.62607015e-19 / (2 * Math.PI),
    proportional: true,
    quantityName: '',
    mathQuantity: '',
    mathUnit: '\\mathrm{rad}\\, \\mathrm{fs}^{-1}',
  },
  {
    // k_B / J K^-1
    coefficient: 1.380649e-23,
    proportional: true,
    quantityName: 'Temperature',
    mathQuantity: 'T',
    mathUnit: '\\mathrm{K}',
  },
  {
    // µ_B / J T^-1
    // (not a defining constant)
    coefficient: 9.2740100783e-24,
    proportional: true,
    quantityName: 'Magnetic flux density',
    mathQuantity: 'B',
    mathUnit: '\\mathrm{T}',
  },
];
