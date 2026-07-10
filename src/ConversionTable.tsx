import 'katex/dist/katex.min.css';
import './ConversionTable.css';
import Button from '@mui/material/Button';
import { enableMapSet } from 'immer';
import { type JSX, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { useImmer } from 'use-immer';
import { useSettingStore, type TripleKeys } from './setting/SettingStore';
import { selectionItemsFlattened } from './setting/UnitSelectionItem';
import { quantityMaps, unitMap } from './units/Unit';

enableMapSet();

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

const tripleKeyMathLabel: Record<TripleKeys, string> = {
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
      tag: 'triple';
      column: Record<TripleKeys, Map<string, string>>;
    };

type ColumnIndex =
  | { tag: 'single'; index: number }
  | { tag: 'triple'; index: [number, TripleKeys] };

export const ConversionTable = () => {
  const columnNumber = useSettingStore((state) => state.columnNumber);
  const precision = useSettingStore((state) => state.precision);
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

  const initMap = () =>
    new Map(fullOrder.flatMap(([_, units]) => units.map((unit) => [unit, ''])));
  const emptyTable: () => ConversionTableTextColumn[] = () => {
    return Array.from(
      { length: columnNumber.single + columnNumber.triple },
      (_, i) => {
        if (i < columnNumber.single) {
          return { tag: 'single', column: initMap() };
        } else {
          return {
            tag: 'triple',
            column: { plus: initMap(), minus: initMap(), diff: initMap() },
          };
        }
      }
    );
  };
  const [texts, setTexts] = useImmer(emptyTable());

  // reset texts if columnNumber is different
  {
    const currentColumnNumber = {
      single: texts.reduce(
        (acc, col) => acc + (col.tag === 'single' ? 1 : 0),
        0
      ),
      triple: texts.reduce(
        (acc, col) => acc + (col.tag === 'triple' ? 1 : 0),
        0
      ),
    };
    if (
      columnNumber.single !== currentColumnNumber.single ||
      columnNumber.triple !== currentColumnNumber.triple
    ) {
      setTexts((texts) => {
        const textsSingle = texts.filter((col) => col.tag === 'single');
        const textsTriple = texts.filter((col) => col.tag === 'triple');
        return [
          ...Array.from({ length: columnNumber.single }, (_, i) =>
            i < textsSingle.length
              ? textsSingle[i]
              : { tag: 'single', column: initMap() }
          ),
          ...Array.from({ length: columnNumber.triple }, (_, i) =>
            i < textsTriple.length
              ? textsTriple[i]
              : {
                  tag: 'triple',
                  column: {
                    plus: initMap(),
                    minus: initMap(),
                    diff: initMap(),
                  },
                }
          ),
        ];
      });
    }
  }

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
            : unit.fromJoule(newJoule).toPrecision(precision),
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

    const units = unitIds.flatMap((unitId) => {
      const unit = unitMap.get(unitId);
      return unit === undefined || !selectedIdSet.has(unitId) ? [] : [unit];
    });

    rows.push(
      ...texts
        .map(({ tag, column }, i) => {
          const index = `${i + 1}`;
          if (tag === 'single') {
            return [
              units.map(({ mathUnit }, j) => (
                <UnitRow
                  key={`${i}--${j}`}
                  index={{ tag: 'single', index: i }}
                  mathQuantity={j === 0 ? mathQuantity(index) : ''}
                  mathUnit={mathUnit}
                  text={column.get(mathUnit)!}
                  recordCellUpdate={recordCellUpdate}
                />
              )),
            ];
          } else {
            return (['plus', 'minus', 'diff'] as const).map((key) => {
              const col = column[key];
              return units.map(({ mathUnit }, j) => (
                <UnitRow
                  key={`${i}--${key}--${j}`}
                  index={{ tag: 'triple', index: [i, key] }}
                  mathQuantity={
                    j === 0
                      ? `${mathQuantity(index)}^{${tripleKeyMathLabel[key]}}`
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
        .map((rows, i) => (
          <div key={i} className="unit-columns-bundle">
            {rows.map((row, j) => (
              <div key={j} className="unit-column-bundle">
                {row}
              </div>
            ))}
          </div>
        ))
    );
    return (
      <div key={quantityName} className="quantity-block">
        <div className="quantity-header">
          {showQuantityName && (
            <div className="quantity-name" key="quantityName">
              {quantityName}
            </div>
          )}
          {showFormulae && (
            <div key="conversionFormula">
              <BlockMath math={mathConversionFormula} />
            </div>
          )}
        </div>
        <div className="quantity-block-body">{rows}</div>
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
