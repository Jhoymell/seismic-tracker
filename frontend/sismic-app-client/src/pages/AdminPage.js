import PageTransition from '../components/utils/PageTransition';
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Container,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import UserManagement from '../components/admin/UserManagement';
import NewsManagement from '../components/admin/NewsManagement';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { commonStyles } from '../styles/commonStyles';
import useAuthStore from '../store/authStore';

const MotionCard = motion(Card);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuthStore();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* ========================================
            HEADER DE ADMINISTRACIÓN
        ======================================== */}
        <MotionCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          elevation={2}
          sx={{ 
            ...commonStyles.lightCard, 
            mb: 3,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(0, 188, 212, 0.08) 100%)',
          }}
        >
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 56, 
                  height: 56,
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)' 
                }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{
                    ...commonStyles.pageTitle,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    mb: 0.5,
                  }}
                >
                  Panel de Administración
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Bienvenido/a, {user?.first_name || 'Administrador'}
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Chip 
                  icon={<AdminPanelSettingsIcon />}
                  label="Administrador" 
                  color="primary" 
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        {/* ========================================
            PANEL DE PESTAÑAS
        ======================================== */}
        <MotionCard 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          elevation={3}
          sx={{
            ...commonStyles.lightCard,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'rgba(33, 150, 243, 0.02)' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleChange} 
              centered
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <Tab 
                icon={<PeopleIcon />} 
                iconPosition="start" 
                label="Gestionar Usuarios"
                sx={{ minHeight: 64 }}
              />
              <Tab 
                icon={<ArticleIcon />} 
                iconPosition="start" 
                label="Gestionar Noticias"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Box>
          <Box sx={{ p: 4 }}>
            {activeTab === 0 && <UserManagement />}
            {activeTab === 1 && <NewsManagement />}
          </Box>
        </MotionCard>
      </Container>
    </PageTransition>
  );
};

export default AdminPage;