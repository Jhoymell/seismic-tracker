import React, { useState } from 'react';
// Importaremos estos dos componentes que crearemos a continuación
import UserManagement from '../components/admin/UserManagement';
import NewsManagement from '../components/admin/NewsManagement';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' o 'news'

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('users')} 
          className={activeTab === 'users' ? 'active' : ''}
        >
          Gestionar Usuarios
        </button>
        <button 
          onClick={() => setActiveTab('news')}
          className={activeTab === 'news' ? 'active' : ''}
        >
          Gestionar Noticias
        </button>
      </div>
      <div className="admin-content">
        {activeTab === 'users' ? <UserManagement /> : <NewsManagement />}
      </div>
    </div>
  );
};

export default AdminPage;