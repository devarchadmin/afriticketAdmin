'use client';
import BlankCard from '@/app/components/shared/BlankCard';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandDribbble,
  IconBrandYoutube,
  IconSettings,
  IconTicket,
  IconMoneybag,
  IconCurrencyEuro
} from '@tabler/icons-react';

const AdminProfileBanner = () => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: "0 auto"
  }));

  return (
    <BlankCard>
      <CardMedia 
        component="img" 
        image={'/images/backgrounds/profilebg.jpg'} 
        alt="admin profile cover" 
        width="100%" 
        height="330px" 
      />
      <Grid container spacing={0} justifyContent="center" alignItems="center">
        {/* Statistics */}
        <Grid
          item
          lg={4}
          sm={12}
          md={5}
          xs={12}
          sx={{
            order: {
              xs: '2',
              sm: '2',
              lg: '1',
            },
          }}
        >
          <Stack direction="row" textAlign="center" justifyContent="center" pl={10} gap={6} m={4}>
            <Box>
              <Typography color="text.secondary">
                <IconTicket width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">
                5.2%
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400} pt={1}>
                Frais de billets
              </Typography>
            </Box>
            <Box>
              <Typography color="text.secondary">
                <IconMoneybag width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">
                3.5%
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400} pt={1}>
                Frais de collecte
              </Typography>
            </Box>
            <Box>
              <Typography color="text.secondary">
                <IconCurrencyEuro width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">
                250,000 GF
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400} pt={1}>
                Revenu total
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Profile */}
        <Grid
          item
          lg={4}
          sm={12}
          xs={12}
          sx={{
            order: {
              xs: '1',
              sm: '1',
              lg: '2',
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            textAlign="center"
            justifyContent="center"
            sx={{
              mt: '-85px',
            }}
          >
            <Box>
              <ProfileImage>
                <Avatar
                  src={"/images/profile/user-default.jpg"}
                  alt="Admin Profile"
                  sx={{
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    border: '4px solid #fff',
                  }}
                />
              </ProfileImage>
              <Box mt={1}>
                <Typography fontWeight={600} variant="h5">
                  Administrateur AfrikTicket
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  Administrateur Principal
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Social Links */}
        <Grid
          item
          lg={4}
          sm={12}
          xs={12}
          sx={{
            order: {
              xs: '3',
              sm: '3',
              lg: '3',
            },
          }}
        >
          <Stack direction={'row'} gap={2} alignItems="center" justifyContent="center" my={2}>
            <Fab size="small" color="primary" sx={{ backgroundColor: '#1877F2' }}>
              <IconBrandFacebook size="16" />
            </Fab>
            <Fab size="small" color="primary" sx={{ backgroundColor: '#1DA1F2' }}>
              <IconBrandTwitter size="18" />
            </Fab>
            <Fab size="small" color="success" sx={{ backgroundColor: '#EA4C89' }}>
              <IconBrandDribbble size="18" />
            </Fab>
            <Fab size="small" color="error" sx={{ backgroundColor: '#CD201F' }}>
              <IconBrandYoutube size="18" />
            </Fab>
            <Button color="primary" variant="contained" startIcon={<IconSettings />}>
              Paramètres
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </BlankCard>
  );
};

export default AdminProfileBanner;