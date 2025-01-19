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
import { AddEvent, UpdateEvent } from '@/store/apps/events/EventsSlice';
import { format } from 'date-fns';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import LocationPicker from './LocationPicker';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const organizations = {
  1: { name: "EventMaster Pro", logo: "/images/organizations/eventmaster.jpg" },
  2: { name: "TechConf Solutions", logo: "/images/organizations/techconf.jpg" },
  3: { name: "Arts & Culture Initiative", logo: "/images/organizations/arts.jpg" },
  4: { name: "Sports Entertainment Ltd", logo: "/images/organizations/sports.jpg" },
  5: { name: "Foodie Events Co", logo: "/images/organizations/foodie.jpg" }
};

const EventAdd = ({ open, onClose, eventData = null }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.eventReducer.events);
  const newId = events.length > 0 ? Math.max(...events.map((e) => e.Id)) + 1 : 1;

  const [values, setValues] = useState({
    eventName: '',
    location: '',
    dateTime: '',
    duration: '',
    numberOfTickets: '',
    ticketPrice: '',
    description: '',
    images: [],
    organizationId: '1',
    organization: organizations[1]
  });

  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (eventData) {
      setValues({
        eventName: eventData.ticketTitle || '',
        location: eventData.location || '',
        dateTime: format(new Date(eventData.Date), "yyyy-MM-dd'T'HH:mm"),
        duration: eventData.duration || '',
        numberOfTickets: eventData.numberOfTickets || '',
        ticketPrice: eventData.ticketPrice || '',
        description: eventData.ticketDescription || '',
        images: eventData.images || [],
        organizationId: eventData.organizationId?.toString() || '1',
        organization: eventData.organization || organizations[1]
      });
    } else {
      setValues({
        eventName: '',
        location: '',
        dateTime: '',
        duration: '',
        numberOfTickets: '',
        ticketPrice: '',
        description: '',
        images: [],
        organizationId: '1',
        organization: organizations[1]
      });
    }
    setImageError('');
  }, [eventData]);

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
    const eventPayload = {
      Id: eventData ? eventData.Id : newId,
      ticketTitle: values.eventName,
      ticketDescription: values.description,
      location: values.location,
      Date: new Date(values.dateTime).toISOString(),
      duration: values.duration,
      numberOfTickets: values.numberOfTickets,
      ticketPrice: values.ticketPrice,
      images: values.images,
      organizationId: parseInt(values.organizationId),
      organization: values.organization,
      deleted: false,
      status: 'active'
    };

    if (eventData) {
      dispatch(UpdateEvent(eventPayload));
    } else {
      dispatch(AddEvent(eventPayload));
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="event-dialog-title"
    >
      <DialogTitle id="event-dialog-title" variant="h5">
        {eventData ? 'Update Event' : 'Create New Event'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="event-dialog-description">
          {eventData ? 'Update the event details below' : 'Please fill in the event details below'}
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
              </Grid>

              {/* Image Upload Section */}
              <Grid item xs={12}>
                <FormLabel>Event Images</FormLabel>
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
                            alt={`Event ${index + 1}`}
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
                <FormLabel>Event Name</FormLabel>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.eventName}
                  onChange={(e) => setValues({ ...values, eventName: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormLabel>Location</FormLabel>
                <LocationPicker
                  value={values.location}
                  onChange={(location) => setValues({ ...values, location })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormLabel>Date and Time</FormLabel>
                <TextField
                  type="datetime-local"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.dateTime}
                  onChange={(e) => setValues({ ...values, dateTime: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormLabel>Duration (hours)</FormLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.duration}
                  onChange={(e) => setValues({ ...values, duration: e.target.value })}
                  inputProps={{ min: '0', step: '0.5' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormLabel>Number of Tickets</FormLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.numberOfTickets}
                  onChange={(e) => setValues({ ...values, numberOfTickets: e.target.value })}
                  inputProps={{ min: '1' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormLabel>Ticket Price (GF)</FormLabel>
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  fullWidth
                  required
                  value={values.ticketPrice}
                  onChange={(e) => setValues({ ...values, ticketPrice: e.target.value })}
                  inputProps={{ min: '0', step: '0.01' }}
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
                  disabled={!values.eventName || !values.dateTime}
                >
                  {eventData ? 'Update Event' : 'Create Event'}
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

export default EventAdd;