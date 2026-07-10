import 'katex/dist/katex.min.css';
import './ConversionTable.css';
import { Button } from '@mui/material';
import { enableMapSet } from 'immer';
import { type JSX, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useImmer } from 'use-immer';
import { useSettingStore } from './setting/SettingStore';
import { selectionItemsFlattened } from './setting/UnitSelectionItem';
import { quantityMaps, unitMap } from './units/Unit';

enableMapSet();

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
        // biome-ignore lint/correctness/noPrecisionLoss: defined constant
        coefficient: 1.9864458571489287e-25,
        mathUnit: '\\mathrm{m}',
      },
      {
        // h c / J nm
        coefficient: 1.9864458571489287e-16,
        mathUnit: '\\mathrm{nm}',
      },
      {
        // h c / J nm
        // biome-ignore lint/correctness/noPrecisionLoss: defined constant
        coefficient: 1.9864458571489287e-15,
        mathUnit: '\\text{\\AA}',
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
        // biome-ignore lint/correctness/noPrecisionLoss: defined constant
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
  index: ColumnIndex;
  mathQuantity: string;
  mathUnit: string;
  text: string;
  recordCellUpdate: (
    columnIndex: ColumnIndex,
    updatedUnit: string,
    updatedText: string
  ) => void;
}
const UnitRow = ({
  index,
  mathQuantity,
  mathUnit,
  text,
  recordCellUpdate,
}: UnitRowProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    recordCellUpdate(index, mathUnit, e.target.value);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    recordCellUpdate(index, mathUnit, e.target.value);
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

type ThreeKeys = 'plus' | 'minus' | 'diff';
const threeKeyMathLabel: Record<ThreeKeys, string> = {
  plus: '+',
  minus: '-',
  diff: '\\Delta',
};

type ConversionTableTextColumn =
  | {
      tag: 'single';
      column: Map<string, string>;
    }
  | {
      tag: 'three';
      column: Record<ThreeKeys, Map<string, string>>;
    };

type ColumnIndex =
  | { tag: 'single'; index: number }
  | { tag: 'three'; index: [number, ThreeKeys] };

export const ConversionTable = () => {
  const numberSingleColumn = 2;
  const numberThreeColumn = 1;

  const showQuantityName = useSettingStore((state) => state.showQuantityName);
  const showFormulae = useSettingStore((state) => state.showFormulae);
  const fullOrder = useSettingStore((store) => store.fullOrder);
  const selectedUnitIds = useSettingStore((store) => store.selectedUnitIds);
  const selectedIdSet = useMemo(() => {
    const set = new Set(selectedUnitIds);
    const quantities = selectionItemsFlattened.flatMap((quantity) => {
      return quantity.children?.some((unit) => set.has(unit.id))
        ? [quantity.label]
        : [];
    });
    return new Set([...selectedUnitIds, ...quantities]);
  }, [selectedUnitIds]);

  const emptyTable: () => ConversionTableTextColumn[] = () => {
    const initMap = () =>
      new Map(
        fullOrder.flatMap(([_, units]) => units.map((unit) => [unit, '']))
      );
    return Array.from(
      { length: numberSingleColumn + numberThreeColumn },
      (_, i) => {
        if (i < numberSingleColumn) {
          return { tag: 'single', column: initMap() };
        } else {
          return {
            tag: 'three',
            column: { plus: initMap(), minus: initMap(), diff: initMap() },
          };
        }
      }
    );
  };
  const [texts, setTexts] = useImmer(emptyTable());

  // 更新後の文字列が number と解釈できたときにそれを他のセルに反映する
  const newColumnFromJoule = (
    newJoule: number,
    updatedUnit: string,
    updatedText: string
  ) => {
    return new Map(
      Array.from(quantityMaps.values()).flatMap((quantity) =>
        quantity.units.map((unit) => [
          unit.mathUnit,
          unit.mathUnit === updatedUnit
            ? updatedText
            : unit.fromJoule(newJoule).toPrecision(10),
        ])
      )
    );
  };
  const parseText = (unit: string, newText: string) => {
    const unitInfo = unitMap.get(unit);
    const valueParsed = Number(newText);
    // Number('') === +0: number
    if (newText === '' || Number.isNaN(valueParsed) || unitInfo === undefined)
      return;
    return unitInfo.toJoule(valueParsed);
  };

  // const updateCellsWithEnergy = (
  //   newEnergy: number,
  //   textUpdated: string,
  //   indexUpdated: number
  // ) => {
  //   const newTexts = units.map(({ coefficient, proportional }, index) => {
  //     if (index == indexUpdated) return textUpdated;
  //     const newValue = proportional
  //       ? newEnergy / coefficient
  //       : coefficient / newEnergy;
  //     return newValue.toPrecision(10);
  //   });
  //   setTexts(newTexts);
  // };

  // 1セルへの更新を記録する（入力途中でも）
  const recordCellUpdate = (
    columnIndex: ColumnIndex,
    updatedUnit: string,
    updatedText: string
  ) => {
    const { tag, index } = columnIndex;
    setTexts((texts) => {
      const newJoule = parseText(updatedUnit, updatedText);
      if (tag === 'single') {
        if (texts[index].tag === tag) {
          if (newJoule === undefined) {
            texts[index].column.set(updatedUnit, updatedText);
          } else {
            texts[index].column = newColumnFromJoule(
              newJoule,
              updatedUnit,
              updatedText
            );
          }
        }
      } else {
        const columns = texts[index[0]];
        if (columns.tag === tag) {
          if (newJoule === undefined) {
            columns.column[index[1]].set(updatedUnit, updatedText);
          } else {
            columns.column[index[1]] = newColumnFromJoule(
              newJoule,
              updatedUnit,
              updatedText
            );
          }
        }
      }
    });
  };

  const handleClickClear = () => {
    setTexts(emptyTable());
  };

  const quantityBlocks = fullOrder.map(([quantityName, unitIds]) => {
    const quantity = quantityMaps.get(quantityName);
    if (quantity === undefined || !selectedIdSet.has(quantityName)) return;
    const { mathQuantity, mathConversionFormula, unitMap } = quantity;

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
        </div>
      );
    }
    const units = unitIds.flatMap((unitId) => {
      const unit = unitMap.get(unitId);
      return unit === undefined || !selectedIdSet.has(unitId) ? [] : [unit];
    });

    rows.push(
      ...texts.flatMap(({ tag, column }, i) => {
        const index = `${i + 1}`;
        if (tag === 'single') {
          return units.map(({ mathUnit }, j) => (
            <UnitRow
              key={`${i}--${j}`}
              index={{ tag: 'single', index: i }}
              mathQuantity={j === 0 ? mathQuantity(index) : ''}
              mathUnit={mathUnit}
              text={column.get(mathUnit)!}
              recordCellUpdate={recordCellUpdate}
            />
          ));
        } else {
          return (['plus', 'minus', 'diff'] as const).flatMap((key) => {
            const col = column[key];
            return units.map(({ mathUnit }, j) => (
              <UnitRow
                key={`${i}--${key}--${j}`}
                index={{ tag: 'three', index: [i, key] }}
                mathQuantity={
                  j === 0
                    ? `${mathQuantity(index)}^{${threeKeyMathLabel[key]}}`
                    : ''
                }
                mathUnit={mathUnit}
                text={col.get(mathUnit)!}
                recordCellUpdate={recordCellUpdate}
              />
            ));
          });
        }
      })
    );
    return (
      <div key={quantityName} className="quantity-block">
        {rows}
      </div>
    );
  });
  return (
    <>
      <div className="conversion-table-container">{quantityBlocks}</div>
      <div className="operation-menu">
        <div className="clear-button-wrapper">
          <Button variant="outlined" color="error" onClick={handleClickClear}>
            Clear values
          </Button>
        </div>
      </div>
    </>
  );
};
