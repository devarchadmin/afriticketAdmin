'use client'
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { useSelector } from 'react-redux';

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}) => {
  const customizer = useSelector((state) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{ 
        padding: 0, 
        border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none'
      }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: '30px' }}>
          {title ? (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 2 }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              mb={3}
            >
              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                {title ? (
                  <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 } }}>
                    {title}
                  </Typography>
                ) : null}

                {subtitle ? (
                  <Typography 
                    variant="subtitle2" 
                    color="textSecondary"
                    sx={{ mb: { xs: 2, sm: 0 } }}
                  >
                    {subtitle}
                  </Typography>
                ) : null}
              </Box>
              {action && (
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  {action}
                </Box>
              )}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </Card>
  );
};

export default DashboardCard;