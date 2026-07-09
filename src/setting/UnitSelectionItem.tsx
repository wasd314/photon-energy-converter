import Typography from '@mui/material/Typography';
import { type ReactNode } from 'react';
import { InlineMath } from 'react-katex';

import {
  isUnit,
  type MultipleOfUnits,
  type Quantity,
  quantities,
  quantitiesFlattened,
  type Unit,
} from '../units/Unit';

export interface UnitSelectionItem {
  category: 'quantity' | 'unit' | 'multipleOfUnits';
  id: string;
  label: string;
  labelNode: ReactNode;
  parentLabel: string;
  children?: UnitSelectionItem[];
}

export const QUANTITY_PARENT_LABEL = '__root__';

const fromUnit: (unit: Unit, parentLabel: string) => UnitSelectionItem = (
  unit: Unit,
  parentLabel: string
) => ({
  category: 'unit',
  id: unit.mathUnit,
  label: unit.mathUnit,
  labelNode: <InlineMath math={unit.mathUnit} />,
  parentLabel,
});
const fromMultipleOfUnits: (
  units: MultipleOfUnits,
  parentLabel: string
) => UnitSelectionItem = (units: MultipleOfUnits, parentLabel: string) => ({
  category: 'multipleOfUnits',
  id: units.seriesLabel,
  label: units.seriesLabel,
  labelNode: units.seriesLabelNode || (
    <Typography>{units.seriesLabel}</Typography>
  ),
  parentLabel,
  children: units.series.map((unit) => fromUnit(unit, parentLabel)),
});
const fromQuantity: (quantity: Quantity) => UnitSelectionItem = (
  quantity: Quantity
) => {
  return {
    category: 'quantity',
    id: quantity.quantityName,
    label: quantity.quantityName,
    labelNode: <Typography>{quantity.quantityName}</Typography>,
    parentLabel: QUANTITY_PARENT_LABEL,
    children: quantity.units.map((value) => {
      return isUnit(value)
        ? fromUnit(value, quantity.quantityName)
        : fromMultipleOfUnits(value, quantity.quantityName);
    }),
  };
};

export const selectionItems: UnitSelectionItem[] = quantities.map(fromQuantity);

export const selectionItemsFlattened = quantitiesFlattened.map(fromQuantity);
