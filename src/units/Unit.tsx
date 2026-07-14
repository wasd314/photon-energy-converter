import Typography from '@mui/material/Typography';
import { type ReactNode } from 'react';
import { InlineMath } from 'react-katex';

import {
  AVOGADRO_CONSTANT,
  BOHR_MAGNETON,
  BOHR_RADIUS,
  BOLTZMANN_CONSTANT,
  DIRAC_CONSTANT,
  ELEMENTARY_CHARGE,
  HARTREE_ENERGY,
  PLANCK_CONSTANT,
  SPEED_OF_LIGHT,
  ZERO_DEGREE_CELSIUS,
} from './Constant';

interface JouleConversion {
  /** E / J への変換 */
  toJoule: (x: number) => number;
  /** E / J からの変換 */
  fromJoule: (x: number) => number;
}
export interface Unit extends JouleConversion {
  /** KaTeX 表示の単位 */
  mathUnit: string;
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
      Multiples of <InlineMath math={mathBaseUnit} />
    </Typography>
  ),
});
type SiPrefix = {
  prefix: string;
  multiple: number;
};
const siPrefixes: SiPrefix[] = [
  { prefix: 'E', multiple: 1e18 },
  { prefix: 'P', multiple: 1e15 },
  { prefix: 'T', multiple: 1e12 },
  { prefix: 'G', multiple: 1e9 },
  { prefix: 'M', multiple: 1e6 },
  { prefix: 'k', multiple: 1e3 },

  { prefix: 'm', multiple: 1e-3 },
  { prefix: 'µ', multiple: 1e-6 },
  { prefix: 'n', multiple: 1e-9 },
  { prefix: 'p', multiple: 1e-12 },
  { prefix: 'f', multiple: 1e-15 },
  { prefix: 'a', multiple: 1e-18 },
];

interface SiMultipleHelperProps {
  toMathLabel: (prefix: string) => string;
  helper: (coeff: number) => JouleConversion;
  prefixes: SiPrefix[];
  baseCoeff: number;
  multiply: 'multiply' | 'divide';
}
const siMultipleHelper: (props: SiMultipleHelperProps) => Unit[] = ({
  toMathLabel,
  helper,
  prefixes,
  baseCoeff,
  multiply,
}: SiMultipleHelperProps) =>
  prefixes.map(({ prefix, multiple }) => ({
    mathUnit: toMathLabel(prefix),
    ...helper(
      multiply === 'multiply' ? baseCoeff * multiple : baseCoeff / multiple
    ),
  }));

export const JOULE_LABEL = '\\mathrm{J}';

export const quantities: Quantity[] = [
  {
    quantityName: 'Energy',
    mathQuantity: (index: string) => `E_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{E}{\\mathrm{eV}} \\cdot \\frac{e}{\\mathrm{C}}',
    units: [
      {
        mathUnit: JOULE_LABEL,
        // J / J
        ...proportionalHelper(1),
      },
      {
        ...multipleLabelHelper('\\mathrm{J}'),
        series: siMultipleHelper({
          toMathLabel: (prefix) => `\\mathrm{${prefix}J}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: 1,
          multiply: 'multiply',
        }),
      },
      {
        mathUnit: '\\mathrm{eV}',
        // eV / J = e / C
        // = e / J V^-1
        ...proportionalHelper(ELEMENTARY_CHARGE),
      },
      {
        ...multipleLabelHelper('\\mathrm{eV}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}eV}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: ELEMENTARY_CHARGE,
          multiply: 'multiply',
        }),
      },
      {
        mathUnit: 'E_{\\text{h}}',
        // E_h / J
        ...proportionalHelper(HARTREE_ENERGY),
      },
      {
        mathUnit: '\\mathrm{Ry}',
        // Ry / J
        ...proportionalHelper(HARTREE_ENERGY / 2),
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
        mathUnit: '\\mathrm{J} \\, \\mathrm{mol}^{-1}',
        // N_A^-1 / mol
        // = (N_A / mol^-1)^-1
        ...proportionalHelper(1 / AVOGADRO_CONSTANT),
      },
      {
        ...multipleLabelHelper('\\mathrm{J} \\, \\mathrm{mol}^{-1}'),
        series: siMultipleHelper({
          toMathLabel: (prefix) =>
            `\\mathrm{${prefix}J} \\, \\mathrm{mol}^{-1}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: 1 / AVOGADRO_CONSTANT,
          multiply: 'multiply',
        }),
      },
      {
        mathUnit: '\\mathrm{cal} \\, \\mathrm{mol}^{-1}',
        // (N_A^-1 / mol) * (J / cal)
        // ((J/kcal) mol)
        ...proportionalHelper(4.184 / AVOGADRO_CONSTANT),
      },
      {
        ...multipleLabelHelper('\\mathrm{cal} \\, \\mathrm{mol}^{-1}'),
        series: siMultipleHelper({
          toMathLabel: (prefix) =>
            `\\mathrm{${prefix}cal} \\, \\mathrm{mol}^{-1}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: 4.184 / AVOGADRO_CONSTANT,
          multiply: 'multiply',
        }),
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
        mathUnit: '\\mathrm{m}',
        // h c / J m
        ...inverseProportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT),
      },
      {
        ...multipleLabelHelper('\\mathrm{m}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}m}`,
          helper: inverseProportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: PLANCK_CONSTANT * SPEED_OF_LIGHT,
          multiply: 'divide',
        }),
      },
      {
        mathUnit: '\\text{\\AA}',
        // h c / J Å
        ...inverseProportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e10),
      },
      {
        mathUnit: 'a_{\\text{B}}',
        // (h c / J m) * (m / a_B)
        ...inverseProportionalHelper(
          (PLANCK_CONSTANT * SPEED_OF_LIGHT) / BOHR_RADIUS
        ),
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
        mathUnit: '\\mathrm{m}^{-1}',
        // h c / J m
        ...proportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT),
      },
      {
        mathUnit: '\\mathrm{cm}^{-1}',
        // h c / J cm
        ...proportionalHelper(PLANCK_CONSTANT * SPEED_OF_LIGHT * 1e2),
      },
      {
        ...multipleLabelHelper('\\mathrm{m}^{-1}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}m}^{-1}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: PLANCK_CONSTANT * SPEED_OF_LIGHT,
          multiply: 'divide',
        }),
      },
    ],
  },
  {
    quantityName: 'Angular wavenumber',
    mathQuantity: (index: string) => `k_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{k}{\\mathrm{rad} \\, \\mathrm{m}^{-1}} \\cdot \\frac{\\hbar c}{\\mathrm{J} \\, \\mathrm{m} \\, \\mathrm{rad}^{-1}}',
    units: [
      {
        mathUnit: '\\mathrm{rad} \\, \\mathrm{m}^{-1}',
        // hbar c / J m rad^-1
        ...proportionalHelper(DIRAC_CONSTANT * SPEED_OF_LIGHT),
      },
      {
        mathUnit: '\\mathrm{rad} \\, \\mathrm{cm}^{-1}',
        // hbar c / J cm rad^-1
        ...proportionalHelper(DIRAC_CONSTANT * SPEED_OF_LIGHT * 1e2),
      },
      {
        ...multipleLabelHelper('\\mathrm{rad} \\, \\mathrm{m}^{-1}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) =>
            `\\mathrm{rad} \\, \\mathrm{${prefix}m}^{-1}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: DIRAC_CONSTANT * SPEED_OF_LIGHT,
          multiply: 'divide',
        }),
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
        ...multipleLabelHelper('\\mathrm{s}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}s}`,
          helper: inverseProportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: PLANCK_CONSTANT,
          multiply: 'divide',
        }),
      },
      {
        mathUnit: '\\hbar E_{\\text{h}}^{-1}',
        // h / (J hbar/E_h)
        // = 2 pi E_h / J
        ...inverseProportionalHelper(2 * Math.PI * HARTREE_ENERGY),
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
        ...multipleLabelHelper('\\mathrm{Hz}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}Hz}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: PLANCK_CONSTANT,
          multiply: 'multiply',
        }),
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
        ...multipleLabelHelper('\\mathrm{rad} \\, \\mathrm{s}^{-1}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) =>
            `\\mathrm{rad} \\, \\mathrm{${prefix}s}^{-1}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: DIRAC_CONSTANT,
          multiply: 'divide',
        }),
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
      {
        mathUnit: '{}^{\\circ}\\mathrm{C}',
        // k_B / J K^-1
        toJoule: (x: number) => (x - ZERO_DEGREE_CELSIUS) * BOLTZMANN_CONSTANT,
        fromJoule: (x: number) => x / BOLTZMANN_CONSTANT - ZERO_DEGREE_CELSIUS,
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
      {
        ...multipleLabelHelper('\\mathrm{T}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}T}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: BOHR_MAGNETON,
          multiply: 'multiply',
        }),
      },
    ],
  },
  {
    quantityName: 'Mass equivalent',
    mathQuantity: (index: string) => `m_{${index}}`,
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{m}{\\mathrm{kg}} \\cdot \\frac{c^2}{\\mathrm{m}^2 \\, \\mathrm{s}^{-2}}',
    units: [
      {
        mathUnit: '\\mathrm{g}',
        // (c^2 / J kg^-1) * (g / kg)
        // = (c^2 / m^2 s^-2) * (g / kg)
        ...proportionalHelper(SPEED_OF_LIGHT ** 2 / 1e3),
      },
      {
        ...multipleLabelHelper('\\mathrm{g}'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}g}`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: SPEED_OF_LIGHT ** 2 / 1e3,
          multiply: 'multiply',
        }),
      },
      {
        mathUnit: '\\mathrm{eV}/c^2',
        // J / eV
        ...proportionalHelper(ELEMENTARY_CHARGE),
      },
      {
        ...multipleLabelHelper('\\mathrm{eV}/c^2'),
        series: siMultipleHelper({
          toMathLabel: (prefix: string) => `\\mathrm{${prefix}eV}/c^2`,
          helper: proportionalHelper,
          prefixes: siPrefixes,
          baseCoeff: ELEMENTARY_CHARGE,
          multiply: 'multiply',
        }),
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
