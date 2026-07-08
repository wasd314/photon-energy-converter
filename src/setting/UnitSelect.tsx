import {
  TreeItem,
  TreeItemLabel,
  type TreeItemProps,
  useTreeItemModel,
} from '@mui/x-tree-view';
import { type ReactNode, type Ref } from 'react';
import { type UnitSelectionItem } from './UnitSelectionItem';

export interface KatexTreeLabelProps {
  children: string;
  className: string;
  labelNode: ReactNode;
}

export const KatexTreeLabel = (props: KatexTreeLabelProps) => {
  const { className, labelNode } = props;
  return <TreeItemLabel className={className}>{labelNode}</TreeItemLabel>;
};

export const KatexTreeItem = ({
  ref,
  ...props
}: TreeItemProps & { ref?: Ref<HTMLLIElement> }) => {
  const item = useTreeItemModel<UnitSelectionItem>(props.itemId)!;
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: KatexTreeLabel,
      }}
      slotProps={{
        label: {
          labelNode: item.labelNode,
        } as KatexTreeLabelProps,
      }}
    />
  );
};
