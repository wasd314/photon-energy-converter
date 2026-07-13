import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useId } from 'react';
import { InlineMath } from 'react-katex';
import NumberSpinner from './components/NumberSpinner';
import {
  type TripleKeys,
  tripleKeyMathLabel,
  tripleKeys,
  useSettingStore,
} from './SettingStore';
import { KatexTreeItem } from './UnitSelect';
import {
  selectionItems,
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
    tripleUpdate,
    setTripleUpdate,
    precision,
    setPrecision,
    fullOrder,
    setFullOrder,
    selectedUnitIds,
    setSelectedUnitIds,
    restoreDefault,
  } = useSettingStore();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const formId = useId();

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
  const handleChangeTripleUpdate =
    (key: TripleKeys) => (event: SelectChangeEvent) => {
      setTripleUpdate((state) => ({ ...state, [key]: event.target.value }));
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

            <Stack spacing={1}>
              <Typography variant="subtitle1">Header information</Typography>
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

            <Stack spacing={1}>
              <Typography variant="subtitle1">
                Number of value series
              </Typography>
              <Stack direction="row" spacing={1}>
                <NumberSpinner
                  label="Single mode"
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
                  label="Triple mode"
                  min={0}
                  max={50}
                  value={columnNumber.triple}
                  onValueChange={(value) => {
                    if (value !== null)
                      setColumnNumber((state) => ({
                        ...state,
                        triple: clampRound(value, 0, 50),
                      }));
                  }}
                  size="small"
                />
              </Stack>
            </Stack>

            <Stack sx={{ alignItems: 'flex-start' }}>
              <Typography variant="subtitle1">Calculation precision</Typography>
              <NumberSpinner
                label="Significant digits"
                min={1}
                max={20}
                value={precision}
                onValueChange={(value) => {
                  if (value !== null) setPrecision(clampRound(value, 1, 20));
                }}
                size="small"
              />
            </Stack>

            <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
              <Typography variant="subtitle1">
                Edit propagation in Triple mode
              </Typography>
              <Typography variant="subtitle2">
                To keep the invariant{' '}
                <InlineMath
                  math={`X^${tripleKeyMathLabel.plus} - X^${tripleKeyMathLabel.minus} = X^${tripleKeyMathLabel.diff}`}
                />
                ,
              </Typography>
              <List dense disablePadding>
                {tripleKeys.map((key) => (
                  <ListItem key={key}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ width: 160 }}
                        id={`${formId}-assoc-${key}`}
                      >
                        Editing{' '}
                        <InlineMath math={`X^${tripleKeyMathLabel[key]}`} />{' '}
                        recomputes
                      </Typography>
                      <FormControl size="small" sx={{ width: 80 }}>
                        <Select
                          aria-labelledby={`${formId}-assoc-${key}`}
                          value={tripleUpdate[key]}
                          onChange={handleChangeTripleUpdate(key)}
                        >
                          {tripleKeys
                            .filter((nextKey) => nextKey !== key)
                            .map((nextKey) => (
                              <MenuItem key={nextKey} value={nextKey}>
                                <InlineMath
                                  math={`X^${tripleKeyMathLabel[nextKey]}`}
                                />
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h5" component="h3">
              Quantities, Units
            </Typography>
            <Stack>
              <Typography variant="subtitle1">Unit Select</Typography>
              <RichTreeView
                items={selectionItems}
                multiSelect
                checkboxSelection
                onSelectedItemsChange={handleSelectedItemsChange}
                isItemSelectionDisabled={isItemSelectionDisabled}
                itemChildrenIndentation={24}
                selectedItems={selectedUnitIds}
                slots={{ item: KatexTreeItem }}
              />
            </Stack>
            <Stack>
              <Typography variant="subtitle1">Order</Typography>
              <Typography variant="subtitle2">
                Drag and drop to rearrange items.
              </Typography>
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

          <Stack spacing={2}>
            <Typography variant="h5" component="h3">
              Danger zone
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  restoreDefault();
                }}
              >
                Restore default
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
