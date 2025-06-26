import 'katex/dist/katex.min.css';
import './ConversionTable.css';
import { useState, type JSX } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { Button, FormControlLabel, FormGroup, Switch } from '@mui/material';

interface UnitProps {
  /** 1 {この単位} が x J に相当するときの x */
  coefficient: number;
  /** katex 表示の単位 */
  mathUnit: string;
}
interface QuantityCalcProps {
  /** true: 正比例, false: 反比例 */
  proportional: boolean;
}
interface QuantityProps extends QuantityCalcProps {
  /** 物理量の名前 */
  quantityName: string;
  /** katex 表示の物理量 */
  mathQuantity: string;
  /** katex 表示のエネルギーへの変換公式 */
  mathConversionFormula: string;
  units: UnitProps[];
}
const quantities: QuantityProps[] = [
  {
    proportional: true,
    quantityName: 'Energy',
    mathQuantity: 'E',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{E}{\\mathrm{eV}} \\cdot \\frac{e}{\\mathrm{C}}',
    units: [
      {
        // J / J
        coefficient: 1,
        mathUnit: '\\mathrm{J}',
      },
      {
        // e / C
        // = e / J V^-1
        coefficient: 1.602176634e-19,
        mathUnit: '\\mathrm{eV}',
      },
    ],
  },
  {
    proportional: true,
    quantityName: 'Molar energy',
    mathQuantity: 'E_\\text{m}',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{E_\\text{m}}{\\mathrm{kJ} \\, \\mathrm{mol}^{-1}} \\cdot \\frac{N_\\text{A}^{-1}}{\\mathrm{mol}} \\cdot \\frac{\\mathrm{kJ}}{\\mathrm{J}}',
    units: [
      {
        // N_A^-1 / ((J/kJ) mol)
        // = (kJ/J) / (N_A mol)
        coefficient: 1000 / 6.02214076e23,
        mathUnit: '\\mathrm{kJ} \\, \\mathrm{mol}^{-1}',
      },
      {
        // N_A^-1 / ((J/kcal) mol)
        // = (kcal/J) / (N_A mol)
        coefficient: 4184 / 6.02214076e23,
        mathUnit: '\\mathrm{kcal} \\, \\mathrm{mol}^{-1}',
      },
    ],
  },
  {
    proportional: false,
    quantityName: 'Wavelength',
    mathQuantity: '\\lambda',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\lambda^{-1}}{\\mathrm{m}^{-1}} \\cdot \\frac{h c}{\\mathrm{J} \\, \\mathrm{m}}',
    units: [
      {
        // h c / J m
        // eslint-disable-next-line no-loss-of-precision
        coefficient: 1.9864458571489287e-25,
        mathUnit: '\\mathrm{m}',
      },
      {
        // h c / J nm
        coefficient: 1.9864458571489287e-16,
        mathUnit: '\\mathrm{nm}',
      },
    ],
  },
  {
    proportional: true,
    quantityName: 'Wavenumber',
    mathQuantity: '\\tilde{\\nu}',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\tilde{\\nu}}{\\mathrm{cm}^{-1}} \\cdot \\frac{h c}{\\mathrm{J} \\, \\mathrm{cm}}',
    units: [
      {
        // h c / J cm
        // eslint-disable-next-line no-loss-of-precision
        coefficient: 1.9864458571489287e-23,
        mathUnit: '\\mathrm{cm}^{-1}',
      },
    ],
  },
  {
    proportional: false,
    quantityName: 'Period',
    mathQuantity: '\\tau',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\tau^{-1}}{\\mathrm{s}^{-1}} \\cdot \\frac{h}{\\mathrm{J} \\, \\mathrm{s}}',
    units: [
      {
        // h / J s
        coefficient: 6.62607015e-34,
        mathUnit: '\\mathrm{s}',
      },
      {
        // h / J fs
        coefficient: 6.62607015e-19,
        mathUnit: '\\mathrm{fs}',
      },
    ],
  },
  {
    proportional: true,
    quantityName: 'Frequency',
    mathQuantity: '\\nu',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\nu}{\\mathrm{Hz}} \\cdot \\frac{h}{\\mathrm{J} \\, \\mathrm{s}}',
    units: [
      {
        // h / J s
        coefficient: 6.62607015e-34,
        mathUnit: '\\mathrm{Hz}',
      },
      {
        // h / J THz^-1
        // = h / J ps
        coefficient: 6.62607015e-22,
        mathUnit: '\\mathrm{THz}',
      },
    ],
  },
  {
    proportional: true,
    quantityName: 'Angular frequency',
    mathQuantity: '\\omega',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{\\omega}{\\mathrm{rad} \\, \\mathrm{s}^{-1}} \\cdot \\frac{\\hbar}{\\mathrm{J} \\, \\mathrm{s} \\, \\mathrm{rad}^{-1}}',
    units: [
      {
        // hbar / J s rad^-1
        coefficient: 6.62607015e-34 / (2 * Math.PI),
        mathUnit: '\\mathrm{rad} \\, \\mathrm{s}^{-1}',
      },
      {
        // hbar / J fs rad^-1
        coefficient: 6.62607015e-19 / (2 * Math.PI),
        mathUnit: '\\mathrm{rad} \\, \\mathrm{fs}^{-1}',
      },
    ],
  },
  {
    proportional: true,
    quantityName: 'Temperature',
    mathQuantity: 'T',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{T}{\\mathrm{K}} \\cdot \\frac{k_\\text{B}}{\\mathrm{J} \\, \\mathrm{K}^{-1}}',
    units: [
      {
        // k_B / J K^-1
        coefficient: 1.380649e-23,
        mathUnit: '\\mathrm{K}',
      },
    ],
  },
  {
    proportional: true,
    quantityName: 'Magnetic flux density',
    mathQuantity: 'B',
    mathConversionFormula:
      '\\frac{E}{\\mathrm{J}} = \\frac{B}{\\mathrm{T}} \\cdot \\frac{\\mu_\\text{B}}{\\mathrm{J} \\, \\mathrm{T}^{-1}}',
    units: [
      {
        // µ_B / J T^-1
        // (not a defining constant)
        coefficient: 9.2740100783e-24,
        mathUnit: '\\mathrm{T}',
      },
    ],
  },
];

interface UnitCalcProps extends UnitProps, QuantityCalcProps {}

const units: UnitCalcProps[] = quantities.flatMap((quantity) =>
  quantity.units.map((unit) => ({
    ...unit,
    proportional: quantity.proportional,
  }))
);

interface UnitRowProps {
  index: number;
  mathQuantity: string;
  mathUnit: string;
  text: string;
  setText: (newText: string, index: number) => void;
}
const UnitRow = ({
  index,
  mathQuantity,
  mathUnit,
  text,
  setText,
}: UnitRowProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value, index);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setText(e.target.value, index);
  };
  return (
    <div className="unit-row">
      <div>
        <InlineMath math={mathQuantity} />
      </div>
      <div>
        <InlineMath math="=" />
      </div>
      <div>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          className="value-input"
        />
      </div>
      <div>
        <InlineMath math={mathUnit} />
      </div>
    </div>
  );
};

const ConversionTable = () => {
  const [texts, setTexts] = useState(Array(units.length).fill(''));
  const [showQuantityName, setShowQuantityName] = useState(true);
  const [showFormulae, setShowFormulae] = useState(false);
  // 更新後の文字列が newEnergy: number と解釈できたときにそれを他のセルに反映する
  const updateWithEnergy = (
    newEnergy: number,
    textUpdated: string,
    indexUpdated: number
  ) => {
    const newTexts = units.map(({ coefficient, proportional }, index) => {
      if (index == indexUpdated) return textUpdated;
      const newValue = proportional
        ? newEnergy / coefficient
        : coefficient / newEnergy;
      return newValue.toPrecision(10);
    });
    setTexts(newTexts);
  };
  // 1セルへの更新を記録する（入力途中でも）
  const setText = (newText: string, indexUpdated: number) => {
    const newTexts = texts.slice();
    newTexts[indexUpdated] = newText;
    setTexts(newTexts);

    const valueParsed = Number(newText);
    if (newText === '' || Number.isNaN(valueParsed)) return;
    const { proportional, coefficient } = units[indexUpdated];
    const newEnergy = proportional
      ? valueParsed * coefficient
      : coefficient / valueParsed;
    updateWithEnergy(newEnergy, newText, indexUpdated);
  };

  const handleChangeShowQuantityName = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowQuantityName(e.target.checked);
  };
  const handleChangeShowFormulae = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowFormulae(e.target.checked);
  };
  const handleClickClear = () => {
    setTexts(Array(units.length).fill(''));
  };

  let unitIndex = 0;
  const quantityBlocks = quantities.map(
    ({ quantityName, mathQuantity, mathConversionFormula, units }) => {
      const rows: JSX.Element[] = [];
      if (showQuantityName) {
        rows.push(
          <div className="quantity-header" key="quantityName">
            {quantityName}
          </div>
        );
      }
      if (showFormulae) {
        rows.push(
          <div key="conversionFormula">
            <BlockMath math={mathConversionFormula} />
            {/* <InlineMath math={mathConversionFormula.replace(/frac/g, "dfrac")} /> */}
          </div>
        );
      }
      rows.push(
        ...units.map((unit, i) => {
          const index = unitIndex + i;
          return (
            <UnitRow
              key={unit.mathUnit}
              index={index}
              mathQuantity={i === 0 ? mathQuantity : ''}
              mathUnit={unit.mathUnit}
              text={texts[index]}
              setText={setText}
            />
          );
        })
      );
      unitIndex += units.length;
      return (
        <div key={quantityName} className="quantity-block">
          {rows}
        </div>
      );
    }
  );
  return (
    <>
      <div className="conversion-table-container">{quantityBlocks}</div>
      <div className="operation-menu">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showQuantityName}
                onChange={handleChangeShowQuantityName}
              />
            }
            label="Show quantity names"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showFormulae}
                onChange={handleChangeShowFormulae}
              />
            }
            label="Show conversion formulae"
          />
        </FormGroup>
        <div className="clear-button-wrapper">
          <Button variant="outlined" color="error" onClick={handleClickClear}>
            Clear values
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConversionTable;
