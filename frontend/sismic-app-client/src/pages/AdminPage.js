import PageTransition from '../components/utils/PageTransition';
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import UserManagement from '../components/admin/UserManagement';
import NewsManagement from '../components/admin/NewsManagement';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import { 
  SectionBackground, 
  StyledCard, 
  GradientTitle,
  PageContainer
} from '../components/shared/StyledComponents';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageTransition>
      <SectionBackground>
        <PageContainer maxWidth="xl">
          <GradientTitle variant="h3" component="h1" sx={{ textAlign: 'center', mb: 4 }}>
            Panel de Administración
          </GradientTitle>
          
          <StyledCard elevation={3}>
            <Box 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                borderRadius: '12px 12px 0 0'
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={handleChange} 
                centered
                sx={{
                  '& .MuiTab-root': {
                    borderRadius: '12px',
                    mx: 1,
                    my: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(33, 150, 243, 0.1)',
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.2), rgba(0, 188, 212, 0.2))',
                      color: '#2196f3',
                      fontWeight: 700,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
                    height: '3px',
                    borderRadius: '2px',
                  },
                }}
              >
                <Tab 
                  icon={<PeopleIcon />} 
                  iconPosition="start" 
                  label="Gestionar Usuarios" 
                  sx={{ fontWeight: 600 }}
                />
                <Tab 
                  icon={<ArticleIcon />} 
                  iconPosition="start" 
                  label="Gestionar Noticias" 
                  sx={{ fontWeight: 600 }}
                />
              </Tabs>
            </Box>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              {activeTab === 0 && <UserManagement />}
              {activeTab === 1 && <NewsManagement />}
            </Box>
          </StyledCard>
        </PageContainer>
      </SectionBackground>
    </PageTransition>
  );
};

export default AdminPage;