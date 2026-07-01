import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';

export const SettingsOverlay = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Settings
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <>
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
          </>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
