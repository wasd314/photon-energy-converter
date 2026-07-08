import type { Dispatch, SetStateAction } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type FullOrder, fullOrderInitial } from './StoreState';

const resolveSetStateAction = <T>(action: SetStateAction<T>, value: T) => {
  return typeof action === 'function'
    ? (action as (prev: T) => T)(value)
    : action;
};

type SettingStoreState = {
  showQuantityName: boolean;
  showFormulae: boolean;
  fullOrder: FullOrder;
  selectedUnitIds: string[];
};
type SettingStoreActions = {
  setShowQuantityName: Dispatch<SetStateAction<boolean>>;
  setShowFormulae: Dispatch<SetStateAction<boolean>>;
  setFullOrder: Dispatch<SetStateAction<FullOrder>>;
  setSelectedUnitIds: Dispatch<SetStateAction<string[]>>;
};
type SettingStore = SettingStoreState & SettingStoreActions;

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      showQuantityName: true,
      showFormulae: false,
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
