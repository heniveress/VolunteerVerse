import { ReactNode } from 'react';
import { CssBaseline, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const showNavbar = !isLoginPage && !isSignupPage;

  return (
    <>
      <CssBaseline />
      {showNavbar && <Navbar />}
      <Grid container sx={{ minHeight: '100vh' }}>
        {children}
      </Grid>
    </>
  );
}

export default Layout;
