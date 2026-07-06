import Typography from '@mui/material/Typography';
import { type ReactNode } from 'react';
import { InlineMath } from 'react-katex';

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
  labelNode: ReactNode;
  children?: UnitSelectionItem[];
}

export const selectionItems: UnitSelectionItem[] = ((quantities) => {
  const fromUnit: (unit: Unit) => UnitSelectionItem = (unit: Unit) => ({
    category: 'unit',
    id: unit.mathUnit,
    label: unit.mathUnit,
    labelNode: <InlineMath math={unit.mathUnit} />,
  });
  const fromMultipleOfUnits: (units: MultipleOfUnits) => UnitSelectionItem = (
    units: MultipleOfUnits
  ) => ({
    category: 'multipleOfUnits',
    id: units.seriesLabel,
    label: units.seriesLabel,
    labelNode: units.seriesLabelNode || (
      <Typography>{units.seriesLabel}</Typography>
    ),
    children: units.series.map(fromUnit),
  });
  return quantities.map((quantity) => {
    return {
      category: 'quantity',
      id: quantity.quantityName,
      label: quantity.quantityName,
      labelNode: <Typography>{quantity.quantityName}</Typography>,
      children: quantity.units.map((value) => {
        return isUnit(value) ? fromUnit(value) : fromMultipleOfUnits(value);
      }),
    };
  });
})(quantities);
