'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns'; // Only import this once
import { fr } from 'date-fns/locale'; // Import the French locale
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useTheme } from '@mui/material/styles';
import { fetchEvents, DeleteEvent, getVisibleEvents, setSelectedOrganization } from '@/store/apps/events/EventsSlice';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import EventAdd from './EventAdd';
import { useRouter } from 'next/navigation';

const organizations = {
  1: { name: "EventMaster Pro", logo: "/images/organizations/eventmaster.jpg" },
  2: { name: "TechConf Solutions", logo: "/images/organizations/techconf.jpg" },
  3: { name: "Arts & Culture Initiative", logo: "/images/organizations/arts.jpg" },
  4: { name: "Sports Entertainment Ltd", logo: "/images/organizations/sports.jpg" },
  5: { name: "Foodie Events Co", logo: "/images/organizations/foodie.jpg" }
};

const EventsListing = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const selectedOrganization = useSelector((state) => state.eventReducer.selectedOrganization);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const events = useSelector((state) =>
    getVisibleEvents(
      state.eventReducer.events,
      state.eventReducer.currentFilter,
      state.eventReducer.eventSearch,
      selectedOrganization
    ),
  );

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (eventId) => {
    const eventToUpdate = events.find((event) => event.Id === eventId);
    setSelectedEvent(eventToUpdate);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(DeleteEvent(eventId));
    }
  };

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleOrganizationChange = (event) => {
    dispatch(setSelectedOrganization(event.target.value));
    setPage(1); // Reset to first page when changing organization
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEvents = events.slice(startIndex, endIndex);

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Organisation</InputLabel>
          <Select
            value={selectedOrganization}
            label="Organisation"
            onChange={handleOrganizationChange}
          >
            <MenuItem value="all">Toutes les organisations</MenuItem>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateEvent}
          sx={{ px: 3 }}
        >
          + Événement
        </Button>
      </Box>

      <EventAdd 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        eventData={selectedEvent}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">ID</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Organisation</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Titre</Typography>
              </TableCell>
              {/* <TableCell>
                <Typography variant="h6">Emplacement</Typography>
              </TableCell> */}
              <TableCell>
                <Typography variant="h6">Date et heure</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Status</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Durée</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Billets</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Prix</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEvents.map((event) => (
              <TableRow key={event.Id} hover>
                <TableCell>{event.Id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={event.organization?.logo} 
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography variant="subtitle2">
                      {event.organization?.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      noWrap
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                      onClick={() => handleEventClick(event.Id)}
                    >
                      {event.ticketTitle}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      noWrap
                      sx={{ maxWidth: '250px' }}
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      {event.ticketDescription}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {format(new Date(event.Date), 'd MMM yyyy', { locale: fr })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={event.status === 'active' ? 'Active' : 'Completed'}
                    color={getStatusColor(event.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {event.duration ? `${event.duration} heures` : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {event.numberOfTickets?.toLocaleString() || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {event.ticketPrice ? `${parseFloat(event.ticketPrice).toFixed(2)} GF` : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="Update Event">
                      <IconButton onClick={() => handleUpdateEvent(event.Id)} >
                        <IconEdit size="20" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Event">
                      <IconButton onClick={() => handleDeleteEvent(event.Id)} >
                        <IconTrash size="20" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box my={3} display="flex" justifyContent="center">
        <Pagination 
          count={Math.ceil(events.length / rowsPerPage)} 
          page={page}
          onChange={handlePageChange}
          color="primary" 
        />
      </Box>
    </Box>
  );
};

export default EventsListing;
