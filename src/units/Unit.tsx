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

export const isUnit = (x: Unit | MultipleOfUnits): x is Unit => 'mathUnit' in x;

export interface Quantity {
  /** 物理量の名前 */
  quantityName: string;
  /** KaTeX 表示の量記号 */
  mathQuantity: (index: string) => string;
  /** KaTeX 表示のエネルギーとの変換公式 */
  mathConversionFormula: string;
  units: (Unit | MultipleOfUnits)[];
}
export interface QuantityWithFlatMap extends Quantity {
  /** flattened array */
  units: Unit[];
  /** mathUnit => Unit */
  unitMap: Map<string, Unit>;
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

export const JOULE_LABEL = '\\mathrm{J}';

export const quantities: Quantity[] = [
  {
    quantityName: 'Energy',
    mathQuantity: (index: string) => `E_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{E}{\\mathrm{eV}} \\cdot \\frac{e}{\\mathrm{C}}',
    units: [
      {
        ...multipleLabelHelper('\\mathrm{J}'),
        series: [
          {
            mathUnit: JOULE_LABEL,
            // J / J
            ...proportionalHelper(1),
          },
          {
            mathUnit: '\\mathrm{mJ}',
            // J / mJ
            ...proportionalHelper(1e3),
          },
        ],
      },
      {
        mathUnit: '\\mathrm{eV}',
        // e / C
        // = e / J V^-1
        ...proportionalHelper(ELEMENTARY_CHARGE),
      },
    ],
  },
  {
    quantityName: 'Molar energy',
    mathQuantity: (index: string) => `E_{\\text{m}, ${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{E_\\text{m}}{\\mathrm{kJ} \\, \\mathrm{mol}^{-1}} \\cdot \\frac{N_\\text{A}^{-1}}{\\mathrm{mol}} \\cdot \\frac{\\mathrm{kJ}}{\\mathrm{J}}',
    units: [
      {
        mathUnit: '\\mathrm{kJ} \\, \\mathrm{mol}^{-1}',
        // N_A^-1 / ((J/kJ) mol)
        // = (kJ/J) / (N_A mol)
        ...proportionalHelper(1000 / AVOGADRO_CONSTANT),
      },
      {
        mathUnit: '\\mathrm{kcal} \\, \\mathrm{mol}^{-1}',
        // N_A^-1 / ((J/kcal) mol)
        // = (kcal/J) / (N_A mol)
        ...proportionalHelper(4184 / AVOGADRO_CONSTANT),
      },
    ],
  },
  {
    quantityName: 'Wavelength',
    mathQuantity: (index: string) => `\\lambda_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\lambda^{-1}}{\\mathrm{m}^{-1}} \\cdot \\frac{h c}{\\mathrm{J} \\, \\mathrm{m}}',
    units: [
      {
        ...multipleLabelHelper('\\mathrm{m}'),
        series: [
          {
            mathUnit: '\\mathrm{m}',
            // h c / J m
            ...inverseProportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT),
          },
          {
            mathUnit: '\\mathrm{nm}',
            // h c / J nm
            ...inverseProportionalHelper(
              PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e9
            ),
          },
        ],
      },
      {
        mathUnit: '\\text{\\AA}',
        // h c / J Å
        ...inverseProportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e10),
      },
    ],
  },
  {
    quantityName: 'Wavenumber',
    mathQuantity: (index: string) => `\\tilde{\\nu}_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\tilde{\\nu}}{\\mathrm{cm}^{-1}} \\cdot \\frac{h c}{\\mathrm{J} \\, \\mathrm{cm}}',
    units: [
      {
        ...multipleLabelHelper('\\mathrm{m}^{-1}'),
        series: [
          {
            mathUnit: '\\mathrm{m}^{-1}',
            // h c / J m
            ...proportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT),
          },
          {
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
    mathQuantity: (index: string) => `\\tau_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\tau^{-1}}{\\mathrm{s}^{-1}} \\cdot \\frac{h}{\\mathrm{J} \\, \\mathrm{s}}',
    units: [
      {
        mathUnit: '\\mathrm{s}',
        // h / J s
        ...inverseProportionalHelper(PLANCK_CONSTANT),
      },
      {
        mathUnit: '\\mathrm{fs}',
        // h / J fs
        ...inverseProportionalHelper(PLANCK_CONSTANT),
      },
    ],
  },
  {
    quantityName: 'Frequency',
    mathQuantity: (index: string) => `\\nu_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\nu}{\\mathrm{Hz}} \\cdot \\frac{h}{\\mathrm{J} \\, \\mathrm{s}}',
    units: [
      {
        mathUnit: '\\mathrm{Hz}',
        // h / J s
        ...proportionalHelper(PLANCK_CONSTANT),
      },
      {
        mathUnit: '\\mathrm{THz}',
        // h / J THz^-1
        // = h / J ps
        ...proportionalHelper(PLANCK_CONSTANT * 1e12),
      },
    ],
  },
  {
    quantityName: 'Angular frequency',
    mathQuantity: (index: string) => `\\omega_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\omega}{\\mathrm{rad} \\, \\mathrm{s}^{-1}} \\cdot \\frac{\\hbar}{\\mathrm{J} \\, \\mathrm{s} \\, \\mathrm{rad}^{-1}}',
    units: [
      {
        mathUnit: '\\mathrm{rad} \\, \\mathrm{s}^{-1}',
        // hbar / J s rad^-1
        ...proportionalHelper(DIRAC_CONSTANT),
      },
      {
        mathUnit: '\\mathrm{rad} \\, \\mathrm{fs}^{-1}',
        // hbar / J fs rad^-1
        ...proportionalHelper(DIRAC_CONSTANT * 1e15),
      },
    ],
  },
  {
    quantityName: 'Temperature',
    mathQuantity: (index: string) => `T_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{T}{\\mathrm{K}} \\cdot \\frac{k_\\text{B}}{\\mathrm{J} \\, \\mathrm{K}^{-1}}',
    units: [
      {
        mathUnit: '\\mathrm{K}',
        // k_B / J K^-1
        ...proportionalHelper(BOLTZMANN_CONSTANT),
      },
    ],
  },
  {
    quantityName: 'Magnetic flux density',
    mathQuantity: (index: string) => `B_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{B}{\\mathrm{T}} \\cdot \\frac{\\mu_\\text{B}}{\\mathrm{J} \\, \\mathrm{T}^{-1}}',
    units: [
      {
        mathUnit: '\\mathrm{T}',
        // µ_B / J T^-1
        ...proportionalHelper(BOHR_MAGNETON),
      },
    ],
  },
];

export const quantityMaps: Map<string, QuantityWithFlatMap> = new Map(
  quantities.map((quantity) => {
    const { units, ...rest } = quantity;
    const unitsFlattened = units.flatMap((value) =>
      isUnit(value) ? [value] : value.series
    );
    return [
      rest.quantityName,
      {
        ...rest,
        units: unitsFlattened,
        unitMap: new Map(unitsFlattened.map((unit) => [unit.mathUnit, unit])),
      },
    ];
  })
);

export const unitMap = new Map(
  Array.from(quantityMaps.values()).flatMap((quantity) =>
    quantity.units.map((unit) => [unit.mathUnit, unit])
  )
);
