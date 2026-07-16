import type { Dispatch, SetStateAction } from 'react';
import {
  QUANTITY_PARENT_LABEL,
  selectionItemsFlattened,
} from './UnitSelectionItem';

export type FullOrder = [string, string[]][];
export type SetFullOrder = Dispatch<SetStateAction<FullOrder>>;

export type FullOrderMap = Map<string, string[]>;

export const fromFullOrder: (order: FullOrder) => FullOrderMap = (
  order: FullOrder
) => {
  const pairs: FullOrder = [
    ...order.map((it) => [it[0], [...it[1]]] as [string, string[]]),
    [QUANTITY_PARENT_LABEL, order.map((it) => it[0])],
  ];
  return new Map(pairs);
};

export const toFullOrder: (map: FullOrderMap) => FullOrder = (
  map: FullOrderMap
) => {
  return map
    .get(QUANTITY_PARENT_LABEL)!
    .map((quantity) => [quantity, [...map.get(quantity)!]]);
};

export const fullOrderInitial: FullOrder = selectionItemsFlattened.map(
  (quantity) => {
    return [
      quantity.label,
      quantity?.children?.map((unit) => unit.label) || [],
    ];
  }
);
