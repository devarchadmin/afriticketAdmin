'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { IconX, IconPhoto } from '@tabler/icons-react';
import { format } from 'date-fns';
import { AddFund, UpdateFund } from '@/store/apps/funds/FundsSlice';
import { getOrganizations } from '@/app/api/organizations/OrganizationData';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const FUND_CATEGORIES = [
  { id: 'festival', name: 'Festival' },
  { id: 'concert', name: 'Concert' },
  { id: 'sport', name: 'Sport' },
  { id: 'art', name: 'Art' },
  { id: 'education', name: 'Education' },
  { id: 'technology', name: 'Technology' },
  { id: 'business', name: 'Business' },
  { id: 'other', name: 'Other' }
];

const FundAdd = ({ open, onClose, fundData = null }) => {
  const dispatch = useDispatch();
  const funds = useSelector((state) => state.fundsReducer.pendingFunds);
  const newId = funds.length > 0 ? Math.max(...funds.map((f) => f.id)) + 1 : 1;

  const [organizations, setOrganizations] = useState({});
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoadingOrgs(true);
        const response = await getOrganizations();
        
        const orgsObject = response.data.data.reduce((acc, item) => {
          const org = item.organization;
          if (org.status === 'approved') {
            acc[org.id] = {
              name: org.name,
              logo: org.user?.profile_image || '/images/organizations/default.jpg',
              email: org.email,
              phone: org.phone
            };
          }
          return acc;
        }, {});
        
        setOrganizations(orgsObject);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, []);

  const [values, setValues] = useState({
    title: '',
    description: '',
    category: 'other',
    goal: '',
    deadline: '',
    images: [],
    organizationId: '',
    organization: null
  });

  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (fundData) {
      setValues({
        title: fundData.title || '',
        description: fundData.description || '',
        category: fundData.category || 'other',
        goal: fundData.goal || '',
        deadline: fundData.deadline ? format(new Date(fundData.deadline), "yyyy-MM-dd") : '',
        images: fundData.images || [],
        organizationId: fundData.organizationId?.toString() || '',
        organization: fundData.organization || null
      });
    } else {
      setValues({
        title: '',
        description: '',
        category: 'other',
        goal: '',
        deadline: '',
        images: [],
        organizationId: '',
        organization: null
      });
    }
    setImageError('');
  }, [fundData]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.some(file => !ACCEPTED_IMAGE_TYPES.includes(file.type))) {
      setImageError('Only JPG, PNG, GIF and WebP images are allowed');
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setValues((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setImageError('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
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
      id: fundData ? fundData.id : newId,
      title: values.title,
      description: values.description,
      category: values.category,
      goal: parseFloat(values.goal),
      deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
      images: values.images,
      organizationId: parseInt(values.organizationId),
      organization: values.organization,
      status: 'pending',
      created_at: new Date().toISOString(),
      currentAmount: 0
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
        {fundData ? 'Update Fund' : 'Create New Fund'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="fund-dialog-description">
          {fundData ? 'Update the fund details below' : 'Please fill in the fund details below'}
        </DialogContentText>
        <Box mt={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Organization Selection */}
              <Grid item xs={12}>
                <FormLabel>Organization</FormLabel>
                <Select
                  fullWidth
                  size="small"
                  value={values.organizationId}
                  onChange={handleOrganizationChange}
                  disabled={loadingOrgs}
                >
                  {loadingOrgs ? (
                    <MenuItem value="">
                      <CircularProgress size={20} /> Loading...
                    </MenuItem>
                  ) : (
                    Object.entries(organizations).map(([id, org]) => (
                      <MenuItem key={id} value={id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            src={org.logo} 
                            sx={{ width: 24, height: 24 }}
                            alt={org.name}
                          />
                          {org.name}
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </Grid>

              {/* Category Selection */}
              <Grid item xs={12}>
                <FormLabel>Category</FormLabel>
                <Select
                  fullWidth
                  size="small"
                  value={values.category}
                  onChange={(e) => setValues({ ...values, category: e.target.value })}
                >
                  {FUND_CATEGORIES.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Image Upload Section */}
              <Grid item xs={12}>
                <FormLabel>Images</FormLabel>
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    border: '2px dashed',
                    borderColor: imageError ? 'error.main' : 'grey.300',
                    borderRadius: 1,
                    backgroundColor: 'grey.50',
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
                            overflow: 'hidden',
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
                              objectFit: 'cover',
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
                                backgroundColor: 'rgba(0,0,0,0.7)',
                              },
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
                            backgroundColor: 'grey.100',
                          },
                        }}
                      >
                        <IconPhoto size={24} />
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          multiple
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          Add Image
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
                <FormLabel>Titre</FormLabel>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.title}
                  onChange={(e) => setValues({ ...values, title: e.target.value })}
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

              <Grid item xs={12} md={6}>
                <FormLabel>Objectif (GF)</FormLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.goal}
                  onChange={(e) => setValues({ ...values, goal: e.target.value })}
                  inputProps={{ min: '0', step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormLabel>Date limite</FormLabel>
                <TextField
                  type="date"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.deadline}
                  onChange={(e) => setValues({ ...values, deadline: e.target.value })}
                  inputProps={{
                    min: format(new Date(), 'yyyy-MM-dd')
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                  type="submit"
                  disabled={!values.title || !values.goal || !values.deadline}
                >
                  {fundData ? 'Update Fund' : 'Create Fund'}
                </Button>
                <Button variant="contained" color="error" onClick={onClose}>
                  Cancel
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
