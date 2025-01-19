'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Chip from '@mui/material/Chip';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import BlankCard from '@/app/components/shared/BlankCard';
import { fetchEvents } from '@/store/apps/events/EventsSlice';
import { fetchFunds } from '@/store/apps/fund/FundSlice';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const messages = {
    allDay: 'Toute la journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: "Aujourd'hui",
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement dans cette plage.',
    showMore: total => `+ ${total} événement(s) supplémentaire(s)`
};

const BigCalendar = () => {
    const dispatch = useDispatch();
    const events = useSelector((state) => state.eventReducer?.events || []);
    const funds = useSelector((state) => state.fundReducer?.funds || []);
    const [date, setDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchEvents());
        dispatch(fetchFunds());
    }, [dispatch]);

    // Combine events and fundraisers
    const combinedEvents = [
        ...events.map(event => ({
            ...event,
            title: event.ticketTitle,
            start: new Date(event.Date),
            end: new Date(new Date(event.Date).getTime() + parseFloat(event.duration) * 60 * 60 * 1000),
            type: 'Event',
            color: getEventColor(event)
        })),
        ...funds.map(fund => ({
            ...fund,
            title: fund.title,
            start: new Date(fund.startDate || fund.deadline),
            end: new Date(fund.deadline),
            type: 'Fundraiser',
            color: getFundColor(fund)
        }))
    ];

    function getEventColor(event) {
        const priceNum = parseFloat(event.ticketPrice);
        if (priceNum >= 200) return 'red';
        if (priceNum >= 100) return 'orange';
        if (priceNum >= 50) return 'green';
        return 'default';
    }

    function getFundColor(fund) {
        switch(fund.category) {
            case 'Médical': return 'blue';
            case 'Éducation': return 'green';
            case 'Secours en Cas de Catastrophe': return 'red';
            case 'Bien-être Animal': return 'purple';
            case 'Communauté': return 'orange';
            default: return 'default';
        }
    }

    const handleNavigate = (action) => {
        let newDate;
        switch(action) {
            case 'PREV':
                newDate = moment(date).subtract(1, 'month').toDate();
                break;
            case 'NEXT':
                newDate = moment(date).add(1, 'month').toDate();
                break;
            default:
                return;
        }
        setDate(newDate);
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setIsDetailDialogOpen(true);
    };

    const renderEventDetails = () => {
        if (!selectedEvent) return null;

        return (
            <Dialog 
                open={isDetailDialogOpen} 
                onClose={() => setIsDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedEvent.title}
                    <Chip 
                        label={selectedEvent.type} 
                        color={selectedEvent.type === 'Event' ? 'primary' : 'secondary'}
                        size="small"
                        sx={{ ml: 2 }}
                    />
                </DialogTitle>
                <DialogContent>
                    {selectedEvent.type === 'Event' && (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                <strong>Description:</strong> {selectedEvent.ticketDescription}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Location:</strong> {selectedEvent.location}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Ticket Price:</strong> {selectedEvent.ticketPrice} GF
                            </Typography>
                            <Typography variant="body2">
                                <strong>Organization:</strong> {selectedEvent.organization?.name}
                            </Typography>
                        </Box>
                    )}
                    {selectedEvent.type === 'Fundraiser' && (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                <strong>Description:</strong> {selectedEvent.description}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Target Amount:</strong> {selectedEvent.requestedAmount} GF
                            </Typography>
                            <Typography variant="body2">
                                <strong>Raised Amount:</strong> {selectedEvent.raisedAmount} GF
                            </Typography>
                            <Typography variant="body2">
                                <strong>Progress:</strong> 
                                {Math.round((selectedEvent.raisedAmount / selectedEvent.requestedAmount) * 100)}%
                            </Typography>
                            <Typography variant="body2">
                                <strong>Category:</strong> {selectedEvent.category}
                            </Typography>
                        </Box>
                    )}
                    <Box mt={2}>
                        <Typography variant="subtitle2">
                            <strong>Start:</strong> {moment(selectedEvent.start).format('LLLL')}
                        </Typography>
                        <Typography variant="subtitle2">
                            <strong>End:</strong> {moment(selectedEvent.end).format('LLLL')}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    };

    const eventStyleGetter = (event) => {
        const backgroundColor = event.color || 'default';
        return {
            style: {
                backgroundColor,
                color: 'white',
                borderRadius: '5px',
                border: 'none'
            }
        };
    };

    return (
        <>
            <BlankCard>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 2 }}>
                    <IconButton 
                        onClick={() => handleNavigate('PREV')} 
                        color="primary"
                        aria-label="Mois précédent"
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {moment(date).format('MMMM YYYY')}
                    </Typography>
                    <IconButton 
                        onClick={() => handleNavigate('NEXT')} 
                        color="primary"
                        aria-label="Mois suivant"
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
                <Calendar
                    localizer={localizer}
                    events={combinedEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    date={date}
                    onNavigate={handleNavigate}
                    onSelectEvent={handleEventSelect}
                    eventPropGetter={eventStyleGetter}
                    messages={messages}
                    views={['month']}
                    toolbar={false}
                />
            </BlankCard>

            {renderEventDetails()}
        </>
    );
};

export default BigCalendar;