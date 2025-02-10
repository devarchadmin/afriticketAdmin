'use client'
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SidebarItems from './SidebarItems';
import Logo from '../../shared/logo/Logo';
import { useSelector, useDispatch } from 'react-redux';
import { hoverSidebar, toggleMobileSidebar } from '@/store/customizer/CustomizerSlice';
import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
import { Profile } from './SidebarProfile/Profile';
import axiosServices from '@/utils/axios';

const Sidebar = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [userData, setUserData] = useState(null);

  const toggleWidth =
    customizer.isCollapse && !customizer.isSidebarHover
      ? customizer.MiniSidebarWidth
      : customizer.SidebarWidth;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosServices.get('/user');
        if (response.data.status === 'success') {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const userProfile = {
    name: userData?.name || 'User',
    role: userData?.role || 'user',
    profile_image: userData?.profile_image
  };

  const onHoverEnter = () => {
    if (customizer.isCollapse) {
      dispatch(hoverSidebar(true));
    }
  };

  const onHoverLeave = () => {
    dispatch(hoverSidebar(false));
  };

  return (
    <>
      {!lgUp ? (
        <Box
          sx={{
            zIndex: 100,
            width: toggleWidth,
            flexShrink: 0,
            ...(customizer.isCollapse && {
              position: 'absolute',
            }),
          }}
        >
          <Drawer
            anchor="left"
            open
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverLeave}
            variant="permanent"
            PaperProps={{
              sx: {
                transition: theme.transitions.create('width', {
                  duration: theme.transitions.duration.shortest,
                }),
                width: toggleWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            <Box sx={{ height: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="center" marginTop={1}>
                <a href="/"><img src="/images/logos/logo-afrik-ticket.webp" width={200} alt="Logo" fetchPriority="high" /></a>
              </Box>
              <Scrollbar sx={{ height: 'calc(100% - 190px)' }}>
                <SidebarItems user={userProfile} />
              </Scrollbar>
              <Profile user={userProfile} />
            </Box>
          </Drawer>
        </Box>
      ) : (
        <Drawer
          anchor="left"
          open={customizer.isMobileSidebar}
          onClose={() => dispatch(toggleMobileSidebar())}
          variant="temporary"
          PaperProps={{
            sx: {
              width: customizer.SidebarWidth,
              border: '0 !important',
              boxShadow: (theme) => theme.shadows[8],
            },
          }}
        >
          <Box px={2}>
            <Logo />
          </Box>
          <SidebarItems user={userProfile} />
          <Profile user={userProfile} />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
