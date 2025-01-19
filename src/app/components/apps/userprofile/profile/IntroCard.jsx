'use client';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { 
  IconBriefcase, 
  IconMail, 
  IconPercentage, 
  IconCurrencyEuro 
} from '@tabler/icons-react';

const AdminIntroCard = () => {
  const [openCommissionModal, setOpenCommissionModal] = useState(false);
  const [commissionSettings, setCommissionSettings] = useState({
    ticketCommission: 5.2,
    fundraiserCommission: 3.5
  });

  const handleOpenCommissionModal = () => {
    setOpenCommissionModal(true);
  };

  const handleCloseCommissionModal = () => {
    setOpenCommissionModal(false);
  };

  const handleCommissionChange = (field, value) => {
    setCommissionSettings(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  const handleSaveCommissions = () => {
    // Here you would typically dispatch an action to save commissions
    console.log('Saving commission settings', commissionSettings);
    handleCloseCommissionModal();
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography fontWeight={600} variant="h4" mb={2}>
            Profil Administrateur
          </Typography>
          <Typography color="textSecondary" variant="subtitle2" mb={2}>
            Gestion globale de la plateforme AfrikTicket avec un accès complet aux opérations et paramètres.
          </Typography>
          
          <Stack direction="row" gap={2} alignItems="center" mb={3}>
            <IconBriefcase size="21" />
            <Typography variant="h6">AfrikTicket Platform</Typography>
          </Stack>
          
          <Stack direction="row" gap={2} alignItems="center" mb={3}>
            <IconMail size="21" />
            <Typography variant="h6">admin@afrikticket.com</Typography>
          </Stack>
          
          <Stack direction="row" gap={2} alignItems="center" mb={3}>
            <IconPercentage size="21" />
            <Typography variant="h6">
              Frais de billets: {commissionSettings.ticketCommission}%
            </Typography>
          </Stack>
          
          <Stack direction="row" gap={2} alignItems="center" mb={3}>
            <IconCurrencyEuro size="21" />
            <Typography variant="h6">
              Frais de collecte: {commissionSettings.fundraiserCommission}%
            </Typography>
          </Stack>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenCommissionModal}
          >
            Modifier les commissions
          </Button>
        </CardContent>
      </Card>

      {/* Commission Settings Modal */}
      <Dialog 
        open={openCommissionModal} 
        onClose={handleCloseCommissionModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Paramètres de Commission</DialogTitle>
        <DialogContent>
          <TextField
            label="Commission de billets (%)"
            type="number"
            fullWidth
            margin="normal"
            value={commissionSettings.ticketCommission}
            onChange={(e) => handleCommissionChange('ticketCommission', e.target.value)}
            inputProps={{ step: 0.1, min: 0, max: 100 }}
          />
          <TextField
            label="Commission de collecte de fonds (%)"
            type="number"
            fullWidth
            margin="normal"
            value={commissionSettings.fundraiserCommission}
            onChange={(e) => handleCommissionChange('fundraiserCommission', e.target.value)}
            inputProps={{ step: 0.1, min: 0, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommissionModal} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSaveCommissions} color="primary" variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminIntroCard;