import type { Dispatch, SetStateAction } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type FullOrder, fullOrderInitial } from './StoreState';

const resolveSetStateAction = <T>(action: SetStateAction<T>, value: T) => {
  return typeof action === 'function'
    ? (action as (prev: T) => T)(value)
    : action;
};

type ColumnNumber = { single: number; triple: number };
export const tripleKeys = ['plus', 'minus', 'diff'] as const;
export type TripleKeys = (typeof tripleKeys)[number];
type TripleUpdate = {
  [K in TripleKeys]: Exclude<TripleKeys, K>;
};
export const tripleKeyMathLabel: Record<TripleKeys, string> = {
  plus: '+',
  minus: '-',
  diff: '\\Delta',
};

type SettingStoreState = {
  showQuantityName: boolean;
  showFormulae: boolean;
  columnNumber: ColumnNumber;
  tripleUpdate: TripleUpdate;
  precision: number;
  fullOrder: FullOrder;
  selectedUnitIds: string[];
};
type SettingStoreActions = {
  setShowQuantityName: Dispatch<SetStateAction<boolean>>;
  setShowFormulae: Dispatch<SetStateAction<boolean>>;
  setColumnNumber: Dispatch<SetStateAction<ColumnNumber>>;
  setTripleUpdate: Dispatch<SetStateAction<TripleUpdate>>;
  setPrecision: Dispatch<SetStateAction<number>>;
  setFullOrder: Dispatch<SetStateAction<FullOrder>>;
  setSelectedUnitIds: Dispatch<SetStateAction<string[]>>;
};
type SettingStore = SettingStoreState & SettingStoreActions;

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      showQuantityName: true,
      showFormulae: false,
      columnNumber: {
        single: 1,
        triple: 1,
      },
      tripleUpdate: {
        plus: 'minus',
        minus: 'diff',
        diff: 'minus',
      },
      precision: 10,
      fullOrder: fullOrderInitial,
      selectedUnitIds: [],
      setShowQuantityName: (action) =>
        set((state) => ({
          showQuantityName: resolveSetStateAction(
            action,
            state.showQuantityName
          ),
        })),
      setShowFormulae: (action) =>
        set((state) => ({
          showFormulae: resolveSetStateAction(action, state.showFormulae),
        })),
      setColumnNumber: (action) =>
        set((state) => ({
          columnNumber: resolveSetStateAction(action, state.columnNumber),
        })),
      setTripleUpdate: (action) =>
        set((state) => ({
          tripleUpdate: resolveSetStateAction(action, state.tripleUpdate),
        })),
      setPrecision: (action) =>
        set((state) => ({
          precision: resolveSetStateAction(action, state.precision),
        })),
      setFullOrder: (action) =>
        set((state) => ({
          fullOrder: resolveSetStateAction(action, state.fullOrder),
        })),
      setSelectedUnitIds: (action) =>
        set((state) => ({
          selectedUnitIds: resolveSetStateAction(action, state.selectedUnitIds),
        })),
    }),
    {
      name: 'photon-energy-converter',
    }
  )
);
