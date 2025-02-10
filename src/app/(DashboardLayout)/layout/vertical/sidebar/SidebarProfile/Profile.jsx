import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const Profile = ({ user }) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar 
          src={user?.profile_image ? `https://api.afrikticket.com/storage/${user.profile_image}` : null}
          alt={user?.name} 
          sx={{ width: '45px', height: '45px' }}
        />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6" color="textPrimary">
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {user?.role || 'user'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
