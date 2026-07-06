import {
  isUnit,
  type MultipleOfUnits,
  quantities,
  type Unit,
} from '../units/Unit';

export interface UnitSelectionItem {
  category: 'quantity' | 'unit' | 'multipleOfUnits';
  id: string;
  label: string;
  children?: UnitSelectionItem[];
}

export const selectionItems: UnitSelectionItem[] = ((quantities) => {
  const fromUnit: (unit: Unit) => UnitSelectionItem = (unit: Unit) => ({
    category: 'unit',
    id: unit.unitLabel,
    label: unit.unitLabel,
  });
  const fromMultipleOfUnits: (units: MultipleOfUnits) => UnitSelectionItem = (
    units: MultipleOfUnits
  ) => ({
    category: 'multipleOfUnits',
    id: units.seriesLabel,
    label: units.seriesLabel,
    children: units.series.map(fromUnit),
  });
  return quantities.map((quantity) => {
    return {
      category: 'quantity',
      id: quantity.quantityName,
      label: quantity.quantityName,
      children: quantity.units.map((value) => {
        return isUnit(value) ? fromUnit(value) : fromMultipleOfUnits(value);
      }),
    };
  });
})(quantities);
