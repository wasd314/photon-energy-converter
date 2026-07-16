import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useForkRef } from '@mui/material';
import { useTreeItemModel } from '@mui/x-tree-view';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItemCheckbox,
  TreeItemContent,
  TreeItemGroupTransition,
  TreeItemIconContainer,
  type TreeItemProps,
  TreeItemRoot,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import { createContext, type Ref, useContext, useMemo } from 'react';
import {
  type FullOrder,
  type FullOrderMap,
  fromFullOrder,
  type SetFullOrder,
  toFullOrder,
} from './StoreState';
import { KatexTreeLabel, type KatexTreeLabelProps } from './UnitSelect';
import {
  QUANTITY_PARENT_LABEL,
  selectionItemsFlattened,
  type UnitSelectionItem,
} from './UnitSelectionItem';

interface OrderContextProps {
  fullOrderMap: FullOrderMap;
  selectedIdSet: Set<string>;
}
const OrderContext = createContext<OrderContextProps>({
  fullOrderMap: new Map(),
  selectedIdSet: new Set(),
});

const UnitSorterTreeItem = ({
  id,
  itemId,
  label,
  disabled,
  children,
  ref,
}: TreeItemProps & { ref?: Ref<HTMLLIElement> }) => {
  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getLabelInputProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });
  const item = useTreeItemModel<UnitSelectionItem>(itemId)!;
  const group = item.parentLabel;
  const { fullOrderMap, selectedIdSet } = useContext(OrderContext);
  const { ref: sortRef } = useSortable({
    id: item.id,
    index:
      fullOrderMap
        .get(group)
        ?.filter((id) => selectedIdSet.has(id))
        .indexOf(item.id) ?? -1,
    group,
    type: group,
    accept: group,
    modifiers: [RestrictToVerticalAxis],
  });
  const rootProps = getRootProps();
  const contentProps = getContentProps({ status });
  const mergedRef = useForkRef(rootProps.ref, sortRef);

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...rootProps} ref={mergedRef}>
        <TreeItemContent {...contentProps}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <TreeItemCheckbox {...getCheckboxProps()} />
          {status.editing ? (
            <TreeItemLabelInput {...getLabelInputProps()} />
          ) : (
            <KatexTreeLabel
              {...getLabelProps({
                labelNode: item.labelNode,
              } as KatexTreeLabelProps)}
            />
          )}
          <DragIndicatorIcon fontSize="small" />
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
};

interface UnitSorterTreeProps {
  fullOrder: FullOrder;
  setFullOrder: SetFullOrder;
  selectedIds: string[];
}

export const UnitSorterTree = ({
  fullOrder,
  setFullOrder,
  selectedIds,
}: UnitSorterTreeProps) => {
  const fullOrderMap = useMemo(() => fromFullOrder(fullOrder), [fullOrder]);
  const selectedIdSet = useMemo(() => {
    const set = new Set(selectedIds);
    const quantities = selectionItemsFlattened.flatMap((quantity) => {
      return quantity.children?.some((unit) => set.has(unit.id))
        ? [quantity.label]
        : [];
    });
    return new Set([...selectedIds, ...quantities]);
  }, [selectedIds]);
  const items: UnitSelectionItem[] = useMemo(() => {
    return fullOrder.flatMap(([quantityLabel, ids]) => {
      const quantity = selectionItemsFlattened.find(
        (value) => value.id === quantityLabel
      );
      if (!quantity || !selectedIdSet.has(quantity.label)) return [];
      const children = quantity.children ?? [];
      const filteredChildren = ids.flatMap((id) => {
        const unit = children.find((it) => it.id === id);
        return unit && selectedIdSet.has(unit.id) ? [unit] : [];
      });
      return { ...quantity, children: filteredChildren };
    });
  }, [fullOrder, selectedIdSet]);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;
        const { source } = event.operation;
        if (!isSortable(source)) return;
        const { group: parentLabel, initialIndex, index } = source.sortable;
        if (typeof parentLabel !== 'string' || initialIndex === index) return;

        const values = fullOrderMap.get(parentLabel);
        if (!values) return;

        setFullOrder((fullOrder) => {
          const map = fromFullOrder(fullOrder);
          const values = map.get(parentLabel)!;
          if (parentLabel === QUANTITY_PARENT_LABEL) {
            const [pop] = values.splice(initialIndex, 1);
            values.splice(index, 0, pop);
          } else {
            const selectedUnits = values.filter((unit) =>
              selectedIdSet.has(unit)
            );
            const [pop] = selectedUnits.splice(initialIndex, 1);
            if (selectedUnits.length > 0) {
              const initialIndexTotal = values.indexOf(pop);
              values.splice(initialIndexTotal, 1);
              if (index < initialIndex) {
                const pushPrev = selectedUnits[index];
                const indexTotal = values.indexOf(pushPrev);
                values.splice(indexTotal, 0, pop);
              } else {
                const pushNext = selectedUnits[index - 1];
                const indexTotal = values.indexOf(pushNext);
                values.splice(indexTotal + 1, 0, pop);
              }
            }
          }
          return toFullOrder(map);
        });
      }}
    >
      <OrderContext
        value={{
          fullOrderMap,
          selectedIdSet,
        }}
      >
        <RichTreeView
          items={items}
          slots={{ item: UnitSorterTreeItem }}
          disableSelection
        />
      </OrderContext>
    </DragDropProvider>
  );
};
