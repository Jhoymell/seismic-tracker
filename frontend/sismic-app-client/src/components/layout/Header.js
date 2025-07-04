import React from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const { openSidebar } = useAuthStore();

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        height: '64px',
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={openSidebar}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
        Proyecto Sismológico
      </Typography>
    </Box>
  );
};

export default Header;