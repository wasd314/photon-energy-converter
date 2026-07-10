import type { Dispatch, SetStateAction } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type FullOrder, fullOrderInitial } from './StoreState';

const resolveSetStateAction = <T>(action: SetStateAction<T>, value: T) => {
  return typeof action === 'function'
    ? (action as (prev: T) => T)(value)
    : action;
};

type ColumnNumber = { single: number; three: number };

type SettingStoreState = {
  showQuantityName: boolean;
  showFormulae: boolean;
  columnNumber: ColumnNumber;
  precision: number;
  fullOrder: FullOrder;
  selectedUnitIds: string[];
};
type SettingStoreActions = {
  setShowQuantityName: Dispatch<SetStateAction<boolean>>;
  setShowFormulae: Dispatch<SetStateAction<boolean>>;
  setPrecision: Dispatch<SetStateAction<number>>;
  setColumnNumber: Dispatch<SetStateAction<ColumnNumber>>;
  setFullOrder: Dispatch<SetStateAction<FullOrder>>;
  setSelectedUnitIds: Dispatch<SetStateAction<string[]>>;
};
type SettingStore = SettingStoreState & SettingStoreActions;

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      showQuantityName: true,
      showFormulae: false,
      precision: 10,
      fullOrder: fullOrderInitial,
      selectedUnitIds: [],
      columnNumber: {
        single: 1,
        three: 1,
      },
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
      setPrecision: (action) =>
        set((state) => ({
          precision: resolveSetStateAction(action, state.precision),
        })),
      setColumnNumber: (action) =>
        set((state) => ({
          columnNumber: resolveSetStateAction(action, state.columnNumber),
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
