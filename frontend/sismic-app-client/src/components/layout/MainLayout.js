import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Header from './Header';
import LeftNav from './LeftNav';
import NewsPanel from './NewsPanel';
import Footer from './Footer';
import UserHeader from './UserHeader';
import useAuthStore from '../../store/authStore';

const MotionAside = motion(Box);

const MainLayout = ({ children }) => {
  const { isAuthenticated, isNewsPanelVisible } = useAuthStore();

  return (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <LeftNav />
  <Box component="main" sx={{ flexGrow: 1, p: 3, position: 'relative', pb: { xs: 10, md: 12 }, overflowX: 'hidden' }}>
          {children}
        </Box>
        {isAuthenticated && (
          <MotionAside
            component="aside"
            animate={{ width: isNewsPanelVisible ? 280 : 0 }}
            transition={{ type: 'tween', duration: 0.3 }}
            sx={{
              flexShrink: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <UserHeader />
            <NewsPanel />
          </MotionAside>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
