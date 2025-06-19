import { Container, Grid, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ReactComponent as Logo } from '../assets/svg_2.svg';
import { UserContext } from '../UserContext';

function Home() {
  const { user } = useContext(UserContext);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ mt: { xs: '30px', md: '120px' } }}>
        <Grid item xs={12} md={8} display="flex" direction="column">
          <Grid item xs={8} textAlign="center">
            <Typography variant="h2" sx={{ mb: '20px' }}>
              Welcome to the Universe of Volunteers
            </Typography>
          </Grid>

          <Grid item xs={8} textAlign="center">
            <Typography variant="h6">
              <i>Organizations, events, and volunteers all in one place</i>
            </Typography>
          </Grid>
          {!user && (
            <Grid item xs={8}>
              <Box
                gap={2}
                sx={{
                  display: 'flex',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                  textAlign: { xs: 'center', md: 'flex-start' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: { xs: '50px' },
                }}
              >
                <Typography variant="h6">
                  <b>Join us and make a difference together!</b>
                </Typography>
                <Button variant="outlined" component={Link} to="/signup">
                  <Typography>Sign up</Typography>
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Logo />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
