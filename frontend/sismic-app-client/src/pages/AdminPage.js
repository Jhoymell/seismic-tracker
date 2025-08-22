import PageTransition from '../components/utils/PageTransition';
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import UserManagement from '../components/admin/UserManagement';
import NewsManagement from '../components/admin/NewsManagement';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageTransition>
      <Box sx={{ 
        width: '100%', 
        p: 3,
        background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
        borderRadius: '1rem',
        boxShadow: '0 2px 16px 0 #00bcd422',
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            filter: 'drop-shadow(0 2px 16px #00e5ff33)',
            mb: 3,
          }}
        >
          Panel de Administración
        </Typography>
        <Paper 
          elevation={3}
          sx={{
            background: 'linear-gradient(135deg, #f8fdff 80%, #e3f7fa 100%)',
            borderRadius: '1rem',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleChange} centered>
              <Tab icon={<PeopleIcon />} iconPosition="start" label="Gestionar Usuarios" />
              <Tab icon={<ArticleIcon />} iconPosition="start" label="Gestionar Noticias" />
            </Tabs>
          </Box>
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && <UserManagement />}
            {activeTab === 1 && <NewsManagement />}
          </Box>
        </Paper>
      </Box>
    </PageTransition>
  );
};

export default AdminPage;