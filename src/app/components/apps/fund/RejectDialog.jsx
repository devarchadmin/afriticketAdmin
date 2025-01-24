'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const RejectDialog = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError('La raison est requise');
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      handleClose();
    } catch (err) {
      setError(err?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rejeter le fonds</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Raison du rejet"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value.trim()) {
              setError('');
            }
          }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Annuler</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="error"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'En cours...' : 'Rejeter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectDialog;
