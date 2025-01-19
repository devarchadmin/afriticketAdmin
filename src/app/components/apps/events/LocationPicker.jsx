import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { IconMapPin, IconSearch } from '@tabler/icons-react';

const LocationPicker = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapUrl, setMapUrl] = useState(
    'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Street%20No.2%20Sultan%20Mehmood%20road%20,Lahore+(Home%20Appliance)&t=&z=14&ie=UTF8&iwloc=B&output=embed'
  );
  
  const handleSearch = () => {
    if (searchQuery) {
      // Encode the search query for the URL
      const encodedQuery = encodeURIComponent(searchQuery);
      const newMapUrl = `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodedQuery}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;
      setMapUrl(newMapUrl);
      onChange(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            sx: { bgcolor: 'white', '&:hover': { bgcolor: 'white' } }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <IconSearch size={20} />
        </Button>
      </Box>
      
      <Paper
        sx={{
          width: '100%',
          height: 400,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.100'
        }}
      >
        {value || mapUrl ? (
          <iframe 
            title="Google Maps Location"
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0"
            src={mapUrl}
            style={{ border: 0 }}
            allowFullScreen
          />
        ) : (
          <Box 
            sx={{ 
              height: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
              <IconMapPin size={32} style={{ marginBottom: 8 }} />
              <Typography variant="body2">
              Entrez un emplacement pour rechercher
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default LocationPicker;