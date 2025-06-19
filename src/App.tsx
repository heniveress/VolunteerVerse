import { GoogleOAuthProvider } from '@react-oauth/google';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { defaultConfig } from 'swr/_internal';
import { useState, useMemo, useEffect } from 'react';
import NavRoutes from './models/Routes';
import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import swrFetcher from './service/fetcher/swrFetcher';
import { UserContext } from './UserContext';
import { User } from './models/user';
import Profile from './pages/Profile';
import { clientID } from './utils/config';
import EventDetails from './pages/EventDetails';
import theme from './styles/theme';
import EventAdministration from './pages/EventAdministration';
import VolunteerProfilePage from './components/Profile/VolunteerProfilePage';
import OrganizationDetails from './pages/OrganizationDetails';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const email = localStorage.getItem('email');
    if (token) {
      setUser({
        token,
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
      });
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <UserContext.Provider value={value}>
        <SWRConfig
          value={{
            fetcher: swrFetcher,
            revalidateOnFocus: true,
            errorRetryCount: 3,
            onErrorRetry(error, ...args) {
              if (error.status && error.status > 400 && error.status < 500) {
                return;
              }

              defaultConfig.onErrorRetry(error, ...args);
            },
            refreshInterval: 10000,
          }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <Router>
              <Layout>
                <Routes>
                  {NavRoutes.map((route) => (
                    <Route
                      key={route.key}
                      path={route.path}
                      element={<route.component />}
                    />
                  ))}
                  <Route
                    key="signup-route"
                    path="/signup"
                    element={<SignUp />}
                  />
                  <Route
                    key="profile-route"
                    path="/profile"
                    element={<Profile />}
                  />
                  <Route
                    key="org-detailed-route"
                    path="/organizations/:orgId"
                    element={<OrganizationDetails />}
                  />
                  <Route
                    key="event-detailed-route"
                    path="/events/:eventId/details"
                    element={<EventDetails />}
                  />
                  <Route
                    key="event-admin-route"
                    path="/events/:eventId/admin"
                    element={<EventAdministration />}
                  />
                  <Route
                    key="volunteer-profile-page"
                    path="/profile/:volunteerId"
                    element={<VolunteerProfilePage />}
                  />
                </Routes>
              </Layout>
            </Router>
          </ThemeProvider>
        </SWRConfig>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
