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
  useKatex: boolean;
}

const KatexTreeLabel = (props: KatexTreeLabelProps) => {
  const { children, className, useKatex } = props;
  return (
    <div className={className}>
      {useKatex ? (
        <InlineMath math={children} />
      ) : (
        <Typography>{children}</Typography>
      )}
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
          useKatex: item.category === 'unit',
        } as KatexTreeLabelProps,
      }}
    />
  );
};
