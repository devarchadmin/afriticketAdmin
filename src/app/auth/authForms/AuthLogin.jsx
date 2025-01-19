'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://api.afrikticket.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status === 'success') {
        // Store the token in cookies
        Cookies.set('token', data.token);
        // Store user data if needed
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard
        router.push('/');
      } else {
        setError(data.message || 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        <Box>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
            placeholder="exemple@email.com"
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Mot de passe</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Entrez votre mot de passe"
          />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center">
          <FormGroup>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Mémoriser cet appareil"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Mot de passe oublié ?
          </Typography>
        </Stack>
      </Stack>
      <Box mt={3}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </Box>
      {subtitle}
    </form>
  );
};

export default AuthLogin;
