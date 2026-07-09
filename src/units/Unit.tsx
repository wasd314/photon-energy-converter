import Typography from '@mui/material/Typography';
import { type ReactNode } from 'react';
import { InlineMath } from 'react-katex';

import {
  AVOGADRO_CONSTANT,
  BOHR_MAGNETON,
  BOLTZMANN_CONSTANT,
  DIRAC_CONSTANT,
  ELEMENTARY_CHARGE,
  PLANCK_CONSTANT,
  SPEED_OF_LIGHT,
} from './Constant';

export interface Unit {
  /** plain text の単位名 */
  unitLabel: string;
  /** KaTeX 表示の単位 */
  mathUnit: string;
  /** E / J への変換 */
  toJoule: (x: number) => number;
  /** E / J からの変換 */
  fromJoule: (x: number) => number;
}

export interface MultipleOfUnits {
  seriesLabel: string;
  seriesLabelNode?: ReactNode;
  series: Unit[];
}

export const isUnit = (x: Unit | MultipleOfUnits): x is Unit =>
  'unitLabel' in x;

export interface Quantity {
  /** 物理量の名前 */
  quantityName: string;
  /** KaTeX 表示の量記号 */
  mathQuantity: string;
  /** KaTeX 表示のエネルギーとの変換公式 */
  mathConversionFormula: string;
  units: (Unit | MultipleOfUnits)[];
}
export interface QuantityFlattened {
  /** 物理量の名前 */
  quantityName: string;
  /** KaTeX 表示の量記号 */
  mathQuantity: string;
  /** KaTeX 表示のエネルギーとの変換公式 */
  mathConversionFormula: string;
  units: Unit[];
}

/** (E / J) = (x / Unit) * coefficient */
const proportionalHelper = (coefficient: number) => ({
  toJoule: (x: number) => x * coefficient,
  fromJoule: (x: number) => x / coefficient,
});
/** (E / J) = coefficient / (x / Unit) */
const inverseProportionalHelper = (coefficient: number) => ({
  toJoule: (x: number) => coefficient / x,
  fromJoule: (x: number) => coefficient / x,
});
const multipleLabelHelper = (mathBaseUnit: string) => ({
  seriesLabel: `Multiples of ${mathBaseUnit}`,
  seriesLabelNode: (
    <Typography>
      Multiples of <InlineMath math={mathBaseUnit} />{' '}
    </Typography>
  ),
});

export const quantities: Quantity[] = [
  {
    quantityName: 'Energy',
    mathQuantity: 'E',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{E}{\\mathrm{eV}} \\cdot \\frac{e}{\\mathrm{C}}',
    units: [
      {
        ...multipleLabelHelper('\\mathrm{J}'),
        series: [
          {
            unitLabel: 'J',
            mathUnit: '\\mathrm{J}',
            // J / J
            ...proportionalHelper(1),
          },
          {
            unitLabel: 'mJ',
            mathUnit: '\\mathrm{mJ}',
            // J / mJ
            ...proportionalHelper(1e3),
          },
        ],
      },
      {
        unitLabel: 'eV',
        mathUnit: '\\mathrm{eV}',
        // e / C
        // = e / J V^-1
        ...proportionalHelper(ELEMENTARY_CHARGE),
      },
    ],
  },
  {
    quantityName: 'Molar energy',
    mathQuantity: 'E_\\text{m}',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{E_\\text{m}}{\\mathrm{kJ} \\, \\mathrm{mol}^{-1}} \\cdot \\frac{N_\\text{A}^{-1}}{\\mathrm{mol}} \\cdot \\frac{\\mathrm{kJ}}{\\mathrm{J}}',
    units: [
      {
        unitLabel: 'kJ / mol',
        mathUnit: '\\mathrm{kJ} \\, \\mathrm{mol}^{-1}',
        // N_A^-1 / ((J/kJ) mol)
        // = (kJ/J) / (N_A mol)
        ...proportionalHelper(1000 / AVOGADRO_CONSTANT),
      },
      {
        unitLabel: 'kcal / mol',
        mathUnit: '\\mathrm{kcal} \\, \\mathrm{mol}^{-1}',
        // N_A^-1 / ((J/kcal) mol)
        // = (kcal/J) / (N_A mol)
        ...proportionalHelper(4184 / AVOGADRO_CONSTANT),
      },
    ],
  },
  {
    quantityName: 'Wavelength',
    mathQuantity: '\\lambda',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\lambda^{-1}}{\\mathrm{m}^{-1}} \\cdot \\frac{h c}{\\mathrm{J} \\, \\mathrm{m}}',
    units: [
      {
        ...multipleLabelHelper('\\mathrm{m}'),
        series: [
          {
            unitLabel: 'm',
            mathUnit: '\\mathrm{m}',
            // h c / J m
            ...inverseProportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT),
          },
          {
            unitLabel: 'nm',
            mathUnit: '\\mathrm{nm}',
            // h c / J nm
            ...inverseProportionalHelper(
              PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e9
            ),
          },
        ],
      },
      {
        unitLabel: 'Å',
        mathUnit: '\\text{\\AA}',
        // h c / J Å
        ...inverseProportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e10),
      },
    ],
  },
  {
    quantityName: 'Wavenumber',
    mathQuantity: '\\tilde{\\nu}',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\tilde{\\nu}}{\\mathrm{cm}^{-1}} \\cdot \\frac{h c}{\\mathrm{J} \\, \\mathrm{cm}}',
    units: [
      {
        ...multipleLabelHelper('\\mathrm{m}^{-1}'),
        series: [
          {
            unitLabel: 'm⁻¹',
            mathUnit: '\\mathrm{m}^{-1}',
            // h c / J m
            ...proportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT),
          },
          {
            unitLabel: 'cm⁻¹',
            mathUnit: '\\mathrm{cm}^{-1}',
            // h c / J cm
            ...proportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e2),
          },
        ],
      },
    ],
  },
  {
    quantityName: 'Period',
    mathQuantity: '\\tau',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\tau^{-1}}{\\mathrm{s}^{-1}} \\cdot \\frac{h}{\\mathrm{J} \\, \\mathrm{s}}',
    units: [
      {
        unitLabel: 's',
        mathUnit: '\\mathrm{s}',
        // h / J s
        ...inverseProportionalHelper(PLANCK_CONSTANT),
      },
      {
        unitLabel: 'fs',
        mathUnit: '\\mathrm{fs}',
        // h / J fs
        ...inverseProportionalHelper(PLANCK_CONSTANT),
      },
    ],
  },
  {
    quantityName: 'Frequency',
    mathQuantity: '\\nu',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\nu}{\\mathrm{Hz}} \\cdot \\frac{h}{\\mathrm{J} \\, \\mathrm{s}}',
    units: [
      {
        unitLabel: 'Hz',
        mathUnit: '\\mathrm{Hz}',
        // h / J s
        ...proportionalHelper(PLANCK_CONSTANT),
      },
      {
        unitLabel: 'THz',
        mathUnit: '\\mathrm{THz}',
        // h / J THz^-1
        // = h / J ps
        ...proportionalHelper(PLANCK_CONSTANT * 1e12),
      },
    ],
  },
  {
    quantityName: 'Angular frequency',
    mathQuantity: '\\omega',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\omega}{\\mathrm{rad} \\, \\mathrm{s}^{-1}} \\cdot \\frac{\\hbar}{\\mathrm{J} \\, \\mathrm{s} \\, \\mathrm{rad}^{-1}}',
    units: [
      {
        unitLabel: 'rad / s',
        mathUnit: '\\mathrm{rad} \\, \\mathrm{s}^{-1}',
        // hbar / J s rad^-1
        ...proportionalHelper(DIRAC_CONSTANT),
      },
      {
        unitLabel: 'rad / fs',
        mathUnit: '\\mathrm{rad} \\, \\mathrm{fs}^{-1}',
        // hbar / J fs rad^-1
        ...proportionalHelper(DIRAC_CONSTANT * 1e15),
      },
    ],
  },
  {
    quantityName: 'Temperature',
    mathQuantity: 'T',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{T}{\\mathrm{K}} \\cdot \\frac{k_\\text{B}}{\\mathrm{J} \\, \\mathrm{K}^{-1}}',
    units: [
      {
        unitLabel: 'K',
        mathUnit: '\\mathrm{K}',
        // k_B / J K^-1
        ...proportionalHelper(BOLTZMANN_CONSTANT),
      },
    ],
  },
  {
    quantityName: 'Magnetic flux density',
    mathQuantity: 'B',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{B}{\\mathrm{T}} \\cdot \\frac{\\mu_\\text{B}}{\\mathrm{J} \\, \\mathrm{T}^{-1}}',
    units: [
      {
        unitLabel: 'T',
        mathUnit: '\\mathrm{T}',
        // µ_B / J T^-1
        ...proportionalHelper(BOHR_MAGNETON),
      },
    ],
  },
];

export const quantitiesFlattened: QuantityFlattened[] = quantities.map(
  (quantity) => {
    const unitsFlattened = quantity.units.flatMap((value) =>
      isUnit(value) ? [value] : value.series
    );
    return {
      ...quantity,
      units: unitsFlattened,
    };
  }
);
