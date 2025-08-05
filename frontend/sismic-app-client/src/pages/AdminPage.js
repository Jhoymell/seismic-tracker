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
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Administración
      </Typography>
      <Paper elevation={3}>
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
  );
};

export default AdminPage;