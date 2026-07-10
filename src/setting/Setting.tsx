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
import NumberSpinner from './components/NumberSpinner';

import { useSettingStore } from './SettingStore';
import { KatexTreeItem } from './UnitSelect';
import {
  selectionItems,
  selectionItemsFlattened,
  type UnitSelectionItem,
} from './UnitSelectionItem';
import { UnitSorterTree } from './UnitSort';

export const SettingsOverlay = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    showQuantityName,
    setShowQuantityName,
    showFormulae,
    setShowFormulae,
    columnNumber,
    setColumnNumber,
    precision,
    setPrecision,
    fullOrder,
    setFullOrder,
    selectedUnitIds,
    setSelectedUnitIds,
  } = useSettingStore();

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
    setSelectedUnitIds(ids.sort());
  };
  const clampRound = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.round(value)));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" component="span" sx={{ flexGrow: 1 }}>
          Settings
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h3">
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
            <Stack>
              <Typography variant="h6">Number of columns</Typography>
              <Stack direction="row" spacing={2}>
                <NumberSpinner
                  label="Single"
                  min={0}
                  max={50}
                  value={columnNumber.single}
                  onValueChange={(value) => {
                    if (value !== null)
                      setColumnNumber((state) => ({
                        ...state,
                        single: clampRound(value, 0, 50),
                      }));
                  }}
                  size="small"
                />
                <NumberSpinner
                  label="Three"
                  min={0}
                  max={50}
                  value={columnNumber.three}
                  onValueChange={(value) => {
                    if (value !== null)
                      setColumnNumber((state) => ({
                        ...state,
                        three: clampRound(value, 0, 50),
                      }));
                  }}
                  size="small"
                />
              </Stack>
            </Stack>
            <Stack sx={{ alignItems: 'flex-start' }}>
              <Typography variant="h6">Calculation precision</Typography>
              <NumberSpinner
                label="Precision"
                min={1}
                max={20}
                value={precision}
                onValueChange={(value) => {
                  if (value !== null) setPrecision(clampRound(value, 1, 20));
                }}
                size="small"
              />
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h5" component="h3">
              Quantities, Units
            </Typography>
            <Stack>
              <Typography variant="h6">Unit Select</Typography>
              <RichTreeView
                items={selectionItems}
                multiSelect
                checkboxSelection
                onSelectedItemsChange={handleSelectedItemsChange}
                isItemSelectionDisabled={isItemSelectionDisabled}
                itemChildrenIndentation={24}
                defaultExpandedItems={selectionItemsFlattened.map((q) => q.id)}
                selectedItems={selectedUnitIds}
                slots={{ item: KatexTreeItem }}
              />
            </Stack>
            <Stack>
              <Typography variant="h6">Order</Typography>
              <Typography>Drag and drop to rearrange items.</Typography>
              {selectedUnitIds.length > 0 ? (
                <UnitSorterTree
                  fullOrder={fullOrder}
                  setFullOrder={setFullOrder}
                  selectedIds={selectedUnitIds}
                />
              ) : (
                <Typography color="textDisabled">Unit Not selected</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
