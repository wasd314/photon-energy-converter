import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useState } from 'react';
import { InlineMath } from 'react-katex';
import { KatexTreeItem } from './setting/UnitSelect';
import {
  selectionItems,
  type UnitSelectionItem,
} from './setting/UnitSelectionItem';

export const SettingsOverlay = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showQuantityName, setShowQuantityName] = useState(true);
  const [showFormulae, setShowFormulae] = useState(false);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleChangeShowQuantityName = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowQuantityName(e.target.checked);
  };
  const handleChangeShowFormulae = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowFormulae(e.target.checked);
  };

  const isItemSelectionDisabled = (item: UnitSelectionItem) =>
    // item.category === 'multipleOfUnits';
    item.category !== 'unit';
  const handleSelectedItemsChange = (
    _event: React.SyntheticEvent | null,
    ids: string[]
  ) => {
    setSelectedIds(ids.sort());
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          Settings
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <Stack spacing={2}>
            <Typography variant="h6" component="h3">
              Display
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showQuantityName}
                    onChange={handleChangeShowQuantityName}
                  />
                }
                label="Show quantity names"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showFormulae}
                    onChange={handleChangeShowFormulae}
                  />
                }
                label="Show conversion formulae"
              />
            </FormGroup>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h6" component="h3">
              Quantities, Units Displaying units
            </Typography>
            <Typography>
              Selected:
              <InlineMath math={`[${selectedIds.join(', ')}]`} />
            </Typography>
            <RichTreeView
              items={selectionItems}
              multiSelect
              checkboxSelection
              onSelectedItemsChange={handleSelectedItemsChange}
              isItemSelectionDisabled={isItemSelectionDisabled}
              itemChildrenIndentation={24}
              selectedItems={selectedIds}
              slots={{ item: KatexTreeItem }}
            />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
