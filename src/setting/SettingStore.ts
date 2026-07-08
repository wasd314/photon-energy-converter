import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type FullOrder, fullOrderInitial } from './StoreState';

type SettingStoreState = {
  showQuantityName: boolean;
  showFormulae: boolean;
  fullOrder: FullOrder;
  selectedUnitIds: string[];
};
type SettingStoreActions = {
  setShowQuantityName: (nextShowQuantityName: boolean) => void;
  setShowFormulae: (nextShowFormulae: boolean) => void;
  setFullOrder: (nextFullOrder: FullOrder) => void;
  setSelectedUnitIds: (nextSelectedUnitIds: string[]) => void;
};
type SettingStore = SettingStoreState & SettingStoreActions;

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      showQuantityName: true,
      showFormulae: false,
      fullOrder: fullOrderInitial,
      selectedUnitIds: [],
      setShowQuantityName: (showQuantityName: boolean) =>
        set({ showQuantityName }),
      setShowFormulae: (showFormulae: boolean) => set({ showFormulae }),
      setFullOrder: (fullOrder: FullOrder) => set({ fullOrder }),
      setSelectedUnitIds: (selectedUnitIds: string[]) =>
        set({ selectedUnitIds }),
    }),
    {
      name: 'photon-energy-converter',
    }
  )
);
