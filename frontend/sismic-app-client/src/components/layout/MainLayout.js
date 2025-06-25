import React from 'react';
import Header from './Header';
import LeftNav from './LeftNav';
import NewsPanel from './NewsPanel';
import Footer from './Footer';
// Importa un archivo CSS para el layout
import './MainLayout.css'; 

const MainLayout = ({ children }) => {
  return (
    <div className="main-container">
      <Header />
      <div className="content-wrapper">
        <LeftNav />
        <main className="main-content">
          {children}
        </main>
        <NewsPanel />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;