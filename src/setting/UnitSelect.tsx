import Typography from '@mui/material/Typography';
import {
  TreeItem,
  type TreeItemProps,
  useTreeItemModel,
} from '@mui/x-tree-view';
import * as React from 'react';
import { InlineMath } from 'react-katex';
import { type UnitSelectionItem } from './UnitSelectionItem';

interface KatexTreeLabelProps {
  children: string;
  className: string;
  category: 'quantity' | 'unit' | 'multipleOfUnits';
  labelNode?: React.ReactNode;
}

const KatexTreeLabel = (props: KatexTreeLabelProps) => {
  const { children, className, category, labelNode } = props;
  return (
    <div className={className}>
      {category === 'unit' && <InlineMath math={children} />}
      {category === 'quantity' && <Typography>{children}</Typography>}
      {category === 'multipleOfUnits' &&
        (labelNode || <Typography>{children}</Typography>)}
    </div>
  );
};

export const KatexTreeItem = ({
  ref,
  ...props
}: TreeItemProps & { ref?: React.Ref<HTMLLIElement> }) => {
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
          category: item.category,
          labelNode: item.labelNode,
        } as KatexTreeLabelProps,
      }}
    />
  );
};
