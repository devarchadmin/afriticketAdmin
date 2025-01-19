'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { AddFund, UpdateFund } from '@/store/apps/fund/FundSlice';
import { format } from 'date-fns';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const FUND_CATEGORIES = [
  'Médical',
  'Éducation',
  "Secours en cas de catastrophe",
  "Bien-être animal",
  'Communauté'
];

const organizations = {
  1: { name: "Fondation Médicale Espoir", logo: "/images/organizations/medical-hope.jpg" },
  2: { name: "Fondation Éducation pour Tous", logo: "/images/organizations/edu-all.jpg" },
  3: { name: "Réseau de Secours Mondial", logo: "/images/organizations/global-relief.jpg" },
  4: { name: "Société Pattes & Soins", logo: "/images/organizations/paws-care.jpg" },
  5: { name: "Fondation Communautaire Unie", logo: "/images/organizations/united-community.jpg" }
};

const FundAdd = ({ open, onClose, fundData = null }) => {
  const dispatch = useDispatch();
  const funds = useSelector((state) => state.fundReducer?.funds || []);
  const newId = funds.length > 0 ? Math.max(...funds.map(f => f.Id)) + 1 : 1;

  const [values, setValues] = useState({
    title: '',
    description: '',
    requestedAmount: '',
    minimumAmount: '',
    category: 'Médical',
    deadline: '',
    organizationId: '1',
    organization: organizations[1],
    images: [],
    status: 'active',
    beneficiary: ''
  });

  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (fundData) {
      setValues({
        title: fundData.title || '',
        description: fundData.description || '',
        requestedAmount: fundData.requestedAmount || '',
        minimumAmount: fundData.minimumAmount || '',
        category: fundData.category || 'Médical',
        deadline: format(new Date(fundData.deadline), "yyyy-MM-dd'T'HH:mm"),
        organizationId: fundData.organizationId?.toString() || '1',
        organization: fundData.organization || organizations[1],
        images: fundData.images || [],
        status: fundData.status || 'active',
        beneficiary: fundData.beneficiary || ''
      });
    } else {
      setValues({
        title: '',
        description: '',
        requestedAmount: '',
        minimumAmount: '',
        category: 'Médical',
        deadline: '',
        organizationId: '1',
        organization: organizations[1],
        images: [],
        status: 'active',
        beneficiary: ''
      });
    }
    setImageError('');
  }, [fundData]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    const invalidFiles = files.filter(file => !ACCEPTED_IMAGE_TYPES.includes(file.type));
    if (invalidFiles.length > 0) {
      setImageError('Seules les images JPG, PNG, GIF et WEBP sont autorisées');
      return;
    }

    const newImages = files.map(file => URL.createObjectURL(file));
    setValues(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    setImageError('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setValues(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setImageError('');
  };

  const handleOrganizationChange = (event) => {
    const orgId = event.target.value;
    setValues(prev => ({
      ...prev,
      organizationId: orgId,
      organization: organizations[orgId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fundPayload = {
      Id: fundData ? fundData.Id : newId,
      title: values.title,
      description: values.description,
      requestedAmount: Number(values.requestedAmount),
      minimumAmount: Number(values.minimumAmount),
      category: values.category,
      deadline: new Date(values.deadline).toISOString(),
      organizationId: parseInt(values.organizationId),
      organization: values.organization,
      images: values.images,
      status: values.status,
      beneficiary: values.beneficiary,
      raisedAmount: fundData ? fundData.raisedAmount : 0,
      donors: fundData ? fundData.donors : 0,
      deleted: false
    };

    if (fundData) {
      dispatch(UpdateFund(fundPayload));
    } else {
      dispatch(AddFund(fundPayload));
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="fund-dialog-title"
    >
      <DialogTitle id="fund-dialog-title" variant="h5">
        {fundData ? 'Mettre à jour le fonds' : 'Créer un nouveau fonds'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="fund-dialog-description">
          {fundData ? 'Mettez à jour les détails du fonds ci-dessous' : 'Veuillez remplir les détails du fonds ci-dessous'}
        </DialogContentText>
        <Box mt={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormLabel>Organisation</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={values.organizationId}
                    onChange={handleOrganizationChange}
                  >
                    {Object.entries(organizations).map(([id, org]) => (
                      <MenuItem key={id} value={id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={org.logo} sx={{ width: 24, height: 24 }} />
                          {org.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Images de campagne</FormLabel>
                <Box 
                  sx={{ 
                    mt: 1,
                    p: 2,
                    border: '2px dashed',
                    borderColor: imageError ? 'error.main' : 'grey.300',
                    borderRadius: 1,
                    backgroundColor: 'grey.50'
                  }}
                >
                  <Grid container spacing={2}>
                    {values.images.map((image, index) => (
                      <Grid item xs={4} sm={3} md={2} key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '100%',
                            backgroundColor: 'grey.100',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={image}
                            alt={`Fund ${index + 1}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                              }
                            }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <IconX size={16} />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={4} sm={3} md={2}>
                      <Box
                        component="label"
                        htmlFor="image-upload"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          minHeight: 100,
                          border: '1px dashed',
                          borderColor: 'grey.400',
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'grey.100'
                          }
                        }}
                      >
                        <IconPhoto size={24} />
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          Ajouter une image
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  {imageError && (
                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {imageError}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Titre de la campagne</FormLabel>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.title}
                  onChange={(e) => setValues({ ...values, title: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <FormLabel>Montant demandé (GF)</FormLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.requestedAmount}
                  onChange={(e) => setValues({ ...values, requestedAmount: e.target.value })}
                  inputProps={{ min: "0", step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <FormLabel>Montant minimum du don (GF)</FormLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.minimumAmount}
                  onChange={(e) => setValues({ ...values, minimumAmount: e.target.value })}
                  inputProps={{ min: "0", step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <FormLabel>Catégorie</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={values.category}
                    onChange={(e) => setValues({ ...values, category: e.target.value })}
                  >
                    {FUND_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={6}>
                <FormLabel>Statut</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={values.status}
                    onChange={(e) => setValues({ ...values, status: e.target.value })}
                  >
                    <MenuItem value="active">Actif</MenuItem>
                    <MenuItem value="completed">Terminé</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Date limite</FormLabel>
                <TextField
                  type="datetime-local"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.deadline}
                  onChange={(e) => setValues({ ...values, deadline: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Bénéficiaire</FormLabel>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.beneficiary}
                  onChange={(e) => setValues({ ...values, beneficiary: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Description</FormLabel>
                <TextField
                  multiline
                  rows={4}
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.description}
                  onChange={(e) => setValues({ ...values, description: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                  type="submit"
                  disabled={!values.title || !values.requestedAmount}
                >
                  {fundData ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button variant="contained" color="error" onClick={onClose}>
                  Annuler
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FundAdd;